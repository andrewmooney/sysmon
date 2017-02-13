var socket = io();
socket.on('clientdata', function(cd) {
    var data = jQuery.parseJSON(cd);
    //console.log(data);
    data.hostname = data.hostname.split('.')[0]
    var client = $('#' + data.hostname);
    client.find('.date').text('Date: ' + new Date(data.timestamp));
    client.find('.cpu').text(data.cpu_perc);
    client.find('.vmem').text(data.vmem_perc);
    client.find('.smem').text(data.smem_perc);
});