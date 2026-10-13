
import tovar from './var.js';

class SB3{

    hat = [
    "control_start_as_clone",
    "event_whenbackdropswitchesto",
    "event_whenbroadcastreceived",
    "event_whenflagclicked",
    "event_whengreaterthan",
    "event_whenkeypressed",
    "event_whenstageclicked",
    "event_whenthisspriteclicked",
    "event_whentouchingobject",
    "procedures_definition",
    "jsext_event_projecthead",
    "jsext_js_fun",
    "jsext_js_class",
    "jsext_event_targethead"
    ]

    control = [
    "control_all_at_once",
    "control_clear_counter",
    "control_create_clone_of",
    "control_delete_this_clone",
    "control_for_each",
    "control_forever",
    "control_get_counter",
    "control_if",
    "control_if_else",
    "control_incr_counter",
    "control_jscode",
    "control_repeat",
    "control_repeat_until",
    "control_stop",
    "control_wait",
    "control_wait_until",
    "control_while",
    "procedures_call",
    "procedures_declaration",
    "procedures_prototype",
    "procedures_return"
    ]

    reporter = [
    "argument_reporter_boolean",
    "argument_reporter_string_number",
    "control_create_clone_of_menu",
    "data_itemnumoflist",
    "data_itemoflist",
    "data_lengthoflist",
    "data_listcontainsitem",
    "data_listcontents",
    "data_variable",
    "event_broadcast_menu",
    "looks_backdropnumbername",
    "looks_backdrops",
    "looks_costume",
    "looks_costumenumbername",
    "looks_size",
    "motion_direction",
    "motion_glideto_menu",
    "motion_goto_menu",
    "motion_pointtowards_menu",
    "motion_xposition",
    "motion_yposition",
    "operator_add",
    "operator_and",
    "operator_contains",
    "operator_divide",
    "operator_equals",
    "operator_gt",
    "operator_join",
    "operator_length",
    "operator_letter_of",
    "operator_lt",
    "operator_mathop",
    "operator_mod",
    "operator_multiply",
    "operator_not",
    "operator_or",
    "operator_random",
    "operator_round",
    "operator_subtract",
    "sensing_answer",
    "sensing_coloristouchingcolor",
    "sensing_current",
    "sensing_dayssince2000",
    "sensing_distanceto",
    "sensing_distancetomenu",
    "sensing_keyoptions",
    "sensing_keypressed",
    "sensing_loud",
    "sensing_loudness",
    "sensing_mousedown",
    "sensing_mousex",
    "sensing_mousey",
    "sensing_of",
    "sensing_of_object_menu",
    "sensing_setdragmode",
    "sensing_timer",
    "sensing_touchingcolor",
    "sensing_touchingobject",
    "sensing_touchingobjectmenu",
    "sensing_userid",
    "sensing_username",
    "sound_volume"
    ]

    product = [
    "argument_editor_boolean",
    "argument_editor_string_number",
    "data_addtolist",
    "data_changevariableby",
    "data_deletealloflist",
    "data_deleteoflist",
    "data_hidelist",
    "data_hidevariable",
    "data_insertatlist",
    "data_listindexall",
    "data_listindexrandom",
    "data_replaceitemoflist",
    "data_setvariableto",
    "data_showlist",
    "data_showvariable",
    "event_broadcast",
    "event_broadcastandwait",
    "event_touchingobjectmenu",
    "extension_microbit_display",
    "extension_music_drum",
    "extension_music_play_note",
    "extension_music_reporter",
    "extension_pen_down",
    "extension_wedo_boolean",
    "extension_wedo_hat",
    "extension_wedo_motor",
    "extension_wedo_tilt_menu",
    "extension_wedo_tilt_reporter",
    "looks_changeeffectby",
    "looks_changesizeby",
    "looks_changestretchby",
    "looks_cleargraphiceffects",
    "looks_goforwardbackwardlayers",
    "looks_gotofrontback",
    "looks_hide",
    "looks_hideallsprites",
    "looks_nextbackdrop",
    "looks_nextcostume",
    "looks_say",
    "looks_sayforsecs",
    "looks_seteffectto",
    "looks_setsizeto",
    "looks_setstretchto",
    "looks_show",
    "looks_switchbackdropto",
    "looks_switchbackdroptoandwait",
    "looks_switchcostumeto",
    "looks_think",
    "looks_thinkforsecs",
    "motion_align_scene",
    "motion_changexby",
    "motion_changeyby",
    "motion_glidesecstoxy",
    "motion_glideto",
    "motion_goto",
    "motion_gotoxy",
    "motion_ifonedgebounce",
    "motion_movesteps",
    "motion_pointindirection",
    "motion_pointtowards",
    "motion_scroll_right",
    "motion_scroll_up",
    "motion_setrotationstyle",
    "motion_setx",
    "motion_sety",
    "motion_turnleft",
    "motion_turnright",
    "motion_xscroll",
    "motion_yscroll",
    "sensing_askandwait",
    "sensing_resettimer",
    "sound_changeeffectby",
    "sound_changevolumeby",
    "sound_cleareffects",
    "sound_play",
    "sound_playuntildone",
    "sound_seteffectto",
    "sound_setvolumeto",
    "sound_sounds_menu",
    "sound_stopallsounds"
    ]

