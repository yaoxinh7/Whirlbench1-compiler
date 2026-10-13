import SB3 from "./sb3.js";
const sb3 = new SB3();
import TYPE from "./type.js";
const type=new TYPE();
import JSGEN from "./jsgen.js";
const jsgen=new JSGEN();
import JLAIgen from "./JLAIgen.js";
const lastgen=new JLAIgen();

class irgen{

    product=1
    contorl=2
    reporter=3
    hat=4





    

    expproc(exp_block,blocks,depth){
        let proc={};
        let blockdata="";
        var suojin="  ";
        while (true){
            blockdata=blocks[exp_block];
            //console.log("执行>"+blockdata.opcode+"\n >>> "+(blockdata.inputs.SUBSTACK !== undefined));
            //console.log(exp_block);

            if (blockdata.inputs.SUBSTACK){
                console.log(suojin.repeat(depth)+"  执行分支>"+blockdata.inputs.SUBSTACK[1]+blockdata.opcode);
                
                if (blockdata.inputs.SUBSTACK[1]){
                    proc[exp_block]=(this.expproc(blockdata.inputs.SUBSTACK[1],blocks,depth+1));
                    if (blockdata.inputs.SUBSTACK2){
                        //console.log(blockdata)
                        if (blockdata.inputs.SUBSTACK2[1]){
                            proc[exp_block+"_else"]=(this.expproc(blockdata.inputs.SUBSTACK2[1],blocks,depth+1));
                            blocks[exp_block+"_else"]={};
                            blocks[exp_block+"_else"].opcode="control_else";
                        }
                    }
                }else{
                    console.warn("空分支积木 跳过!");
                }
                
            }else{
                proc[exp_block]="product";
            }
            console.log(suojin.repeat(depth)+blockdata.next,blockdata.next == null,blockdata.opcode)
            if (blockdata.next == null){
                return proc;
            }
            
            exp_block=blockdata.next;
        }
        //console.log("break");
        return proc;
    }

    getproc(sb3obj){
        let targets=sb3.gettarget(sb3obj);
        let hats=sb3.gethatproc(sb3obj);
        let procs={};
        for (const target of targets){
            let tarhats=hats[target.name];
            console.log(target.name);
            let tarproc={};
            for (const head of tarhats){
                //console.log("111"+head);
                
                tarproc[head]=(this.expproc(head,target.blocks,0));
                
                
            }
            procs[target.name]=tarproc;
        }
        //console.log(procs);
        return procs;
        
    }







    


    dumpop(oplist,blocks,vars,alert,step_hat){
        let blockdata;
        //console.log(oplist);
        for (const blockid in oplist){
            blockdata=blocks[blockid];
            console.log(blockid);

            if (oplist[blockid]=="product"){
                //console.log(alert+"steping op:"+blockdata.opcode);
                let varx=type.typefor(blocks,vars,blockdata,step_hat);
            }else{
                //console.log(alert+"进入分支 op:"+blockdata.opcode);
                this.dumpop(oplist[blockid],blocks,vars,blockdata.opcode,step_hat);
            }
        }
    }

    


    jsdump(oplist,blocks,vars,alert,step_hat){
        let blockdata;
        let suojin="    ";
        let lines=[];
        //console.log(oplist);
        //console.log("生成js:"+step_hat);
        //console.log(oplist);
        let opt={'hat':step_hat,'depth':alert};
        
        for (const blockid in oplist){
            
            blockdata=blocks[blockid];
            if (blockdata.topLevel){
                lines.push({'op':'hat',"hat":blockdata,'depth':alert})
                continue;
            }
            
            
            //console.log(oplist[blockid]);
            if (oplist[blockid]=="product"){
                //console.log(alert+"steping op:"+blockdata.opcode);
                //lines.push(suojin.repeat(alert)+blockdata.opcode+`\n`);
                let genjs=jsgen.gen(blockdata.opcode,blockdata,vars,blocks,opt);
                //console.log(JSON.stringify(genjs));
                lines.push({"op":"line","opcode":blockdata.opcode,"id":blockid,"js":genjs});
            }else{
                //console.log(alert+"进入分支 op:"+blockdata.opcode);
                console.log("进入分支 层:"+(alert+1)+"op:"+blockdata.opcode);
                let forkhead=jsgen.genforkjs(blocks,blockdata,vars,opt);
                console.log("分支头:",forkhead);
                let forkjs=this.jsdump(oplist[blockid],blocks,vars,alert+1,step_hat);
                //lines.push(suojin.repeat(alert)+(blockdata.opcode+`\n{\n`+forkjs+`\n}\n`));
                //console.log(JSON.stringify(forkjs));
                lines.push({"op":"fork","head":forkhead.js,"data":blockdata,"child":forkjs,"yield":forkhead.yield,"patch":forkhead.patch});
            }
        }
        return lines;
    }




