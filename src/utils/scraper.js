import cheerio from 'cheerio';
import fetch from 'node-fetch';

async function scrapeResults(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const results = [];
    
    // Each row in the results table
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

    return results;
  } catch (error) {
    console.error('Scraping error:', error);
    return null;
  }
}

export { scrapeResults };
