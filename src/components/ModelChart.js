// src/components/ModelChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Title, Tooltip, Legend);

function ModelChart({ title, actualData, predictedData }) {
    const data = {
        labels: Array.from({ length: actualData.length }, (_, i) => i + 1),
        datasets: [
            {
                label: 'Actual',
                data: actualData,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
            },
            {
                label: 'Predicted',
                data: predictedData,
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: title },
        },
        scales: {
            x: { title: { display: true, text: 'Sample' } },
            y: { title: { display: true, text: title } },
        },
    };

    return <Line data={data} options={options} />;
}

export default ModelChart;
