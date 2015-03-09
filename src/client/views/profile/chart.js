Template.profile_chart.postStats = function() {
    return {
        chart: {
            backgroundColor: 'transparent',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            height: 200
        },
        credits: {
          enabled: false
        },
        title: {
            text: ''
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: false
                }
            }
        },
        xAxis: {
            gridLineColor: '#000000'
        },
        yAxis: {
            gridLineColor: 'transparent',
            labels: {
                enabled: false
            },
            title: {
                text: null
            }
        },
        series: [{
            type: 'line',
            name: 'posts by day',
            data: [
                ['1/1', 6],
                ['2/1', 12],
                ['3/1', 7],
                ['4/1', 0],
                ['5/1', 3]
            ]
        }]
    };
};