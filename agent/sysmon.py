import time
import json
import socket
import psutil
import requests

hostname = socket.gethostname()
def getPerf():
    # Get current time
    localTime = time.time() * 1000

    # CPU information
    cpuPercent = psutil.cpu_percent(interval=1)

    # Memory information
    # Virtual Memory outputs as: total, available, percent, used, free, active, inactive, wired
    vMem = psutil.virtual_memory()
    # Swap Memory outputs as: total, used, free, percent, sin, sout
    sMem = psutil.swap_memory()

    # Disk io information outputs as: read_count, write_count, read_bytes, write_bytes, read_time, write_time
    diskIo = psutil.disk_io_counters()

    return {'timestamp':localTime, 'cpu_perc':cpuPercent, 'vmem_perc':vMem.percent, 'smem_perc':sMem.percent}

while (True):
    perf = getPerf()
    if (perf['cpu_perc'] > 50 ) or (perf['vmem_perc'] > 90 ) or (perf['smem_perc'] > 10):
        file = open("./logs/plog.log", "a+")
        perf['hostname'] = hostname;
        data = json.dumps(perf)
        file.write(data)
        file.close()
        post = requests.post("http://elipsemon.uqcloud.net/api", headers = {u'content-type': u'application/json'}, data=data)
        print(post.text)