const mill_sec_one_day = 24 * 3600 * 1000;

/**
 * 获取语言
 * @param languages
 */
function language_chart(languages) {
    let language = [];
    for (let idx in languages.edges) {
        let item = {};
        item['value'] = languages.edges[idx].size;
        item['name'] = languages.edges[idx].node.name;
        language.push(item)
    }

    let languageChart = echarts.init(document.getElementById('language-chart'), 'dark');
    let option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        backgroundColor: 'rgba(0,0,0,0.0)',
        color: ['#005cc5', '#28a745'],
        legend: {
            top: 10,
            left: 30,
            orient: 'vertical',
            x: 'left',
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: ['50%', '70%'],
                center: ['50%', '50%'],
                animationType: 'scale',
                animationEasing: 'elasticOut',
                avoidLabelOverlap: true,
                data: language.sort(function (a, b) {
                    return a.value - b.value;
                }),
            }
        ]
    };
    languageChart.setOption(option);
}

/**
 * 获取贡献雷达图
 * @param starCount
 * @param watchCount
 * @param ForkCount
 */
function starWatchForkChart(starCount, watchCount, ForkCount) {
    let starWatchForkChart = echarts.init(document.getElementById('star-watch-fork-chart'), 'dark');
    let option = {
        backgroundColor: 'rgba(0,0,0,0.0)',
        tooltip: {},
        radar: {
            shape: 'circle',
            radius: '70%',
            indicator: [
                {name: 'Star', max: Math.max(starCount, watchCount, ForkCount)},
                {name: 'Watch', max: Math.max(starCount, watchCount, ForkCount)},
                {name: 'Fork', max: Math.max(starCount, watchCount, ForkCount)}
            ],
            splitLine: {
                lineStyle: {
                    color: [
                        'rgba(45, 234, 148, 0.1)', 'rgba(45, 234, 148, 0.2)',
                        'rgba(45, 234, 148, 0.4)', 'rgba(45, 234, 148, 0.6)',
                        'rgba(45, 234, 148, 0.8)', 'rgba(45, 234, 148, 1)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(45, 234, 148, 0.5)'
                }
            }
        },
        series: [{
            name: 'Activity',
            type: 'radar',
            symbolSize: 0,
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: [
                {
                    value: [starCount, watchCount, ForkCount],
                    name: 'Activity'
                }
            ],
            color: 'rgba(40,167,69,1.0)'
        }]
    };
    starWatchForkChart.setOption(option);
}

/**
 * 获取最近一年贡献日历
 * @param contributions
 */
function contributions(contributions) {
    let now = new Date();
    let today = datetimeToUtcDate(now);
    let week = now.getUTCDay();
    let days = 51 * 7 + week + 1;
    let one_year_ago = new Date(today.getTime() - (days - 1) * mill_sec_one_day);

    let commits = [];
    for (let i = 0; i < days; i++) {
        let date = new Date(one_year_ago.getTime() + i * mill_sec_one_day).format('yyyy-MM-dd');
        commits[i] = [date, contributions[Math.floor(i / 7)]['days'][i % 7]]
    }

    let start = one_year_ago.format('yyyy-MM-dd');
    let end = today.format('yyyy-MM-dd');
    let contributionsChart = echarts.init(document.getElementById('contribution'));
    let option = {
        title: {
            top: 0,
            text: days+' contributions in the last year',
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
                let value = obj.value;
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
                color: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127']
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
            data: commits,
        }]

    };
    contributionsChart.setOption(option);
}

/**
 * @param int
 * @returns {*}
 */
function leftPaddingZero(int) {
    return int < 10 ? '0' + int : int;
}

/**
 * @param datetime
 * @returns {Date}
 */
function datetimeToUtcDate(datetime) {
    let year = datetime.getUTCFullYear();
    let month = leftPaddingZero((datetime.getUTCMonth() + 1));
    let day = leftPaddingZero(datetime.getUTCDate());
    return new Date(year + '-' + month + '-' + day + 'T00:00:00Z');
}
