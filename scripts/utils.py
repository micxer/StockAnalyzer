import re
import json
from bs4 import BeautifulSoup
from datetime import datetime

class Utils:

	def getMappingDict(fileName):
		with open(fileName) as json_file:
			return json.load(json_file)
			
	def getYearEnd(htmlSoup):
		get_year_end = lambda x: x.find("span").text.split(" ")[1] if x.find("span") and len(x.find("span").text.split(" ")) >= 2 else ''
		return get_year_end(htmlSoup)

	def getKeyFigures(htmlSoup, mappingFileName):
		data = dict()
		years = list()
		mapping = Utils.getMappingDict(mappingFileName)
		key_figures = htmlSoup.find("article", {"class": "KENNZAHLEN"})

		if (key_figures):
			year_end = Utils.getYearEnd(key_figures)
			tables = key_figures.findAll("table")
			for table in tables:
				rows = table.findAll("tr")
				i = 0
				for row in rows:
					if i == 0:
						if len(years) == 0:
							cols = row.findAll("th", {"class": "ZAHL"})
							for col in cols:
								year = re.findall('\d+', col.text)
								if len(year) > 0:
									if len(year[0]) == 2:
										year[0] = '20' + year[0]
									years.append(year[0])
					else:
						fact = row.find("td", {"class": "INFOTEXT"})
						if fact:
							fact = fact.text
							for map in mapping.keys():
								if fact.find(map) == 0:
									fact = mapping[map]
						cols = row.findAll("td", {"class": "ZAHL"})
						counter = 0
						for col in cols:
							if counter < len(years):
								tmp_year = years[counter]
								if tmp_year not in data.keys():
									data[tmp_year] = dict()

								tmp_value = re.findall('[-]?\d+[,]?\d+', col.text.replace('.', ''))
								if len(tmp_value) == 1:
									data[tmp_year][fact] = float(tmp_value[0].replace(',', '.'))
								else:
									data[tmp_year][fact] = None
									
								#data[tmp_year]['year_end'] = year_end
								counter += 1
					i += 1
		return data
		
	def getTechnicalFigures(htmlSoup, mappingFileName):
		data = dict()
		mapping = Utils.getMappingDict(mappingFileName)
		risk_trend_figures = htmlSoup.find("article", {"class": "RISIKO_TREND KENNZAHLEN"})
		performance_figures = htmlSoup.find("article", {"class": "KURSE_PERFORMANCE KENNZAHLEN"}).find("tbody").findAll("tr")
		
		if (risk_trend_figures):
			risk_trend_figures_headers = risk_trend_figures.findAll("th")
			risk_trend_figures_values = risk_trend_figures.findAll("td", {"class": "ZAHL"})
			if (len(risk_trend_figures_headers) == len(risk_trend_figures_values)):
				i = 0
				for i in range(0, len(risk_trend_figures_headers)):
					header = risk_trend_figures_headers[i].text.strip()
					value = risk_trend_figures_values[i].text.strip()
					for map in mapping.keys():
						if header.find(map) == 0:
							tmp_value = re.findall('[-]?\d+[,]?\d+', value.replace('.', ''))
							if len(tmp_value) == 1:
								data[mapping[map]] = float(tmp_value[0].replace(',', '.'))
							else:
								data[mapping[map]] = None

		if (performance_figures):
			for row in performance_figures:
				header = row.find("th").text.strip()
				value = row.find("td").text.strip()
				for map in mapping.keys():
					if header.find(map) == 0:
						tmp_value = re.findall('[-]?[+]?\d+[,]?\d+', value.replace('.', ''))
						if len(tmp_value) == 1:
							data[mapping[map]] = float(tmp_value[0].replace('+', '').replace(',', '.'))
						else:
							data[mapping[map]] = None
		return data
		
	def createSqlString(dictKeys, tableName, isCreation=True):
		values = '(%(' + ')s, %('.join(dictKeys) + ')s)'
		names = '(' + ', '.join(dictKeys) + ')'
		if isCreation:
			return "INSERT INTO " + tableName + " " + names + " VALUES " + values
		else:
			return "UPDATE " + tableName + " SET " + names + " = " + values

	def getActualYear():
		return datetime.now().year
	
	def getActualDate():
		return datetime.now().date()
