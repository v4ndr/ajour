/* eslint-disable func-names */
const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
require('dotenv').config();

const chapsUrl = process.env.OP_CHAPS_URI;
const releaseDateUrl = process.env.OP_RELEASE_DATE_URI;

const months = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

class op {
  static async chaps() {
    return axios(chapsUrl)
      .then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const chapters = [];
        const chapt = $('.chapters', html);
        $('li', chapt).each(function () {
          const title = $(this).find('em').text();
          const chapter = $(this).find('a').text().split(' ')[2];
          let date = $(this).find('.date-chapter-title-rtl').text().split('\n')[1].trim();
          date = Date.parse(date);
          date = new Date(date).toISOString();
          [date] = date.split('T');
          chapters.push({
            chapter,
            title,
            date,
          });
        });
        return chapters;
      }).catch((err) => {
        throw new Error(err);
      });
  }

  static async releaseDate() {
    const browser = await puppeteer.launch({
      headless: true,
      ignoreHTTPSErrors: true,
    });
    const page = await browser.newPage();
    await page.goto(releaseDateUrl);
    await page.waitForSelector('.TitleDetail-module_updateInfo_2MITq', { timeout: 5_000 });
    const $ = cheerio.load(await page.content());
    let releaseDate = $('[class^="TitleDetail-module_updateInfo"]').text();

    releaseDate = releaseDate.split(',')[1].trim();
    const today = new Date();
    const year = today.getUTCFullYear();
    releaseDate = `${releaseDate} ${year}`;
    let releaseMonth = releaseDate.split(' ')[0];
    releaseMonth = months[releaseMonth];
    const releaseDay = releaseDate.split(' ')[1];
    releaseDate = new Date(Date.UTC(year, releaseMonth - 1, releaseDay));
    releaseDate.setDate(releaseDate.getDate() - ((releaseDate.getDay() + 2) % 7));
    if (releaseDate.getMonth() < today.getUTCMonth()) {
      releaseDate.setFullYear(releaseDate.getFullYear() + 1);
    }

    await page.close();
    await browser.close();

    return releaseDate;
  }
}

module.exports = op;
