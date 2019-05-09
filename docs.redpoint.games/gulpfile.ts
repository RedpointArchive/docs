import * as gulp from 'gulp';
import { spawn } from 'child_process';
import * as which from 'which';
import * as rimrafSync from 'rimraf';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import * as mkdirp from 'mkdirp';
import { find as findInFiles } from 'find-in-files';
import * as glob from 'globby';
import * as xml2js from 'xml2js';
import * as puppeteer from 'puppeteer';
import * as express from 'express';
import * as http from 'http';
import { AddressInfo } from 'net';
import * as md5 from 'md5';
import * as parallel from 'async-await-parallel';
import * as os from 'os';

async function execAsync(command: string, args: string[], cwd?: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const cp = spawn(command, args, {
      cwd: cwd,
      stdio: ['ignore', process.stdout, process.stderr]
    });
    cp.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error('Got exit code: ' + code));
      } else {
        resolve();
      }
    });
  })
}

async function rimraf(path: string) {
  return new Promise((resolve, reject) => {
    rimrafSync(path, (err) => {
      if (err) { reject(err); }
      else { resolve(); }
    })
  })
}

function readdirAsync(path: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) =>
    fs.readdir(path, function(err, items) {
      if (err) {
        reject(err);
        return;
      }

      resolve(items);
    })
  );
}

const spellcheckerPath = which.sync('node_modules/.bin/spellchecker');
const cwd = __dirname;

let hugo = 'hugo'
if (process.platform === 'win32') {
  hugo = path.join(__dirname, 'hugo-built/hugo.exe');
}

gulp.task('spellcheck', async () => {
  // Remove temporary spellchecking directory if it exists.
  if (fs.existsSync(path.join(__dirname, 'content-spellcheck-temp'))) {
    await rimraf(path.join(__dirname, 'content-spellcheck-temp'));
  }

  // Copy the content files that match to the temporary directory, patching
  // out any code blocks so they won't match the spellchecker.
  mkdirp.sync(path.join(__dirname, 'content-spellcheck-temp'));
  const files: string[] = await glob([
    './content/**/*.md',
    '!./content/**/rest/**/*.md',
  ], { gitignore: true });
  const patchRegex = /{{<\s+code-block[^\>]+>}}.+{{<\s+\/code-block\s+>}}/gs;
  for (const file of files) {
    mkdirp.sync(path.dirname(path.join('./content-spellcheck-temp/', file)));
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(patchRegex, '');
    fs.writeFileSync(path.join('./content-spellcheck-temp/', file), content);
  }
  
  // Now spellcheck the content spellchecking directory.
  try {
    await execAsync(
      spellcheckerPath, 
      [
        '--files',
        './content-spellcheck-temp/**/*.md',
        '--dictionaries',
        'dictionary.js',
        '--language',
        'en-AU',
        '--plugins',
        'spell',
        'indefinite-article',
        'repeated-words',
        'syntax-mentions',
        'syntax-urls',
        'frontmatter',
        '--quiet',
        '--frontmatter-keys',
        'title',
        'description',
        'menu',
        'name',
      ]);
  } finally {
    if (fs.existsSync(path.join(__dirname, 'content-spellcheck-temp'))) {
      await rimraf(path.join(__dirname, 'content-spellcheck-temp'));
    }
  }
});

const targetDir = process.env.OUTPUT_DIR || './dist-homepage';

gulp.task('build-website', async () => {
  await execAsync(
    hugo, 
    [
      '-d',
      targetDir,
    ]);
});

gulp.task('serve-website', async () => {
  await execAsync(
    hugo, 
    [
      'serve'
    ]);
});

gulp.task('search-output-for-bad-refs', async () => {
  const results = await findInFiles('{{ ref', targetDir, '.html$');
  let isBadRef = false;
  for (const result in results) {
    for (const line of results[result].line) {
      console.error(`${result}: bad ref on line: ${line}`);
      isBadRef = true;
    }
  }
  if (isBadRef) {
    throw new Error('At least one file has a bad or missing ref!');
  }
});

gulp.task('search-output-deploy-blockers', async () => {
  const results = await findInFiles('TODO DEPLOY BLOCKER', targetDir, '.html$');
  let isBlocked = false;
  for (const result in results) {
    console.error(`${result}: blocking deploy with TODO directive`);
    isBlocked = true;
  }
  if (isBlocked) {
    throw new Error('At least one file is blocking deployment!');
  }
});

gulp.task('generate-page-screenshots', async () => {
  console.log('starting express server...');
  const app = express();
  app.use(express.static(targetDir));
  const server = http.createServer(app).listen()
  const address = server.address() as AddressInfo;
  app.set('port', address.port);
  const baseUrl = `http://127.0.0.1:${address.port}`;

  const thumbnailPath = targetDir + '/img/thumbnails';

  try {
    mkdirp.sync(thumbnailPath);
  } catch {
    // ignore
  }

  try {
    console.log('starting puppeteer browser...');
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox'
      ]
    });
    try {
      const sitemap = fs.readFileSync(targetDir + '/sitemap.xml');
      const data = await new Promise<any>((resolve, reject) => {
        xml2js.parseString(sitemap, (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
      const urls: string[] = data.urlset.url.map((url) => url.loc[0]);
      const tasks = [];

      for (const originalUrl of urls) {
        const url = originalUrl;
        const localUrl = `${baseUrl}${url}`;
        const md5Hash = md5(url);
        if (!fs.existsSync(thumbnailPath + `/twitter_${md5Hash}.png`)) {
          tasks.push(async () => {
            const twitterPage = await browser.newPage();
            twitterPage.setViewport({
              width: 1200,
              height: 600
            });
            try {
              console.log(`screenshotting: ${localUrl} (Twitter)`);
              await twitterPage.goto(localUrl);
              await twitterPage.screenshot({
                path: thumbnailPath + `/twitter_${md5Hash}.png`
              });
            } finally {
              try {
                await twitterPage.close();
              } catch (err) {
              }
            }
          });
        }
        if (!fs.existsSync(thumbnailPath + `/fb_${md5Hash}.png`)) {
          tasks.push(async () => {
            const facebookPage = await browser.newPage();
            facebookPage.setViewport({
              width: 1200,
              height: 630
            });
            try {
              console.log(`screenshotting: ${localUrl} (Facebook)`);
              await facebookPage.goto(localUrl);
              await facebookPage.screenshot({
                path: thumbnailPath + `/fb_${md5Hash}.png`
              });
            } finally {
              try {
                await facebookPage.close();
              } catch (err) {
              }
            }
          });
        }
      }

      await parallel(tasks, Math.max(os.cpus().length, 2) - 1);
    } finally {
      await browser.close();
      console.log('shutdown puppeteer browser.');
    }
  } finally {
    await server.close();
    console.log('shutdown express app.');
  }
});

gulp.task('default', gulp.series([
  'spellcheck',
  'build-website',
  'search-output-for-bad-refs',
  'search-output-deploy-blockers',
]));

gulp.task('build-server', gulp.series([
  'spellcheck',
  'build-website',
  'search-output-for-bad-refs',
]));

gulp.task('prep', gulp.series([
  'spellcheck',
]));

gulp.task('serve', gulp.series([
  'spellcheck',
  'serve-website',
]));

gulp.task('serve-no-spellcheck', gulp.series([
  'serve-website',
]));
