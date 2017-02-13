import time
import json
import socket
import psutil
import requests
from socketIO_client import SocketIO, LoggingNamespace
import datetime

hostname = socket.gethostname()

# Get all processes
def getProc():
    localTime = time.time() * 1000
    pids = psutil.pids()
    processes = {}
    processes['hostname'] = hostname
    processes['timestamp'] = localTime
    processes['procs'] = {}
    for pid in pids:
        p = psutil.Process(pid)
        pname = p.name()
        pstatus = p.status()
        puser = p.username()
        processes['procs'][pid] = {'pid': pid, 'pname': pname, 'pstatus': pstatus, 'puser': puser}

    return processes;

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

    # Disk usage
    diskUt = psutil.disk_usage('/')
    # Disk io information outputs as: read_count, write_count, read_bytes, write_bytes, read_time, write_time
    diskIo = psutil.disk_io_counters()

    return {'timestamp':localTime, 'cpu_perc':cpuPercent, 'vmem_perc':vMem.percent, 'smem_perc':sMem.percent, 'disk_use':diskUt.percent}

with SocketIO('elipsemon.uqcloud.net', 80, LoggingNamespace) as socketIO:

    def emitProc():
        print('Process request recieved')
        socketIO.emit(getProc)
    
    loopnum = 0

    while (True):
        loopnum += 1
        now = datetime.datetime.now()
        perf = getPerf()
        perf['hostname'] = hostname;
        data = json.dumps(perf)

        if (perf['cpu_perc'] > 50 ) or (perf['vmem_perc'] > 90 ) or (perf['smem_perc'] > 10):
            file = open("./logs/plog.log", "a+")
            file.write(data)
            file.close()

        socketIO.emit('clientpd', data)
        socketIO.wait(seconds=1)
        
        if (loopnum == 1 or loopnum % 150 == 0):
            socketIO.emit('clientpr', getProc())