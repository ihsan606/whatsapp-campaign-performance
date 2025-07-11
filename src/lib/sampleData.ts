
export interface CampaignData {
  campaignId: string;
  campaignType: 'Automation' | 'Campaign';
  timestamp: string;
  attempted: number;
  delivered: number;
  deliveryStatus: 'success' | 'failure';
  failureReason?: string;
  read: number;
  responded: number;
  tokensUsed: number;
}

export const generateSampleData = (): CampaignData[] => {
  const campaigns = ['CAMP-001', 'CAMP-002', 'CAMP-003', 'CAMP-004', 'CAMP-005'];
  const campaignTypes: ('Automation' | 'Campaign')[] = ['Automation', 'Campaign'];
  const failureReasons = [
    'Invalid number',
    'Blocked by user',
    'Network error',
    'Service unavailable',
    'Rate limit exceeded',
    'Message too long'
  ];

  const data: CampaignData[] = [];

  // Generate data for the last 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(2024, 5, 1 + i);
    
    campaigns.forEach(campaignId => {
      // Generate 1-3 broadcasts per campaign per day
      const broadcastsPerDay = Math.floor(Math.random() * 3) + 1;
      
      for (let j = 0; j < broadcastsPerDay; j++) {
        const attempted = Math.floor(Math.random() * 1000) + 500;
        const deliveryRate = 0.75 + Math.random() * 0.2; // 75-95% delivery rate
        const delivered = Math.floor(attempted * deliveryRate);
        const failed = attempted - delivered;
        
        const readRate = 0.4 + Math.random() * 0.3; // 40-70% read rate
        const read = Math.floor(delivered * readRate);
        
        const responseRate = 0.05 + Math.random() * 0.15; // 5-20% response rate
        const responded = Math.floor(delivered * responseRate);

        // Calculate tokens used (average 1-3 tokens per message)
        const tokensUsed = Math.floor(attempted * (1 + Math.random() * 2));

        // Create timestamp with random hour
        const timestamp = new Date(date);
        timestamp.setHours(Math.floor(Math.random() * 24));
        timestamp.setMinutes(Math.floor(Math.random() * 60));

        data.push({
          campaignId,
          campaignType: campaignTypes[Math.floor(Math.random() * campaignTypes.length)],
          timestamp: timestamp.toISOString(),
          attempted,
          delivered,
          deliveryStatus: delivered === attempted ? 'success' : 'failure',
          failureReason: failed > 0 ? failureReasons[Math.floor(Math.random() * failureReasons.length)] : undefined,
          read,
          responded,
          tokensUsed
        });
      }
    });
  }

  return data.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};
