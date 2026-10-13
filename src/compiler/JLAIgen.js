import tovar from "./var.js";
import FILE from "./file.js";
const file=new FILE();
import runtime from './runtime.js';


class JLAIgen{
    
    funnames={};
    funsubs={};
    
    warpmod=false; 
    intarget=true;
    normalcode=false;


    genjs(JLAI,depth,targetname){
        
        var funtex=[];
        var suojin="    ";
        var warp=false;
        for (const line of JLAI){
            var suojin0=suojin.repeat(depth);
            var suojin1=suojin.repeat(depth+1);
            switch(line.line){
                case "function":
                    this.normalcode=false;
                    this.intarget=true;
                    //实现状态机后 在这里实现yield插入 现在为纯逻辑代码生成 26-3-15
                    //line.warp
                    //5-29 改底层 目前改为类角色 而不是生成器角色
                    if (line.warp){
                        funtex.push("warp_"+line.js+"{");
                        this.funnames[targetname].push({'fun':"warp_"+line.funname,'tag':'custom_block'});
                        this.warpmod=true;
                    }else{
                        funtex.push("* "+line.js+"{");
                        this.funnames[targetname].push({'fun':line.funname,'tag':'custom_block'});
                        this.warpmod=false;
                    }
                    
                    
                    break;

                case "normal"://不需要插yield
                    if (this.warpmod){
                        funtex.push(suojin1+line.js.replaceAll("\n","\n"+suojin1).replaceAll("yield","//非生成器中不能用yield 原本是:yield "));
                    }else{
                        funtex.push(suojin1+line.js.replaceAll("\n","\n"+suojin1));
                    }
                    
                    break;

                case "wait_until"://特殊 要插入yield和}
                    //后续检查:其实可以不需要 在normal里面会被注释掉()
                    if (this.warpmod){
                        line.js=line.js+`\n}`;
                    }else{
                        line.js=line.js+`\n    yield null;\n}`;
                    }
                    
                    funtex.push(suojin1+line.js.replaceAll("\n","\n"+suojin1));
                    break;
                    
                case "forknormal":
                    funtex.push(suojin0+line.js.replaceAll("\n","\n"+suojin));
                    break;

                case "forkyield":
                    if (!this.warpmod){
                        //console.log(this.warpmod);
                        funtex.push(suojin.repeat(depth)+line.js);
                    }
                    break;

                case "call":
                    //实现状态机后再实现yield:)
                    if (this.warpmod || line.warp == "true"){
                        funtex.push(suojin.repeat(depth+1)+"this.warp_"+line.js);
                    }else{
                        funtex.push(suojin.repeat(depth+1)+"yield* this."+line.js);
                    }

                    break;

                case "fork":
                    funtex.push(this.genjs(line.js,depth+1));
                    break;

                case "event":
                    this.intarget=true;
                    this.warpmod=false;
                    this.normalcode=false;
                    var realfunname=line.funname+"_"+line.count;
                    funtex.push("* "+realfunname+`(){`);
                    this.funnames[targetname].push({'fun':realfunname,'tag':line.eventid,'nocover':line.nocover});
                    
                    if (line.spec){
                        //console.log(line);
                        var lspec=line.spec;
                        //console.log(lspec);
                        switch(lspec.sepc){
                            case "key":
                                this.funsubs['keys'].add(lspec.key);
                                
                                break;
                        }
                    }
                    
                    break;

                case "code":
                    this.intarget=line.intarget;
                    this.warpmod=true;
                    this.normalcode=true;
                    //funtex.push("//↓这是根据OnlyCode事件时留下的代码 你的代码只能用JSext自己实现异步 否则仅支持同步↓")
                    break;

                case "jsfun":
                    this.warpmod=!(line.isgen);
                    this.normalcode=false;
                    this.intarget=!(line.isglobal);
                    var funhead=(this.intarget)?"":"function ";
                    if (this.warpmod){
                        funtex.push(`${funhead}${line.funname}{`);
                    }else{
                        funtex.push(`${funhead}* ${line.funname}{`);
                    }
                    break;

                case "jsclass":
                    this.warpmod=false;
                    this.normalcode=false;
                    this.intarget=line.intarget;
                    funtex.push(`class ${line.classname}{`);
                    console.log(111);
                    //process.exit()
                    break;

                    
                default:
                    console.log(line)
                    console.error("不支持ir3code:"+line.line);
                    process.exit(1);
            }
        }
        if (!(this.normalcode)){
            if (depth==0){
                funtex.push("}");
            }
        }else{
            //funtex.push("//↑这是根据OnlyCode事件时留下的代码 你的代码只能用JSext自己实现异步 否则仅支持同步↑")
        }
        
        return funtex;
    }


