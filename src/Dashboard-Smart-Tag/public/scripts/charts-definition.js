// Create the charts when the web page loads
window.addEventListener('load', onload);

function onload(event){
  chartT = createTemperatureChart();
}

// Create Temperature Chart
function createTemperatureChart() {
  var chart = new Highcharts.Chart({
    chart:{ 
      renderTo:'chart-temperature',
      type: 'spline' 
    },
    series: [
      {
        name: 'Força do Sinal Wi-Fi'
      }
    ],
    title: { 
      text: undefined
    },
    plotOptions: {
      line: { 
        animation: false,
        dataLabels: { 
          enabled: true 
        }
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' }
    },
    yAxis: {
      title: { 
        text: 'Sinal Wi-Fi (decibéis em relação a 1 miliwatt)' 
      }
    },
    credits: { 
      enabled: false 
    }
  });
 return chart;
}