// src/components/ModelChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: title,
      font: {
        size: 16,
        weight: 'bold'
      },
      padding: 20
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14
      },
      bodyFont: {
        size: 13
      },
      padding: 12,
      cornerRadius: 8,
      animation: {
        duration: 200
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Sample',
        font: {
          size: 14
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    y: {
      title: {
        display: true,
        text: title,
        font: {
          size: 14
        }
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  },
  animation: {
    duration: 1000,
    easing: 'easeInOutQuart'
  },
  interaction: {
    intersect: false,
    mode: 'index'
  },
  elements: {
    line: {
      tension: 0.4
    },
    point: {
      radius: 4,
      hoverRadius: 6
    }
  }
};

function ModelChart({ title, actualData, predictedData }) {
    const data = {
        labels: Array.from({ length: actualData.length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Actual',
                data: actualData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
            {
                label: 'Predicted',
                data: predictedData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
        ],
    };

    return <Line data={data} options={chartOptions} />;
}

export default ModelChart;
