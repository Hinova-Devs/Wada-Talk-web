const sharp=require('../node_modules/sharp');const fs=require('fs');
const svg=fs.readFileSync('brand/wada-icon.svg');
(async()=>{
 for(const s of [1024,512,180,48,32,16]) await sharp(svg,{density:384}).resize(s,s).png().toFile(`brand/wada-icon-${s}.png`);
 // rounded version for favicon / web
 const r=Math.round(1024*0.225);
 const rounded=Buffer.from(fs.readFileSync('brand/wada-icon.svg','utf8').replace('<rect width="1024" height="1024" fill="url(#bg)"/>',`<rect width="1024" height="1024" rx="${r}" fill="url(#bg)"/>`).replace('<rect width="1024" height="1024" fill="url(#glow)"/>',`<rect width="1024" height="1024" rx="${r}" fill="url(#glow)"/>`));
 fs.writeFileSync('brand/wada-icon-rounded.svg',rounded);
 for(const s of [512,48,32,16]) await sharp(rounded,{density:384}).resize(s,s).png().toFile(`brand/wada-icon-rounded-${s}.png`);
 console.log('ok');
})();
