// api/scrape.js
import cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const { raceId, location } = req.query;
    const url = `https://www.formula1.com/en/results/2024/races/${raceId}/${location}/race-result.html`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const html = await response.text();
    console.log('HTML Response:', html.substring(0, 500)); // Log first 500 chars
    
    if (!html) {
      throw new Error('Empty HTML response');
    }
    
    const $ = cheerio.load(html);
    
    const results = [];
    
    // Parse race results table
    $('.resultsarchive-table tbody tr').each((i, row) => {
      const position = $(row).find('td:nth-child(2)').text().trim();
      const driver = $(row).find('td:nth-child(4)').text().trim();
      const status = $(row).find('td:last-child').text().trim();
      
      results.push({
        position: parseInt(position) || 'DNF',
        driver,
        status
      });
    });

    // Get first DNF
    const firstDNF = results.find(r => r.position === 'DNF')?.driver || null;
    
    // Get P10 finisher
    const p10 = results.find(r => r.position === 10)?.driver || null;

    return res.status(200).json({
      raceId,
      location,
      results: {
        firstDNF,
        p10,
        fullResults: results
      }
    });

  } catch (error) {
    return res.status(500).json({ 
      error: 'Failed to fetch race results',
      details: error.message 
    });
  }
}
