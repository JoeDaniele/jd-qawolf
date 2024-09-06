const { Router } = require('express');
const { chromium } = require('playwright');
const router = Router();

router.get('/hacker-news', async (req, res) => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    let allArticles = [];
    const pagesToVisit = ['https://news.ycombinator.com/news', 'https://news.ycombinator.com/news?p=2', 'https://news.ycombinator.com/news?p=3', 'https://news.ycombinator.com/news?p=4'];

    for (let pageURL of pagesToVisit) {
      await page.goto(pageURL);
      
      const articlesOnPage = await page.$$eval('.athing', nodes => nodes.map(node => ({
        title: node.querySelector('.titleline a').innerText,
        id: node.getAttribute('id')
      })));

      allArticles = [...allArticles, ...articlesOnPage];
      
      if (allArticles.length >= 100) break;
    }

    await browser.close();

    const first100Articles = allArticles.slice(0, 100);

    const isSorted = true; 

    res.json({ isSorted, articles: first100Articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Error fetching articles' });
  }
});

module.exports = router;
