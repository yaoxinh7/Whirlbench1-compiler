var varStage = { "var1": 18, "var2": 20, "var3": "20", "var4": 126, "var5": 124.000244140625, "var6": 18, "var7": 826519906609.9999, "var8": 2130.0001220703125, "var9": 125.1500244140625, "var10": [122.999755859375, 124.0001220703125, 123.0001220703125, 123, 122.9998779296875, 124, 124.0001220703125, 123.0001220703125, 122.9998779296875, 124.0001220703125, 124.000244140625, 125, 125, 125, 125, 126, 126.0001220703125, 126.0001220703125, 132.9998779296875, 134, 124.0001220703125, 126.0001220703125, 125, 122.9998779296875, 125, 134, 123.0001220703125, 122.9998779296875, 122.999755859375, 125, 124.0001220703125, 124, 132.9998779296875, 126, 123, 123.0001220703125, 126.0001220703125], "var11": [125, 124.0001220703125, 126.0001220703125, 125, 122.9998779296875, 125, 134, 123.0001220703125, 122.9998779296875, 122.999755859375, 125, 124.0001220703125, 124, 132.9998779296875, 126, 123, 123.0001220703125, 126.0001220703125, 124.0001220703125, 124.000244140625], "isclone": false };
var v_Stage_wodebianliang = varStage["var1"];
var v_Stage_i = varStage["var2"];
var v_Stage_i2 = varStage["var3"];
var v_Stage_n = varStage["var4"];
var v_Stage_used_time_ms = varStage["var5"];
var v_Stage_jizhunsuoyin = varStage["var6"];
var v_Stage_time_stamp = varStage["var7"];
var v_Stage_sum = varStage["var8"];
var v_Stage_avg = varStage["var9"];
var l_Stage_paixuliebiao = varStage["var10"];
var l_Stage_chengjibiao = varStage["var11"];
import RUNTIME from "./runtime.js";
const runtime = new RUNTIME();
function* Stage(vardef) {
    var events = [], ret = [];
    function collectvars() {
        var collected = {};
        collected["var1"] = v_Stage_wodebianliang;
        collected["var2"] = v_Stage_i;
        collected["var3"] = v_Stage_i2;
        collected["var4"] = v_Stage_n;
        collected["var5"] = v_Stage_used_time_ms;
        collected["var6"] = v_Stage_jizhunsuoyin;
        collected["var7"] = v_Stage_time_stamp;
        collected["var8"] = v_Stage_sum;
        collected["var9"] = v_Stage_avg;
        collected["var10"] = l_Stage_paixuliebiao;
        collected["var11"] = l_Stage_chengjibiao;
        collected["isclone"] = true;
        return collected;
    }
    function collectfun(tag) {
        var collected = [];
        return collected;
    }

    var retevent = "ok";
    var isremove = false;
    while (true) {
        yield retevent;//yield1
        events = yield { "ret": ret };
        ret = [];
        retevent = [];
        for (const event of events) {
            if (event.id == "event") {
                retevent = collectfun(event.tag);
            }
            if (event.id == "remove") {
                if (vardef.isclone) {
                    isremove = true;
                } else {
                    console.warn("不能结束母target的协程 否则其事件将无法触发!");
                }
            }
        }
        if (isremove) {
            return retevent;
        }

    }


}
function* jiaose1(vardef) {
    var events = [], ret = [];
    function collectvars() {
        var collected = {};
        collected["isclone"] = true;
        return collected;
    }
    function* f_maopaopaixu() {
        warp_f_chushihuashuzu_s(10000);
        v_Stage_i = 0;
        for (let repeat_0 = 0; repeat_0 < l_Stage_paixuliebiao.length; repeat_0++) { //第1层
            v_Stage_i2 = 0;
            v_Stage_i += 1;
            for (let repeat_1 = 0; repeat_1 < (l_Stage_paixuliebiao.length - v_Stage_i); repeat_1++) { //第2层
                v_Stage_i2 += 1;
                if (((l_Stage_paixuliebiao[v_Stage_i2 - 1]) > (l_Stage_paixuliebiao[(v_Stage_i2 + 1) - 1]))) { //第3层
                    v_Stage_n = (l_Stage_paixuliebiao[v_Stage_i2 - 1]);
                    l_Stage_paixuliebiao[v_Stage_i2 - 1] = (l_Stage_paixuliebiao[(v_Stage_i2 + 1) - 1]);
                    l_Stage_paixuliebiao[(v_Stage_i2 + 1) - 1] = v_Stage_n;
                } //第3层
            } //第2层
        } //第1层
    }
    function* f_chushihuashuzu_s(a_n) {
        l_Stage_paixuliebiao = [];
        for (let repeat_0 = 0; repeat_0 < a_n; repeat_0++) { //第1层
            l_Stage_paixuliebiao.push(runtime.randomBetween(1, a_n));
        } //第1层
    }
    function* f_huizhijieguo() {
        //penclear
        v_Stage_i = 0;
        //gotoxy
        for (let repeat_0 = 0; repeat_0 < l_Stage_paixuliebiao.length; repeat_0++) { //第1层
            v_Stage_i += 1;
            //motion_changexby
            //motion_sety
            //pen_penDown
            //motion_changeyby
            //pen_penUp
        } //第1层
    }
    function* flagclick_1() {
        l_Stage_chengjibiao = [];
        for (let repeat_0 = 0; repeat_0 < 20; repeat_0++) { //第1层
            v_Stage_time_stamp = ((((runtime.getDaysSince2000() * 24) * 60) * 60) * 1000);
            warp_f_ceshikuaisupaixu();
            v_Stage_used_time_ms = (((((runtime.getDaysSince2000() * 24) * 60) * 60) * 1000) - v_Stage_time_stamp);
            l_Stage_chengjibiao.push(v_Stage_used_time_ms);
        } //第1层
        l_Stage_paixuliebiao = [];
        v_Stage_wodebianliang = 0;
        v_Stage_sum = 0;
        for (let repeat_0 = 0; repeat_0 < 20; repeat_0++) { //第1层
            v_Stage_wodebianliang += 1;
            l_Stage_paixuliebiao.push((l_Stage_chengjibiao[v_Stage_wodebianliang - 1]));
            v_Stage_sum += (l_Stage_chengjibiao[v_Stage_wodebianliang - 1]);
        } //第1层
        v_Stage_avg = (v_Stage_sum / 20);
        warp_f_kuaisupaixu_s_s(1, 20);
        v_Stage_wodebianliang = 0;
        v_Stage_wodebianliang = 1;
        v_Stage_sum = 0;
        for (let repeat_0 = 0; repeat_0 < 18; repeat_0++) { //第1层
            v_Stage_wodebianliang += 1;
            l_Stage_paixuliebiao.push((l_Stage_chengjibiao[v_Stage_wodebianliang - 1]));
            v_Stage_sum += (l_Stage_chengjibiao[v_Stage_wodebianliang - 1]);
        } //第1层
        l_Stage_chengjibiao = [];
        l_Stage_chengjibiao.push(runtime.strconcat("成绩 最低:", runtime.strconcat((l_Stage_paixuliebiao[1 - 1]), runtime.strconcat("最高:", runtime.strconcat((l_Stage_paixuliebiao[20 - 1]), runtime.strconcat("平均:", runtime.strconcat(v_Stage_avg, runtime.strconcat("掐头去尾平均:", (v_Stage_sum / 18)))))))));
    }
    function* f_kuaisupaixu_s_s(a_zuobianjie, a_youbianjie) {
        if (((a_youbianjie - a_zuobianjie) < 2)) { //第1层
            if (((a_youbianjie > a_zuobianjie) && ((l_Stage_paixuliebiao[a_zuobianjie - 1]) > (l_Stage_paixuliebiao[a_youbianjie - 1])))) { //第2层
                v_Stage_n = (l_Stage_paixuliebiao[a_zuobianjie - 1]);
                l_Stage_paixuliebiao[a_zuobianjie - 1] = (l_Stage_paixuliebiao[a_youbianjie - 1]);
                l_Stage_paixuliebiao[a_youbianjie - 1] = v_Stage_n;
            } //第2层
            return 0;
        } //第1层
        v_Stage_jizhunsuoyin = a_zuobianjie;
        v_Stage_i = a_zuobianjie;
        v_Stage_i2 = a_youbianjie;
        while (!(v_Stage_i == v_Stage_i2)) { //第1层
            while (!((v_Stage_i == v_Stage_i2) || ((l_Stage_paixuliebiao[v_Stage_i - 1]) > (l_Stage_paixuliebiao[a_youbianjie - 1])))) { //第2层
                v_Stage_i += 1;
            } //第2层
            while (!((v_Stage_i == v_Stage_i2) || ((l_Stage_paixuliebiao[v_Stage_i2 - 1]) < (l_Stage_paixuliebiao[a_youbianjie - 1])))) { //第2层
                v_Stage_i2 += -1;
            } //第2层
            if ((v_Stage_i < v_Stage_i2)) { //第2层
                v_Stage_n = (l_Stage_paixuliebiao[v_Stage_i - 1]);
                l_Stage_paixuliebiao[v_Stage_i - 1] = (l_Stage_paixuliebiao[v_Stage_i2 - 1]);
                l_Stage_paixuliebiao[v_Stage_i2 - 1] = v_Stage_n;
            } //第2层
        } //第1层
        if (((l_Stage_paixuliebiao[v_Stage_i - 1]) > (l_Stage_paixuliebiao[a_youbianjie - 1]))) { //第1层
            v_Stage_n = (l_Stage_paixuliebiao[v_Stage_i - 1]);
            l_Stage_paixuliebiao[v_Stage_i - 1] = (l_Stage_paixuliebiao[a_youbianjie - 1]);
            l_Stage_paixuliebiao[a_youbianjie - 1] = v_Stage_n;
        } //第1层
        warp_f_kuaisupaixu_s_s(a_zuobianjie, (v_Stage_i - 1));
        warp_f_kuaisupaixu_s_s((v_Stage_i + 1), a_youbianjie);
    }
    function* f_ceshikuaisupaixu() {
        warp_f_chushihuashuzu_s(100000);
        warp_f_kuaisupaixu_s_s(1, 100000);
    }
    function warp_f_maopaopaixu() {
        warp_f_chushihuashuzu_s(10000);
        v_Stage_i = 0;
        for (let repeat_0 = 0; repeat_0 < l_Stage_paixuliebiao.length; repeat_0++) { //第1层
            v_Stage_i2 = 0;
            v_Stage_i += 1;
            for (let repeat_1 = 0; repeat_1 < (l_Stage_paixuliebiao.length - v_Stage_i); repeat_1++) { //第2层
                v_Stage_i2 += 1;
                if (((l_Stage_paixuliebiao[v_Stage_i2 - 1]) > (l_Stage_paixuliebiao[(v_Stage_i2 + 1) - 1]))) { //第3层
                    v_Stage_n = (l_Stage_paixuliebiao[v_Stage_i2 - 1]);
                    l_Stage_paixuliebiao[v_Stage_i2 - 1] = (l_Stage_paixuliebiao[(v_Stage_i2 + 1) - 1]);
                    l_Stage_paixuliebiao[(v_Stage_i2 + 1) - 1] = v_Stage_n;
                } //第3层
            } //第2层
        } //第1层
    }
    function warp_f_chushihuashuzu_s(a_n) {
        l_Stage_paixuliebiao = [];
        for (let repeat_0 = 0; repeat_0 < a_n; repeat_0++) { //第1层
            l_Stage_paixuliebiao.push(runtime.randomBetween(1, a_n));
        } //第1层
    }
    function warp_f_huizhijieguo() {
        //penclear
        v_Stage_i = 0;
        //gotoxy
        for (let repeat_0 = 0; repeat_0 < l_Stage_paixuliebiao.length; repeat_0++) { //第1层
            v_Stage_i += 1;
            //motion_changexby
            //motion_sety
            //pen_penDown
            //motion_changeyby
            //pen_penUp
        } //第1层
    }
    function warp_f_kuaisupaixu_s_s(a_zuobianjie, a_youbianjie) {
        if (((a_youbianjie - a_zuobianjie) < 2)) { //第1层
            if (((a_youbianjie > a_zuobianjie) && ((l_Stage_paixuliebiao[a_zuobianjie - 1]) > (l_Stage_paixuliebiao[a_youbianjie - 1])))) { //第2层
                v_Stage_n = (l_Stage_paixuliebiao[a_zuobianjie - 1]);
                l_Stage_paixuliebiao[a_zuobianjie - 1] = (l_Stage_paixuliebiao[a_youbianjie - 1]);
                l_Stage_paixuliebiao[a_youbianjie - 1] = v_Stage_n;
            } //第2层
            return 0;
        } //第1层
        v_Stage_jizhunsuoyin = a_zuobianjie;
        v_Stage_i = a_zuobianjie;
        v_Stage_i2 = a_youbianjie;
        while (!(v_Stage_i == v_Stage_i2)) { //第1层
            while (!((v_Stage_i == v_Stage_i2) || ((l_Stage_paixuliebiao[v_Stage_i - 1]) > (l_Stage_paixuliebiao[a_youbianjie - 1])))) { //第2层
                v_Stage_i += 1;
            } //第2层
            while (!((v_Stage_i == v_Stage_i2) || ((l_Stage_paixuliebiao[v_Stage_i2 - 1]) < (l_Stage_paixuliebiao[a_youbianjie - 1])))) { //第2层
                v_Stage_i2 += -1;
            } //第2层
            if ((v_Stage_i < v_Stage_i2)) { //第2层
                v_Stage_n = (l_Stage_paixuliebiao[v_Stage_i - 1]);
                l_Stage_paixuliebiao[v_Stage_i - 1] = (l_Stage_paixuliebiao[v_Stage_i2 - 1]);
                l_Stage_paixuliebiao[v_Stage_i2 - 1] = v_Stage_n;
            } //第2层
        } //第1层
        if (((l_Stage_paixuliebiao[v_Stage_i - 1]) > (l_Stage_paixuliebiao[a_youbianjie - 1]))) { //第1层
            v_Stage_n = (l_Stage_paixuliebiao[v_Stage_i - 1]);
            l_Stage_paixuliebiao[v_Stage_i - 1] = (l_Stage_paixuliebiao[a_youbianjie - 1]);
            l_Stage_paixuliebiao[a_youbianjie - 1] = v_Stage_n;
        } //第1层
        warp_f_kuaisupaixu_s_s(a_zuobianjie, (v_Stage_i - 1));
        warp_f_kuaisupaixu_s_s((v_Stage_i + 1), a_youbianjie);
    }
    function warp_f_ceshikuaisupaixu() {
        warp_f_chushihuashuzu_s(100000);
        warp_f_kuaisupaixu_s_s(1, 100000);
    }
    function collectfun(tag) {
        var collected = [];
        if (tag == "custom_block")
            collected.push(f_maopaopaixu);
        if (tag == "custom_block")
            collected.push(f_chushihuashuzu_s);
        if (tag == "custom_block")
            collected.push(f_huizhijieguo);
        if (tag == "flag")
            collected.push(flagclick_1);
        if (tag == "custom_block")
            collected.push(f_kuaisupaixu_s_s);
        if (tag == "custom_block")
            collected.push(f_ceshikuaisupaixu);
        if (tag == "custom_block")
            collected.push(warp_f_maopaopaixu);
        if (tag == "custom_block")
            collected.push(warp_f_chushihuashuzu_s);
        if (tag == "custom_block")
            collected.push(warp_f_huizhijieguo);
        if (tag == "custom_block")
            collected.push(warp_f_kuaisupaixu_s_s);
        if (tag == "custom_block")
            collected.push(warp_f_ceshikuaisupaixu);
        return collected;
    }

    var retevent = "ok";
    var isremove = false;
    while (true) {
        yield retevent;//yield1
        events = yield { "ret": ret };
        ret = [];
        retevent = [];
        for (const event of events) {
            if (event.id == "event") {
                retevent = collectfun(event.tag);
            }
            if (event.id == "remove") {
                if (vardef.isclone) {
                    isremove = true;
                } else {
                    console.warn("不能结束母target的协程 否则其事件将无法触发!");
                }
            }
        }
        if (isremove) {
            return retevent;
        }

    }


}
var tarpool = [];
tarpool.push({ "gen": Stage({ "var1": 18, "var2": 20, "var3": "20", "var4": 126, "var5": 124.000244140625, "var6": 18, "var7": 826519906609.9999, "var8": 2130.0001220703125, "var9": 125.1500244140625, "var10": [122.999755859375, 124.0001220703125, 123.0001220703125, 123, 122.9998779296875, 124, 124.0001220703125, 123.0001220703125, 122.9998779296875, 124.0001220703125, 124.000244140625, 125, 125, 125, 125, 126, 126.0001220703125, 126.0001220703125, 132.9998779296875, 134, 124.0001220703125, 126.0001220703125, 125, 122.9998779296875, 125, 134, 123.0001220703125, 122.9998779296875, 122.999755859375, 125, 124.0001220703125, 124, 132.9998779296875, 126, 123, 123.0001220703125, 126.0001220703125], "var11": [125, 124.0001220703125, 126.0001220703125, 125, 122.9998779296875, 125, 134, 123.0001220703125, 122.9998779296875, 122.999755859375, 125, 124.0001220703125, 124, 132.9998779296875, 126, 123, 123.0001220703125, 126.0001220703125, 124.0001220703125, 124.000244140625], "isclone": false }), "isclone": false, "name": "Stage", "realname": "Stage" });
tarpool.push({ "gen": jiaose1({ "isclone": false }), "isclone": false, "name": "jiaose1", "realname": "角色1" });




