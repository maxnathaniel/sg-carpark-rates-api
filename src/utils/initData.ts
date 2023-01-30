import fetch from 'node-fetch';
import $ from 'cheerio';
import { Pool } from 'pg';

const urls = [
  {
    region: 'orchard',
    url: 'https://onemotoring.lta.gov.sg/content/onemotoring/home/owning/ongoing-car-costs/parking/parking_rates.1.html',
  },
  {
    region: 'central, north & north east',
    url: 'https://onemotoring.lta.gov.sg/content/onemotoring/home/owning/ongoing-car-costs/parking/parking_rates.2.html',
  },
  {
    region: 'east',
    url: 'https://onemotoring.lta.gov.sg/content/onemotoring/home/owning/ongoing-car-costs/parking/parking_rates.3.html',
  },
  {
    region: 'south & cbd',
    url: 'https://onemotoring.lta.gov.sg/content/onemotoring/home/owning/ongoing-car-costs/parking/parking_rates.4.html',
  },
  {
    region: 'west',
    url: 'https://onemotoring.lta.gov.sg/content/onemotoring/home/owning/ongoing-car-costs/parking/parking_rates.5.html',
  },
  {
    region: 'hotels',
    url: 'https://onemotoring.lta.gov.sg/content/onemotoring/home/owning/ongoing-car-costs/parking/parking_rates.6.html',
  },
  {
    region: 'attractions',
    url: 'https://onemotoring.lta.gov.sg/content/onemotoring/home/owning/ongoing-car-costs/parking/parking_rates.8.html',
  },
];

export const populateTable = async (
  pool: Pool,
  rows: any[],
  region: string
) => {
  for (const row of rows) {
    const query = {
      text: 'INSERT INTO carpark.carpark_rates (name, region, weekday_before_5, weekday_after_5, saturday, sunday_ph) VALUES($1, $2, $3, $4, $5, $6)',
      values: [row[0], region, row[1], row[2], row[3], row[4]],
    };
    await pool.query(query);
  }
};

const scrapSite = async (pool: Pool) => {
  for (const url of urls) {
    const res = await fetch(url.url);
    const body = await res.text();
    const rows: string[][] = [];
    const list = $('tbody > tr', body);

    list.each(function () {
      const row: string[] = [];
      rows.push(row);
      $(this)
        .find('th, td')
        .each(function () {
          row.push($(this).text().trim());
        });
    });
    await populateTable(pool, rows, url.region);
  }
};

export const insertIntoTable = async (pool: Pool) => {
  await scrapSite(pool);
};
