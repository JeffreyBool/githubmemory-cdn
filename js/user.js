function UserContributions(contributionCalendar) {
    let index = 0;
    let commits = [];
    for (let i = 0; i < contributionCalendar.weeks.length; i++) {
        for (let j = 0; j < contributionCalendar.weeks[i].contributionDays.length; j++) {
            let contribution = contributionCalendar.weeks[i].contributionDays[j];
            commits[index] = [contribution.date, contribution.contributionCount];
            index++
        }
    }

    let now = moment();
    let start = now.format('YYYY-MM-DD');
    let end = now.add(-1, 'y').format('YYYY-MM-DD');
    if (commits.length > 0) {
        start = commits[0][0];
        end = commits[commits.length - 1][0];
    }

    let contributionsChart = echarts.init(document.getElementById('contribution'));
    let option = {
        title: {
            top: 0,
            text: contributionCalendar.totalContributions + ' contributions in the last year',
            left: 'center',
            textStyle: {
                color: '#3C4858'
            }
        },
        tooltip: {
            padding: 10,
            backgroundColor: '#555',
            borderColor: '#777',
            borderWidth: 1,
            formatter: function (obj) {
                var value = obj.value;
                return '<div style="font-size: 14px;">' + value[0] + '：' + value[1] + '</div>';
            }
        },
        visualMap: {
            show: true,
            showLabel: true,
            categories: [0, 1, 2, 3, 4],
            calculable: true,
            inRange: {
                symbol: 'rect',
                color: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
            },
            itemWidth: 12,
            itemHeight: 12,
            orient: 'horizontal',
            left: 'center',
            bottom: 0
        },
        calendar: [{
            left: 'center',
            range: [start, end],
            cellSize: [13, 13],
            splitLine: {
                show: false
            },
            itemStyle: {
                color: '#196127',
                borderColor: '#fff',
                borderWidth: 2
            },
            yearLabel: {
                show: false
            },
            monthLabel: {
                nameMap: 'cn',
                fontSize: 11
            },
            dayLabel: {
                formatter: '{start}  1st',
                nameMap: 'cn',
                fontSize: 11
            }
        }],
        series: [{
            type: 'heatmap',
            coordinateSystem: 'calendar',
            calendarIndex: 0,
            data: commits
        }]

    };
    contributionsChart.setOption(option);
}
