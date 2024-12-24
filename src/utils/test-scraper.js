import { scrapeResults } from './scraper.js';
import schedule from '../data/schedule.json';

async function testScraper() {
  // Test with first race in schedule
  const firstRace = schedule.races[0];
  console.log(`Testing scraper with ${firstRace.name}...`);
  
  const results = await scrapeResults(firstRace.raceUrl);
  
  if (results) {
    console.log('Scraping successful!');
    console.log('First 3 positions:');
    console.log(results.slice(0, 3));
    console.log('\nDNFs:');
    console.log(results.filter(r => r.position === 'DNF'));
  } else {
    console.log('Scraping failed!');
  }
}

testScraper();
