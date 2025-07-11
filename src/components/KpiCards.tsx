import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { CampaignData } from '@/lib/sampleData';

interface KpiCardsProps {
  data: CampaignData[];
}

const KpiCards = ({ data }: KpiCardsProps) => {
  // Calculate totals
  const totalAttempted = data.reduce((sum, item) => sum + item.attempted, 0);
  const totalDelivered = data.reduce((sum, item) => sum + item.delivered, 0);
  const totalRead = data.reduce((sum, item) => sum + item.read, 0);
  const totalResponded = data.reduce((sum, item) => sum + item.responded, 0);
  const totalFailed = totalAttempted - totalDelivered;
  const totalTokensUsed = data.reduce((sum, item) => sum + item.tokensUsed, 0);

  // Calculate rates
  const deliveryRate = (totalDelivered / Math.max(totalAttempted, 1)) * 100;
  const readRate = (totalRead / Math.max(totalDelivered, 1)) * 100;
  const responseRate = (totalResponded / Math.max(totalDelivered, 1)) * 100;
  const failureRate = (totalFailed / Math.max(totalAttempted, 1)) * 100;

  const kpis = [
    {
      title: 'Total Recipients',
      value: totalAttempted.toLocaleString(),
      rate: '',
      change: '+12.3%',
      isPositive: true,
      color: 'from-slate-500 to-slate-600',
      bgColor: 'from-slate-50 to-slate-100'
    },
    {
      title: 'Delivery Rate',
      value: `${deliveryRate.toFixed(1)}%`,
      rate: totalDelivered.toLocaleString(),
      change: '+2.1%',
      isPositive: true,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      title: 'Read Rate',
      value: `${readRate.toFixed(1)}%`,
      rate: totalRead.toLocaleString(),
      change: '+3.5%',
      isPositive: true,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Response Rate',
      value: `${responseRate.toFixed(1)}%`,
      rate: totalResponded.toLocaleString(),
      change: '+1.8%',
      isPositive: true,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    },
    {
      title: 'Failure Rate',
      value: `${failureRate.toFixed(1)}%`,
      rate: totalFailed.toLocaleString(),
      change: '-1.2%',
      isPositive: true,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100'
    },
    {
      title: 'Tokens Used',
      value: totalTokensUsed.toLocaleString(),
      rate: '',
      change: '+8.7%',
      isPositive: true,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${kpi.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className={`text-2xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                {kpi.value}
              </div>
              {kpi.rate && (
                <div className="text-lg font-semibold text-gray-700">{kpi.rate}</div>
              )}
              <div className={`flex items-center text-sm ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {kpi.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                {kpi.change}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KpiCards;