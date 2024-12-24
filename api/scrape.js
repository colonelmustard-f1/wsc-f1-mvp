import cheerio from 'cheerio';
import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    console.log('Attempting to scrape:', url);
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];
    
    $('.resultsarchive-table tbody tr').each((i, elem) => {
      const position = $(elem).find('td:nth-child(2)').text().trim();
      const driver = $(elem).find('td:nth-child(4)').text().trim();
      const status = $(elem).find('td:nth-child(7)').text().trim();
      
      results.push({
        position: position === 'NC' ? 'DNF' : parseInt(position),
        driver,
        status
      });
    });

    return res.status(200).json({ results });
  } catch (error) {
    console.error('Scraping error:', error);
    return res.status(500).json({ error: 'Failed to scrape results' });
  }
}
