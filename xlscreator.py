from pyExcelerator import *
import datetime

from db.exceptions import *
from db.userData import UserData, db
from db.aziendaData import AziendaData
from db.sessionData import SessionData

def XLS_creator(userdata=None, azienda=None, sessionSum=None, msg=None, date=None):
	
	#print "SESSIONS:"
	#print sessions
	
	wb = Workbook()
	ws0 = wb.add_sheet('Sheet 1')
	fnt = Font()
	fnt.name = 'Arial'
	fnt.colour_index = 4
	fnt.bold = True
	
	borders = Borders()
	borders.left = 6
	borders.right = 6
	borders.top = 6
	borders.bottom = 6

	style = XFStyle()
	style.font = fnt
	style.borders = borders
	
	for x in range(10):
		for y in range(10):
			# writing to a specific x,y
			ws0.write(x, y, "this is cell %s, %s" % (x,y), style)
	
	ws0.write_merge(1, 1, 1, 5, date.strftime("%m/%d/%Y"), style)
	ws0.write_merge(2, 2, 1, 4, ''+(azienda['name'] or ""), style)
	#ws0.write_merge(3, 3, 1, 3, "START: "+start, style)
	#ws0.write_merge(4, 4, 1, 4, "END: "+end, style)
	ws0.write_merge(5, 5, 1, 4, ''+(userdata['firstName'] or ""), style)
	ws0.write_merge(6, 6, 1, 5, 'TOTALE '+str(sessionSum), style)
	ws0.write_merge(7, 7, 1, 5, str(msg), style)
	ws0.write_merge(8, 8, 1, 4, 'test 1', style)
	ws0.write_merge(9, 9, 1, 3, 'test 5', style)
	
	ws0.row(1).height = 0x0d00
	
	return wb