
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CampaignData } from '@/lib/sampleData';
import { format, parseISO } from 'date-fns';

interface CampaignTableProps {
  data: CampaignData[];
}

const CampaignTable = ({ data }: CampaignTableProps) => {
  // Aggregate data by campaign
  const campaignMetrics = data.reduce((acc, item) => {
    if (!acc[item.campaignId]) {
      acc[item.campaignId] = {
        campaignId: item.campaignId,
        dates: [],
        totalAttempted: 0,
        totalDelivered: 0,
        totalRead: 0,
        totalResponded: 0
      };
    }
    
    acc[item.campaignId].dates.push(item.timestamp);
    acc[item.campaignId].totalAttempted += item.attempted;
    acc[item.campaignId].totalDelivered += item.delivered;
    acc[item.campaignId].totalRead += item.read;
    acc[item.campaignId].totalResponded += item.responded;
    
    return acc;
  }, {} as Record<string, any>);

  const tableData = Object.values(campaignMetrics).map((campaign: any) => {
    const deliveryRate = (campaign.totalDelivered / campaign.totalAttempted) * 100;
    const failureRate = ((campaign.totalAttempted - campaign.totalDelivered) / campaign.totalAttempted) * 100;
    const readRate = (campaign.totalRead / campaign.totalDelivered) * 100;
    const responseRate = (campaign.totalResponded / campaign.totalDelivered) * 100;
    
    // Get date range for campaign
    const sortedDates = campaign.dates.sort();
    const startDate = format(parseISO(sortedDates[0]), 'MMM dd, yyyy');
    const endDate = format(parseISO(sortedDates[sortedDates.length - 1]), 'MMM dd, yyyy');
    const dateRange = startDate === endDate ? startDate : `${startDate} - ${endDate}`;

    return {
      campaignId: campaign.campaignId,
      dateRange,
      recipients: campaign.totalAttempted,
      deliveryRate: deliveryRate.toFixed(1),
      failureRate: failureRate.toFixed(1),
      readRate: readRate.toFixed(1),
      responseRate: responseRate.toFixed(1)
    };
  });

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Campaign Performance Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold">Campaign Name</TableHead>
                <TableHead className="font-semibold">Campaign Date</TableHead>
                <TableHead className="font-semibold text-right">Recipients</TableHead>
                <TableHead className="font-semibold text-right">Delivery Rate</TableHead>
                <TableHead className="font-semibold text-right">Failure Rate</TableHead>
                <TableHead className="font-semibold text-right">Read Rate</TableHead>
                <TableHead className="font-semibold text-right">Response Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((campaign) => (
                <TableRow key={campaign.campaignId} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{campaign.campaignId}</TableCell>
                  <TableCell className="text-gray-600">{campaign.dateRange}</TableCell>
                  <TableCell className="text-right font-medium">
                    {campaign.recipients.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {campaign.deliveryRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                      {campaign.failureRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-800">
                      {campaign.readRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                      {campaign.responseRate}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTable;
