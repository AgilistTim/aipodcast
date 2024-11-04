import axios from 'axios';

async function scrapeUrl(url: string): Promise<string> {
  try {
    const response = await axios.get(url, {
      timeout: 5000, // 5 seconds timeout
    });
    const textContent = response.data.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return textContent.slice(0, 1000);
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return `Failed to scrape ${url}. Please check the URL or try again later.`;
  }
}

export async function scrapeAndSummarizeUrls(urls: string[]): Promise<string[]> {
  const scrapedContents = await Promise.all(urls.map(scrapeUrl));
  return scrapedContents;
}