import urllib
import os
import pandas as pd



def download_champion():
	data = pd.read_csv("list_champions.csv", delimiter=",")

	for champion in data["Champion"]:
		for i in range(1,5):
			url = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + str(champion) + "_" + str(i) + ".jpg"
			urllib.urlretrieve(url, os.path.join(os.getcwd(), "images_champions/" + str(champion) + str(i) + ".jpg"))
			print url


def download_item():
	data = pd.read_csv("list_items.csv", delimiter=";")
	for itemid in data["id"].unique():
		url = "http://ddragon.leagueoflegends.com/cdn/6.24.1/img/item/" + str(itemid) + ".png"
		urllib.urlretrieve(url, os.path.join(os.getcwd(), "item/" + str(itemid) + ".png"))
	

download_champion()
