import pinyin from 'pinyin';
import tovar from './compiler/var.js';
import fs from 'fs';
import path from 'path';
import SB3 from './compiler/sb3.js';
const sb3 = new SB3();
import IRGEN from './compiler/irgen.js';
const irgen = new IRGEN();
import fsp from 'fs/promises';
import fsExtra from 'fs-extra';
import AdmZip from 'adm-zip';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import runtime from './compiler/runtime.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function rfile(relativePath) {
    return fs.readFileSync(path.join(__dirname, relativePath), 'utf8');
}
function wfile(relativePath, data) {
    const absolutePath = path.join(__dirname, relativePath);
    // 确保目标目录存在（递归创建）
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, data, 'utf8');
}

function rfilee(relativePath) {
    return fs.readFileSync(relativePath, 'utf8');
}
function wfilee(relativePath, data) {
    const absolutePath = relativePath;
    // 确保目标目录存在（递归创建）
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, data, 'utf8');
}

export default class Whirlbench{
    status(){
        return 'ok';
    }   
    gen(workpath,sb3obj,setProgress){


        if (sb3obj.meta['scratch-desktop:settings']){
            if (objmeta.isBackend){
                runtime.setMode('backend');
            }
        }



        var jsblocks=irgen.gen(sb3obj,false,{
            setProgress
        });

        let stagew=480;
        let stageh=360;
        let wtps=30;

        if (sb3obj.meta['scratch-desktop:settings']){
            const objmeta=sb3obj.meta['scratch-desktop:settings'];
            stagew=objmeta.stageWidth || 480;
            stageh=objmeta.stageHeight || 360;
            wtps=objmeta.tps || 30;
        }

        for (const jsfile of jsblocks){
            let wfile=String(jsfile.data);
            if (jsfile.spec === 'init'){
                wfile=wfile.replaceAll('860/* Width */',String(stagew));
                wfile=wfile.replaceAll('360/* Height */',String(stageh));
                wfile=wfile.replaceAll('60/* tps */',String(wtps));
            }
            //wfile=`//spec:${jsfile.spec} hasrep:${wfile.includes('60/* tps */')}\n`+wfile;
            wfilee(path.resolve(workpath,jsfile.file),wfile);
            console.log(`正在写入文件${jsfile.file}`);
        }
    }

    dist(workpath){
        var jsblocks=[];
        var jspath=[];
        jspath.push('./template/init.js');
        jspath.push('./vardef.js');
        
        var targetlist=JSON.parse(rfilee(path.resolve(workpath,"./targets/list.json")));
        
        for (const tar of targetlist){
            jspath.push(`./targets/${tar}.js`);
        }
        
        jspath.push('./def.js');

        jsblocks.push(`//角色数量:${targetlist.length}`);
        jsblocks.push(`/* 文件列表: ${JSON.stringify(jspath,null,2)} */`);

        jspath.push('./template/ticker.js');

        for (const jsp of jspath){
            jsblocks.push(`//jsblock:${jsp}`);
            jsblocks.push(rfilee(path.resolve(workpath,jsp)));
            console.log(`处理文件:${jsp}`)
        }

        

        console.log(`产物路径:./src/main.js`)
        wfilee(path.resolve(workpath,"./src/main.js"),jsblocks.flat(1).join("\n"));

    }
    
}


