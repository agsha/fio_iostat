
var data;

$(document).ready(function() {
    var myselect = $('#myselect');
    myselect.attr("disabled", true);
    var a = ['libaio', 'sync'], b=['read', 'write', 'randread', 'randwrite', 'rw', 'randrw']
    var c = ['sync=0', 'sync=1'], d=['direct=0', 'direct=1']
    for(var i=0; i<a.length; i++) {
        for(var j=0; j<b.length; j++) {
            for(var k=0; k< c.length; k++) {
                for(var l=0; l< d.length; l++) {
                    var val = [a[i], b[j], c[k], d[l]].join();
                    //console.log('<option>'+val+'</option>');
                    myselect.append('<option>'+val+'</option>');
                }
            }
        }
    }
    $.getJSON({
            url: "js/data"
            //cache: false
        })
        .done(function( val ) {
            data = val;
            //console.log(data);
            myselect.attr("disabled", false);
            reloadTableAndChart('libaio,read,sync=0,direct=0');
        });
    myselect.change(function(){reloadTableAndChart(this.value)});
} );
function invertArray(array,arrayWidth,arrayHeight) {
    var newArray = [];
    for (x=0;x<arrayWidth;x++) {
        newArray[x] = [];
        for (y=0;y<arrayHeight;y++) {
            newArray[x][y] = array[y][x];
        }
    }
    return newArray;
}
function reloadTableAndChart(title) {
    var x = [];
    var start = 0;
    console.log(title);

    if(title.indexOf('direct=1') != -1) {
        start = 12;
    }
    console.log(start);


    for(var r=start; r<25; r++) {
        x[r-start] = r;
    }

    var piece = getRun(title);
    if(!piece) return;
    var cols = [];
    for (var i=0; i<piece[4].length; i++) {
        cols.push({title:piece[4][i]});
    }

    var vals = piece.slice(5);
    invVals = invertArray(vals, vals[0].length, vals.length);

    console.log(invVals);

    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
        $('#example').dataTable({
            columns: cols,
            data: vals,
            paging: false,
            ordering: false,
            info: false,
            searching: false,
            "scrollY": "200px",
            "scrollCollapse": true,

            //autoWidth: false
        });
    } else {
        $('#example').DataTable().clear();
        $('#example').DataTable().rows.add(vals);
        $('#example').DataTable().draw()
    }
    var chart = $('#container').highcharts();
    if(chart) {
        chart.destroy();
    }
    $('#container').highcharts({
        chart: {
            zoomType: 'x'
        },
        title: {
            text: title
        },
        xAxis: [{
            categories: x,
            crosshair: true,
            title: {
                text: 'Block size (powers of 2)',
                style: {
                }
            }
        }],
        yAxis: [{ // Primary yAxis

            title: {
                text: 'bw'
            },
            opposite: true

        }, { // Secondary yAxis
            gridLineWidth: 0,
            title: {
                text: 'iops'
            }


        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'r/s',
            },

            opposite: true
        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'w/s'
            },
            opposite: true
        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'rKB/s'
            },
            opposite: true
        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'wKB/s'
            },
            opposite: true
        }, { // Tertiary yAxis
            gridLineWidth: 0,
            title: {
                text: 'avgrq-sz'
            },
            opposite: true
        }],
        tooltip: {
            shared: true
        },
        legend: {
            layout: 'horizontal',
            align: 'left'
        },
        series: [{
            name: 'bw',
            type: 'line',
            yAxis: 0,
            data: invVals[2],

        }, {
            name: 'iops',
            type: 'line',
            yAxis: 1,
            data: invVals[3],

        }, {
            name: 'r/s',
            type: 'line',
            yAxis: 2,
            data: invVals[7],

        }, {
            name: 'w/s',
            type: 'line',
            yAxis: 3,
            data: invVals[8],

        }, {
            name: 'rKB/s',
            type: 'line',
            yAxis: 0,
            data: invVals[9],

        }, {
            name: 'wKB/s',
            type: 'line',
            yAxis: 5,
            data: invVals[10],

        }, {
            name: 'avgrq-sz',
            type: 'line',
            yAxis: 6,
            data: invVals[11],

        }]
    })


}


function getRun(which) {
    for(var i=0; i<data.length; i++) {
        if(which==data[i].slice(0,4).join()) {
            //console.log('returned'+i);
            return data[i];
        }
    }
}
