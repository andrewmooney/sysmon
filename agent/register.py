import json
import socket
import psutil
import requests

hostname = socket.gethostname()
ip = str(socket.gethostbyname(hostname))
data = json.dumps({'hostname':hostname, 'ip':ip})

post = requests.post("http://elipsemon.uqcloud.net/api/register", headers = {u'content-type': u'application/json'}, data=data)
print(post.text)

print(hostname)
print(ip)