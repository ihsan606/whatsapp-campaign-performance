
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { CampaignData } from '@/lib/sampleData';

interface PerformanceOverTimeChartProps {
  data: CampaignData[];
}

const PerformanceOverTimeChart = ({ data }: PerformanceOverTimeChartProps) => {
  // Aggregate data by date
  const dailyData = data.reduce((acc, item) => {
    const date = format(parseISO(item.timestamp), 'yyyy-MM-dd');
    
    if (!acc[date]) {
      acc[date] = {
        date,
        totalAttempted: 0,
        totalDelivered: 0,
        totalRead: 0,
        totalResponded: 0,
        totalFailed: 0
      };
    }
    
    acc[date].totalAttempted += item.attempted;
    acc[date].totalDelivered += item.delivered;
    acc[date].totalRead += item.read;
    acc[date].totalResponded += item.responded;
    acc[date].totalFailed += (item.attempted - item.delivered);
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(dailyData).map((day: any) => ({
    date: format(parseISO(day.date), 'MMM dd'),
    deliveryRate: ((day.totalDelivered / day.totalAttempted) * 100).toFixed(1),
    readRate: ((day.totalRead / day.totalDelivered) * 100).toFixed(1),
    responseRate: ((day.totalResponded / day.totalDelivered) * 100).toFixed(1),
    failureRate: ((day.totalFailed / day.totalAttempted) * 100).toFixed(1)
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Campaign Performance Over Time
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ width: '100%', height: 500 }}>
          <ResponsiveContainer>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                stroke="#666"
                fontSize={12}
              />
              <YAxis 
                stroke="#666"
                fontSize={12}
                label={{ value: 'Rate (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="deliveryRate" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Delivery Rate"
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="readRate" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Read Rate"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="responseRate" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Response Rate"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="failureRate" 
                stroke="#ef4444" 
                strokeWidth={3}
                name="Failure Rate"
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceOverTimeChart;
