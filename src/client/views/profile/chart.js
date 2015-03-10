Template.profile_chart.helpers({
    postStats: function() {
        return {
            chart: {
                backgroundColor: 'transparent',
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                height: 250
            },
            credits: {
                enabled: false
            },
            title: {
                text: ''
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
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false
                    }
                },
                pie: {
                    dataLabels: {
                        distance: -10,
                        color: 'red'
                    }
                }
            },
            series: [{
                type: 'line',
                name: 'posts by day',
                data: [6,12,7,0,3]
            }, {
                type: 'pie',
                name: 'Total consumption',
                data: [{
                    name: 'Black Metal',
                    y: 13,
                    color: Highcharts.getOptions().colors[0] // Jane's color
                }, {
                    name: 'Post-rock',
                    y: 23,
                    color: Highcharts.getOptions().colors[1] // John's color
                }, {
                    name: 'Hip Hop',
                    y: 19,
                    color: Highcharts.getOptions().colors[2] // Joe's color
                }],
                center: [100, 80],
                size: 100,
                showInLegend: false

            }]
        };
    }
});