import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { LineChart } from 'lucide-react';
import { getAllRows } from '../lib/db';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export function ResultsChart() {
  const { data: samples = [] } = useQuery({
    queryKey: ['samples-chart'],
    queryFn: () => getAllRows(`
      SELECT concreteType,
             AVG(day7Result) as avg7,
             AVG(day14Result) as avg14,
             AVG(day28Result) as avg28
      FROM samples
      GROUP BY concreteType
    `),
  });

  const chartData = {
    labels: ['7 Jours', '14 Jours', '28 Jours'],
    datasets: samples.map((sample: any) => ({
      label: sample[0],
      data: [sample[1], sample[2], sample[3]],
      borderColor: getColorForType(sample[0]),
      tension: 0.3,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution de la Résistance par Type de Béton',
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Résistance (MPa)',
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <LineChart className="w-6 h-6 text-blue-600" />
        Analyse des Résultats
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
}

function getColorForType(type: string) {
  const colors = {
    'B25': 'rgb(59, 130, 246)',
    'B30': 'rgb(16, 185, 129)',
    'B35': 'rgb(249, 115, 22)',
  };
  return colors[type as keyof typeof colors] || 'rgb(107, 114, 128)';
}