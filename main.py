#!/usr/bin/env python

import webapp2
import random
import json
import datetime

import os
from google.appengine.ext.webapp import template
from google.appengine.api import users
import json

from xlscreator import XLS_creator

from db.exceptions import *
from db.userData import UserData, db
from db.aziendaData import AziendaData
from db.projectData import ProjectData
from db.sessionData import SessionData

# devo scegliere lo xor preferito ^^
def xor(*args):
	return not all(args) and any(args)
def xor2(a, b):
	(False if a else b) if b else a
def xor3(a, b):
	(not b and a) or (not a and b)
def xor4(a, b):
	return bool(a)+bool(b)==1
def xor5(a, b):
	return bool(a)^bool(b)

class MyHandler(webapp2.RequestHandler):
	
	def needAuth(self):
		return True
	
	def redirectToLogin(self):
		return False # la maggior parte degli handler sono in ajax..
	
	def get(self):
		user = users.get_current_user()
		if user and (user.email() not in ["vincenzo.minolfi@gmail.com", "albi.mori@gmail.com", "mc3infotest@gmail.com", "test@example.com"]):
			print user.email(),"showLavoriInCorso"
			self.showLavoriInCorso(user)
			return
		if self.needAuth():
			if user:
				self.safeGet(user)
			elif self.redirectToLogin():
				self.redirect(users.create_login_url(self.request.uri))
			else:
				self.response.out.write("{'error':'Utente non loggato!'}")
		else:
			#print "Request parameters: ", self.getAllParametersInDict()
			self.safeGet(user)
	
	def safeGet(self, user):
		self.response.out.write("<div class='error'>safeGet va reimplementato dagli handler ereditanti!</div>")
	
	def showLavoriInCorso(self, user):
		template_values = {
			'datetime':datetime.datetime.utcnow().strftime("%d/%m/%y %X"),
			'usermail':user.email(),
			'username':user.nickname(),
			'logsession':users.create_logout_url('/')
		}
		path = "html/underconstruction.html"
		path = os.path.join(os.path.dirname(__file__), path)
		self.response.out.write(template.render(path, template_values))
		return
		
	def getAllParametersInDict(self):
		dic = dict()
		for argkey in self.request.arguments():
			dic[argkey] = self.request.get(argkey)
			if dic[argkey]=="true": dic[argkey] = True
			if dic[argkey]=="false": dic[argkey] = False
		return dic
	
	def sendError(self, e, msg=None):
		self.response.out.write(json.dumps({
			'status': hasattr(e, 'code') and e.code or -1,
			'resultType':'error',
			'msg': msg or str(e),
			'data':None
		}))


class MainHandler(MyHandler):
	
	def safeGet(self, user):
		
			print "processing page request..."
			#boxesText = ((not FORCE_FILL_DB) and reloadData()) or (fillDB() and reloadData())
			
			
			path = 'html/index.html'
			
			userstate = 0
			if user:
				if UserData.exist(user) or self.request.get('skip'):
					userstate = 2
				else:
					userstate = 1
			
			if userstate>0:
				path = 'html/index.html'
				template_values = {
					'datetime':datetime.datetime.utcnow().strftime("%d/%m/%y %X"),
					'usermail':user.email(),
					'username':user.nickname(),
					'logsession':users.create_logout_url('/')
				}
			else:
				path = 'html/welcome.html'
				template_values = {
					'init_string': "Accedi",
					'redirect_url': users.create_login_url(self.request.uri)
				}
				
			
			path = os.path.join(os.path.dirname(__file__), path)
			self.response.out.write(template.render(path, template_values))
	
	def needAuth(self):
		return False

class UserHandler(MyHandler):
	
	def safeGet(self, user):
		print "processing userHandler ajax request..."
		d = self.getAllParametersInDict()
		userdata,modified = UserData.getUserData(user, **d)
		print "Record modificato: "+str(modified)
		self.response.out.write(json.dumps({
				'status':0,
				'resultType': modified and 'success' or "",
				'msg': modified and 'Record modificato con successo' or "",
				'data':userdata
			}))



class AziendeHandler(MyHandler):
	
	def safeGet(self, user):
		print "processing aziendeHandler ajax request..."
		params = self.getAllParametersInDict()
		if not 'method' in params or not params['method'] or params['method']=="read":
			self.response.out.write(json.dumps({
				'status':0,
				'resultType':'',
				'msg':'',
				'data':AziendaData.getAziendaData(user, **params)
			})) # senza filtri per averle tutte, coi filtri per averne alcune
			return
		elif params['method']== 'write':
			try:
				az,new = AziendaData.createAziendaData(user, **params)
				self.response.out.write(json.dumps({
					'status':0,
					'resultType':'success',
					'msg':'Azienda '+az['name'] + (new and " creata" or " modificata")+' con successo',
					'data':az
				}))
			except NoNameAziendaException as e:
				self.response.out.write(json.dumps({
					'status': -1,
					'resultType':'error',
					'msg':str(e)
				}))
			return;
		elif params['method']== 'delete':
			try:
				AziendaData.deleteAziendaData(**params)
				self.response.out.write(json.dumps({
					'status':0,
					'resultType':'success',
					'msg':'Azienda eliminata con successo',
					'data':None
				}))
			except Exception as e:
				self.sendError(e, 'Si &egrave; verificato un errore!')


