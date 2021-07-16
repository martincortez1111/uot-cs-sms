var options = {
    series: [{
        name: 'الطلاب المسجلين',
        data: [100, 90, 50, 70, 100, 80, 60, 65, 90]
    }, {
        name: 'الطلاب المستمرين',
        data: [76, 85, 40, 66, 87, 60, 35, 55, 75]
    }, {
        name: 'الطلاب الخريجين',
        data: [35, 41, 36, 26, 45, 48, 52, 53, 41]
    }],
    chart: {
        type: 'bar',
        height: 350
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded'
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
    },
    xaxis: {
        categories: ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022'],
        title: {
            text: 'سنة'
        }
    },
    yaxis: {
        title: {
            text: 'طالب'
        }
    },
    fill: {
        opacity: 1
    },
    tooltip: {
        y: {
            formatter: function(val) {
                return "طالب"
            }
        }
    }
};

var chart = new ApexCharts(document.querySelector("#apex1"), options);
chart.render();