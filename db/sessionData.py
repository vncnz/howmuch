from google.appengine.ext import db
from time import gmtime, strftime
from exceptions import *
#from db.aziendaData import AziendaData

import datetime, time

class SessionData(db.Model):
	start_time = db.DateTimeProperty()
	end_time = db.DateTimeProperty()
	#azienda = db.ReferenceProperty()
	progetto = db.ReferenceProperty()
	user = db.UserProperty()
	#userid = db.ReferenceProperty()
	
	@staticmethod
	def getSessionData(user):
		return map(lambda x: x.myserialize(), SessionData.all().filter('user', user).order('start_time'))
	
	@staticmethod
	def deleteSessionData(key=None, **trash):
		#print "elimino con key="+str(key)
		if key:
			db.get(key).delete()
		else:
			raise Exception("Inexistent key")
	
	def myserialize(self):
		return {
				'key':str(self.key()),
				'start':self.start_time and self.start_time.strftime("%m/%d/%Y %H:%M") or '',
				'end':self.end_time and self.end_time.strftime("%m/%d/%Y %H:%M") or '',
				#'azienda': self.azienda and str(self.azienda.key()) or None,
				'progetto': self.progetto and str(self.progetto.key()) or None,
			}
	
	@staticmethod
	def newSession(user, key=None, progetto=None, start=None, end=None, **trash):
		#if SessionData.getOpenSession(user) and not end_time:
		#	raise Exception("Esiste gia' una sessione aperta!")
		sessiondatadb, new = key and (db.get(key), False) or (SessionData(), True)
		sessiondatadb.user = user
		if start:
			start_time = datetime.datetime.strptime(start, "%m/%d/%Y %H:%M")
			sessiondatadb.start_time = start_time
		if end:
			end_time = datetime.datetime.strptime(end, "%m/%d/%Y %H:%M")
			sessiondatadb.end_time = end_time
		if progetto:
			sessiondatadb.progetto = db.get(progetto)
		#if azienda:
		#	sessiondatadb.azienda = db.get(azienda)
		if sessiondatadb.progetto and sessiondatadb.progetto.closed:
			raise ClosedProjectError()
		if not sessiondatadb.start_time:
			raise NoStartTimeException()
		if sessiondatadb.end_time and (sessiondatadb.start_time > sessiondatadb.end_time):
			raise EndBeforeStartException()
		sessiondatadb.put()
		return sessiondatadb.myserialize(),new
	
	@staticmethod
	def getSessionBetween(user, azienda=None, progetto=None, start=None, end=None, **trash):
		#res1 = SessionData.all().filter('user', user).filter("end_time >= ", datetime.datetime.strptime(start, "%m/%d/%Y"))
		#res2 = SessionData.all().filter('user', user).filter("end_time < ", datetime.datetime.strptime(end, "%m/%d/%Y"))
		res = SessionData.all().filter('user', user)
		if progetto:
			res = res.filter("progetto", db.get(progetto))
		#elif azienda:
		#	res = res.filter("azienda", db.get(azienda))
		res = res.order("start_time")
		res = filter(lambda r: r.end_time>=datetime.datetime.strptime(start, "%m/%d/%Y"), res)
		res = filter(lambda r: r.end_time<datetime.datetime.strptime(end, "%m/%d/%Y"), res)
		print len(res)
		return map(lambda x: x.myserialize(), res)
	
	@staticmethod
	def getSumBetween(user, azienda=None, start=None, end=None, **trash):
		#res1 = SessionData.all().filter('user', user).filter("end_time >= ", datetime.datetime.strptime(start, "%m/%d/%Y"))
		#res2 = SessionData.all().filter('user', user).filter("end_time < ", datetime.datetime.strptime(end, "%m/%d/%Y"))
		res = SessionData.all().filter('user', user).filter("azienda", db.get(azienda))
		res = filter(lambda r: r.end_time>=datetime.datetime.strptime(start, "%m/%d/%Y"), res)
		res = filter(lambda r: r.end_time<datetime.datetime.strptime(end, "%m/%d/%Y"), res)
		lens = map(lambda r: (r, (time.mktime(r.end_time.timetuple()) - time.mktime(r.start_time.timetuple())) / 60.0 / 60), res)
		return sum(map(lambda (r,l): r.azienda.eur_h*(int(l+0.5)), lens))