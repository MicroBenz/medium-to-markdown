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
const sites = [
  // {
  //   path: 'https://microbenz.in.th/managing-oneself-%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%A2%E0%B8%B2%E0%B8%A1%E0%B8%88%E0%B8%B0%E0%B8%9A%E0%B8%AD%E0%B8%81%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%81%E0%B8%B1%E0%B8%9A%E0%B9%80%E0%B8%A3%E0%B8%B2-f650e0bb1477',
  //   filename: 'managing-oneself.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B8%A1%E0%B8%B2%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87-%E0%B8%AB%E0%B8%A5%E0%B8%B1%E0%B8%87%E0%B8%88%E0%B8%B2%E0%B8%81%E0%B8%81%E0%B8%A5%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%B2%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD-14a125fbe9e0',
  //   filename: 'ได้อะไรมาบ้าง หลังจากกลับมาอ่านหนังสือ.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/mvp-%E0%B8%84%E0%B8%B3%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B8%A7%E0%B9%88%E0%B8%B2%E0%B8%97%E0%B8%B3%E0%B8%87%E0%B8%B2%E0%B8%99%E0%B9%84%E0%B8%AB%E0%B8%99%E0%B9%86-%E0%B8%84%E0%B8%A7%E0%B8%A3%E0%B8%88%E0%B8%B3%E0%B9%83%E0%B8%AB%E0%B9%89%E0%B8%82%E0%B8%B6%E0%B9%89%E0%B8%99%E0%B9%83%E0%B8%88-149415c76195',
  //   filename: 'MVP.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%99-%E0%B8%9E%E0%B8%B5%E0%B9%88%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%87-%E0%B8%84%E0%B8%A3%E0%B8%AD%E0%B8%9A%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%A7-%E0%B9%84%E0%B8%A1%E0%B9%88%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%99%E0%B8%AD%E0%B8%99-ywc-15-66a377d5e043',
  //   filename: 'ywc15.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/6-%E0%B8%AB%E0%B8%99%E0%B8%B1%E0%B8%87%E0%B8%AA%E0%B8%B7%E0%B8%AD%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%84%E0%B8%94%E0%B9%89%E0%B8%AD%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%80%E0%B8%A1%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%9B%E0%B8%B5-2017-734e78ab3a88',
  //   filename: '2017-readlist.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/%E0%B9%80%E0%B8%9A%E0%B8%99%E0%B8%8B%E0%B9%8C%E0%B8%99%E0%B8%B0%E0%B8%88%E0%B9%8A%E0%B8%B0%E0%B9%83%E0%B8%99%E0%B8%9B%E0%B8%B52017-9c0fcdae331f',
  //   filename: '2017-review.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/391-commits-ywc-15-website-4dc7c745e9ca',
  //   filename: 'ywc15-site-behind-the-scene.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/4-%E0%B8%9B%E0%B8%B5%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%9C%E0%B9%88%E0%B8%B2%E0%B8%99%E0%B9%84%E0%B8%9B%E0%B9%84%E0%B8%A7%E0%B8%99%E0%B8%B0-%E0%B8%9A%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B6%E0%B8%81-%E0%B8%93-%E0%B8%A7%E0%B8%B1%E0%B8%99%E0%B8%97%E0%B8%B5%E0%B9%88%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%88%E0%B8%9A-f97e2706ca8a',
  //   filename: '4-years-flies-fast.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/%E0%B8%A5%E0%B8%AD%E0%B8%87%E0%B9%83%E0%B8%8A%E0%B9%89-styled-components-%E0%B8%AA%E0%B8%B4-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%84%E0%B8%B8%E0%B8%93%E0%B8%88%E0%B8%B0%E0%B8%A5%E0%B8%B7%E0%B8%A1%E0%B8%81%E0%B8%B2%E0%B8%A3%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99-css-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%80%E0%B8%94%E0%B8%B4%E0%B8%A1%E0%B9%86-%E0%B9%84%E0%B8%9B%E0%B9%80%E0%B8%A5%E0%B8%A2-e310f5c7cf33',
  //   filename: 'styled-components.md'
  // },
  // {
  //   path: 'https://microbenz.in.th/%E0%B9%80%E0%B8%9A%E0%B8%99%E0%B8%8B%E0%B9%8C%E0%B8%99%E0%B8%B0%E0%B8%88%E0%B9%8A%E0%B8%B0%E0%B9%83%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%AF-%E0%B8%88%E0%B8%B8%E0%B8%AC%E0%B8%B2%E0%B8%AF-episode-2-now-i-am-cp40-700026ff7db',
  //   filename: 'benz-in-intania-part-2.md'
  // },
  {
    path: 'https://microbenz.in.th/huawei-p10-%E0%B9%80%E0%B8%AB%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%99%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%81%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%81%E0%B8%96%E0%B8%A1%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD-%E0%B8%AB%E0%B8%A3%E0%B8%B7%E0%B8%AD%E0%B8%8B%E0%B8%B7%E0%B9%89%E0%B8%AD%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%96%E0%B8%B7%E0%B8%AD%E0%B9%81%E0%B8%96%E0%B8%A1%E0%B8%81%E0%B8%A5%E0%B9%89%E0%B8%AD%E0%B8%87-572944c1a23',
    filename: 'huawei-p10.md'
  },
  {
    path: 'https://microbenz.in.th/%E0%B9%80%E0%B8%9A%E0%B8%99%E0%B8%8B%E0%B9%8C%E0%B8%99%E0%B8%B0%E0%B8%88%E0%B9%8A%E0%B8%B0%E0%B9%83%E0%B8%99%E0%B8%A3%E0%B8%B1%E0%B9%89%E0%B8%A7%E0%B8%A7%E0%B8%B4%E0%B8%A8%E0%B8%A7%E0%B8%AF-%E0%B8%88%E0%B8%B8%E0%B8%AC%E0%B8%B2%E0%B8%AF-episode-1-%E0%B9%80%E0%B8%9B%E0%B9%87%E0%B8%99%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B8%9B%E0%B8%B5-1-%E0%B8%99%E0%B8%B5%E0%B9%88%E0%B8%A1%E0%B8%B1%E0%B8%99%E0%B8%94%E0%B8%B5%E0%B8%88%E0%B8%A3%E0%B8%B4%E0%B8%87%E0%B9%86-14c0faffe0e9',
    filename: 'benz-in-intania-part-1.md'
  },
  {
    path: 'https://microbenz.in.th/%E0%B8%AA%E0%B8%A7%E0%B8%B1%E0%B8%AA%E0%B8%94%E0%B8%B5%E0%B8%84%E0%B8%A3%E0%B8%B1%E0%B8%9A-%E0%B8%9C%E0%B8%A1%E0%B8%A1%E0%B8%B5%E0%B8%8A%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%A7%E0%B9%88%E0%B8%B2-react-3e8fd72ccdbb',
    filename: 'react-intro.md'
  },
  {
    path: 'https://microbenz.in.th/%E0%B8%99%E0%B8%B5%E0%B9%88%E0%B8%9B%E0%B8%B5-2017-%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7-%E0%B8%A1%E0%B8%B2%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%99-es6-%E0%B8%81%E0%B8%B1%E0%B8%99-9dede81e30da',
    filename: 'es6.md'
  },
  {
    path: 'https://microbenz.in.th/%E0%B8%97%E0%B8%B3%E0%B8%84%E0%B8%A7%E0%B8%B2%E0%B8%A1%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B8%88%E0%B8%B1%E0%B8%81%E0%B8%81%E0%B8%B1%E0%B8%9A-redux-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%A2%E0%B9%81%E0%B8%A5%E0%B9%89%E0%B8%A7%E0%B8%A2%E0%B9%88%E0%B8%AD%E0%B8%A2%E0%B8%AD%E0%B8%B5%E0%B8%81-b464808aca12',
    filename: 'redux.md'
  },
  {
    path: 'https://microbenz.in.th/%E0%B8%97%E0%B8%B3%E0%B8%A2%E0%B8%B1%E0%B8%87%E0%B9%84%E0%B8%87%E0%B8%96%E0%B8%B6%E0%B8%87%E0%B8%88%E0%B8%B0%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%A3%E0%B8%B9%E0%B9%89%E0%B9%84%E0%B8%94%E0%B9%89%E0%B9%80%E0%B8%A3%E0%B9%87%E0%B8%A7%E0%B9%86-%E0%B8%95%E0%B8%B2%E0%B8%A1%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%89%E0%B8%9A%E0%B8%B1%E0%B8%9A%E0%B8%A1%E0%B8%99%E0%B8%B8%E0%B8%A9%E0%B8%A2%E0%B9%8C%E0%B8%97%E0%B8%B3%E0%B9%80%E0%B8%A7%E0%B9%87%E0%B8%9A-7013ed8e811e',
    filename: 'how-to-learn-faster.md'
  },
  {
    path: 'https://microbenz.in.th/2016-recap-%E0%B8%A2%E0%B9%89%E0%B8%AD%E0%B8%99%E0%B8%AD%E0%B8%94%E0%B8%B5%E0%B8%95-%E0%B8%9B%E0%B8%B5%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B8%97%E0%B8%B3%E0%B8%AD%E0%B8%B0%E0%B9%84%E0%B8%A3%E0%B9%84%E0%B8%9B%E0%B8%9A%E0%B9%89%E0%B8%B2%E0%B8%87-d7be4bb40ea7',
    filename: '2016-review.md'
  }
]

sites
  .reduce((prev, curr) => {
    return prev.then(async () => {
      const pageHTML = await crawlPage(curr.path)
      const markdown = await convertToMarkdown(pageHTML)
      // console.log(markdown)
      await saveFile(markdown, curr.filename)
      console.log(`${curr.filename} successfully saved`)
      return Promise.resolve();
    })
  }, Promise.resolve());
