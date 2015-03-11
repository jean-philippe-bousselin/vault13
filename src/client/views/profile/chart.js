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
            xAxis: {
                type: 'datetime'
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: false
                    }
                },
                series: {
                    marker: {
                        enabled: false
                    }
                }
            },
            series: [{
                type: 'line',
                name: 'posts by day',
                data: [
                    [Date.UTC(2015, 2, 1), 2],
                    [Date.UTC(2015, 2, 2), 3],
                    [Date.UTC(2015, 2, 3), 8],
                    [Date.UTC(2015, 2, 4), 13],
                    [Date.UTC(2015, 2, 5), 4],
                    [Date.UTC(2015, 2, 6), 0],
                    [Date.UTC(2015, 2, 7), 0],
                    [Date.UTC(2015, 2, 8), 12],
                    [Date.UTC(2015, 2, 9), 21],
                    [Date.UTC(2015, 2, 10), 16]
                ]
            }]
        };
    }
});