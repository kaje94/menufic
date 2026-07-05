import puppeteer from 'puppeteer-core';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const [url, outdir = 'shots'] = process.argv.slice(2);
const widths = [390, 768, 1440];
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new' });
for (const w of widths) {
  const p = await b.newPage();
  const errs = [];
  p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  await p.setViewport({ width: w, height: 900 });
  await p.goto(url, { waitUntil: 'networkidle0' });
  // overflow check ignoring scroll-clipped descendants
  const overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.screenshot({ path: `${outdir}/${w}.png`, fullPage: true });
  console.log(`w=${w} overflowPx=${overflow} consoleErrors=${errs.length}`, errs.slice(0, 3));
  await p.close();
}
await b.close();