    gettarget(sb3obj){
        return sb3obj.targets;
    }

    //获取sb3内变量
    getvar(sb3obj){
        let vars={};
        let avgs={};
        const targets=sb3obj.targets;
        let common={};
        let jsonarr=function(data){
            if (Array.isArray(data)){
                return data;
            }
            if (typeof(data)!="string"){
                return [];
            }
            try{
                let ret=JSON.parse(data);
                if (Array.isArray(ret)){
                    return ret;
                }
            }catch{
                return [];
            }
            return [];
        }
        let mergetype=function(oldtype,newtype){
            if (oldtype=="text" || newtype=="text"){
                return "text";
            }
            if (oldtype=="number" || newtype=="number"){
                return "number";
            }
            return "unknow";
        }
        let typebyopcode=function(opcode){
            if (opcode=="argument_reporter_boolean"){
                return "number";
            }
            if (opcode=="argument_reporter_string_number"){
                return "unknow";
            }
            return "unknow";
        }
        let typebytoken=function(token){
            if (token=="%b" || token=="%n"){
                return "number";
            }
            if (token=="%s"){
                return "unknow";
            }
            return "unknow";
        }
        let typebydefault=function(defv){
            if (typeof(defv)!="string"){
                return "unknow";
            }
            if (defv==""){
                return "unknow";
            }
            if (!isNaN(Number(defv))){
                return "number";
            }
            return "text";
        }
        let typebycallinput=function(inputdata,blocks){
            if (!Array.isArray(inputdata)){
                return "unknow";
            }
            let inputv=inputdata[1];
            if (Array.isArray(inputv)){
                let rawv=inputv[1];
                if (typeof(rawv)=="number"){
                    return "number";
                }
                if (typeof(rawv)=="string"){
                    if (rawv==""){
                        return "unknow";
                    }
                    if (!isNaN(Number(rawv))){
                        return "number";
                    }
                    return "text";
                }
            }else if (typeof(inputv)=="string"){
                if (blocks[inputv]!=undefined){
                    return typebyopcode(blocks[inputv].opcode);
                }
            }
            return "unknow";
        }
        let regavg=function(avgid,avgdata){
            let avgkey=avgid+"_avg";
            let olddata=common[avgkey];
            if (olddata==undefined){
                olddata=avgs[avgkey];
            }
            let avgname=avgdata.name;
            if (avgname==undefined){
                if (olddata!=undefined){
                    avgname=olddata.name;
                }else{
                    avgname=avgid;
                }
            }
            let avgusename;
            if (olddata!=undefined){
                avgusename=olddata.usename;
            }else{
                avgusename="a_"+tovar(avgname);
            }
            let avgfather=avgdata.father;
            if (avgfather==undefined && olddata!=undefined){
                avgfather=olddata.father;
            }
            let avgbid=avgdata.avgbid;
            if (avgbid==undefined && olddata!=undefined){
                avgbid=olddata.avgbid;
            }
            let avgtype=avgdata.type;
            if (avgtype==undefined){
                avgtype="unknow";
            }
            if (olddata!=undefined){
                avgtype=mergetype(olddata.type,avgtype);
            }
            let avgobj={'name':avgname,'usename':avgusename,'avgbid':avgbid,'tag':'avg','father':avgfather,'type':avgtype};
            common[avgkey]=avgobj;
            avgs[avgkey]=avgobj;
            if (avgfather!=undefined && avgname!=undefined){
                common[avgname+avgfather]={'id':avgid,'usename':avgusename};
                avgs[avgname+avgfather]={'id':avgid,'usename':avgusename};
            }
        }
        for(const target of targets){
            let fvars={};
            var varhead=target.name;
            
            let tvar=target.variables;
            let tlist=target.lists;
            for (const varname in tvar) {
                let vard=tvar[varname];
                let varrealname=vard[0];
                let varvalue=vard[1];
                let varename=tovar("v_"+varhead+"_"+(varrealname));
                fvars[varname]={"name":varrealname,'id':varname};
                common[varname]={"father":target.name,"name":varrealname,"usename":varename,"value":varvalue,"tag":"var",type:"unknow","id":varname};
            }
            for (const varname in tlist) {
                let vard=tlist[varname];
                let varrealname=vard[0];
                let varvalue=vard[1];
                let varename=tovar("l_"+varhead+"_"+(varrealname));
                fvars[varname+"_list"]={"name":varrealname,'id':varname};
                common[varname+"_list"]={"father":target.name,"usename":varename,"name":varrealname,"value":varvalue,"tag":"list",type:"unknow"};
            }
            vars[target.name]=fvars;
            let blocks = target.blocks;
            let procinfo={};
            let def2proto={};
            for (const blockid in blocks){
                let block=blocks[blockid];
                if (block.opcode == "procedures_definition"){
                    if (block.inputs!=undefined && Array.isArray(block.inputs.custom_block)){
                        let protobid=block.inputs.custom_block[1];
                        if (typeof(protobid)=="string"){
                            def2proto[protobid]=blockid;
                        }
                    }
                }
            }
            for (const blockid in blocks){
                let block=blocks[blockid];
                let blockop=block.opcode;
                if (blockop=="procedures_prototype"){
                    let mutation=block.mutation || {};
                    let argids=jsonarr(mutation.argumentids);
                    let argnames=jsonarr(mutation.argumentnames);
                    let argdefaults=jsonarr(mutation.argumentdefaults);
                    let proccode=mutation.proccode;
                    let protsign=String(proccode || "");
                    let argtokens=protsign.match(/%[snb]/g) || [];
                    let fathid=def2proto[blockid];
                    if (fathid==undefined){
                        fathid=block.parent;
                    }
                    procinfo[proccode]={
                        "father":fathid,
                        "argids":argids,
                        "argnames":argnames,
                        "argdefaults":argdefaults,
                        "argtokens":argtokens
                    };
                    let pavg=block.inputs || {};
                    for (const avgid in pavg){
                        let pavgi=pavg[avgid];
                        let avgbid;
                        if (Array.isArray(pavgi)){
                            if (typeof(pavgi[1])=="string"){
                                avgbid=pavgi[1];
                            }
                        }
                        let avgblock=blocks[avgbid];
                        let avgname;
                        if (avgblock!=undefined && avgblock.fields!=undefined) {
                            // 尝试多种可能的字段名
                            if (Array.isArray(avgblock.fields.VALUE)) {
                                avgname=avgblock.fields.VALUE[0];
                            } else if (Array.isArray(avgblock.fields.value)) {
                                avgname=avgblock.fields.value[0];
                            } else {
                                // 遍历所有字段，寻找数组类型的值
                                for (const fieldKey in avgblock.fields) {
                                    const fieldVal = avgblock.fields[fieldKey];
                                    if (Array.isArray(fieldVal) && fieldVal.length > 0 && typeof fieldVal[0] === 'string') {
                                        avgname = fieldVal[0];
                                        break;
                                    }
                                }
                            }
                        }
                        let argi=argids.indexOf(avgid);
                        if (avgname==undefined && argi!=-1){
                            avgname=argnames[argi];
                        }
                        let avgtype=typebyopcode(avgblock!=undefined ? avgblock.opcode : undefined);
                        if (argi!=-1){
                            avgtype=mergetype(avgtype,typebytoken(argtokens[argi]));
                            avgtype=mergetype(avgtype,typebydefault(argdefaults[argi]));
                        }
                        regavg(avgid,{"name":avgname,"usename":undefined,"avgbid":avgbid,"father":fathid,"type":avgtype});
                    }
                    for (let i=0;i<argids.length;i++){
                        let avgid=argids[i];
                        let avgname=argnames[i];
                        let avgtype=mergetype(typebytoken(argtokens[i]),typebydefault(argdefaults[i]));
                        regavg(avgid,{"name":avgname,"father":fathid,"type":avgtype});
                    }
                }
            }
            for (const blockid in blocks){
                let block=blocks[blockid];
                if (block.opcode=="procedures_call"){
                    let mutation=block.mutation || {};
                    let argids=jsonarr(mutation.argumentids);
                    let proccode=mutation.proccode;
                    let pinfo=procinfo[proccode];
                    let cinputs=block.inputs || {};
                    for (let i=0;i<argids.length;i++){
                        let avgid=argids[i];
                        let cinput=cinputs[avgid];
                        let avgbid;
                        if (Array.isArray(cinput)){
                            if (typeof(cinput[1])=="string"){
                                avgbid=cinput[1];
                            }
                        }
                        let avgblock=blocks[avgbid];
                        let avgname;
                        if (avgblock!=undefined && avgblock.fields!=undefined) {
                            // 尝试多种可能的字段名
                            if (Array.isArray(avgblock.fields.VALUE)) {
                                avgname=avgblock.fields.VALUE[0];
                            } else if (Array.isArray(avgblock.fields.value)) {
                                avgname=avgblock.fields.value[0];
                            } else {
                                // 遍历所有字段，寻找数组类型的值
                                for (const fieldKey in avgblock.fields) {
                                    const fieldVal = avgblock.fields[fieldKey];
                                    if (Array.isArray(fieldVal) && fieldVal.length > 0 && typeof fieldVal[0] === 'string') {
                                        avgname = fieldVal[0];
                                        break;
                                    }
                                }
                            }
                        }
                        if (avgname==undefined && pinfo!=undefined && Array.isArray(pinfo.argnames)){
                            avgname=pinfo.argnames[i];
                        }
                        let avgtype=typebyopcode(avgblock!=undefined ? avgblock.opcode : undefined);
                        if (pinfo!=undefined){
                            avgtype=mergetype(avgtype,typebytoken((pinfo.argtokens || [])[i]));
                            avgtype=mergetype(avgtype,typebydefault((pinfo.argdefaults || [])[i]));
                        }
                        avgtype=mergetype(avgtype,typebycallinput(cinput,blocks));
                        let avgfather;
                        if (pinfo!=undefined){
                            avgfather=pinfo.father;
                        }
                        regavg(avgid,{"name":avgname,"avgbid":avgbid,"father":avgfather,"type":avgtype});
                    }
                }
            }
        }
        vars["avgs"]=avgs;
        vars["common"]=common;
        return vars;
    }
    //获取sb3内程序头
    gethatproc(sb3obj){
        let hats={};
        let targets=sb3obj.targets;
        for(const target of targets){
            let tarproc=target.blocks;
            let tarhats=[];
            for (const block in tarproc){
                let blockdata=tarproc[block];
                let blockop=blockdata.opcode;
                if (blockdata.topLevel){
                    if (this.hat.includes(blockdata.opcode)){
                        tarhats.push(block);
                    }else{
                        console.warn("检查到非hat块:"+blockdata.opcode);
                    }
                   
                }
            }
            hats[target.name]=tarhats;
        }
        return hats;
    }
    //获取sb3内自定义积木
    getfuns(sb3obj){
        let funs={};
        let targets=sb3obj.targets;
        for(const target of targets){
            let tarproc=target.blocks;
            let tarfuns={};
            for (const block in tarproc){
                let blockdata=tarproc[block];
                let blockop=blockdata.opcode;
                if (blockdata.opcode=="procedures_prototype"){
                    tarfuns[blockdata.mutation.proccode]={
                        "function":blockdata.parent,
                        "argumentnames":JSON.parse(blockdata.mutation.argumentnames),
                        "argumentids":JSON.parse(blockdata.mutation.argumentids),
                        "warp":blockdata.mutation.warp
                    };
                }
            }
            funs[target.name]=tarfuns;
        }
        return funs;
    }
    //获取sb3内某opcode对应的blockid
    getopcode(sb3obj,opcode){
        let block={};
        let targets=sb3obj.targets;
        for(const target of targets){
            let tarproc=target.blocks;
            let tarblock=[];
            for (const block in tarproc){
                let blockdata=tarproc[block];
                let blockop=blockdata.opcode;
                if (blockop==opcode){
                    tarblock.push(block)
                }
            }
            block[target.name]=tarblock;
        }
        return block;
    }


    //获取sb3内参数积木
    getargumentname(sb3obj){
        let argument={};
        let functions=this.getfuns(sb3obj);
        let targets=sb3obj.targets;
        let blocks;
        for(const target of targets){
            blocks=target.blocks;
            let tarfuns=functions[target.name];
            for (const tarfun in tarfuns){

                let funargument={}
                for (const argumentid in tarfun.argumentids){
                    
                }
            }
        }
    }






   
}

export default SB3;
