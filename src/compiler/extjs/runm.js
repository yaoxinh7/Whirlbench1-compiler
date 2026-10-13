

//基础定义
















const _debug=true;
const close_tick=5;


var tarret;
let taskSelf;
const rendpool=[];
const gtar={};
const ftasks={};

//if (tarpool.length<=0){
//    console.error("没有正确拿到tarpool!");
//    process.exit();
//}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


class genTask{
    constructor(gen,{
        father,
    }){
        let gendx;
        try{
            gendx=gen();
        }
        catch(error){
            this.error=error;
            throw new Error("task Init Error:",e);
            //this.error=e;
            //return;
        }
        
        this.isFreeze=false;
        this.done=false;
        this.gen=gendx;
        
        this.father=father;
        this.nextInput=undefined;

        this.disposed=false;

        try{
            if (typeof ftasks[father] === 'undefined'){ 
                ftasks[father]={};
                ftasks[father].sum=0;
                ftasks[father].childs={};
            };
            ftasks[father].sum++;
            ftasks[father].childs[gendx.constructor.name]=this;
        }
        catch(error){
            console.error(error);
        }

        

        
    }
    setFreeze(f){
        this.isFreeze=!!(f);
    }

    async DoPromise(Prom){
        this.nextInput=await Prom;
    }

    next(){
        if (this.isFreeze) return;
        let stepResult;

        stepResult=this.gen.next(this.nextInput);
        this.nextInput=undefined;
        
        this.done=stepResult.done;
        //这里处理返回值
        const retValue=stepResult.value;
        if (retValue instanceof Promise){
            const self=this;
            this.setFreeze(true);
            this.DoPromise(retValue)
            .then(function(){
                self.setFreeze(false);
            })
            .catch(function(error){
                console.error("task Promise Error:",error);
            })
        }
    }
    dispose(){
        if (this.disposed) return;
        
        try{
            //console.log("before",JSON.parse(JSON.stringify(ftasks[this.father])));
            ftasks[this.father].sum--;
            delete ftasks[this.father].childs[this.gen.constructor.name];
            //console.log("after",ftasks[this.father]);
            //这里之后做协程持有特殊资源清理 目前阶段模块化内容持有的都可以被gc清掉 用户若自行创建 需要自行清理
            this.gen=null;
            this.disposed=true;

        }
        catch(error){
            console.error("task dispose error:",error,"generator name:",this.gen.constructor.name)
        }

    }
}

function _handleMake(tag,target,father){
    const tartasks=target.tasks;
    const matchedTaskGens=target.collectgen(tag,father || 'none');
    if(_debug){
        console.log(`${target.realname}匹配事件${tag}共${matchedTaskGens.length}个`)
    }
    for (const taskGen of matchedTaskGens){
        if (
            taskGen.nocover &&
            typeof tartasks[taskGen.fid] === 'object'
        ){
            return;
        }
        let taskObj;
        const oldTask=tartasks[taskGen.fid];
        if (typeof oldTask === 'object'){
            console.log('覆盖:',taskGen);
            oldTask.dispose();
        }
        //console.log('task:',tartasks,'typeof',typeof tartasks[taskGen.fid],'fid',taskGen.fid)
        try{
            taskObj=new genTask(taskGen.gen,{
                father:taskGen.father
            });
        }
        catch{ continue }
        if (taskObj.error){
            continue;
        }
        tartasks[taskGen.fid]=taskObj;
    }
}

function makeEvent(eventTag,target,father){
    if (target === 'all' || (typeof target === 'undefined')){
        for (const tarid in tarpool){
            target=tarpool[tarid];
            _handleMake(eventTag,target,father);
        }
    }else{
        if (typeof target === 'string'){
            target=tarpool[target];
        }
        if (typeof target !== 'object'){
            return;
        }
        _handleMake(eventTag,target,father);
    }
}





















//实例化角色
for (const tarname in tarpool){
    var target=tarpool[tarname];
    if (!(typeof(target) === "object")) continue;
    var tarrenddx=target.init();
    if (!(typeof(tarrenddx) === "object")) continue;
}

//绿旗事件:
makeEvent('flag','all','flag');

//清理资源 避免角色删除时资源残留


//console.log(tarpool);
console.log("初始化完成辣!!!现在开始运行(");






function collectEvents(){
    const collected={};
    for (const keypress of funsubs.keys){
        if (runtime.isPressed(keypress)){
            collected["key"+keypress]="key"+keypress;
        }
    }
    /* replace sign */

    return collected;
}


var target,tarobj,tasks;

const tickEvents={};

