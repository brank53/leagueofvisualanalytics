import json
import re
from bs4 import BeautifulSoup
import pandas as pd

data = pd.read_csv("item_type.csv", delimiter="\t")
data = data.drop_duplicates()

with open('items.json') as json_data:
    items = json.load(json_data)


file = "list_items"
download_dir = file + ".csv"
csv = open(download_dir, "w")
columnTitleRow = "id;name;effect;type\n"
csv.write(columnTitleRow)

count = 0
for x in items["data"]:
	
	id = ""
	name = ""
	effect = ""
	
	id = items["data"][x]["id"]
	
	if "name" in items["data"][x]:
		name = items["data"][x]["name"]
	
	temp_item = data[data["name"] == name]
	type_item = temp_item["type"].tolist()
	tipo = ""
	for t in type_item:
		if(len(tipo) == 0):
				tipo = t
		else:
			tipo += "," + str(t)
	
	if "description" in items["data"][x]:
		text = items["data"][x]["description"]
		soup = BeautifulSoup(text, "lxml")
		effect = re.sub('<[^>]*>', ',', str(soup.find("stats")))
		effect = effect.split(",")
		effect = [i for i in effect if len(i) > 1]
		temp = ""
		for j in effect:
			if(len(temp) == 0):
				temp = j
			else:
				temp += ", " + str(j)

	columnTitleRow = str(id) + ";" + str(name) + ";" + str(temp) + ";" + tipo + "\n"
	csv.write(columnTitleRow)
	
