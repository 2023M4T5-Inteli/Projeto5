// Create the charts when the web page loads
window.addEventListener('load', onload);

function onload(event) {
  chartT = createTemperatureChart();
}

// Create Temperature Chart
function createTemperatureChart() {
  var isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  var chart = new Highcharts.Chart({
    chart: {
      renderTo: 'chart-temperature',
      type: 'line',
      backgroundColor: isDarkMode ? '#ECF2FF' : '#343A40', // Define a cor de fundo com base no tema preferido do usuário
      style: {
        fontFamily: 'Arial, sans-serif' // Altere a família de fontes do gráfico aqui
      }
    },
    series: [
      {
        name: 'Força do Sinal Wi-Fi',
        yAxis: 0,
        // configurações da primeira série...
        events: {
          legendItemClick: function () {
            var yAxis = this.chart.yAxis[0];
            if (this.visible) {
              yAxis.update({ title: { text: '' } });
            } else {
              yAxis.update({ title: { text: 'Sinal Wi-Fi (dBm)' } });
            }
          }
        }
      },
      {
        name: 'Distância do roteador conectado',
        yAxis: 1,
        // configurações da segunda série...
        events: {
          legendItemClick: function () {
            var yAxis = this.chart.yAxis[1];
            if (this.visible) {
              yAxis.update({ title: { text: '' } });
            } else {
              yAxis.update({ title: { text: 'Distância tablet x roteador (metros)' } });
            }
          }
        }
      }
    ],

    yAxis: [
      {
        title: {
          text: 'Sinal Wi-Fi (dBm)',
          style: {
            color: isDarkMode ? '#2caffe' : '#2CAFFE' // Defina a cor do nome do eixo Y principal
          }
        }
      },
      {
        title: {
          text: 'Distância tablet x roteador (metros)',
          style: {
            color: isDarkMode ? '#544fc5' : '#544fc5' // Defina a cor do nome do eixo Y secundário
          }
        },
        opposite: true // Posiciona o eixo y secundário no lado oposto
      }
    ],
    title: {
      text: undefined
    },
    plotOptions: {
      line: {
        animation: true,
        dataLabels: {
          enabled: true
        }
      }
    },
    xAxis: {
      type: 'datetime',
      dateTimeLabelFormats: { second: '%H:%M:%S' },
      labels: {
        style: {
          color: isDarkMode ? '#FFFFFF' : '#000000' // Defina a cor dos rótulos do eixo x (horário)
        }
      }
    },
    credits: {
      enabled: false
    }
  });
  return chart;
}

function updateChartColors(isDarkMode) {
  chartT.update({
    chart: {
      backgroundColor: isDarkMode ? '#343A40' : '#ECF2FF'
    },
    series: [
      {
        labels: {
          style: {
            color: isDarkMode ? '#2CAFFE' : '#2CAFFE' // Defina a cor da descrição da série (nome da série)
          }
        },
        // ...
      },
      {
        labels: {
          style: {
            color: isDarkMode ? '#544FC5' : '#544FC5' // Defina a cor da descrição da série (nome da série)
          }
        },
        // ...
      }
    ],
    yAxis: [
      {
        title: {
          style: {
            color: isDarkMode ? '#2caffe' : '#2caffe'
          }
        }
      },
      {
        title: {
          style: {
            color: isDarkMode ? '#544fc5' : '#544fc5'
          }
        }
      }
    ],
    xAxis: {
      labels: {
        style: {
          color: isDarkMode ? '#FFFFFF' : '#000000' // Defina a cor dos rótulos do eixo x (horário)
        }
      }
    }
  });
}

var input = document.querySelector('.container-leituras');
var search = document.querySelector('.input-leituras-grafico')
var button = document.querySelector('.btn-leituras');
button.addEventListener('click', function(e) {
  e.preventDefault();
  input.classList.toggle('active');
})
search.addEventListener('focus', function() {
  input.classList.add('focus');
})

search.addEventListener('blur', function() {
  search.value.length != 0 ? input.classList.add('focus') : input.classList.remove('focus');
})


