// pages/api/data.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Define types for your expected data
type ApiResponse = {
  labels: string[];
  values: number[];
  // Add other properties as needed
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse | ErrorResponse>
) {
  if (req.method !== 'POST') {
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}


  try {
    const { project, asset_id } = req.query;

    // Validate required parameters
    if (!project && !asset_id) {
      return res.status(400).json({ 
        error: 'At least one search parameter (project or asset_id) is required' 
      });
    }

    // Call your n8n webhook
    const response = await fetch('https://alt012.app.n8n.cloud/webhook-test/webhook-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        company: project,  // Matching your n8n expected field name
        asset_id 
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n API responded with status ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to match your frontend expectations
    const transformedData: ApiResponse = {
      labels: data.results?.map((item: any) => item.label) || [],
      values: data.results?.map((item: any) => item.value) || [],
    };

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Internal server error' 
    });
  }
}