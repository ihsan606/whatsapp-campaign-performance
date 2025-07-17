
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
        publishDate: item.timestamp,
        totalAttempted: 0,
        totalDelivered: 0,
        totalRead: 0,
        totalResponded: 0,
        totalFailed: 0,
        totalTokensUsed: 0
      };
    }
    
    // Use earliest date as publish date
    if (new Date(item.timestamp) < new Date(acc[item.campaignId].publishDate)) {
      acc[item.campaignId].publishDate = item.timestamp;
    }
    
    acc[item.campaignId].totalAttempted += item.attempted;
    acc[item.campaignId].totalDelivered += item.delivered;
    acc[item.campaignId].totalRead += item.read;
    acc[item.campaignId].totalResponded += item.responded;
    acc[item.campaignId].totalFailed += (item.attempted - item.delivered);
    acc[item.campaignId].totalTokensUsed += item.tokensUsed;
    
    return acc;
  }, {} as Record<string, any>);

  const tableData = Object.values(campaignMetrics).map((campaign: any) => {
    const deliveryRate = (campaign.totalDelivered / campaign.totalAttempted) * 100;
    const readRate = (campaign.totalRead / campaign.totalDelivered) * 100;
    const responseRate = (campaign.totalResponded / campaign.totalDelivered) * 100;
    const failureRate = (campaign.totalFailed / campaign.totalAttempted) * 100;
    const totalCost = campaign.totalTokensUsed * 0.001; // Assuming $0.001 per token for WhatsApp

    return {
      campaignId: campaign.campaignId,
      publishDate: format(parseISO(campaign.publishDate), 'MMM dd, yyyy'),
      totalRecipients: campaign.totalAttempted,
      sent: campaign.totalAttempted,
      delivered: campaign.totalDelivered,
      read: campaign.totalRead,
      replied: campaign.totalResponded,
      deliveryRate: deliveryRate.toFixed(1),
      readRate: readRate.toFixed(1),
      responseRate: responseRate.toFixed(1),
      failureRate: failureRate.toFixed(1),
      tokensUsed: campaign.totalTokensUsed,
      totalCost: totalCost
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
                <TableHead className="font-semibold">Publish Date</TableHead>
                <TableHead className="font-semibold text-right">Sent</TableHead>
                <TableHead className="font-semibold text-right">Delivered</TableHead>
                <TableHead className="font-semibold text-right">Read</TableHead>
                <TableHead className="font-semibold text-right">Replied</TableHead>
                <TableHead className="font-semibold text-right">Delivery Rate</TableHead>
                <TableHead className="font-semibold text-right">Read Rate</TableHead>
                <TableHead className="font-semibold text-right">Response Rate</TableHead>
                <TableHead className="font-semibold text-right">Failure Rate</TableHead>
                <TableHead className="font-semibold text-right">Total Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((campaign) => (
                <TableRow key={campaign.campaignId} className="hover:bg-gray-50/50">
                  <TableCell className="font-medium">{campaign.campaignId}</TableCell>
                  <TableCell className="text-gray-600">{campaign.publishDate}</TableCell>
                  <TableCell className="text-right font-medium">
                    {campaign.sent.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {campaign.delivered.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {campaign.read.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {campaign.replied.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      parseFloat(campaign.deliveryRate) >= 90 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : parseFloat(campaign.deliveryRate) >= 70 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.deliveryRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      parseFloat(campaign.readRate) >= 60 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : parseFloat(campaign.readRate) >= 40 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.readRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      parseFloat(campaign.responseRate) >= 15 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : parseFloat(campaign.responseRate) >= 5 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.responseRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                      parseFloat(campaign.failureRate) <= 10 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : parseFloat(campaign.failureRate) <= 30 
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {campaign.failureRate}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    ${campaign.totalCost.toFixed(3)}
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
