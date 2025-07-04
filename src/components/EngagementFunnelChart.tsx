
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignData } from '@/lib/sampleData';

interface EngagementFunnelChartProps {
  data: CampaignData[];
}

const EngagementFunnelChart = ({ data }: EngagementFunnelChartProps) => {
  const totals = data.reduce(
    (acc, item) => ({
      delivered: acc.delivered + item.delivered,
      read: acc.read + item.read,
      responded: acc.responded + item.responded
    }),
    { delivered: 0, read: 0, responded: 0 }
  );

  const stages = [
    {
      label: 'Messages Delivered',
      count: totals.delivered,
      percentage: 100,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Messages Read',
      count: totals.read,
      percentage: (totals.read / totals.delivered) * 100,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      label: 'Messages Responded',
      count: totals.responded,
      percentage: (totals.responded / totals.delivered) * 100,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Engagement Funnel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {stages.map((stage, index) => (
            <div key={index} className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{stage.label}</span>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {stage.count.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stage.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              
              <div className={`relative ${stage.bgColor} rounded-lg overflow-hidden`} 
                   style={{ height: '60px' }}>
                <div 
                  className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-1000 ease-out flex items-center justify-center`}
                  style={{ width: `${Math.max(stage.percentage, 5)}%` }}
                >
                  <span className="text-white font-semibold text-sm">
                    {stage.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {index < stages.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
          <div className="text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Delivered → Read conversion:</span>
              <span className="font-semibold">
                {((totals.read / totals.delivered) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Read → Response conversion:</span>
              <span className="font-semibold">
                {((totals.responded / totals.read) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Overall engagement rate:</span>
              <span className="font-semibold text-purple-600">
                {((totals.responded / totals.delivered) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementFunnelChart;
