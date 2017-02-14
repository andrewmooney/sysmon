// {{!--'hostname': hostname, 'timestamp': localTime,'pid': pid, 'pname': pname, 'pstatus': pstatus, 'puser': puser--}}
var socket = io();
io.on('connection', function(socket){
    socket.join('help-tst');
});
socket.on('clientproc', function(pd) {
    var tdata = "";
    var ptable = $('#procInfo');
    pd.forEach( function(proc) {
        var data = jQuery.parseJSON(proc);
        tdata += "<tr>";
        tdata += "<td>" + data.pid + "</td>";
        tdata += "<td>" + data.pname + "</td>";
        tdata += "<td>" + data.pstatus + "</td>";
        tdata += "<td>" + data.pcpu_perc + "</td>";
        tdata += "<td>" + data.pmem_perc + "</td>";
        tdata += "<td>" + data.puser + "</td>";
        tdata += "</tr>";
    })
    ptable.html( tdata );
});