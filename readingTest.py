from csv import unix_dialect
from http import client
import board
import busio
import requests
import base64
import json
import os
from digitalio import DigitalInOut
from adafruit_pn532.spi import PN532_SPI
#import webbrowser
#import spotipy

#setup PN532's SPI Configuration
spi = busio.SPI(board.SCK, board.MOSI, board.MISO)
cs_pin = DigitalInOut(board.D5)
pn532 = PN532_SPI(spi, cs_pin, debug=False)

#info on PN532's firmware version and revision
ic, ver, rev, support = pn532.firmware_version
print("Found PN532 with firmware version: {0}.{1}".format(ver, rev))

#Ensures PN532 recognizes MiFare style cards
pn532.SAM_configuration()

#Setting up Spotify Project credentials for Authorization Code Flow
client_id = "96b36c35317a4a71bab8db06208a1b3e"
client_secret = "c0de77b8e8fd4cd4a663774e0489ce95"
auth_URL = "https://accounts.spotify.com/authorize"
base_URL = "https://api.spotify.com/v1"
player_URL = f'{base_URL}/me/player/play'
token_URL = "https://accounts.spotify.com/api/token"
redirect_URI = 'https://localhost:8888/callback'
access_token = ""
refresh_token = ""
clientCredentials = f"{client_id}:{client_secret}"
clientCredentials_bytes = clientCredentials.encode("ascii")
base64_clientCredentials = base64.urlsafe_b64encode(clientCredentials_bytes)
clientCredentials = base64_clientCredentials.decode("ascii")
player_headers = {'Authorization': f'Bearer {access_token}',
                'Content-Type': 'application/json',
                'Host': 'api.spotify.com'}

def authorizeUsage():
    auth_body = {'client_id': client_id,
                'response_type': 'code',
                'redirect_URI': redirect_URI}
    auth_response = requests.get(auth_URL, {
                'client_id': client_id,
                'response_type': 'code',
                'redirect_URI' : redirect_URI
    })
    #webbrowser.open_new_tab(auth_response.url)
    auth_response_data = auth_response.json()
    print(json.dumps(auth_response_data, indent=2))
    auth_code = auth_response_data['code']
    token_headers = {'Authorization': f'Basic {clientCredentials}',
                    'Content-Type': 'application/x-www-form-urlencoded'}
    token_payload = {'grant_type': 'authorization_code',
                    'code': auth_code,
                    'redirect_URI': redirect_URI}
    access_token_response = requests.post(token_URL, headers=token_headers, data=token_payload)
    access_token_data = access_token_response.json()
    print(json.dumps(access_token_data, indent=2))
    access_token = access_token_data['access_token']
    refresh_token = access_token_data['refresh_token']

def refreshToken():
    token_headers = {'Authorization': f'Basic {clientCredentials}',
                    'Content-Type': 'application/x-www-form-urlencoded'}
    refresh_payload = {'grant_type': 'refresh_token',
                    'refresh_token': refresh_token}
    refresh_response = requests.post(token_URL, headers=token_headers, data=refresh_payload)
    refresh_response_data = refresh_response.json()
    access_token = refresh_response_data['access_token']

URIDict = {
        "202141443": "Mic Request - Initiate Mic",
        "1409188206": "spotify:album:4PgleR09JVnm3zY1fW3XBA", #Bruno Mars - 24K Magic
        "63101233": "spotify:playlist:37i9dQZF1DZ06evO4kqwHC", #This is Foo Fighters Playlist
        "691031433": "spotify:album:5zi7WsKlIiUXv09tbGLKsE", #Tyler the Creator - IGOR
        "157441223": "spotify:album:2yI4m5Yu2tl8v0It5P9WVz", #Rex Orange County - Who Cares?
        "72491443": "spotify:album:5PrhnVNOKoJC2aLLfabxuB", #Surfaces - Pacifico
        "253341443": "spotify:album:6pwuKxMUkNg673KETsXPUV", #Kanye West - Kids See Ghosts
        "182951433" : "spotify:album:5SxudoALxEAVh9l83kSebx", #Florence and the Machine - Ceremonials
        "1092411223" : "spotify:album:76290XdXVF9rPzGdNRWdCh",  #SZA - Ctrl
        "2351443" : "spotify:album:2fYhqwDWXjbpjaIJPEfKFw" #Ariana Grande - Thank u, next
}

authorizeUsage()
print("Waiting for RFID Card...")
while True:
    uniqueIdentifier = ""
    uid = pn532.read_passive_target(timeout=0.5)
    print(".", end="")
    if uid is None:
        continue
    else:
        refresh_token()
        for i in uid:
            uniqueIdentifier += str(i)
        print("Found card with UID: ", uniqueIdentifier)
        spotifyURI = URIDict[uniqueIdentifier]
        if uniqueIdentifier == "202141443":
            print("Insert Mic Code")
        else:
            player_data = {'context_uri': spotifyURI,
                            'position_ms': 0}
            response = requests.put(player_URL, headers=player_headers, data=player_data)
            response_data = response.json()
            print(json.dumps(response_data, indent=2))
