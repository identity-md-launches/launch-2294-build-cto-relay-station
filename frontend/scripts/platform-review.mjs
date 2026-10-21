// Supplemental rendered observations on production components; not a full accessibility audit.
import { chromium, webkit } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { startPreview } from './static-preview.mjs';
const engine=process.argv.includes('--webkit')?'webkit':'chromium';
const server=await startPreview(0),browser=await ({chromium,webkit}[engine]).launch({headless:true,executablePath:engine==='webkit'?process.env.W1_WEBKIT_EXECUTABLE:process.env.W1_CHROMIUM_EXECUTABLE});
const origin=`http://127.0.0.1:${server.address().port}`;
const out=new URL('../../docs/validation/steps-brand-v1/',import.meta.url);await mkdir(new URL('screenshots/',out),{recursive:true});
const rows=[], pageErrors=[], consoleErrors=[], failedRequests=[];
try{
 for(const width of [320,390,768,1440]){
  const page=await browser.newPage({viewport:{width,height:900},deviceScaleFactor:1});
  page.on('pageerror', e=>pageErrors.push({width,message:e.message}));
  page.on('console', m=>{if(m.type()==='error')consoleErrors.push({width,message:m.text()});});
  page.on('response', r=>{if(r.status()>=400)failedRequests.push({width,url:r.url(),status:r.status()});});
  for(const route of ['#/','#/demo','#/demo/b/fx-branch-1','#/showcase']){
   await page.goto(`${origin}/preview/${route}`);await page.waitForLoadState('networkidle');
   rows.push(await page.evaluate(({width,route})=>{const buttons=[...document.querySelectorAll('button,a.btn,input:not([type=checkbox]):not([type=radio]),select,textarea')].filter(e=>e.getClientRects().length);return {width,route,overflow:document.documentElement.scrollWidth-document.documentElement.clientWidth,title:document.title,lang:document.documentElement.lang,smallControls:buttons.map(e=>({text:e.textContent?.trim().slice(0,60)||e.getAttribute('aria-label'),height:e.getBoundingClientRect().height})).filter(e=>e.height<44),bodySize:getComputedStyle(document.body).fontSize,bodyFamily:getComputedStyle(document.body).fontFamily};},{width,route}));
  }
  await page.goto(`${origin}/preview/#/demo/b/fx-branch-1`);await page.getByRole('heading',{name:'Relay introduction',exact:true}).waitFor();
  if([320,390,1440].includes(width)) await page.screenshot({path:new URL(`screenshots/${engine}-workspace-${width}.jpg`,out).pathname,type:'jpeg',quality:45,scale:'css'});
  await page.getByRole('button',{name:'Continue',exact:true}).click();const input=page.getByLabel('New asset name',{exact:true});await input.focus();
  rows.push(await input.evaluate(e=>({kind:'Focused input',width:document.documentElement.clientWidth,outline:getComputedStyle(e).outlineColor,outlineWidth:getComputedStyle(e).outlineWidth,border:getComputedStyle(e).borderColor})));
  if(width===390)await page.screenshot({path:new URL(`screenshots/${engine}-focus-${width}.jpg`,out).pathname,type:'jpeg',quality:50,scale:'css'});
  await page.keyboard.press('Escape');await page.emulateMedia({reducedMotion:'reduce'});rows.push(await page.getByRole('button',{name:'Continue',exact:true}).evaluate(e=>({kind:'Reduced motion',transition:getComputedStyle(e).transitionDuration})));
  await page.close();
 }
 await writeFile(new URL(`rendered-review-${engine}.json`,out),JSON.stringify({rows,pageErrors,consoleErrors,failedRequests},null,2)+'\n');
 if(pageErrors.length||consoleErrors.length||failedRequests.length)throw new Error('Browser runtime diagnostics failed');
 if(rows.some(r=>r.overflow>0||r.smallControls?.length))throw new Error('Rendered layout or control size check failed');
 console.log('PASS: four widths, four routes; no page overflow; controls >=44px; focused inputs and reduced motion recorded.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
