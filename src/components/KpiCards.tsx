
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { CampaignData } from '@/lib/sampleData';

interface KpiCardsProps {
  data: CampaignData[];
}

const KpiCards = ({ data }: KpiCardsProps) => {
  const metrics = {
    deliveryRate: data.reduce((sum, item) => sum + item.delivered, 0) / 
                  Math.max(data.reduce((sum, item) => sum + item.attempted, 0), 1),
    failureRate: 1 - (data.reduce((sum, item) => sum + item.delivered, 0) / 
                     Math.max(data.reduce((sum, item) => sum + item.attempted, 0), 1)),
    readRate: data.reduce((sum, item) => sum + item.read, 0) / 
              Math.max(data.reduce((sum, item) => sum + item.delivered, 0), 1),
    responseRate: data.reduce((sum, item) => sum + item.responded, 0) / 
                  Math.max(data.reduce((sum, item) => sum + item.delivered, 0), 1),
  };

  const kpis = [
    {
      title: 'Delivery Rate',
      value: (metrics.deliveryRate * 100).toFixed(1) + '%',
      change: '+2.3%',
      isPositive: true,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: 'Failure Rate',
      value: (metrics.failureRate * 100).toFixed(1) + '%',
      change: '-1.2%',
      isPositive: true,
      color: 'from-red-500 to-red-600',
      bgColor: 'from-red-50 to-red-100'
    },
    {
      title: 'Read Rate',
      value: (metrics.readRate * 100).toFixed(1) + '%',
      change: '+5.7%',
      isPositive: true,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      title: 'Response Rate',
      value: (metrics.responseRate * 100).toFixed(1) + '%',
      change: '+3.1%',
      isPositive: true,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <Card key={index} className={`relative overflow-hidden bg-gradient-to-br ${kpi.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{kpi.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                  {kpi.value}
                </div>
                <div className={`flex items-center text-sm mt-1 ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.isPositive ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                  {kpi.change} vs last period
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default KpiCards;
