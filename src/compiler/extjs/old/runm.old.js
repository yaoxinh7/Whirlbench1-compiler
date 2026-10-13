//已弃用 之前的协程角色留档(最好不要用了)
//推荐用最新的类角色版本

//基础定义
















const _debug=true;
const close_tick=5;




if (tarpool.length<=0){
    console.error("没有正确拿到tarpool!");
    process.exit();
}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var tarret;
var rendpool=[];
var gtar={};
//target keys:  gen,isclone,father,name,realname,taskpool
//点绿旗
for (const target of tarpool){
    tarret=target.gen.next();
    if (tarret.value.msg != "ok"){
        console.error("target"+target.name+"初始化失败!");
        process.exit(1);
    }
    rendpool.push(tarret.value.tardx);
    //后续跨角色访问就靠这个(开销可能较大)
    gtar[target.realname]={};
    gtar[target.realname]["tardx"]=tarret.value.tardx;
    gtar[target.realname]["getvar"]=tarret.value.getvarfun;
    gtar[target.realname]["getallvar"]=tarret.value.getallvarfun;
    gtar[target.realname]["def"]=tarret.value.targetfun;


    var wantevent=[];
    wantevent.push({"id":"event","tag":"flag"})
    target.gen.next();
    tarret=target.gen.next(wantevent);
    console.log("角色"+target.name+"绿旗脚本数量"+tarret.value.length);
    target['taskpool']={};
    for(const targen of tarret.value){
        //脚本任务 keys: gen,father,
        target['taskpool'][targen.fid]={"gen":targen.gen(),"father":"flag"};
    }
}
console.log(tarpool);
console.log("初始化完成辣!!!现在开始运行(");


var scriptreturn;
var taskpool=[];
var taskret;
var taskdel;
var task,tids,taskid;
var cclean=false;
var eventtags=[];
var broadcast_getlist=[];
var fathersum={};
var tickhat="";
var ticktarget="";
var _stopotherscript=false;
var _nop_tick=close_tick;
var tasktotal=0;
async function DoPromise(taskdx,Promisedx){
    var result=await Promisedx;
    var taskresult=taskdx.gen.next(result);
    if (taskresult.value){
        if(taskresult.value.event == "Promise"){
            DoPromise(taskdx,taskresult.value.Promise);
        }else{
            //嵌套结束
            taskdx.freeze=false;
        }
    }else{
        //为了简洁 后续在循环里清理 没啥区别
        taskdx.freeze=false;
    }
}

