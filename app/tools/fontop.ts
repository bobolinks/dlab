/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/no-extraneous-dependencies */
import fs from 'fs';
import path from 'path';
// @ts-ignore
import Fontmin from 'fontmin';
import rename from 'gulp-rename';

const Ft: any = Fontmin;
const codeSet = new Set<number>();

for (let i = 0; i < 256; i++) {
  codeSet.add(i);
}

const scaner = (dir: string) => {
  const files = fs.readdirSync(dir);
  files.forEach((name) => {
    const fp = path.join(dir, name);
    const st = fs.statSync(fp);
    if (st.isDirectory()) {
      scaner(fp);
    } else if (/.(ts|wxml)$/i.test(name)) {
      const text = fs.readFileSync(fp, 'utf-8');
      for (const char of text) {
        codeSet.add(char.charCodeAt(0));
      }
    }
  });
};

scaner(path.resolve(__dirname, '../src'));

const text = String.fromCharCode(...codeSet);

const fontmin = new Fontmin()
  .src('../resource/LongCang-Regular.ttf')
  .use(rename('myfont.ttf'))
  .use(Ft.glyph({
    text,
  }))
  .use(Ft.css({
    base64: true,
  }))
  .dest('./src/assets/fonts/');

fontmin.run((err: any) => {
  if (!err) {
    const fp = path.resolve(__dirname, '../src/assets/fonts/myfont');
    fs.renameSync(`${fp}.css`, `${fp}.wxss`);
    const src = fs.readFileSync(`${fp}.wxss`, 'utf-8');
    fs.writeFileSync(`${fp}.wxss`, src.replace(/Long\sCang/g, 'myFont'), 'utf-8');
    console.log(`文件已生成到${fp}.wxss`);
  }
});
