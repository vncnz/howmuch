from google.appengine.ext import db
from time import gmtime, strftime
from exceptions import *
#from db.aziendaData import AziendaData

import datetime, time

class ProjectData(db.Model):
	azienda = db.ReferenceProperty()
	user = db.UserProperty()
	name = db.StringProperty()
	closed = db.BooleanProperty()
	eur = db.FloatProperty(0)
	
	@staticmethod
	def getProjectData(user):
		return map(lambda x: x.myserialize(), ProjectData.all().filter('user', user).order('name'))
	
	@staticmethod
	def deleteProjectData(key=None, **trash):
		#print "elimino con key="+str(key)
		if key:
			db.get(key).delete()
		else:
			raise Exception("Inexistent key")
	
	def myserialize(self):
		return {
				'key':str(self.key()),
				'name':str(self.name),
				'azienda': self.azienda and str(self.azienda.key()) or None,
				'closed': self.closed,
				'eur':self.eur
			}
	
	@staticmethod
	def newProject(user, key=None, azienda=None, name=None, closed=False, eur=0, **trash):
		projectdatadb, new = key and (db.get(key), False) or (ProjectData(), True)
		projectdatadb.user = user
		if name:
			projectdatadb.name = name
		if not projectdatadb.name:
			raise NoNameProgettoException()
		if azienda:
			projectdatadb.azienda = db.get(azienda)
		if closed:
			projectdatadb.closed = closed
		if eur:
			projectdatadb.eur = float(eur)
		projectdatadb.put()
		return projectdatadb.myserialize(),new
	
	def closeProj(self):
		self.closed = True
		self.put()