class SessionHandler(MyHandler):
	
	def safeGet(self, user):
		print "processing sessionHandler ajax request..."
		params = self.getAllParametersInDict()
		if not 'method' in params or not params['method'] or params['method']=="read":
			self.response.out.write(json.dumps({
				'status':0,
				'resultType':'',
				'msg':'',
				'data':SessionData.getSessionData(user, **params)
			})) # senza filtri per averle tutte, coi filtri per averne alcune
			return
		elif params['method']== 'write':
			try:
				az,new = SessionData.newSession(user, **params)
				self.response.out.write(json.dumps({
					'status':0,
					'resultType':'success',
					'msg':'Sessione '+(new and "creata" or "modificata")+' con successo',
					'data':az
				}))
			except (EndBeforeStartException,ClosedProjectError, NoStartTimeException, NoProjectBounded) as e:
				self.sendError(e)
			return
		elif params['method']== 'delete':
			try:
				ok, errors = SessionData.deleteSessionsData(**params)
				if not errors:
					self.response.out.write(json.dumps({
						'status':0,
						'resultType':'success',
						'msg':'Sessioni eliminate con successo',
						'data':{
							'keys': ok,
							'onerror': errors
							}
					}))
				elif ok:
					self.response.out.write(json.dumps({
						'status':0,
						'resultType':'warning',
						'msg':'Non &egrave; stato possibile eliminare alcune sessioni',
						'data':{
							'keys': ok,
							'onerror': errors
							}
					}))
				else:
					self.response.out.write(json.dumps({
						'status':0,
						'resultType':'error',
						'msg':'Nessuna sessione &egrave; stata eliminata',
						'data':{
							'keys': ok,
							'onerror': errors
							}
					}))
				#keys = SessionData.deleteSessionData(**params)
				#if not keys:
					#self.response.out.write(json.dumps({
						#'status':0,
						#'resultType':'success',
						#'msg':'Sessioni eliminate con successo',
						#'data':None
					#}))
			except Exception as e:
				print e
				self.sendError(e, 'Si &egrave; verificato un errore!')




class ProjectHandler(MyHandler):
	
	def safeGet(self, user):
		print "processing sessionHandler ajax request..."
		params = self.getAllParametersInDict()
		if not 'method' in params or not params['method'] or params['method']=="read":
			self.response.out.write(json.dumps({
				'status':0,
				'resultType':'',
				'msg':'',
				'data':ProjectData.getProjectData(user, **params)
			})) # senza filtri per averle tutte, coi filtri per averne alcune
			return
		elif params['method']== 'write':
			try:
				pr,new = ProjectData.newProject(user, **params)
				self.response.out.write(json.dumps({
					'status':0,
					'resultType':'success',
					'msg':'Progetto '+ pr['name'] +(new and " creato" or " modificato")+' con successo',
					'data':pr
				}))
			except Exception as e:
				self.sendError(e, str(e))
			return
		elif params['method']== 'delete':
			try:
				ok, errors = ProjectData.deleteProjectsData(**params)
				if not errors:
					self.response.out.write(json.dumps({
						'status':0,
						'resultType':'success',
						'msg':'Progetti eliminati con successo',
						'data':{
							'keys': ok,
							'onerror': errors
							}
					}))
				elif ok:
					self.response.out.write(json.dumps({
						'status':0,
						'resultType':'warning',
						'msg':'Non &egrave; stato possibile eliminare alcuni progetti',
						'data':{
							'keys': ok,
							'onerror': errors
							}
					}))
				else:
					self.response.out.write(json.dumps({
						'status':0,
						'resultType':'error',
						'msg':'Nessun progetto &egrave; stata eliminato',
						'data':{
							'keys': ok,
							'onerror': errors
							}
					}))
			except Exception as e:
				self.sendError(e, str(e))# 'Si &egrave; verificato un errore!')



class GetXls(MyHandler):
	def safeGet(self, user):
		
		params = self.getAllParametersInDict()
		userData = UserData.getUserData(user)[0]
		aziendaData = None
		proj = None
		
		if params['azienda']:
			aziendaData = db.get(params['azienda']).myserialize()
			sessionSum = SessionData.getSumBetween(user, azienda=params['azienda'], start=params['start'], end=params['end'])
		elif params['progetto']:
			proj = db.get(params['progetto'])
			aziendaData = proj.azienda.myserialize()
			sessionSum = proj.eur
		else:
			self.sendError(MyException(), 'Si &egrave; verificato un errore!')
		
		msg = ('msg' in params) and params['msg'] or "Messaggio di prova"
		
		try:
			date = ('date' in params) and datetime.datetime.strptime(params['date'], "%m/%d/%Y") or datetime.datetime.now()
		except:
			date = datetime.datetime.now()
		xls = XLS_creator(userdata=userData, azienda=aziendaData, sessionSum=sessionSum, msg=msg, date=date)

		# HTTP headers to force file download
		self.response.headers['Content-Type'] = 'application/ms-excel'
		self.response.headers['Content-Transfer-Encoding'] = 'Binary'
		self.response.headers['Content-disposition'] = 'attachment; filename="Diaria_test.xls"'

		# output to user
		xls.save(self.response.out)
		if proj:
			proj.closeProj()

app = webapp2.WSGIApplication([('/', MainHandler), 
							   ('/download', GetXls), 
							   ('/user', UserHandler), 
							   ('/aziende', AziendeHandler),
							   ('/session', SessionHandler),
							   ('/project', ProjectHandler)], debug=True)
