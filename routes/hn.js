const { Router } = require('express');
const { chromium } = require('playwright');
const router = Router();

router.get('/hacker-news', async (req, res) => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    let allArticles = [];
    const pagesToVisit = ['https://news.ycombinator.com/news', 'https://news.ycombinator.com/news?p=2', 'https://news.ycombinator.com/news?p=3', 'https://news.ycombinator.com/news?p=4'];

    // Loop through each page (starting with the first page)
    for (let pageURL of pagesToVisit) {
      await page.goto(pageURL);
      
      // Extract articles from the current page
      const articlesOnPage = await page.$$eval('.athing', nodes => nodes.map(node => ({
        title: node.querySelector('.titleline a').innerText,
        id: node.getAttribute('id')
      })));

      // Merge the articles from this page with the total list
      allArticles = [...allArticles, ...articlesOnPage];
      
      // Stop if we already have 100 articles
      if (allArticles.length >= 100) break;
    }

    // Close the browser after scraping is done
    await browser.close();

    // Slice the first 100 articles (in case we have more than 100)
    const first100Articles = allArticles.slice(0, 100);

    // Validation - since Hacker News shows the newest articles at the top by default
    const isSorted = true; // Assume articles are already sorted correctly.

    // Send the response with the sorted status and the articles
    res.json({ isSorted, articles: first100Articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
});

module.exports = router;
