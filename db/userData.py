from google.appengine.ext import db

class UserData(db.Model):
	firstName = db.StringProperty()
	lastName = db.StringProperty()
	address = db.PostalAddressProperty()
	iban = db.StringProperty()
	piva = db.StringProperty()
	user = db.UserProperty()
	aziendeids = db.ListProperty(db.Key)
	#born = db.ReferenceProperty()
	
	@staticmethod
	def addAziendaId(user, aziendaId):
		userData = getUserData(user)
		userData.aziendeids.append(aziendaId)
		userData.put()
	
	@staticmethod
	def getUserData(user, firstName=None, lastName=None, address=None, iban=None, piva=None, **trash):
		if user:
			modified = False
			userdatadb = UserData.all().filter("user", user).get()
			
			if not userdatadb:
				print "creating new FAKE UserData on db"
				userdatadb = UserData(user=user, firstName=firstName, lastName=lastName, address=address, piva=piva, iban=iban)
				userdatadb.put()
			
			if firstName or lastName or address or iban or piva:
				userdatadb.firstName 	= firstName or userdatadb.firstName
				userdatadb.lastName 	= lastName 	or userdatadb.lastName
				userdatadb.address 		= address	or userdatadb.address
				userdatadb.iban 		= iban		or userdatadb.iban
				userdatadb.piva 		= piva		or userdatadb.piva
				
				userdatadb.put()
				print "Dati utente "+str(user.nickname())+" modificati"
				modified = True
			
			userdata = userdatadb.myserialize()
			userdata['ignorati'] = trash
			return userdata,modified
		else:
			raise Exception
	
	@staticmethod
	def exist(user):
		return bool(UserData.all().filter("user", user).get())
	
	def myserialize(self):
		return {
				'firstName':self.firstName,
				'lastName':self.lastName,
				'address':self.address,
				'iban':self.iban,
				'piva':self.piva
			}