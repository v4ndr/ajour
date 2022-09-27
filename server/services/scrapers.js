const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const urlToScrap = process.env.OP_URI;

class Scrapers {
  static async op(numberToScrap) {
    return axios(urlToScrap)
      .then(async (response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        const chapters = [];
        const chapt = $('.chapters', html);

        $('li', chapt).slice(0, numberToScrap).each(function () {
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
}

module.exports = Scrapers;