async function steptick(){
    var tasksum=0,target;
    eventtags.length=0;

    //开始收集事件
    //要触发的key事件
    for (const keypress of funsubs.keys){
        if (runtime.isPressed(keypress)){
            eventtags.push({"id":"event","tag":"key"+keypress,"father":"key"+keypress});
        }
    }
    //要触发的广播事件
    for (const msg of broadcast_getlist){
        fathersum[msg.father]=0;
        eventtags.push({"id":"event","tag":msg.tag,"father":msg.father});
    }
    broadcast_getlist.length=0;//数据交换给eventtag实际去要gen并加入taskpool
    
    for (let itt=tarpool.length-1;itt>=0;itt--){

        cclean=false;
        if (tarpool[itt] == undefined){
            console.log("tarpool错误");
            continue;
            
        }
        target=tarpool[itt];
        ticktarget=target.realname;
        

        
        
        
        taskpool=target.taskpool;
        //脚本任务 keys: gen,father,

        tids=Object.keys(taskpool);
        for (const tid of tids){

            tasksum++;
            task=taskpool[tid];
            if (task.freeze){
                continue;
            }
            

            //协程进行
            //动态给uuid
            if (!(task.uuid)){
                tasktotal++;
                task.uuid=tasktotal+1;
                //task.uuid=crypto.randomUUID();
                //这玩意只支持安全上下文 但是我们想兼容浏览器网址模式

            }



            taskret=task.gen.next();
            //某脚本触发了停止该角色其他脚本
            if (_stopotherscript){
                for (const dtid of tids){
                    dtask=taskpool[dtid];
                    if (dtask){
                        if (!(dtask.uuid == _stopotherscript)){
                            delete taskpool[dtid];
                            tasktotal--;
                        }
                    }else if (_debug) console.log("空任务错误"+dtask);
                }
                _stopotherscript=false;
                //这帧没必要再进循环了
                break;
            }

            //协程结束
            if (taskret.done){
                delete taskpool[tid];
                tasksum--;
                tasktotal--;
                if (task.father){
                    if (!(fathersum[task.father]==undefined)){
                        fathersum[task.father]--;
                    }
                }else if (_debug) console.log(`无father脚本:`,task);
            }
            if (!(taskret.value == null)){
                //广播并等待的收集器
                if (taskret.value.event == "fathernum"){
                    //console.log(fathersum[taskret.value.father]);
                    task.gen.next(fathersum[taskret.value.father]);
                }

                if (taskret.value.event == "Promise"){
                    task.freeze=true;
                    DoPromise(task,taskret.value.Promise);
                }
            }
            
        }
        //收集运行小脚本后获得的事件请求
        scriptreturn=target.gen.next();

        //整个target被结束(删除克隆体时)
        if (scriptreturn.done){
            var remuuid=target.uuid;
            //遍历tarpool 减去协程father
            for (const dtid of tids){
                var dtask=taskpool[dtid];
                if (dtask){
                    if (dtask.father){
                        fathersum[dtask.father]--;
                    }
                }else if (_debug) console.log(`空task:`,dtask);
                
                
            }
            tarpool.splice(itt,1);
            for (var i = rendpool.length - 1; i >= 0; i--) {
                if (rendpool[i].uuid === remuuid) {
                    rendpool.splice(i, 1);
                }
            }
            cclean=true;
            //console.log('break');
            continue;
        }else{
            for(const scriptback of scriptreturn.value){
                //遍历回传任务表
                if (scriptback.event == "clone"){
                    var vardefobj=scriptback.vardefobj;
                    var targen=scriptback.target;
                    //生成克隆体的uuid
                    var cloneuuid=crypto.randomUUID();
                    vardefobj["isclone"]=true;
                    var clonegen=targen(vardefobj);
                    
                    var cloneret=clonegen.next();
                    //接收初始化信息
                    if (cloneret.value.msg == "cloneok"){
                        
                        cloneret.value.tardx["uuid"]=cloneuuid;
                        rendpool.push(cloneret.value.tardx);
                        //直接跑到第二个yield 然后传参和接收
                        clonegen.next();
                        var clonetasks=clonegen.next([{"id":"event","tag":"clone"}]);
                        var clonetaskpool={};
                        
                        for(const taskgen of clonetasks.value){
                            //脚本任务 keys: gen,father,
                            clonetaskpool[taskgen.fid]={"gen":taskgen.gen(),"father":"clonestart"};
                        }
                        tarpool.push({
                            //创建克隆体
                            "gen":clonegen,
                            "isclone":true,
                            "uuid":cloneuuid,
                            "taskpool":clonetaskpool
                        });
                    }else{
                        console.error("克隆体启动失败");
                        console.error(clonegen);
                    }
                    //delete clonegen;
                }
                
                if (scriptback.event == "broadcast"){
                    broadcast_getlist.push({"tag":scriptback.tag,"father":scriptback.father});
                    //tasknum++;
                }
            }
        }

        //如果克隆体被清理 那就跳过执行这个任务
        //我也不知道为什么如果加了这个会导致克隆体删除时导致其它target的进程停止 所以目前暂且注释掉 后续再来分析
        //`if(cclean){
        //    continue;
        //}`


        //向target发送任务请求
        tarret=target.gen.next(eventtags);
        //遍历传回的任务列表
        for(const targen of tarret.value){
            //创建任务
            if (targen.nocover){
                //若nocover为真 则不允许覆盖 必须完成执行后再重新开启
                if (target['taskpool'][targen.fid] == undefined){
                    //console.log(target['taskpool'][targen.fid]);
                    if (_debug) console.log(`创建任务 tag:${targen.tag} father:${targen.fid}`);
                    target['taskpool'][targen.fid]=({"gen":targen.gen(),"father":targen.father});
                }else if (_debug) console.log(`未创建任务(nocover) tag:${targen.tag} father:${targen.fid}`);
            }else{
                //若nocover为假 则允许覆盖 之前的就任务会被覆盖(用户自行考虑持有外部资源情况)
                if (_debug) console.log(`创建任务(covermod) tag:${targen.tag} father:${targen.fid}`);
                if (target['taskpool'][targen.fid] == undefined) tasktotal--;
                target['taskpool'][targen.fid]=({"gen":targen.gen(),"father":targen.father});
                fathersum[targen.father]=(fathersum[targen.father]??0)+1;
                
            }
            
            
            tasksum++;
        }
        




    }
    if (tasksum == 0){
        _nop_tick--;
        if (_nop_tick <= 0){
            console.log("看起来所有脚本都停掉了 那我也跑路喽~~~!!~~~")
            process.exit(0);
        }
        
    }else{
        _nop_tick=close_tick;
    }
    console.log("tick");
    renderf(rendpool);
    if (_IsPointerLock){
        mousex=0;
        mousey=0;
    }
}








//下面是TICK同步机



function createSyncTicker(step, tps) {
    const tickMs = 1000 / tps;
    let timeoutId = null;
    let stopped = false;
    let processing = false;  // 新增：是否正在执行 tick

    async function driver() {
        if (stopped) return;

        // 如果上一个 tick 还没执行完，直接跳过本次（吞 tick）
        if (processing) {
            timeoutId = setTimeout(driver, tickMs);
            return;
        }

        processing = true;
        const startedAt = performance.now();

        try {
            await step();  // 等待 step 完成（如果 step 是同步的，await 会立即返回）
        } catch (err) {
            console.error('Tick error:', err);
        } finally {
            processing = false;
        }

        const spent = performance.now() - startedAt;
        const wait = Math.max(0, tickMs - spent);
        timeoutId = setTimeout(driver, wait);
    }

    function start() {
        stopped = false;
        timeoutId = setTimeout(driver, 0);
    }

    function stop() {
        stopped = true;
        if (timeoutId) clearTimeout(timeoutId);
    }

    return { start, stop };
}

const ticker = createSyncTicker(steptick, tps);
ticker.start();
// 需要停止时调用 ticker.stop()
