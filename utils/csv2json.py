#!/usr/bin/python
import csv
import sys
import json 

def csv2Json(csvfile,delim=';',qcr='"'):
  reader = csv.DictReader(open(csvfile, 'rU'), delimiter = delim, quotechar = qcr)
  out = json.dumps( [ row for row in reader ] )  
  print "JSON parsed!"  
  # Save the JSON 
  f = open( './sap-dummy/sap-data.json', 'w')  
  f.write(out)  
  print "JSON saved!" 

if __name__ == '__main__':
        fname = sys.argv[1]
        csv2Json(fname)
