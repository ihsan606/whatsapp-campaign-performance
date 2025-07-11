
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

  const failureReasonExplanations = {
    'Invalid number': 'Phone number format is incorrect or does not exist',
    'Blocked by user': 'Recipient has blocked messages from this sender',
    'Network error': 'Temporary connectivity issues preventing delivery',
    'Service unavailable': 'WhatsApp service is temporarily down',
    'Rate limit exceeded': 'Too many messages sent too quickly',
    'Message too long': 'Message exceeds maximum character limit'
  };

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
        
        {/* Legend with explanations */}
        <div className="mt-4 space-y-2">
          <h4 className="font-medium text-gray-700 text-sm">Failure Reason Explanations:</h4>
          <div className="space-y-1">
            {chartData.map((item, index) => (
              <div key={item.name} className="flex items-start gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <div>
                  <span className="font-medium">{item.name}:</span>
                  <span className="text-gray-600 ml-1">
                    {failureReasonExplanations[item.name as keyof typeof failureReasonExplanations]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FailureReasonsChart;
