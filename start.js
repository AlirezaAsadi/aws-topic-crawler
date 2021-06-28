const fetch = require('node-fetch');
const cheerio = require('cheerio');
const userAgent = 'Faraz Crawler/1.0 (+http://faraz.com.au/)';

const urls = [
  'https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html'
];

const load = (html) => cheerio.load(html, { xmlMode: true });
const wait = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

const getWebsite = async (url) => {
  try {
    const option = {
      Accept: 'text/html'
    };
    console.log(`Crawling ${url}...`);
    const response = await fetch(url, option);
    option.headers = Object.assign(option.headers || {}, { 'user-agent': userAgent });
    return response.text();
  } catch (e) {
    console.log(`Error while getting ${url}`, e);
    return null;
  }
};

const findConditionKeysInTopicPage = async (topicUrl) => {
  const actionConditionKeys = {};
  const html = await getWebsite(topicUrl);
  const $ = load(html);
  const firstTable = $('.table-container .table-contents table')[0];
  let tableHtml = load(firstTable).html();

  // Looks like html of table is not standard as it does not have tbody tag :)
  // I need to get ride of thead otherwise cheerio cannot parse it properly
  tableHtml = '<table>' + tableHtml.substr(tableHtml.indexOf('</thead>') + '</thead>'.length)

  const rows = load(tableHtml)('tr');
  for(let rowIndex = 0; rowIndex < rows.length; rowIndex++){
    const row = rows[rowIndex];
    const cells = load(row)('td');
    if (cells.length >= 5) {
      const actionsCell = load(cells[0]).text().replace(/\s\s+/g, ' ').trim(); // Action is in first cell
      const conditionKeysCell = load(cells[4]).text().replace(/\s\s+/g, ' ').trim(); // ConditionKeys is in fifth cell
      actionConditionKeys[actionsCell] = conditionKeysCell;
      console.log(`>Found Action=${actionsCell} ->  ConditionKeys=${conditionKeysCell}`);
    }
  }

  return actionConditionKeys;
}


const start = async () => {
  // This is query selector to find link of topics
  const query = '.highlights li a';

  // Now for each url we will fetch html content
  for (const url of urls) {
    const html = await getWebsite(url);

    // Load crawled html and return cheerio object which looks like jQuery 
    const $ = load(html);

    // Find links of topics
    const topicLinkSelector = $(query);

    // Go through each topic link and get title and link of topics
    for(let topicLinkIndex in topicLinkSelector){
      // Find topic title and link
      const elm = topicLinkSelector[topicLinkIndex];
      const text = $(elm).text();
      const href = $(elm).attr('href');

      console.log(`\n\n>Topic:  ${text} -> ${href}`);

      // Fetch list of conditionKeys
      const baseUrl = url.substr(0, url.lastIndexOf('/') + 1);
      const fullTopicUrl = baseUrl + href.replace('./', '');

      // Wait to prevent gets blocked by AWS
      await wait(2);

      const actionConditionKeys = await findConditionKeysInTopicPage(fullTopicUrl);

      //TODO: Now what you are going to do with actionConditionKeys?
    };
  }

}


start();