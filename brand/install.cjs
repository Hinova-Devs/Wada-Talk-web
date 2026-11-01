const fs=require('fs');
fs.copyFileSync('brand/wada-icon-rounded.svg','src/app/icon.svg');
fs.copyFileSync('brand/wada-icon-180.png','src/app/apple-icon.png');
// ICO with embedded PNGs (16, 32, 48)
const sizes=[16,32,48];const pngs=sizes.map(s=>fs.readFileSync(`brand/wada-icon-rounded-${s}.png`));
const head=Buffer.alloc(6);head.writeUInt16LE(1,2);head.writeUInt16LE(sizes.length,4);
let off=6+16*sizes.length;const dir=[];
sizes.forEach((s,i)=>{const e=Buffer.alloc(16);e[0]=s;e[1]=s;e.writeUInt16LE(1,4);e.writeUInt16LE(32,6);e.writeUInt32LE(pngs[i].length,8);e.writeUInt32LE(off,12);off+=pngs[i].length;dir.push(e)});
fs.writeFileSync('src/app/favicon.ico',Buffer.concat([head,...dir,...pngs]));