    //入口
    genfile(filename,data){
        if (this.Onefile){
            return data;
        }else{
            return {
                "file":filename,
                "data":data
            }
        }
    }



    gen(JLAIobj,vars,targets,broadcasts,isdebug){
        this.Onefile=isdebug;
        var projectInit=[];

        this.funsubs['keys']=new Set();
        
        var targetlist=[];
        var jsblocks=[];
        
        var tarpool=[`var tarpool={};`];
        var tarloop=file.rfile("./extjs/targetmain.js");
        tarloop=tarloop.replaceAll("function",'');

        var soundnum=0;
        for (const targetobj of targets){
            var targetname=targetobj.name;
            
            console.log("开始生成角色的变量定义>"+targetname);
            var vardefjs=[];
            if (targetname!="Stage"){
                vardefjs.push(`constructor(vardef) {`);
            }
            this.funnames[targetname]=[];
            var varcollectfun=[`collectvars(){`];
            var vargetfun=[`getvar(gvarname){`];
            varcollectfun.push(`    var collected={};`);
            var vardefobj={};
            var varcount=0;
            var targetvars=vars[targetname];
            //步骤1:生成数据设置器(vardefjs)+数据配置(vardefobj)+数据收集器(varcollectfun);
            for (const varid in targetvars){
                varcount++;
                //console.log(vardata);

                
                
                var vardata=vars['common'][varid];
                var varusename=vardata.usename;
                var varusename2=varusename;

                if (
                    vardata.father !== 'Stage' && 
                    (
                        vardata.tag === 'list' ||
                        vardata.tag === 'var'
                    )
                ){
                    varusename2='this.'+varusename;
                }

                vargetfun.push(`    if (gvarname == "${vardata.name.replaceAll("\"","\\\"")}")`);
                vargetfun.push(`        return ${varusename2};`);
                

                var varrid=`var${varcount}`;//生成运行时id
                vardefobj[varrid]=vardata.value;
                varcollectfun.push(`    collected["${varrid}"]=${varusename2};`);
                if (targetname=="Stage"){
                    vardefjs.push(`var ${varusename}=vardef["${varrid}"];`)
                }else{
                    vardefjs.push(`    this.${varusename}=vardef["${varrid}"];`)
                }


            }

            varcollectfun.push(`    collected["xpos"]=this.xpos;`);
            varcollectfun.push(`    collected["ypos"]=this.ypos;`);
            varcollectfun.push(`    collected["direction"]=this.direction;`);
            varcollectfun.push(`    collected["size"]=this.size;`);
            varcollectfun.push(`    collected["custom"]=this.custom;`);
            varcollectfun.push(`    collected["visible"]=this.visible;`);
            varcollectfun.push(`    collected["volume"]=this.volume;`);
            varcollectfun.push(`    collected["ghost"]=this.GHOST;`);


            vargetfun.push(`    if (gvarname == "x position")`);
            vargetfun.push(`        return xpos;`);
            vargetfun.push(`    if (gvarname == "y position")`);
            vargetfun.push(`        return ypos;`);
            vargetfun.push(`    if (gvarname == "size")`);
            vargetfun.push(`        return size;`);
            vargetfun.push(`    if (gvarname == "direction")`);
            vargetfun.push(`        return direction;`);
            vargetfun.push(`    if (gvarname == "costume #")`);
            vargetfun.push(`        return custom+1;`);
            vargetfun.push(`    if (gvarname == "costume name")`);
            vargetfun.push(`        return custom_names[custom];`);
            vargetfun.push(`    if (gvarname == "volume")`);
            vargetfun.push(`        return volume;`);
            vargetfun.push(`    if (gvarname == "backdrop #")`);
            vargetfun.push(`        return custom+1;`);
            vargetfun.push(`    if (gvarname == "backdrop name")`);
            vargetfun.push(`        return custom_names[custom];`);

            vardefobj["isclone"]=false;

            vargetfun.push(`}`);

            //对自己的角色属性
            var custom_names=[],custom_files=[],rotcxs=[],rotcys=[],sound_names=[],sound_files=[];
            for(const customassets of targetobj.costumes){
                custom_files.push(customassets.md5ext);
                custom_names.push(customassets.name);
                if (customassets.dataFormat == "svg"){
                    rotcxs.push(customassets.rotationCenterX);
                    rotcys.push(customassets.rotationCenterY);
                }else{
                    rotcxs.push(customassets.rotationCenterX/2);
                    rotcys.push(customassets.rotationCenterY/2);
                }
                
            }
            for(const customsound of targetobj.sounds){
                sound_files.push(customsound.md5ext);
                sound_names.push(customsound.name);
                soundnum++;
            }
            //角色属性
            vardefobj['xpos']=targetobj.x;
            vardefobj['ypos']=targetobj.y;
            vardefobj['direction']=targetobj.direction;
            vardefobj['size']=targetobj.size;
            vardefobj['custom']=targetobj.currentCostume;
            vardefobj['volume']=targetobj.volume;
            vardefobj['visible']=targetobj.visible;
            vardefobj['ghost']=0;


            
            if (targetname=="Stage"){
                
                vardefjs.push(`var xpos=9999;`);
                vardefjs.push(`var ypos=vardef.ypos;`);
                vardefjs.push(`var size=vardef.size;`);
                vardefjs.push(`var direction=vardef.direction;`);
                vardefjs.push(`var custom=vardef.custom;`);
                vardefjs.push(`var volume=vardef.volume;`);
                vardefjs.push(`var GHOST=vardef.ghost;`);
                vardefjs.push(`var visible=vardef.visible;`);
                vardefjs.push(`var pendown=false;`);
                vardefjs.push(`var temp;`);
                vardefjs.push(`var temp1;`);
                vardefjs.push(`var temp2;`);
                vardefjs.push(`var custom_names=${JSON.stringify(custom_names)};`);
                vardefjs.push(`var custom_files=${JSON.stringify(custom_files)};`);
                vardefjs.push(`var sound_names=${JSON.stringify(sound_names)};`);
                vardefjs.push(`var sound_files=${JSON.stringify(sound_files)};`);
                vardefjs.push(`var rotcxs=${JSON.stringify(rotcxs)};`);
                vardefjs.push(`var rotcys=${JSON.stringify(rotcys)};`);
            }else{

                vardefjs.push(`    this.isSprite=true;`);
                
                vardefjs.push(`    this.xpos=vardef.xpos;`);
                vardefjs.push(`    this.ypos=vardef.ypos;`);
                vardefjs.push(`    this.size=vardef.size;`);
                vardefjs.push(`    this.direction=vardef.direction;`);
                vardefjs.push(`    this.custom=vardef.custom;`);
                vardefjs.push(`    this.volume=vardef.volume;`);
                vardefjs.push(`    this.GHOST=vardef.ghost;`);
                vardefjs.push(`    this.visible=vardef.visible;`);
                vardefjs.push(`    this.pendown=false;`);
                vardefjs.push(`    this.temp;`);
                vardefjs.push(`    this.temp1;`);
                vardefjs.push(`    this.temp2;`);
                vardefjs.push(`    this.custom_names=${JSON.stringify(custom_names)};`);
                vardefjs.push(`    this.custom_files=${JSON.stringify(custom_files)};`);
                vardefjs.push(`    this.sound_names=${JSON.stringify(sound_names)};`);
                vardefjs.push(`    this.sound_files=${JSON.stringify(sound_files)};`);
                vardefjs.push(`    this.rotcxs=${JSON.stringify(rotcxs)};`);
                vardefjs.push(`    this.rotcys=${JSON.stringify(rotcys)};`);
                vardefjs.push(`    this.name=vardef.name || "Stage";`);
                vardefjs.push(`    this.realname=vardef.realname || "Stage";`);
            }

            



            varcollectfun.push(`    collected["isclone"]=true;`);
            varcollectfun.push(`return collected; }`);
            if (targetname=="Stage"){
                vardefjs.splice(0,0,`var vardef=${JSON.stringify(vardefobj)};`)
            }



            if (targetname!="Stage"){
                vardefjs.push("}")
            }
            

            //jsblocks[targetname]
            //console.log(varcollectfun);
            //console.log(vardefobj);
            //console.log(vardefjs);











            console.log("开始生成角色的函数定义>>"+targetname);
            var fundefjs=[];
            

            //这里是target的function头
            var tarname=tovar(targetname);
            //后续给调度器的角色列表 以获取生成器对象
            
            fundefjs.push(`class ${tarname} {`)
            fundefjs.push("events=[]");
            fundefjs.push("ret=[]");
            fundefjs.push(`thistarget=${tarname};`)

            //这里是把变量设置器(新版本为构造函数)推入
            if (targetname!="Stage"){
                fundefjs.push(varcollectfun);
                fundefjs.push(vardefjs);
            }else{
                fundefjs.push(varcollectfun);
                jsblocks.push(this.genfile("./vardef.js",vardefjs.flat(1).join("\n")));

                
            }
            fundefjs.push(vargetfun);














            var tarJLAI=JLAIobj[targetname];
            //步骤2:生成close-js+获取eventid+funname
            for (const hatname in tarJLAI){

                var retjs=this.genjs(tarJLAI[hatname],0,targetname);
                if (this.intarget){
                    
                    fundefjs.push(retjs);
                }else{
                    projectInit.push(retjs);
                    
                }
                
                
                
                //console.log(retjs);
            }


            tarpool.push(`tarpool["${targetname}"]=new ${tarname}(${
                JSON.stringify({
                    ...vardefobj,
                    name:tarname,
                    realname:targetname
                },null,2)
            })`)
            //tarpool.push(`tarpool.push({\n  "gen":${tarname}(${JSON.stringify(vardefobj)}),"isclone":false,"name":"${tarname}",\n  "realname":"${targetname}"\n});`);



            //收集functions
            //console.log(this.funnames[targetname]);
            var tarfunnames=this.funnames[targetname];
            var funcollectdef=[`collectgen(tag,father){`];
            funcollectdef.push(`    var collected=[];`)
            for (const fn of this.funnames[targetname]){
                funcollectdef.push(`    if (tag=="${fn.tag}")`)
                funcollectdef.push(`        collected.push({"gen":this.${fn.fun}.bind(this),"fid":"${fn.fun}","nocover":${fn.nocover},"father":father,"tag":tag});`)
                console.log(fn);
            }
            funcollectdef.push(`    return collected;`);
            funcollectdef.push(`}`);

            //console.log(funcollectdef);
            fundefjs.push(funcollectdef);



            //每个target的主循环
            //协议:
            //返回:ret=[]
            //传入:events=[]
            //执行顺序(每次tick两次yield)
            //开始时 执行到yield1 返回主进程
            //主进程遍历target对应触发的事件 target收集ret ret处于target作用域下
            //遍历完成后 主进程解析ret next时传入欲触发事件(比如按下按键,收到广播) target只负责返回function* 
            //如果为删除target 母target无法删除(varobj标记) 克隆体可被删除 即为直接最后return一次触发的事件(因为可能是广播) 然后让克隆体target生成器函数对象被移除
            //收集完成function*后 target进程把收集到的内容返回给主线程 卡在yield1 等待下一次tick
            fundefjs.push(tarloop);




            //target的封口

            fundefjs.push(`}`);

            fundefjs=fundefjs.flat(Infinity);
            jsblocks.push(this.genfile(`./targets/${targetname}.js`,fundefjs.flat(Infinity).join("\n")));
            targetlist.push(targetname);
            //console.log(JSON.stringify(fundefjs));
        }



        




        //上面完成了基本所有对target的添加 接下来就是注入调度器模板
        var runner=file.rfile("./extjs/runm.js");
        var defn=file.rfile(`./extjs/${runtime.mode === 'backend'?'backend/':''}initstage.js`);
        
        //console.log(JSON.stringify(jsblocks));
        if (isdebug){
            jsblocks.push(tarpool);

            if (runtime.mode === 'normal'){
                jsblocks.push(`const audioManager = new AudioManager({ maxConcurrent: ${soundnum} });`);
            }
                

            


            var msg_id = broadcasts.reduce((acc, curr) => Object.assign(acc, curr), {});
            console.log(msg_id);
            jsblocks.push("var broadcasts="+JSON.stringify(msg_id,null,2)+";");

            this.funsubs['keys']=[...this.funsubs['keys']];
            jsblocks.push(`var funsubs=${JSON.stringify(this.funsubs,null,2)}`);




            jsblocks.push(projectInit);
            console.log("111",projectInit);

            jsblocks.push(runner);
            jsblocks.splice(0,0,defn);


            jsblocks=jsblocks.flat(Infinity);

            //console.log(JSON.stringify(jsblocks));
            var jsopt=jsblocks.join("\n");
        }else{
            var defjs=[];

            defjs.push("//角色对象推入对象池");
            defjs.push(tarpool);

            defjs.push("//音乐管理器");
            defjs.push(`const audioManager = new AudioManager({ maxConcurrent: ${soundnum} });`);

            defjs.push("//广播收集器");
            var msg_id = broadcasts.reduce((acc, curr) => Object.assign(acc, curr), {});
            defjs.push("var broadcasts="+JSON.stringify(msg_id,null,2)+";");

            defjs.push("//订阅keys");
            this.funsubs['keys']=[...this.funsubs['keys']];

            defjs.push("//在global定义的一些帽子之类的");
            defjs.push(projectInit);

            defjs.push(`var funsubs=${JSON.stringify(this.funsubs,null,2)}`);

            jsblocks.push(this.genfile("./def.js",defjs.flat(Infinity).join("\n")));

            const defb=this.genfile("./template/init.js",defn);
            defb.spec='init';

            jsblocks.push(defb);

            jsblocks.push(this.genfile("./template/ticker.js",runner));
            
            jsblocks.push(this.genfile("./targets/list.json",JSON.stringify(targetlist,null,2)));

            var jsopt=jsblocks;
            
        }



        //console.log(vars);
        return jsopt;
    
    }
}
export default JLAIgen