var tps = 5;


var tickms = 1000 / tps;

if (tarpool.length <= 0) {
    console.error("没有正确拿到tarpool!");
    process.exit();
}


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var tarret;
//target keys:  gen,isclone,father,name,realname,taskpool
//点绿旗
for (const target of tarpool) {
    tarret = target.gen.next();
    if (tarret.value != "ok") {
        console.error("target" + target.name + "初始化失败!");
        process.exit(1);
    }
    var wantevent = [];
    wantevent.push({ "id": "event", "tag": "flag" })
    target.gen.next();
    tarret = target.gen.next(wantevent);
    console.log("角色" + target.name + "绿旗脚本数量" + tarret.value.length);
    target['taskpool'] = [];
    for (const targen of tarret.value) {
        //脚本任务 keys: gen,father,
        target['taskpool'].push({ "gen": targen(), "father": "flag" });
    }
}
console.log(tarpool);
console.log("初始化完成辣!!!现在开始运行(");


var scriptreturn;
var miniscript = [];
var taskret;
var taskdel;
var task;
while (true) {
    var tasksum = 0;

    for (const target of tarpool) {

        miniscript = target.taskpool;
        //脚本任务 keys: gen,father,

        for (let tid = 0; tid < miniscript.length; tid++) {
            task = miniscript[tid];
            tasksum++;
            taskret = task.gen.next();
            if (taskret.done) {
                miniscript.splice(tid, 1);
                tid--;
                tasksum--;
            }
        }
        //收集运行小脚本后获得的事件请求
        scriptreturn = target.gen.next();



        //向target发送任务请求
        tarret = target.gen.next([]);

        for (const targen of tarret.value) {
            //创建任务
            target['taskpool'].push({ "gen": targen(), "father": "flag" });
            tasksum++;
        }





    }
    if (tasksum == 0) {
        console.log("看起来所有脚本都停掉了 那我也跑路喽~~~!!~~~")
        process.exit(0);
    }
    await sleep(tickms);
    console.log("tick");
}
