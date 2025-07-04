
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CampaignData } from '@/lib/sampleData';

interface FailureReasonsChartProps {
  data: CampaignData[];
}

const FailureReasonsChart = ({ data }: FailureReasonsChartProps) => {
  // Aggregate failure reasons
  const failureReasons = data.reduce((acc, item) => {
    if (item.failureReason && item.delivered < item.attempted) {
      const failed = item.attempted - item.delivered;
      acc[item.failureReason] = (acc[item.failureReason] || 0) + failed;
    }
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(failureReasons).map(([reason, count]) => ({
    name: reason,
    value: count,
    percentage: ((count / Object.values(failureReasons).reduce((a, b) => a + b, 0)) * 100).toFixed(1)
  }));

  const COLORS = [
    '#ef4444', '#f97316', '#eab308', '#84cc16', 
    '#06b6d4', '#8b5cf6', '#ec4899', '#64748b'
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{data.payload.name}</p>
          <p className="text-sm text-gray-600">
            Count: {data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">
            Percentage: {data.payload.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Failure Reasons Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default FailureReasonsChart;
