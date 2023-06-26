// Create Temperature Gauge
function createTemperatureGauge() {
    var gauge = new RadialGauge({
        renderTo: 'gauge-temperature',
        width: 150,
        height: 150,
        units: 'dBm',
        valueDec: 0,
        valueInt: 2, 
        minValue: -100,
        maxValue: 0,
        majorTicks: ['-100', '-80', '-60', '-40', '-20', '0'],
        minorTicks: 20,
        ticksAngle: 270,
        startAngle: 45,
        strokeTicks: true,
        highlights: [
          { from: -100, to: -80, color: 'rgba(255,0,0,.25)' },
          { from: -80, to: -60, color: 'rgba(255,255,0,.25)' },
          { from: -60, to: 0, color: 'rgba(0,255,0,.25)' }
        ],
        colorPlate: '#fff',
        borderShadowWidth: 0,
        borders: false,
        needleType: "rectangle",
        needleWidth: 2,
        needleCircleSize: 25,
        needleCircleOuter: false,
        needleCircleInner: true,
        animationDuration: 1500,
        animationRule: "linear"
      });

    return gauge;
}