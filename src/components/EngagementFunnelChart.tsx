
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CampaignData } from '@/lib/sampleData';

interface EngagementFunnelChartProps {
  data: CampaignData[];
}

const EngagementFunnelChart = ({ data }: EngagementFunnelChartProps) => {
  const totals = data.reduce(
    (acc, item) => ({
      attempted: acc.attempted + item.attempted,
      delivered: acc.delivered + item.delivered,
      read: acc.read + item.read,
      responded: acc.responded + item.responded,
      failed: acc.failed + (item.attempted - item.delivered)
    }),
    { attempted: 0, delivered: 0, read: 0, responded: 0, failed: 0 }
  );

  const maxValue = Math.max(totals.attempted, totals.delivered, totals.read, totals.responded, totals.failed);

  const stages = [
    {
      label: 'Total Recipients',
      count: totals.attempted,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'bg-slate-100'
    },
    {
      label: 'Messages Delivered',
      count: totals.delivered,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      label: 'Messages Read',
      count: totals.read,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      label: 'Messages Responded',
      count: totals.responded,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      label: 'Messages Failed',
      count: totals.failed,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-100'
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
                {index > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-gray-500">
                      {index === 4 
                        ? ((stage.count / stages[0].count) * 100).toFixed(1)
                        : ((stage.count / stages[index - 1].count) * 100).toFixed(1)
                      }% conversion
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`relative ${stage.bgColor} rounded-lg overflow-hidden`} 
                   style={{ height: '60px' }}>
                <div 
                  className={`h-full bg-gradient-to-r ${stage.color} transition-all duration-1000 ease-out flex items-center justify-center`}
                  style={{ width: `${Math.max((stage.count / maxValue) * 100, 5)}%` }}
                >
                  <span className="text-white font-semibold text-sm">
                    {stage.count.toLocaleString()}
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
      </CardContent>
    </Card>
  );
};

export default EngagementFunnelChart;
