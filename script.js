
fetch('https://api.upbit.com/v1/candles/days?market=KRW-BTC&count=30')
    .then(response => response.json())
    .then(data => {
        data.reverse(); // 날짜 순으로 정렬

        // 캔들 차트 데이터 생성
        const candleData = data.map(d => ({
            x: new Date(d.candle_date_time_kst),
            y: [d.opening_price, d.high_price, d.low_price, d.trade_price]
        }));

        // 7일 이동 평균 계산
        const movingAverageData = data.map((d, i, arr) => {
            const windowSize = 7;
            const startIdx = Math.max(0, i - windowSize + 1);
            const windowData = arr.slice(startIdx, i + 1);
            const average = windowData.reduce((acc, val) => acc + val.trade_price, 0) / windowData.length;
            return { x: new Date(d.candle_date_time_kst), y: average };
        });

        // 차트 설정 및 렌더링
        const chart = new CanvasJS.Chart("chart", {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "비트코인 30일 캔들 차트 및 7일 평균"
            },
            axisX: {
                valueFormatString: "DD MMM"
            },
            axisY: {
                prefix: "₩"
            },
            data: [{
                type: "candlestick",
                showInLegend: true,
                name: "비트코인 가격",
                yValueFormatString: "₩#,##0",
                dataPoints: candleData
            }, {
                type: "line",
                showInLegend: true,
                name: "7일 평균",
                yValueFormatString: "₩#,##0",
                dataPoints: movingAverageData
            }]
        });

        chart.render();
    });
