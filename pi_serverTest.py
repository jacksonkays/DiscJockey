import asyncio
import datetime
import websockets
import json

async def handler(websocket, path):
    while True:
        data = [
            {
                "spotifyURI": 'hello'
            }
        ]
        await websocket.send(json.dumps(data[0]))
        await asyncio.sleep()

start_server = websockets.serve(handler, "" , 8888)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()