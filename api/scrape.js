// api/scrape.js
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { race } = req.query;
    const url = `https://www.bbc.com/sport/formula1/2024/${race}/results`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    const results = [];
    
    // Parse BBC results table - update selectors after inspecting page
    $('.results-table tbody tr').each((i, row) => {
      const position = $(row).find('td:nth-child(1)').text().trim();
      const driver = $(row).find('td:nth-child(2)').text().trim();
      const status = $(row).find('td:last-child').text().trim();
      
      results.push({
        position: parseInt(position) || 'DNF',
        driver,
        status
      });
    });

    // Get P10 and first DNF
    const p10 = results.find(r => r.position === 10)?.driver || null;
    const firstDNF = results.find(r => r.position === 'DNF')?.driver || null;

    return res.status(200).json({
      race,
      results: {
        firstDNF,
        p10,
        fullResults: results
      }
    });

  } catch (error) {
    console.error('Scraper error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch race results',
      details: error.message 
    });
  }
}
