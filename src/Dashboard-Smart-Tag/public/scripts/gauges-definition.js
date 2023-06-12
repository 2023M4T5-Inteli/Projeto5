// Create Temperature Gauge
function createTemperatureGauge() {
    var gauge = new LinearGauge({
        renderTo: 'gauge-temperature',
        width: 120,
        height: 400,
        units: "Sinal Wi-Fi (dBm)",
        minValue: -100,
        startAngle: 90,
        ticksAngle: 180,
        maxValue: 0,
        colorValueBoxRect: "#049faa",
        colorValueBoxRectEnd: "#049faa",
        colorValueBoxBackground: "#f1fbfc",
        valueDec: 2,
        valueInt: 2,
        majorTicks: [
            "-96",
            "-84",
            "-72",
            "-60",
            "-48",
            "-36",
            "-24",
            "-12",
            "0"
        ],
        minorTicks: 4,
        strokeTicks: true,
        highlights: [
            {
                "from": -24,
                "to": 0,
                "color": "rgba(200, 50, 50, .75)"
            }
        ],
        colorPlate: "#fff",
        colorBarProgress: "#CC2936",
        colorBarProgressEnd: "#049faa",
        borderShadowWidth: 0,
        borders: false,
        needleType: "arrow",
        needleWidth: 2,
        needleCircleSize: 7,
        needleCircleOuter: true,
        needleCircleInner: false,
        animationDuration: 1500,
        animationRule: "linear",
        barWidth: 10,
    });
    return gauge;
}