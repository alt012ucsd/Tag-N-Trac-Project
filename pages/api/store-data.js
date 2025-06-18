let latestData = null;

export default function handler(req, res) {
  if (req.method === 'POST') {
    latestData = req.body;
    return res.status(200).json({ message: 'Data stored' });
  } else if (req.method === 'GET') {
    return res.status(200).json(latestData || { message: 'No data yet' });
  }
}
