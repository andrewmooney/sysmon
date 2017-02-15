var socket = io.connect();
var path = window.location.pathname.split('/');
var room = path[1];

hostname.innerText = room;

socket.on('connect', function(){
    socket.emit('room', room);
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
