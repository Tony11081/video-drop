const { chromium } = require('playwright');
const { spawn } = require('child_process');
const cfg = JSON.parse(require('fs').readFileSync(process.argv[2],'utf8'));
const out = process.argv[3];
(async()=>{
  const b = await chromium.launch(); const p = await b.newPage({viewport:{width:1080,height:1920}});
  await p.addInitScript(c=>{window.CFG=c}, cfg);
  p.on('pageerror',e=>{console.error('PAGEERR',e.message);process.exit(1)});
  await p.goto('file://'+__dirname+'/film.html');
  await p.evaluate(()=>document.fonts.ready);
  
  const n = Math.round(cfg.dur*30);
  const ff = spawn('ffmpeg',['-y','-f','image2pipe','-framerate','30','-i','-','-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p',out],{stdio:['pipe','ignore','inherit']});
  for(let i=0;i<n;i++){ await p.evaluate(()=>window.renderFrame()); const buf = await p.locator('#c').screenshot({type:'jpeg',quality:90}); ff.stdin.write(buf); }
  ff.stdin.end(); await new Promise(r=>ff.on('close',r)); require('fs').writeFileSync('events.json', JSON.stringify(await p.evaluate(()=>window.EVENTS))); await b.close(); console.log('done',n);
})();
