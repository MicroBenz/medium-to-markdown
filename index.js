const upndown = require('upndown')
const puppeteer = require('puppeteer')
const fs = require('fs')

async function crawlPage(path) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(path)
  const content = await page.$$eval('.section--body', contents => contents.map(content => content.innerHTML).join(''))
  await page.close()
  return content
}

function convertToMarkdown(html = '') {
  const converter = new upndown()
  return new Promise((resolve, reject) => {
    converter.convert(html, (err, markdown) => {
      if (err) return reject(err)
      return resolve(markdown)
    })
  })
}

function saveFile(data, filename) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${__dirname}/${filename}`, data, { encoding: 'utf-8' }, (err) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

// Main
(async () => {
  const pageHTML = await crawlPage('https://microbenz.in.th/managing-oneself-%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B0%E0%B8%9A%E0%B8%AD%E0%B8%81%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%A3%E0%B8%B2-f650e0bb1477')
  const markdown = await convertToMarkdown(pageHTML)
  // console.log(markdown)
  await saveFile(markdown, 'test.md')
  console.log('done');
})();

// const markdown = convertToMarkdown('## Hello World')