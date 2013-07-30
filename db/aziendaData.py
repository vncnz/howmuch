from google.appengine.ext import db
from exceptions import *

class AziendaData(db.Model):
	name = db.StringProperty("")
	address = db.PostalAddressProperty("")
	piva = db.StringProperty("")
	user = db.UserProperty()
	eur_h = db.FloatProperty(0)
	
	@staticmethod
	def createAziendaData(user, key=None, name=None, address="", piva="", eur_h=0, **trash):
		print "creating or modifing azienda with key=%s name=%s address=%s piva=%s eur_h=%s" % (key, name, address, piva, eur_h)
		aziendadatadb, new = key and (db.get(key), False) or (AziendaData(), True)
		aziendadatadb.user = user
		if name:
			aziendadatadb.name = name
		if name=='':
			raise NoNameAziendaException()
		if address:
			aziendadatadb.address = address
		if piva:
			aziendadatadb.piva = piva
		if eur_h:
			aziendadatadb.eur_h = float(eur_h)
		aziendadatadb.put()
		return aziendadatadb.myserialize(), new
	
	@staticmethod
	def getAziendaData(user=None, name=None, address=None, piva=None, eur_h=None, **trash):
		lst = AziendaData.all().order("name")
		if user:
			lst = lst.filter('user', user)
		if name:
			lst = lst.filter('name', name)
		if address:
			lst = lst.filter('address', address)
		if piva:
			lst = lst.filter('piva', piva)
		if eur_h:
			lst = lst.filter('eur_h', eur_h)
		
		return map(lambda az: az.myserialize(), lst)
	
	@staticmethod
	def deleteAziendaData(key=None, **trash):
		#print "elimino con key="+str(key)
		if key:
			db.get(key).delete()
		else:
			raise Exception("Inexistent key")
	
	def myserialize(self):
		return {
				'key':str(self.key()),
				'name':self.name,
				'address':self.address,
				'piva':self.piva,
				'eur_h':self.eur_h
			}