#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd
import numpy as np
import sys
import json
from itertools import permutations
reload(sys)
sys.setdefaultencoding('utf8')

def hierarchical_json(df,attributes):
	level_1 = df[attributes[0]].unique()
	level_2 = df[attributes[1]].unique()
	level_3 = df[attributes[2]].unique()
	level_4 = df[attributes[3]].unique()
	
	data_dict = {}
	data_dict["name"] = "champions"
	data_dict["size"] = df.shape[0]
	data_dict["children"] = []
	data_dict["depth"] = 0
	
	for elem_1 in level_1:
		level_1_dict = {}
		level_1_dict["name"] = elem_1
		level_1_dict["children"] = []
		data_dict["children"].append(level_1_dict)
		
		level_1_df = df[df[attributes[0]] == elem_1]
		level_1_dict["size"] = level_1_df.shape[0]
		level_1_dict["depth"] = 1
		level_2 = level_1_df[attributes[1]].unique()
		for elem_2 in level_2:
			level_2_dict = {}
			level_2_dict["name"] = elem_2
			level_2_dict["children"] = []
			level_1_dict["children"].append(level_2_dict)
			
			level_2_df = level_1_df[level_1_df[attributes[1]] == elem_2]
			level_2_dict["size"] = level_2_df.shape[0]
			level_2_dict["depth"] = 2
			level_3 = level_2_df[attributes[2]].unique()
			for elem_3 in level_3:
				level_3_dict = {}
				level_3_dict["name"] = elem_3
				level_3_dict["children"] = []
				level_2_dict["children"].append(level_3_dict)

				level_3_df = level_2_df[level_2_df[attributes[2]] == elem_3]
				level_3_dict["size"] = level_3_df.shape[0]
				level_3_dict["depth"] = 3
				level_4 = level_3_df[attributes[3]].unique()
				for elem_4 in level_4:
					level_4_dict = {}
					level_4_dict["name"] = elem_4

					level_4_df = level_3_df[level_3_df[attributes[3]] == elem_4]
					level_4_dict["size"] = level_4_df.shape[0]
					level_4_dict["depth"] = 4

					if(level_4_df.shape[0] != 0):
						level_3_dict["children"].append(level_4_dict)
	
	return data_dict
	
def hierarchical_json2(df,attributes):
	level_1 = df[attributes[0]].unique()
	level_2 = df[attributes[1]].unique()
	level_3 = df[attributes[2]].unique()
	
	data_dict = {}
	data_dict["name"] = "classification"
	data_dict["size"] = df.shape[0]
	data_dict["children"] = []
	data_dict["depth"] = 0
	
	for elem_1 in level_1:
		level_1_dict = {}
		level_1_dict["name"] = elem_1
		level_1_dict["children"] = []
		data_dict["children"].append(level_1_dict)
		
		level_1_df = df[df[attributes[0]] == elem_1]
		level_1_dict["size"] = level_1_df.shape[0]
		level_1_dict["depth"] = 1
		level_2 = level_1_df[attributes[1]].unique()
		if(len(level_2) > 1):
			for elem_2 in level_2:
				level_2_dict = {}
				level_2_dict["name"] = elem_2
				level_2_dict["children"] = []
				level_1_dict["children"].append(level_2_dict)
				
				level_2_df = level_1_df[level_1_df[attributes[1]] == elem_2]
				level_2_dict["size"] = level_2_df.shape[0]
				level_2_dict["depth"] = 2
				level_3 = level_2_df[attributes[2]].unique()
				if(len(level_3) > 1):
					for elem_3 in level_3:
						level_3_dict = {}
						level_3_dict["name"] = elem_3
						level_3_dict["children"] = []
						level_2_dict["children"].append(level_3_dict)

						level_3_df = level_2_df[level_2_df[attributes[2]] == elem_3]
						level_3_dict["size"] = level_3_df.shape[0]
						level_3_dict["depth"] = 3

						if(level_3_df.shape[0] != 0):
							level_2_dict["children"].append(level_3_dict)

	return data_dict
						
def main():
	#df = pd.read_csv('champions_role_class.csv', skipinitialspace=True, delimiter=",")
	df = pd.read_csv('classification.csv', skipinitialspace=True, delimiter="\t")
	attributes = list(map(list,permutations(list(df.columns.values))))
	for a in attributes:
		data_out = hierarchical_json2(df,a)
		
		with open('_'.join(a) + '.json', 'w') as outfile:
			json.dump(data_out, outfile, ensure_ascii=False)				

						
if __name__ == "__main__":
	main()