    genvartype(sb3obj){
        let targets=sb3.gettarget(sb3obj);//获取角色对象
        let procs=this.getproc(sb3obj);//获取脚本
        let funs=sb3.getfuns(sb3obj);//获取函数(hat对脚本)
        let vars=sb3.getvar(sb3obj);//获取变量
        let hats=sb3.gethatproc(sb3obj);//获取hats
        //console.log(vars);
        let varsc=true,varsn;
        while(varsc){
            varsn=JSON.stringify(vars);
            for (const target of targets){
                let tarhats=hats[target.name];
                let blocks=target.blocks;
                //console.log(target.name);
                let tarproc=[];
                for (const head of tarhats){
                    //console.log(target.name+":--------");
                    //console.log(procs[target.name][head]);
                    //console.log(Object.values(vars['common']));
                    
                    this.dumpop(procs[target.name][head],blocks,vars,'main>',head);//逐个遍历
                    
                }
                procs[target.name]=tarproc;
            }
            //console.log(varsn);
            //console.log(vars);
            if (varsn == JSON.stringify(vars)){
                varsc=false;
            }
            //console.log(vars.common);
            console.log("排查类型中...");
        }
        console.log("完成辣");
        //console.log(vars['common']);
        console.log("接下来生成irjs");
        return vars;
    }

    gen(sb3obj,isdebug,{
        setProgress
    }){
        let targets=sb3.gettarget(sb3obj);//获取角色对象
        let procs=this.getproc(sb3obj);//获取脚本
        let funs=sb3.getfuns(sb3obj);//获取函数(hat对脚本)
        let hats=sb3.gethatproc(sb3obj);//获取hats
        
        let vars=this.genvartype(sb3obj);
        //console.log(vars);
        
        console.log(">>>>开始生成ir1代码:>>>>");
        let iroutput={};

        const targetCount=targets.length;
        let progressCount=0;
        let totalHats=0;
        for (const target of targets){
            let tarhats=hats[target.name];
            let blocks=target.blocks;
            //console.log(target.name);
            let tarproc=[];
            iroutput[target.name]={};
            for (const head of tarhats){
                //console.log(target.name+":--------");
                //console.log(procs[target.name][head]);

                console.log(">>>生成hat:"+head+">>>");
                iroutput[target.name][head]=this.jsdump(procs[target.name][head],blocks,vars,0,head);//逐个遍历

                //console.log(vars.common);
                totalHats++;
            }
            progressCount++;
            setProgress((progressCount/targetCount),`正在生成IR(${progressCount}/${targetCount})`,`共${totalHats}个脚本帽子`);
        }
        console.log(">>>>开始生成JLAI代码:>>>>");
        console.log(JSON.stringify(iroutput));
        let output={};
        var broadcasts=[];

        
        progressCount=0;
        let hatProgress=0;
        for (const target of targets){
            let tarhats=hats[target.name];
            let blocks=target.blocks;
            //console.log(target.name);
            output[target.name]={};
            for (const head of tarhats){
                //console.log(target.name+":--------");
                //console.log(procs[target.name][head]);

                console.log(">>>hat:"+head+">>>"+target.name);
                var ret=jsgen.genjs(iroutput[target.name][head],blocks,vars,0,head,target.name);//逐个遍历
                var jlaiblock=ret.lines;
                var broadcastblock=ret.broadcasts;
                broadcasts.push(...broadcastblock);
                output[target.name][head]=jlaiblock;



                //console.log(vars.common);
                hatProgress++;
            }
            progressCount++;
            setProgress((progressCount/targetCount),`正在生成JAIL(${progressCount}/${targetCount})`,`处理${hatProgress}/${totalHats}个脚本`);
        }
        console.log(JSON.stringify(output));
        console.log(">>>>>开始生成JavaScript代码:>>>>>");
        console.log("广播列表:");
        console.log(broadcasts);


        setProgress((progressCount/targetCount),`正在生成js文件...`,`共处理了${totalHats}个脚本`);






        //接下来是处理JLAI中的customblock 让它们可以同时生成warp和非warp
        
        for (const target in output){

            for(const js in output[target]){
                console.log(js);
                var funhead=structuredClone(output[target][js]);
                if (funhead.length>=1){
                    if (funhead[0].line=="function"){
                        funhead[0].warp=true;
                        output[target][js+"warp"]=(funhead);
                    }
                }
                
            }
            console.log(output[target])
            
        }








        var jsoutput=lastgen.gen(output,vars,targets,broadcasts,isdebug);
        //console.log(broadcasts);
        return jsoutput;

    }


}

export default irgen;