#!/usr/bin/env python

import asyncio
import random
import datetime
import websockets
import json
import time

async def handler(websocket, path):
    while True:
        data = [
            { 
              "spotifyURI": "spotify:album:5PrhnVNOKoJC2aLLfabxuB"  
            },
            {
              "spotifyURI": "spotify:album:5zi7WsKlIiUXv09tbGLKsE" 
            },
            {
              "spotifyURI": "never gonna give you up" 
            },
            {
              "spotifyURI": "hello pop smoke"
            }
        ]
        time.sleep(10)
        number = random.randint(0, 3)
        await websocket.send(json.dumps(data[number]))
        print("message sent")
        await asyncio.sleep(10)

start_server = websockets.serve(handler, "127.0.0.1", 8888)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()