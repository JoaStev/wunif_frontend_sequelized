// PieChart.js
import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data }) {
  const chartData = {
    labels: data.map(p => p.name),
    datasets: [
      {
        data: data.map(p => p.cantidad),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#C9CBCF', '#B2FF66', '#FF66B2', '#66B2FF'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Pie data={chartData} />
    </div>
  );
}