async function steptick(){

    //收集事件标签
    tasks=target.tasks;
    Object.assign(tickEvents,collectEvents());

    //通过标签触发事件
    for (const eventFather in tickEvents){
        const eventTag=tickEvents[eventFather];
        makeEvent(eventTag,'all',eventFather);
        delete tickEvents[eventFather];
    }

    //tick任务
    for (const tarname in tarpool){
        target=tarpool[tarname];
        if (target.disposed){
            delete tarpool[tarname];
            //console.log(Object.values(tarpool).length);
            continue;
        }
        if ((!target) || (!target.tasks)){
            console.warn("移除损坏角色:"+tarname);
            delete tarpool[tarname];
            continue;
        }
        //遍历target的tasks
        for (const taskfid in target.tasks){
            const task=target.tasks[taskfid];
            taskSelf=task;
            if (task.error) continue;
            task.next();
            if (task.done){
                if (_debug) console.log(`task ${taskfid} done`);

                task.dispose();
                delete target.tasks[taskfid];
            }
        }


    }

    //渲染更新
    rendpool.length=0;
    for (const tarname in tarpool){
        target=tarpool[tarname];
        if (!target.disposed){
            target.update();
            rendpool.push(target.tardx);
        }
        
    }
    //console.log(rendpool)

    renderf(rendpool);
    if (_IsPointerLock){
        mousex=0;
        mousey=0;
    }

    //if (_debug){
        //console.log('tick')
    //}


}








//下面是TICK同步机


function createSyncTicker(step, tps, debug = false) {
    const tickMs = 1000 / tps;
    const maxFrameSkip = 5;

    // ---------- 环境检测 ----------
    const hasRAF = typeof requestAnimationFrame === 'function';
    const nowFn = (typeof performance !== 'undefined' && performance.now)
        ? () => performance.now()
        : () => Date.now();

    let running = false;
    let processing = false;
    let lastTime = nowFn();
    let accumulator = 0;
    let rafId = null;          // 存储 RAF ID 或 timer ID

    // ---------- 调试 ----------
    function log(...args) {
        if (debug) console.log('[Ticker]', ...args);
    }

    // ---------- 帧调度 ----------
    function scheduleNext() {
        if (!running) return;
        if (hasRAF) {
            rafId = requestAnimationFrame(loop);
        } else {
            // Node / 无 RAF 环境：动态计算下次检查时间
            // 如果累加器已经够一个 tick，尽快检查（1ms）
            // 否则等到预计快凑够一个 tick 时再检查（最多提前半个 tickMs）
            const remaining = accumulator < tickMs ? tickMs - accumulator : 0;
            const delay = Math.max(1, Math.min(tickMs * 0.5, remaining));
            rafId = setTimeout(() => loop(nowFn()), delay);
        }
    }

    function cancelNext() {
        if (hasRAF) {
            if (rafId !== null) cancelAnimationFrame(rafId);
        } else {
            if (rafId !== null) clearTimeout(rafId);
        }
        rafId = null;
    }

    // ---------- 主循环 ----------
    function loop(now) {
        if (!running) return;

        // 统一获取时间：RAF 回调会传时间戳，setTimeout 回调我们已经传了 nowFn()
        if (now === undefined) {
            now = nowFn();
        }

        const delta = now - lastTime;
        lastTime = now;

        if (delta < 1000) {
            accumulator += delta;
        }

        log(`loop | delta: ${delta.toFixed(2)}ms | acc: ${accumulator.toFixed(2)}ms | processing: ${processing}`);

        tickIfPossible();
        scheduleNext();
    }

    function tickIfPossible() {
        if (processing || !running || accumulator < tickMs) return;

        const ticksToRun = Math.min(
            Math.floor(accumulator / tickMs),
            maxFrameSkip
        );

        if (ticksToRun <= 0) return;

        accumulator -= ticksToRun * tickMs;
        log(`run ${ticksToRun} tick(s), accumulator left: ${accumulator.toFixed(2)}ms`);

        runTicks(ticksToRun);
    }

    async function runTicks(count) {
        processing = true;
        try {
            for (let i = 0; i < count; i++) {
                if (!running) break;
                log(`executing step ${i + 1}/${count}`);
                await step();
            }
        } catch (err) {
            console.error('Tick error:', err);
        } finally {
            processing = false;
            if (running) tickIfPossible();   // 可能累加器又攒够了
        }
    }

    // ---------- 对外接口 ----------
    function start() {
        if (running) return;
        log('start');
        running = true;
        processing = false;
        lastTime = nowFn();
        accumulator = 0;
        scheduleNext();                     // 统一用调度器启动
    }

    function stop() {
        if (!running) return;
        log('stop');
        running = false;
        cancelNext();
    }

    return { start, stop };
}

const ticker = createSyncTicker(steptick, tps);

ticker.start();


// 需要停止时调用 ticker.stop()
