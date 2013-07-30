class MyException(Exception):
	def __init__(self, value='', code=-1):
		self.value = value
		self.code = code

class NoNameAziendaException(MyException):
	def __str__(self):
		return repr(self.value or "Specificare una ragione sociale")

class EndBeforeStartException(MyException):
	def __str__(self):
		return repr(self.value or "La data di fine non pu&ograve; precedere quella di inizio")
	
class NoStartTimeException(MyException):
	def __str__(self):
		return repr(self.value or "Specificare una data di inizio")

class ClosedProjectError(MyException):
	def __str__(self):
		return repr(self.value or "Il progetto selezionato &egrave; gi&agrave; stato chiuso")

class NoNameProgettoException(MyException):
	def __str__(self):
		return repr(self.value or "Specificare un nome per il progetto")