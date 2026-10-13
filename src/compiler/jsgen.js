
import tovar from "./var";
import SB3 from "./sb3.js";
const sb3 = new SB3();
import TYPE from "./type.js";
const type=new TYPE();
import CONFIG from "./config.js";
const config=new CONFIG();

const plugins={
    havokplug:require("./plugins/havokphy.cjs"),
    jsext:require("./plugins/jsext.js"),
    jsonext:require("./plugins/jsonext.js"),
    bjsmaterial:require("./plugins/bjsmaterial.js"),
    bjsstage:require("./plugins/bjsstage.js"),
    pointerlock:require("./plugins/pointerlock.js"),
    file:require("./plugins/file.js"),
    debugger:require("./plugins/debugger.js"),
    curveplayer:require("./plugins/curveplayer.js"),
    uWS:require("./plugins/uWS.js"),
    type:require("./plugins/type.js"),
    zstd:require("./plugins/zstd.js"),
}











class Types{
    constructor(){
        this.number=1;
        this.string=2;
        this.any=3;
        this.empty=4;
        this.object=5;
    }
}
const Type=new Types();



class jsgen{

    STRONG_NUM=2;

    strtypeof(text) {
        const str = String(text).trim();
        if (str === '') {
            return 'empty';
        }
        if (!isNaN(str) && str !== '') {
            return 'number';
        }
        return 'text';
    }


    input_mod(input){
        console.log(input);

        let vartype=typeof(input[1]);
        if (vartype == "object"){
            //传参2情况或者数字文本情况
            if (!(input[1])){
                return 1;
            }
            if (input[1].length == 2){
                //数字/文本
                vartype=this.strtypeof(input[1][1])
                //console.log(this.strtypeof(input[1][1]));
                if (vartype == "text"||vartype == "empty"){
                    return 2;
                }else{
                    return 1;
                }
            }
            else{
                //回退传参情况
                return 4;
            }
        }else{
            //传参情况'
            return 3;
        }

    }

    input_value(input,mod){
        //console.log(input);
        switch(mod){
            case undefined:
                mod=this.input_mod(input);
                //console.log(mod);
                if (mod !== undefined){
                    
                    return this.input_value(input,mod);
                }
            case 1:
                //console.log(input[1][1]);
                if (!(input[1])){
                    return {'v':0,'t':2};
                }
                return {'v':Number(input[1][1]),'t':1};
            case 2:
                if (!(input[1])){
                    return {'v':"",'t':2};
                }
                return {'v':input[1][1],'t':2};
            case 3:
                return {'v':input[1],'t':3};
            case 4:
                if (!(input[1])){
                    return {'v':"",'t':4};
                }
                return {'v':input[1][2],'t':4};

        }
    }


    ginput(blockdata,expect,blocks,vars,plantype,opt={}){
        //console.log('expect',expect);
        //console.log(blockdata);
        if (!(blockdata.inputs[expect])){
            return {"v":0,"t":1};
        }
        return this.geninputjs(blocks,blockdata.inputs[expect],vars,plantype,opt);
    }

    gfield(blockdata,expect){
        return blockdata.fields[expect];
    }

    vardata(vars,id,style){
        const vardx=vars['common'][id+style];
        console.log(vardx);
        /*if (vardx.usename === 'l_Raytracer_vid'){
            console.log(vardx.father !== 'Stage' && 
            (
                vardx.tag === 'list' ||
                vardx.tag === 'var'
            ));
            process.exit();
        }*/
        //process.exit();
        vardx.perfix="";
        if (
            vardx.father !== 'Stage' && 
            (
                vardx.tag === 'list' ||
                vardx.tag === 'var'
            )
        ){
            vardx.perfix="this.";
            //process.exit();
        }
        
        return vardx;
    }

    genforkjs(blocks,blockdata,vars,opt={}){
        //只检查一个积木 以及其输入即可
        switch(blockdata.opcode){
            

            case 'control_else':
                return {"js":`else`};

            case 'control_if_else':
                var input=this.ginput(blockdata,"CONDITION",blocks,vars,1,opt);
                return {"js":`if (${input.v})`};

            case 'control_if':
                var input=this.ginput(blockdata,"CONDITION",blocks,vars,1,opt);
                return {"js":`if (${input.v})`};

            case 'control_repeat':
                var input=this.ginput(blockdata,"TIMES",blocks,vars,1,opt);
                var repeat_bl=`repeat_${String(opt.depth)}`;
                return {"js":`for (let ${repeat_bl}=0;${repeat_bl}<${input.v};${repeat_bl}++)`,"yield":true};

            case 'control_repeat_until':
                var input=this.ginput(blockdata,"CONDITION",blocks,vars,1,opt);
                var repeat_bl=`repeat_${String(opt.depth)}`;
                return {"js":`while (!${input.v})`,"yield":true};

            case 'control_while':
                var input=this.ginput(blockdata,"CONDITION",blocks,vars,1,opt);
                var repeat_bl=`repeat_${String(opt.depth)}`;
                return {"js":`while (${input.v})`,"yield":true};

            case 'control_forever':
                return {"js":`while (true)`,"yield":true};

            case 'jsext_jsext_constructor':
                var AVG=this.ginput(blockdata,"AVG",blocks,vars,3,opt);
                return {"js":`constructor(${this.tonotstr(AVG.v)})`}

            case 'jsext_jsext_substack':
                var SUBN=this.ginput(blockdata,"SUBN",blocks,vars,3,opt);
                return {"js":`${this.tonotstr(SUBN.v)}`}

            case 'jsext_jsext_foreach':
                //传入:
                //ARRAY:列表对象
                //ITER:迭代器名
                var ARRAY=this.ginput(blockdata,"ARRAY",blocks,vars,3,opt);
                var ITER=this.ginput(blockdata,"ITER",blocks,vars,3,opt);
                return {"js":`${this.tonotstr(ARRAY.v)}.forEach(function(${this.tonotstr(ITER.v)})`,"patch":"});"}

            default:

                var plugs=Object.values(plugins);
                for (const plug of plugs){
                    if (plug.forkop){
                        var blockdx=plug.forkop(blockdata.opcode);
                        //console.log(Object.values(plugins),111)
                        if (blockdx){
                            console.log("plugin:"+blockdx);
                            var args=blockdx.args;
                            var ARGS={};
                            for (const arg of args){
                                if (arg.isinput){
                                    var inputvaluex=this.ginput(blockdata,arg.key,blocks,vars,arg.expectType,opt);
                                    ARGS[arg.key]=inputvaluex;
                                }else{
                                    var inputvaluex=this.gfield(blockdata,arg.key)[0];
                                    ARGS[arg.key]=inputvaluex;
                                }
                            }
                            return blockdx.js(ARGS);

                        }
                    }

   
                }
                console.log('inputs');
                console.table(blockdata.inputs);

                console.log('fields');
                console.table(blockdata.fields);

                console.error("不支持的fork op:"+blockdata.opcode);
                process.exit(1);
        }
    }

    geninputjs(blocks,inputs,vars,plantype,opt={}){


        let inputvalue=this.input_value(inputs);

        if(inputvalue.v in vars['common']){
            //顶层变量
            var varb=this.vardata(vars,inputvalue.v,'');
            var useVar=varb.perfix+varb.usename;
            switch(varb.type){
                case 'number':
                    return {'v':useVar,'t':1};
                case 'text':
                    return {'v':useVar,'t':this.STRONG_NUM};
                case 'empty':
                    return {'v':useVar,'t':3};
                default:
                    return {'v':useVar,'t':1};
            }
        }
        if(inputvalue.v+"_list" in vars['common']){
            //顶层列表
            var varb=this.vardata(vars,inputvalue.v,'_list');
            var useVar=varb.perfix+varb.usename;
            switch(varb.type){
                case 'number':
                    return {'v':useVar,'t':1};
                case 'text':
                    return {'v':useVar,'t':this.STRONG_NUM};
                case 'empty':
                    return {'v':useVar,'t':3};
                default:
                    return {'v':useVar,'t':1};
            }
        }

        if (inputvalue.t==3 && inputvalue.v in blocks){
            //套娃娃
            //console.log(vars['common'][inputvalue.v]);
            //顶层积木




            let inputblock=blocks[inputvalue.v];
            let blockdata=inputblock;
            var v1,v2,index,dx,t1,t2;


            //console.log(typeof(this.input_value(inputs).v));
            switch(inputblock.opcode){


                //造型相关
                case "looks_size":
                    return {"v":`this.size`,"t":1} ;

                case "looks_costumenumbername":
                    var mod=this.gfield(blockdata,"NUMBER_NAME",blocks,vars,2)[0];
                    switch(mod){
                        case "name":
                            return {"v":`(this.custom_names[this.custom])`,"t":1};
                        case "number":
                            return {"v":`(this.custom+1)`,"t":1}
                    }




                //声音相关
                case "sound_sounds_menu":
                    var dx=this.gfield(blockdata,"SOUND_MENU")[0];
                    return({'v':`"${dx}"`,'t':2})
                
                //克隆相关
                case "control_create_clone_of_menu":
                    var dx=this.gfield(blockdata,"CLONE_OPTION")[0];
                    return({'v':`${dx}`,'t':2})


                //角色相关
                case "motion_goto_menu":
                    dx=this.gfield(blockdata,"TO")[0];
                    return({'v':`${dx}`,'t':2});

                case "motion_xposition":
                    return({'v':`this.xpos`,'t':1});

                case "motion_yposition":
                    return({'v':`this.ypos`,'t':1});

                case "motion_direction":
                    return({'v':`this.direction`,'t':1});

                case "looks_costume":
                    dx=this.gfield(blockdata,"COSTUME")[0];
                    return({'v':`"${dx}"`,'t':2});

                

                //列表相关
                case "data_itemnumoflist":
                    v1=this.ginput(blockdata,"ITEM",blocks,vars,2,opt);
                    dx=this.gfield(blockdata,"LIST")[1];
                    var listxx=this.vardata(vars,dx,'_list');
                    var listname=listxx.perfix+listxx.usename;
                    return {'v':`(${listname}.indexOf(${v1.v})+1)`};

                case "data_itemoflist":
                    v1=this.ginput(blockdata,"INDEX",blocks,vars,1,opt);
                    dx=this.gfield(blockdata,"LIST")[1];
                    var listxx=this.vardata(vars,dx,'_list');
                    var listname=listxx.perfix+listxx.usename;
                    return {'v':`(${listname}[~~(${v1.v}-1)])`};

                case "data_lengthoflist":
                    dx=this.gfield(blockdata,"LIST")[1];
                    var listxx=this.vardata(vars,dx,'_list');
                    var listname=listxx.perfix+listxx.usename;
                    return {'v':`${listname}.length`};

                case "data_listcontainsitem":
                    v1=this.ginput(blockdata,"ITEM",blocks,vars,2,opt);
                    dx=this.gfield(blockdata,"LIST")[1];
                    var listxx=this.vardata(vars,dx,'_list');
                    var listname=listxx.perfix+listxx.usename;
                    return {'v':`(${listname}.indexOf(${v1.v})>=0)`};

                
                


                //算数相关

                case "operator_contains":
                    v1=this.ginput(blockdata,"STRING1",blocks,vars,2,opt);
                    v2=this.ginput(blockdata,"STRING2",blocks,vars,2,opt);
                    return({'v':`runtime.isinclude(${v1.v},${v2.v})`,'t':1})

                case "operator_length":
                    v1=this.ginput(blockdata,"STRING",blocks,vars,2,opt);
                    return({'v':`runtime.strlength(${v1.v})`,'t':1})

                case "operator_round":
                    v1=this.ginput(blockdata,"NUM",blocks,vars,1,opt);
                    return({'v':`Math.round(${v1.v})`,'t':1})

                case "operator_add":
                    v1=this.ginput(blockdata,"NUM1",blocks,vars,1,opt);
                    v2=this.ginput(blockdata,"NUM2",blocks,vars,1,opt);
                    return({'v':`(${v1.v}+${v2.v})`,'t':1})

                case "operator_subtract":
                    v1=this.ginput(blockdata,"NUM1",blocks,vars,1,opt);
                    v2=this.ginput(blockdata,"NUM2",blocks,vars,1,opt);
                    return({'v':`(${v1.v}-${v2.v})`,'t':1})

                case "operator_multiply":
                    v1=this.ginput(blockdata,"NUM1",blocks,vars,1,opt);
                    v2=this.ginput(blockdata,"NUM2",blocks,vars,1,opt);
                    return({'v':`(${v1.v}*${v2.v})`,'t':1})

                case "operator_divide":
                    v1=this.ginput(blockdata,"NUM1",blocks,vars,1,opt);
                    v2=this.ginput(blockdata,"NUM2",blocks,vars,1,opt);
                    if (config.Infcheck){
                        return({'v':`runtime.Infcheck(${v1.v}/${v2.v})`,'t':1})
                    }
                    return({'v':`(${v1.v}/${v2.v})`,'t':1})

                case 'operator_random':
                    v1=this.ginput(blockdata,"FROM",blocks,vars,1,opt);
                    v2=this.ginput(blockdata,"TO",blocks,vars,1,opt);
                    return {'v':`runtime.randomBetween(${v1.v},${v2.v})`,'t':1}

                case "operator_join":
                    v1=this.ginput(blockdata,"STRING1",blocks,vars,2,opt);
                    v2=this.ginput(blockdata,"STRING2",blocks,vars,2,opt);
                    
                    return({'v':`runtime.strconcat(${v1.v},${v2.v})`,'t':2})

                case "operator_letter_of":
                    v1=this.ginput(blockdata,"STRING",blocks,vars,3,opt);
                    v2=this.ginput(blockdata,"LETTER",blocks,vars,1,opt);
                    
                    return({'v':`runtime.letter_of(${v1.v},${v2.v})`,'t':1})

                case "operator_mod":
                    v1=this.ginput(blockdata,"NUM1",blocks,vars,1,opt);
                    v2=this.ginput(blockdata,"NUM2",blocks,vars,1,opt);
                    // Scratch使用欧几里得取模，总是返回非负余数
                    return({'v':`(((${v1.v})%(${v2.v})+Math.abs(${v2.v}))%Math.abs(${v2.v}))`,'t':1})



                case "operator_mathop":
                    v1=this.ginput(blockdata,"NUM",blocks,vars,1,opt);
                    v2=this.gfield(blockdata,"OPERATOR")[0];
                    switch(v2){
                        case 'sin':
                            return({'v':`Math.sin((${v1.v})*Math.PI/180)`,'t':1});
                        case 'cos':
                            return({'v':`Math.cos((${v1.v})*Math.PI/180)`,'t':1});
                        case 'tan':
                            return({'v':`Math.tan((${v1.v})*Math.PI/180)`,'t':1});
                        case 'floor':
                            return({'v':`Math.floor(${v1.v})`,'t':1});
                        case 'abs':
                            return({'v':`Math.abs(${v1.v})`,'t':1});
                        case 'sqrt':
                            return({'v':`Math.sqrt(${v1.v})`,'t':1});
                        case 'asin':
                            return({'v':`Math.asin(${v1.v})`,'t':1});
                        case 'atan':
                            return({'v':`Math.atan(${v1.v})`,'t':1});
                        case 'ceiling':
                            return({'v':`Math.ceil(${v1.v})`,'t':1});
                        case 'log':
                            return({'v':`Math.log(${v1.v})`,'t':1});
                        case 'ln':
                            return({'v':`Math.log(${v1.v})`,'t':1});
                        case 'e ^':
                            return({'v':`Math.exp(${v1.v})`,'t':1});
                        default:
                            console.error("不支持mathop:"+v2);
                            process.exit(1);
                    }

                //逻辑相关

                case "operator_gt":
                    v1=this.ginput(blockdata,"OPERAND1",blocks,vars,3,opt);
                    v2=this.ginput(blockdata,"OPERAND2",blocks,vars,3,opt);
                    return({'v':`(${v1.v}>${v2.v})`,'t':1})

                case "operator_lt":
                    v1=this.ginput(blockdata,"OPERAND1",blocks,vars,3,opt);
                    v2=this.ginput(blockdata,"OPERAND2",blocks,vars,3,opt);
                    return({'v':`(${v1.v}<${v2.v})`,'t':1})

                case "operator_equals":
                    v1=this.ginput(blockdata,"OPERAND1",blocks,vars,3,opt);
                    v2=this.ginput(blockdata,"OPERAND2",blocks,vars,3,opt);
                    //console.log({'v':`(${v1.v}==${v2.v})`,'t':1});
                    return({'v':`(${v1.v}==${v2.v})`,'t':1})

                case "operator_and":
                    v1=this.ginput(blockdata,"OPERAND1",blocks,vars,3,opt);
                    v2=this.ginput(blockdata,"OPERAND2",blocks,vars,3,opt);
                    return({'v':`(${v1.v}&&${v2.v})`,'t':1})

                case "operator_or":
                    v1=this.ginput(blockdata,"OPERAND1",blocks,vars,3,opt);
                    v2=this.ginput(blockdata,"OPERAND2",blocks,vars,3,opt);
                    return({'v':`(${v1.v}||${v2.v})`,'t':1})

                case "operator_not":
                    v1=this.ginput(blockdata,"OPERAND",blocks,vars,3,opt);
                    return({'v':`(!(${v1.v}))`,'t':1})


                //侦测相关
                case "sensing_mousedown":
                    return {"v":`mousedown`,"t":2}

                case "sensing_touchingobjectmenu":
                    var dx=this.gfield(blockdata,"TOUCHINGOBJECTMENU")[0];
                    return {"v":`"${dx}"`,"t":2}

                case "sensing_touchingobject":
                    var dx=this.ginput(blockdata,"TOUCHINGOBJECTMENU",blocks,vars,2,opt);
                    switch(dx.v){
                        case `"_edge_"`:
                            return {"v":`((Math.abs(this.xpos)>240)&&(Math.abs(this.ypos)>180))`,"t":1}
                    }
                    return {"v":`(stage.checkhit(this.tardx,tarpool[${dx.v}].tardx))`,"t":1}

                case "sensing_answer":
                    return {"v":`_answer`,"t":2};

                case "sensing_distancetomenu":
                    var prot=this.gfield(blockdata,"DISTANCETOMENU")[0];
                    return({'v':`${prot}`,'t':2})

                case 'sensing_distanceto':
                    var toxy=this.ginput(blockdata,"DISTANCETOMENU",blocks,vars,2,opt);
                    if (toxy.v=="_mouse_"){
                        var dxx="mousex";
                        var dxy="mousey";
                    }else{
                        var dxx=`gtar["${toxy.v}"]["getvar"]("x position")`;
                        var dxy=`gtar["${toxy.v}"]["getvar"]("y position")`;
                    }
                    var chax=`(${dxx}-this.xpos)`;
                    var chay=`(${dxy}-this.ypos)`;

                    return {"v":`Math.sqrt((${chax}*${chax})+(${chay}*${chay}))`,"t":1};

                case "sensing_of_object_menu":
                    var prot=this.gfield(blockdata,"OBJECT")[0];
                    
                    
                    return({'v':`${prot}`,'t':2})


                case "sensing_of"://大开销
                    var prot=this.gfield(blockdata,"PROPERTY")[0];
                    var obj=this.ginput(blockdata,"OBJECT",blocks,vars,1,opt);
                    if (obj.v == "_stage_")
                        obj.v="Stage";
                    
                    return({'v':`gtar["${obj.v}"]["getvar"]("${prot}")`,'t':1})
                    


                case "motion_glideto_menu":
                    v1=this.gfield(blockdata,"TO")[0];
                    
                    return({'v':`${v1}`,'t':1})

                case "sensing_dayssince2000":
                    return({'v':`runtime.getDaysSince2000()`,'t':1})

                case "sensing_timer":
                    return({'v':`(Date.now()/1000-timerstart)`,'t':1})

                case "sensing_mousex":
                    return({'v':`mousex`,'t':1})

                case "sensing_mousey":
                    return({'v':`mousey`,'t':1})

                case "sensing_keypressed":
                    v1=this.ginput(blockdata,"KEY_OPTION",blocks,vars,2,opt);
                    return({'v':`runtime.isPressed("${v1.v}")`,'t':1})

                case "sensing_keyoptions":
                    v1=this.gfield(blockdata,"KEY_OPTION")[0];
                    return({'v':`${v1}`,'t':2})

                case "argument_reporter_boolean":
                    dx=this.gfield(blockdata,"VALUE")[0];
                    var varid=vars['common'][dx+opt.hat];
                    // 如果未找到，尝试其他可能的键
                    if (varid === undefined) {
                        // 尝试不带后缀的键，或者尝试其他可能的键
                        // 遍历 common 中所有以 dx 开头的键
                        for (const key in vars['common']) {
                            if (key.startsWith(dx) && vars['common'][key] && vars['common'][key].id) {
                                varid = vars['common'][key];
                                break;
                            }
                        }
                        if (varid === undefined) {
                            console.warn("参数未找到:", dx, "hat:", opt.hat);
                            // 返回默认值
                            return {'v': '0', 't': 1};
                        }
                    }
                    //console.log(dx+opt.hat);
                    //console.log(vars['common']);
                    var vardata=vars['common'][varid.id+"_avg"];
                    //console.log("引用arg"+JSON.stringify(vardata));

                    return {'v':vardata.usename,'t':vardata.type};

                case "argument_reporter_string_number":
                    dx=this.gfield(blockdata,"VALUE")[0];
                    var varid=vars['common'][dx+opt.hat];
                    // 如果未找到，尝试其他可能的键
                    if (varid === undefined) {
                        // 尝试不带后缀的键，或者尝试其他可能的键
                        // 遍历 common 中所有以 dx 开头的键
                        for (const key in vars['common']) {
                            if (key.startsWith(dx) && vars['common'][key] && vars['common'][key].id) {
                                varid = vars['common'][key];
                                break;
                            }
                        }
                        if (varid === undefined) {
                            console.warn("参数未找到:", dx, "hat:", opt.hat);
                            // 返回默认值
                            return {'v': '0', 't': 1};
                        }
                    }
                    //console.log(dx+opt.hat);
                    //console.log(vars['common']);
                    var vardata=vars['common'][varid.id+"_avg"];
                    //console.log("引用arg"+JSON.stringify(vardata));
                    
                    return {'v':vardata.usename,'t':vardata.type};


                //jsext相关
                case "jsext_menu_VARTYPE":
                    var VARTYPE=this.gfield(blockdata,"VARTYPE")[0];
                    return {"v":VARTYPE,"t":2};

                case "jsext_menu_JSTYPE":
                    var JSTYPE=this.gfield(blockdata,"JSTYPE")[0];
                    return {"v":JSTYPE,"t":2};

                case "jsext_js_report":
                    var JSCODE=this.ginput(blockdata,"JSCODE",blocks,vars,3,opt);
                    return {"v":this.tonotstr(JSCODE.v),"t":Type.any};

                case "jsext_js_bool":
                    var JSCODE=this.ginput(blockdata,"JSCODE",blocks,vars,3,opt);
                    return {"v":this.tonotstr(JSCODE.v),"t":Type.any};

                

                //bjs相关
                
                case 'babylonjsenv_menu_SCENEKEYS':
                    var SCENEKEYS=this.gfield(blockdata,"SCENEKEYS")[0];
                    return {"v":SCENEKEYS,'t':2}
                case 'babylonjsenv_menu_JSTYPE':
                    var JSTYPE=this.gfield(blockdata,"JSTYPE")[0];
                    return {"v":JSTYPE,'t':2}

                case 'babylonjstransform_menu_VALUEWAYS':
                    var VALUEWAYS=this.gfield(blockdata,"VALUEWAYS")[0];
                    return {"v":VALUEWAYS,'t':2}

                case 'babylonjstransform_menu_MESHKEYS':
                    var MESHKEYS=this.gfield(blockdata,"MESHKEYS")[0];
                    return {"v":MESHKEYS,'t':2}

                case "babylonjsmesh_menu_KIND":
                    var KIND=this.gfield(blockdata,"KIND")[0];
                    return {"v":KIND,'t':2}
                
                case 'babylonjslights_menu_LIGHTCONFIGTYPE':
                    var LIGHTCONFIGTYPE=this.gfield(blockdata,"LIGHTCONFIGTYPE")[0];
                    return {"v":LIGHTCONFIGTYPE,'t':2}

                case 'babylonjsmaterial_bjs_create_mat_standard':
                    var NAME=this.ginput(blockdata,"NAME",blocks,vars,3,opt);
                    return {"v":`(new BABYLON.StandardMaterial(${NAME.v},scene))`,'t':2}

                case 'babylonjsmaterial_bjs_create_mat_PBRMaterialOld':
                    var NAME=this.ginput(blockdata,"NAME",blocks,vars,3,opt);
                    return {"v":`(new BABYLON.PBRMaterial(${NAME.v},scene))`,'t':2}

                case 'babylonjslights_bjs_shadow_key':
                    var KEY=this.gfield(blockdata,"KEY")[0];
                    return {"v":KEY,'t':2}
                

                case 'babylonjsmesh_bjs_meshgroup_key':
                    //传入:
                    //AMESH:传入管理器
                    //KEY:AMESH的键
                    var AMESH=this.ginput(blockdata,"AMESH",blocks,vars,3,opt);
                    var KEY=this.gfield(blockdata,"KEY")[0];
                    return {"v":`(${this.tonotstr(AMESH.v)}.${KEY})`,'t':3}

                case 'babylonjsstage_bjs_col3hex':
                    var HEX=this.ginput(blockdata,"HEX",blocks,vars,3,opt);
                    return {"v":`BABYLON.Color3.FromHexString(${HEX.v})`,'t':2}

                case 'babylonjsmesh_bjs_create_mesh'://创建基础mesh
                    //传入:
                    //KIND:创建种类
                    //NAME:传入Bjs的名称
                    //返回:Mesh实例
                    var KIND=this.ginput(blockdata,"KIND",blocks,vars,3,opt);
                    var NAME=this.ginput(blockdata,"NAME",blocks,vars,3,opt);
                    var Opt=this.ginput(blockdata,"Opt",blocks,vars,3,opt);
                    //this.defvars.add(NAME);
                    if (this.tonotstr(Opt.v) == "<Option Object>"){
                        switch(KIND.v){
                            case "Cube":
                                return {"v":`BABYLON.MeshBuilder.CreateBox(${NAME.v},{size:1},scene)`,"t":Type.object}
                            case "Sphere":
                                return {"v":`BABYLON.MeshBuilder.CreateSphere(${NAME.v},{radius:1},scene)`,"t":Type.object}
                            case "Plane":
                                return {"v":`BABYLON.MeshBuilder.CreatePlane(${NAME.v},{size:1},scene)`,"t":Type.object}
                            case "TransformNode":
                                return {"v":`new BABYLON.TransformNode(${NAME.v},scene)`,"t":Type.object}
                            default:
                                return ``;
                        }
                    }else{
                        return {"v":`BABYLON.MeshBuilder.Create${this.tonotstr(KIND.v.replaceAll("Cube","Box"))}(${NAME.v},${Opt.v},scene)`,"t":Type.object}
                    }
                    

                
                case 'babylonjslights_menu_LIGHTTYPE':
                    var LIGHTTYPE=this.gfield(blockdata,"LIGHTTYPE")[0];
                    return {"v":LIGHTTYPE,'t':2}




                //OpenPBR
                case 'babylonjsmaterial_menu_MATSET':
                    var MATSET=this.gfield(blockdata,"MATSET")[0];
                    return {"v":MATSET,'t':3}

                case 'babylonjsmaterial_bjs_openpbrset':
                    var KEY=this.ginput(blockdata,"KEY",blocks,vars,3,opt);
                    return {"v":KEY.v,'t':3}

                //PBR
                case 'babylonjsmaterial_menu_PBRMATSET':
                    var PBRMATSET=this.gfield(blockdata,"PBRMATSET")[0];
                    return {"v":PBRMATSET,'t':3}

                case 'babylonjsmaterial_bjs_pbrkey':
                    var KEY=this.ginput(blockdata,"KEY",blocks,vars,3,opt);
                    return {"v":KEY.v,'t':3}




                case 'babylonjslights_bjs_add_light':
                    //传入:
                    //LIGHTTYPE 光源种类
                    //NAME 传入BJS的名称
                    var LIGHTTYPE=this.ginput(blockdata,"LIGHTTYPE",blocks,vars,3,opt);
                    var NAME=this.ginput(blockdata,"NAME",blocks,vars,3,opt);
                    this.defvars.add(NAME);
                    switch(LIGHTTYPE.v){
                        case "PointLight":
                            return {"v":`new BABYLON.${LIGHTTYPE.v}(${NAME.v},BABYLON.Vector3.Zero(),scene)`,"t":Type.object}
                        case "DirectionalLight":
                            return {"v":`new BABYLON.${LIGHTTYPE.v}(${NAME.v},BABYLON.Vector3.Down(),scene)`,"t":Type.object}
                        case "HemisphericLight":
                            return {"v":`new BABYLON.${LIGHTTYPE.v}(${NAME.v},BABYLON.Vector3.Zero(),scene)`,"t":Type.object}
                        default:
                            return ``;
                    }
                
                case 'babylonjsmesh_bjs_import_glb':
                    //传入:
                    //DATA 链接或者数据(arraybffer之类的)
                    //NAME 给bjs的名称
                    var DATA=this.ginput(blockdata,"DATA",blocks,vars,3,opt);
                    var RootUrl=this.ginput(blockdata,"RootUrl",blocks,vars,3,opt);
                    var Format=this.gfield(blockdata,"Format")[0];
                    var opt={
                        pluginExtension:Format
                    }
                    if (this.tonotstr(RootUrl.v)){
                        opt.rootUrl=this.tonotstr(RootUrl.v);
                    }
                    return {"v":`(yield BABYLON.LoadAssetContainerAsync(${DATA.v},scene,${JSON.stringify(opt)}))`,"t":Type.any}

                case 'babylonjslights_bjs_shadowgen':
                    //传入:
                    //LIGHT 灯光对象
                    //SIZE shadowmap精度
                    var LIGHT=this.ginput(blockdata,"LIGHT",blocks,vars,3,opt);
                    var SIZE=this.ginput(blockdata,"SIZE",blocks,vars,3,opt);
                    return {"v":`(new BABYLON.ShadowGenerator(${SIZE.v}, ${this.tonotstr(LIGHT.v)}))`,"t":Type.any}

                case 'babylonjslights_bjs_shadow_list':
                    var OBJ=this.ginput(blockdata,"OBJ",blocks,vars,3,opt);
                    return {"v":`(${this.tonotstr(OBJ.v)}.getShadowMap().renderList)`,"t":Type.any}

                case 'babylonjstransform_bjs_get_mesh_info':
                    //传入:
                    //NAME 对象
                    //KEY 键
                    var NAME=this.ginput(blockdata,"NAME",blocks,vars,3,opt);
                    var KEY=this.ginput(blockdata,"KEY",blocks,vars,3,opt);
                    return {"v":`(${this.tonotstr(NAME.v)}.${KEY.v})`,"t":Type.any}

                


                

                
                default:

                    var plugs=Object.values(plugins);
                    for (const plug of plugs){
                        if (plug.reporter){
                            var blockdx=plug.reporter(inputblock.opcode);
                            if (blockdx){
                                console.log("plugin:",blockdx);
                                var args=blockdx.args;
                                var ARGS={};
                                for (const arg of args){
                                    if (arg.isinput){
                                        var inputvaluex=this.ginput(blockdata,arg.key,blocks,vars,arg.expectType,opt);
                                        console.log(arg.key,arg.expectType,inputvaluex);
                                        ARGS[arg.key]=inputvaluex;
                                        if (!(inputvaluex)){
                                            console.error("非法的参数"+arg.key);
                                            process.exit(1);
                                        }
                                    }else{
                                        var inputvaluex=this.gfield(blockdata,arg.key,blocks,vars,3,opt)[0];
                                        ARGS[arg.key]=inputvaluex;
                                        if (!(inputvaluex)){
                                            console.error("非法的参数"+arg.key);
                                            process.exit(1);
                                        }
                                        
                                    }
                                }
                                return blockdx.js(ARGS);

                            }
                        }
                        
                    }
                    
                    console.log(inputblock);

                    console.log('inputs');
                    console.table(inputblock.inputs);

                    console.log('fields');
                    console.table(inputblock.fields);

                    console.error("不支持的reporter:"+inputblock.opcode);
                    process.exit(1);
                    return {"v":`0`,"t":Type.any}
            }
        }else{
            //console.log("是str")
            //传入数字或者文本
            let inputtype=this.strtypeof(inputvalue.v);
            console.log("number or text",inputvalue.v)
            switch(inputtype){
                case "empty":
                    return {'v':'""','t':3};
                case "number":
                    return {'v':inputvalue.v,'t':1};
                case "text":
                    if (plantype==1){
                        // 使用 JSON.stringify 来安全地处理特殊字符
                        const safeValue = JSON.stringify(inputvalue.v);
                        return {'v':`(isNaN(Number(${safeValue})) || ${safeValue} === null || ${safeValue} === '' ? 0 : Number(${safeValue}))`,'t':1};
                    }
                    return {'v':`"${inputvalue.v.replaceAll("\"","\\\"")}"`,'t':2};
            }
        }
    }

    tonotstr(str) {
        if (typeof str === 'string' && str.startsWith('"') && str.endsWith('"')) {
            return str.slice(1, -1).replaceAll("\\\"","\"");
        }
        return str;
    }
    defvars=new Set();
    gen(opcode,blockdata,vars,blocks,opt={}){
        var lines=[];
        switch(opcode){
            //其实是空内容
            case 'control_if':
                return `//空if`;
            case 'control_repeat':
                return `//空循环`;
            case 'control_if_else':
                return `//空ifelse`;
            case 'control_repeat_until':
                return `//空循环`;
            case 'control_forever':
                return `//空循环`;


            //Bjs相关
            case 'babylonjslights_bjs_shadowgen_exampleset':
                var OBJ=this.ginput(blockdata,"OBJ",blocks,vars,3,opt);
                lines.push(`${this.tonotstr(OBJ.v)}.bias = 0.00001;`);
                lines.push(`${this.tonotstr(OBJ.v)}.normalBias = 0.015;`);
                lines.push(`${this.tonotstr(OBJ.v)}.useContactHardeningShadow = true;`);
                lines.push(`${this.tonotstr(OBJ.v)}.contactHardeningLightSizeUVRatio = 0.05;`);
                return lines.join("\n");

            case 'babylonjslights_bjs_mesh_receive_shadows':
                //传入:
                //MESH 对象
                //BOOLEAN 值
                var MESH=this.ginput(blockdata,"MESH",blocks,vars,3,opt);
                var BOOLEAN=this.ginput(blockdata,"BOOLEAN",blocks,vars,3,opt);
                return `${this.tonotstr(MESH.v)}.receiveShadows=${BOOLEAN.v};`

            case 'babylonjsmaterial_bjs_config':
                //传入:
                //MATOBJ Mat对象
                //MATSET 材质对象
                //VALUE
                var MATOBJ=this.ginput(blockdata,"MATOBJ",blocks,vars,3,opt);
                var MATSET=this.ginput(blockdata,"MATSET",blocks,vars,3,opt);
                var VALUE=this.ginput(blockdata,"VALUE",blocks,vars,3,opt);
                return `${this.tonotstr(MATOBJ.v)}.${MATSET.v}=${VALUE.v};`
                
            case 'babylonjsmaterial_bjs_mesh_mat':
                //传入:
                //Mesh Mesh对象
                //MATERIALOBJ 材质对象
                var Mesh=this.ginput(blockdata,"Mesh",blocks,vars,3,opt);
                var MATERIALOBJ=this.ginput(blockdata,"MATERIALOBJ",blocks,vars,3,opt);
                return `${this.tonotstr(Mesh.v)}.material=${this.tonotstr(MATERIALOBJ.v)};`

            case 'babylonjslights_bjs_light_config':
                //传入:
                //LIGHT:对象
                //SETTYPE:设置键
                //JSTYPE:修改方式
                //VALUE:值
                var LIGHT=this.ginput(blockdata,"LIGHT",blocks,vars,3,opt);
                var SETTYPE=this.ginput(blockdata,"SETTYPE",blocks,vars,3,opt);
                var JSTYPE=this.ginput(blockdata,"JSTYPE",blocks,vars,3,opt);
                var VALUE=this.ginput(blockdata,"VALUE",blocks,vars,3,opt);
                return `${this.tonotstr(LIGHT.v)}.${this.tonotstr(SETTYPE.v)}${this.tonotstr(JSTYPE.v)}${VALUE.v};`

            case 'babylonjsmesh_bjs_amesh_setparent':
                //传入:
                //AMESH Container对象
                //MESH 父节点
                var AMESH=this.ginput(blockdata,"AMESH",blocks,vars,3,opt);
                var MESH=this.ginput(blockdata,"MESH",blocks,vars,3,opt);
                return `${this.tonotstr(AMESH.v)}.rootNodes[0].parent=${this.tonotstr(MESH.v)}`;

            case 'babylonjsmesh_bjs_meshgroup_op':
                //传入:
                //AMESH Container对象
                //OP 操作方式
                var AMESH=this.ginput(blockdata,"AMESH",blocks,vars,3,opt);
                var OP=this.gfield(blockdata,"OP")[0];
                return `${this.tonotstr(AMESH.v)}.${OP}();`

            case 'babylonjstransform_bjs_trandform_mesh':
                //传入:
                //NAME:对象
                //KEY:Mesh键
                //WAY:修改方式
                //VALUE:值
                var NAME=this.ginput(blockdata,"NAME",blocks,vars,3,opt);
                var KEY=this.ginput(blockdata,"KEY",blocks,vars,3,opt);
                var WAY=this.ginput(blockdata,"WAY",blocks,vars,3,opt);
                var VALUE=this.ginput(blockdata,"VALUE",blocks,vars,3,opt);
                return `${this.tonotstr(NAME.v)}.${KEY.v}${WAY.v}${VALUE.v};`

            case 'babylonjsenv_bjs_env_set':
                //传入:
                //KEY:传入键
                //JSTYPE:太阳能运算方式
                //VALUE:值
                var KEY=this.ginput(blockdata,"KEY",blocks,vars,3,opt);
                var JSTYPE=this.ginput(blockdata,"JSTYPE",blocks,vars,3,opt);
                var VALUE=this.ginput(blockdata,"VALUE",blocks,vars,3,opt);
                return `scene.${KEY.v}${JSTYPE.v}${VALUE.v};`



            
            //jsext相关
            

            case 'jsext_js_varlet':
                //传入:
                //VARDY:变量类型
                //VARNAME:变量名称 注:完全不支持表达式
                //返回:定义变量语句
                var VARDY=this.ginput(blockdata,"VARDY",blocks,vars,3,opt);
                var VARNAME=this.ginput(blockdata,"VARNAME",blocks,vars,3,opt);
                return `${this.tonotstr(VARDY.v)} ${this.tonotstr(VARNAME.v)};`

            case 'jsext_js_datavar':
                //传入:
                //VARNAME:变量名
                //JSTYPE:操作
                //VALUE:值
                //返回:变量操作
                var VARNAME=this.ginput(blockdata,"VARNAME",blocks,vars,3,opt);
                var JSTYPE=this.ginput(blockdata,"JSTYPE",blocks,vars,3,opt);
                var VALUE=this.ginput(blockdata,"VALUE",blocks,vars,3,opt);
                return `${this.tonotstr(VARNAME.v)}${JSTYPE.v}${VALUE.v};`

            case 'jsext_js_line':
                var JSCODE=this.ginput(blockdata,"JSCODE",blocks,vars,3,opt);
                return `${this.tonotstr(JSCODE.v)}`

            case 'jsext_js_return':
                var value=this.ginput(blockdata,"value",blocks,vars,3,opt);
                return `return ${value.v};`






            //products
            case 'procedures_call':
                var calldx=blockdata.mutation.proccode;
                var arg=[];
                for (const argin of Object.values(blockdata.inputs)){
                    var arginput=this.geninputjs(blocks,argin,vars,3,opt);
                    arg.push({"value":arginput.v,"type":arginput.t});
                    //console.log(this.geninputjs(blocks,argin,vars,3,opt));
                }
                //console.log(JSON.stringify({"op":"call","arg":arg,"call":calldx}));
                return {"arg":arg,"call":"f_"+tovar(calldx),"warp":blockdata.mutation.warp};



            //声音相关
            case "sound_changeeffectby":
                return `//sound_v`;

            case "sound_changevolumeby":
                return `//sound_v`;

            case "sound_setvolumeto":
                return `//sound_v`;

            case "sound_seteffectto":
                return `//soundeff`;


            case "sound_stopallsounds":
                return `audioManager.stopAll();`;

            case "sound_play":
                var soundname=this.ginput(blockdata,"SOUND_MENU",blocks,vars,2,opt);
                lines.push(`this.temp=this.sound_names.indexOf(${soundname.v});`);
                lines.push(`if (this.temp == -1){`);
                lines.push(`    this.temp=Number(${soundname.v});`);
                lines.push(`    if (!(Number.isNaN(this.temp))){`);
                lines.push(`        this.temp1=this.sound_files[this.temp-1]; }`);
                lines.push(`} else {`);
                lines.push(`    this.temp1=this.sound_files[this.temp];`);
                lines.push(`}`);
                lines.push(`audioManager.playAudioAsync(${soundname.v}, this.temp1);`);
                return lines.join("\n");

            case "sound_playuntildone":
                var soundname=this.ginput(blockdata,"SOUND_MENU",blocks,vars,2,opt);
                lines.push(`this.temp=this.sound_names.indexOf(${soundname.v});`);
                lines.push(`if (this.temp == -1){`);
                lines.push(`    this.temp=Number(${soundname.v});`);
                lines.push(`    if (!(Number.isNaN(this.temp))){`);
                lines.push(`        this.temp1=this.sound_files[this.temp-1]; }`);
                lines.push(`} else {`);
                lines.push(`    this.temp1=this.sound_files[this.temp];`);
                lines.push(`}`);
                lines.push(`yield* audioManager.playAudioGenerator(${soundname.v}, this.temp1);`);
                return lines.join("\n");
            

            //广播相关
            case "event_broadcast":
                var msgid=this.ginput(blockdata,"BROADCAST_INPUT",blocks,vars,2,opt);

                return `makeEvent(broadcasts[String(${msgid.v})],'all',broadcasts[String(${msgid.v})]);`;
                //return `ret.push({"event":"broadcast","tag":broadcasts[String(${msgid.v})],"father":"${onlyid}"});`;
            
            case "event_broadcastandwait":
                var msgid=this.ginput(blockdata,"BROADCAST_INPUT",blocks,vars,2,opt);

                lines.push(`makeEvent(broadcasts[String(${msgid.v})],'all',broadcasts[String(${msgid.v})]);`);
                lines.push(`yield* waitfather(broadcasts[String(${msgid.v})])`);
                return lines.join("\n");

            //克隆相关
            case "control_delete_this_clone":
                return "this.dispose();";
            
            case "control_create_clone_of":
                var dx=this.ginput(blockdata,"CLONE_OPTION",blocks,vars,1,opt);
                if (dx.v == "_myself_"){
                    lines.push(`var clonedx=this.thistarget;`);
                    lines.push(`var clonevar=this.collectvars();`);
                }else{
                    lines.push(`var clonedx=tarpool["${dx.v}"].thistarget;`);
                    lines.push(`var clonevar=tarpool["${dx.v}"].collectvars();`);
                }
                lines.push(`this.childNum++;`);

                lines.push(`var cloneName=this.name+"_s_clone"+this.childNum;`);

                lines.push(`clonevar.name=cloneName`);
                lines.push(`clonevar.realname=this.realname+"_s_clone"+this.childNum;`);

                lines.push(`var newTar=new clonedx(clonevar);`);
                lines.push(`newTar.isClone=true;`);
                lines.push(`newTar.init(this);`);


                lines.push(`makeEvent('clone',newTar,cloneName);`);

                
                lines.push(`tarpool[cloneName]=newTar;`);
                return lines.join("\n");







            //造型相关


            case "looks_cleargraphiceffects":
                return `this.GHOST=0;`;

            case 'looks_changeeffectby':
                var value=this.ginput(blockdata,"CHANGE",blocks,vars,1,opt);
                var dx=this.gfield(blockdata,"EFFECT",blocks,vars,2)[0];
                switch(dx){
                    case "GHOST":
                        return `this.GHOST+=${value.v}`;
                }
                return `//none_tx${dx}`;

            case 'looks_seteffectto':
                var value=this.ginput(blockdata,"VALUE",blocks,vars,1,opt);
                var dx=this.gfield(blockdata,"EFFECT",blocks,vars,2)[0];
                switch(dx){
                    case "GHOST":
                        return `this.GHOST=${value.v}`;
                }
                return `//none_tx${dx}`;

            case "looks_goforwardbackwardlayers":
                var value=this.ginput(blockdata,"NUM",blocks,vars,1,opt);
                var dx=this.gfield(blockdata,"FORWARD_BACKWARD",blocks,vars,2)[0];
                if (dx == "forward"){
                    return `this.tardx.offsetlayer(${value.v});`;
                }else{
                    return `this.tardx.offsetlayer(-(${value.v}));`;
                }


            case 'looks_gotofrontback':
                var opt=this.gfield(blockdata,"FRONT_BACK",blocks,vars,2)[0];
                
                if (opt == "front"){
                    return `this.tardx.setlayer("front");`;
                }else{
                    return `this.tardx.setlayer("back");`;
                }
                

            case 'looks_sayforsecs':
                var msg=this.ginput(blockdata,"MESSAGE",blocks,vars,1,opt);
                return `console.log(${msg.v});`;

            case 'looks_changesizeby':
                var size=this.ginput(blockdata,"CHANGE",blocks,vars,1,opt);
                return `this.size+=${size.v};`;

            case 'looks_setsizeto':
                var size=this.ginput(blockdata,"SIZE",blocks,vars,1,opt);
                return `this.size=${size.v};`;

            case 'looks_show':
                return `this.visible=true;`;

            case 'looks_hide':
                return `this.visible=false;`;

            case 'looks_switchcostumeto':
                var COSTUME=this.ginput(blockdata,"COSTUME",blocks,vars,2,opt);
                lines.push(`this.temp=this.custom_names.indexOf(${COSTUME.v});`);
                lines.push(`if (this.temp == -1){`);
                lines.push(`    this.temp=Number(${COSTUME.v});`);
                lines.push(`    if (!(Number.isNaN(this.temp))){`);
                lines.push(`        this.custom=this.temp-1; }`);
                lines.push(`} else {`);
                lines.push(`    this.custom=this.temp;`);
                lines.push(`}`);
                lines.push(`this.tardx.rotationCenterOffsetX=this.rotcxs[this.custom];`);
                lines.push(`this.tardx.rotationCenterOffsetY=this.rotcys[this.custom];`);
                lines.push(`this.tardx.texturePath=this.custom_files[this.custom];`);
                return lines.join("\n");

            case 'looks_nextcostume':
                lines.push(`this.custom++;`);
                lines.push(`if (this.custom+1>this.custom_files.length)`);
                lines.push(`    this.custom=0;`);
                lines.push(`this.tardx.rotationCenterOffsetX=this.rotcxs[this.custom];`);
                lines.push(`this.tardx.rotationCenterOffsetY=this.rotcys[this.custom];`);
                lines.push(`this.tardx.texturePath=this.custom_files[this.custom];`);

                return lines.join("\n");







            //侦测相关


            case 'sensing_resettimer':
                return `timerstart=Date.now()/1000;`;

            case 'sensing_askandwait':
                var ques=this.ginput(blockdata,"QUESTION",blocks,vars,2,opt);
                lines.push(`var _input=prompt(${ques.v});`);
                lines.push(`if (!(_input==null))`);
                lines.push(`    _answer=_input;`);
                return lines.join("\n");




            //控制相关
            case 'control_stop':
                var dx=this.gfield(blockdata,"STOP_OPTION",blocks,vars,2)[0];
                switch(dx){
                    case 'this script':
                        return 'return 0;';
                    case 'other scripts in sprite':
                        lines.push(`_stopotherscript=task.uuid;`);
                        return lines.join("\n");
                    case 'all':
                        return 'process.exit(0)';
                }
                return `//stop:${dx}`;


            case 'control_wait':
                var time=this.ginput(blockdata,"DURATION",blocks,vars,1,opt);
                lines.push(`var unlock_time=Date.now()+${time.v}*1000;`);
                lines.push("yield* sleepms(unlock_time);");
                return lines.join("\n");
                
            case 'control_wait_until':
                var cond=this.ginput(blockdata,"CONDITION",blocks,vars,1,opt);
                lines.push(`while (true){`);
                lines.push(`    if (${cond.v})`);
                lines.push(`        break;`);
                //lines.push(`    yield null;`);
                //lines.push(`}`);
                return lines.join("\n");

            case 'data_showlist':
                return `//varshow;`

            case 'data_hidelist':
                return `//varhide;`


            //变量相关

            case 'data_setvariableto':
                var dx=this.gfield(blockdata,"VARIABLE",blocks,vars,3)[1];
                var to=this.ginput(blockdata,"VALUE",blocks,vars,3,opt);
                //console.log(vars['common'][dx]);
                var varxx=this.vardata(vars,dx,'');
                var varname=varxx.perfix+varxx.usename;
                //console.log("gent",dx,to.v,to.t,varname)
                return `${varname}=${to.v};`

            case 'data_changevariableby':
                var dx=this.gfield(blockdata,"VARIABLE",blocks,vars,3)[1];
                var to=this.ginput(blockdata,"VALUE",blocks,vars,3,opt);
                var varxx=this.vardata(vars,dx,'');
                var varname=varxx.perfix+varxx.usename;
                //console.log(`${varname}+=${to.v}`)
                //console.log(to)
                return `${varname}+=${to.v};`

            case 'data_showvariable':
                return `//varshow;`

            case 'data_hidevariable':
                return `//varhide;`

            //列表相关

            case 'data_insertatlist':
                var dx=this.gfield(blockdata,"LIST",blocks,vars,3)[1];
                var index=this.ginput(blockdata,"INDEX",blocks,vars,1,opt);
                var listxx=this.vardata(vars,dx,'_list');
                var listname=listxx.perfix+listxx.usename;
                var to=this.ginput(blockdata,"ITEM",blocks,vars,3,opt);
                return `${listname}.splice((${index.v}-1),0,${to.v});`

            case 'data_deleteoflist':
                var dx=this.gfield(blockdata,"LIST",blocks,vars,3)[1];
                var index=this.ginput(blockdata,"INDEX",blocks,vars,1,opt);
                var listxx=this.vardata(vars,dx,'_list');
                var listname=listxx.perfix+listxx.usename;
                return `runtime.removeFast(${listname},(${index.v}-1));`

            case 'data_replaceitemoflist':
                var dx=this.gfield(blockdata,"LIST",blocks,vars,3)[1];
                //console.log("1")
                var index=this.ginput(blockdata,"INDEX",blocks,vars,1,opt);
                var to=this.ginput(blockdata,"ITEM",blocks,vars,3,opt);
                var listxx=this.vardata(vars,dx,'_list');
                var listname=listxx.perfix+listxx.usename;
                return `${listname}[${index.v}-1]=${to.v};`

            case 'data_deletealloflist':
                var dx=this.gfield(blockdata,"LIST",blocks,vars,3)[1];
                var listxx=this.vardata(vars,dx,'_list');
                var listname=listxx.perfix+listxx.usename;
                return `${listname}.length=0;`
            
            case 'data_addtolist':
                var dx=this.gfield(blockdata,"LIST",blocks,vars,3)[1];
                //console.log("1")
                var to=this.ginput(blockdata,"ITEM",blocks,vars,3,opt);
                var listxx=this.vardata(vars,dx,'_list');
                var listname=listxx.perfix+listxx.usename;
                return `${listname}.push(${to.v});`





            //运动相关
            case "motion_pointtowards":
                return ``;

            case "motion_setrotationstyle":
                return ``;

            case 'motion_glidesecstoxy':
                var sec=this.ginput(blockdata,"SECS",blocks,vars,1,opt);
                var tox=this.ginput(blockdata,"X",blocks,vars,1,opt);
                var toy=this.ginput(blockdata,"Y",blocks,vars,1,opt);
                lines.push(`yield* this.movetoms(${tox.v},${toy.v},${sec.v*1000})`);
                return lines.join("\n");

            case 'motion_glideto':
                var sec=this.ginput(blockdata,"SECS",blocks,vars,1,opt);
                var to=this.ginput(blockdata,"TO",blocks,vars,1,opt);
                console.log(to.v);
                if (to.v == "_random_"){
                    lines.push(`this.temp=runtime.randomBetween(-240,240);`);
                    lines.push(`this.temp1=runtime.randomBetween(-180,180);`);
                }
                lines.push(`yield* this.movetoms(this.temp,this.temp1,${sec.v*1000})`);
                return lines.join("\n");

            case 'motion_goto':
                var toxy=this.ginput(blockdata,"TO",blocks,vars,2,opt);
                if (toxy.v=="_mouse_"){
                    lines.push(`this.temp=mousex;`);
                    lines.push(`this.temp1=mousey;`);
                }else{
                    lines.push(`this.temp=gtar["${toxy.v}"]["getvar"]("x position");`);
                    lines.push(`this.temp1=gtar["${toxy.v}"]["getvar"]("y position");`);
                }

                lines.push(`if (this.pendown)`);
                lines.push(`    stage.drawLine(this.xpos,this.ypos,this.temp,this.temp1);`);
                lines.push(`this.xpos=this.temp;`);
                lines.push(`this.ypos=this.temp1;`);
                return lines.join("\n");
            
            case 'motion_gotoxy':
                var to=this.ginput(blockdata,"X",blocks,vars,1,opt);
                var to2=this.ginput(blockdata,"Y",blocks,vars,1,opt);
                lines.push(`this.temp=${to.v};`);
                lines.push(`this.temp1=${to2.v};`);
                lines.push(`if (this.pendown)`);
                lines.push(`    stage.drawLine(this.xpos,this.ypos,this.temp,this.temp1);`);
                lines.push(`this.xpos=this.temp;`);
                lines.push(`this.ypos=this.temp1;`);
                return lines.join("\n");

            case 'motion_changexby':
                var to=this.ginput(blockdata,"DX",blocks,vars,1,opt);
                lines.push(`this.temp=${to.v};`);
                lines.push(`if (this.pendown)`);
                lines.push(`    stage.drawLine(this.xpos,this.ypos,this.xpos+this.temp,this.ypos);`);
                lines.push(`this.xpos+=this.temp;`);
                return lines.join("\n");

            case 'motion_changeyby':
                var to=this.ginput(blockdata,"DY",blocks,vars,1,opt);
                lines.push(`this.temp=${to.v};`);
                lines.push(`if (this.pendown)`);
                lines.push(`    stage.drawLine(this.xpos,this.ypos,this.xpos,this.ypos+this.temp);`);
                lines.push(`this.ypos+=this.temp;`);
                return lines.join("\n");

            case 'motion_setx':
                var to=this.ginput(blockdata,"X",blocks,vars,1,opt);
                lines.push(`this.temp=${to.v};`);
                lines.push(`if (this.pendown)`);
                lines.push(`    stage.drawLine(this.xpos,this.ypos,this.temp,this.ypos);`);
                lines.push(`this.xpos=this.temp;`);
                return lines.join("\n");

            case 'motion_sety':
                var to=this.ginput(blockdata,"Y",blocks,vars,1,opt);
                lines.push(`this.temp=${to.v};`);
                lines.push(`if (this.pendown)`);
                lines.push(`    stage.drawLine(this.xpos,this.ypos,this.xpos,this.temp);`);
                lines.push(`this.ypos=this.temp;`);
                return lines.join("\n");

            case 'motion_pointindirection':
                var to=this.ginput(blockdata,"DIRECTION",blocks,vars,1,opt);
                return `this.direction=${to.v};`;

            case 'motion_turnleft':
                //console.log("aaa");
                var to=this.ginput(blockdata,"DEGREES",blocks,vars,1,opt);
                lines.push(`this.direction-=${to.v};`);
                lines.push(`if (this.direction<=-180)`);
                lines.push(`    this.direction+=360;`);
                return lines.join("\n");

            case 'motion_turnright':
                //console.log("aaa");
                var to=this.ginput(blockdata,"DEGREES",blocks,vars,1,opt);
                lines.push(`this.direction+=${to.v};`);
                lines.push(`if (this.direction>=180)`);
                lines.push(`    this.direction-=360;`);
                return lines.join("\n");

            case 'motion_movesteps':
                var to=this.ginput(blockdata,"STEPS",blocks,vars,1,opt);
                lines.push(`var rad = (this.direction) * Math.PI / 180;`);
                lines.push(`var stepx = (${to.v}) * Math.sin(rad);`);
                lines.push(`var stepy = (${to.v}) * Math.cos(rad);`);
                lines.push(`if (this.pendown)`);
                lines.push(`    stage.drawLine(this.xpos,this.ypos,this.xpos+stepx,this.ypos+stepy);`);
                lines.push(`this.xpos+=stepx;`);
                lines.push(`this.ypos+=stepy;`);
                return lines.join("\n");

            
            //画笔相关
            case 'pen_clear':
                return 'stage.clearPen();';

            case 'pen_penDown':
                return 'this.pendown=true;';

            case 'pen_penUp':
                return 'this.pendown=false;';

            case 'pen_setPenSizeTo':
                var to=this.ginput(blockdata,"SIZE",blocks,vars,1,opt);
                return `stage.setPenSize(${to.v})`;

            case 'pen_setPenColorToColor':
                var to=this.ginput(blockdata,"COLOR",blocks,vars,2,opt);
                to.v=to.v.replace("#","0x");
                return `stage.setPenColor(${to.v})`;

            case 'pen_changePenColorParamBy':
                //var key=this.ginput(blockdata,"COLOR_PARAM",blocks,vars,2,opt);
                return '';
            
            case 'pen_stamp':
                return ``;

            case 'pointerlock_setLocked':
                return ``;
            
            

            default:
                var plugs=Object.values(plugins);
                for (const plug of plugs){
                    if (plug.op){
                        var blockdx=plug.op(opcode);
                        //console.log(Object.values(plugins),111)
                        if (blockdx){
                            console.log("plugin:"+blockdx);
                            var args=blockdx.args;
                            var ARGS={};
                            for (const arg of args){
                                if (arg.isinput){
                                    var inputvaluex=this.ginput(blockdata,arg.key,blocks,vars,arg.expectType,opt);
                                    ARGS[arg.key]=inputvaluex;
                                }else{
                                    var inputvaluex=this.gfield(blockdata,arg.key)[0];
                                    ARGS[arg.key]=inputvaluex;
                                }
                            }
                            return blockdx.js(ARGS);

                        }
                    }

   
                }
                console.log('inputs');
                console.table(blockdata.inputs);

                console.log('fields');
                console.table(blockdata.fields);

                console.error("不支持的opcode:"+opcode);
                
                process.exit(1);
                return '//不支持的opcode:"+opcode';
        }
    }








    //上面是生成IR1的地方






    //下面是生成JLAI代码的地方

    //广播事件收集在这 特殊处理
    broadcasts=[];



    event_count={};
    
    doir(irlist,blocks,vars,depth,head,targetname,opt={}){
        switch(irlist.op){
                case 'hat':
                    var hatdata=irlist.hat;
                    switch(hatdata.opcode){
                        case "procedures_definition":
                            var pc_data=hatdata.inputs.custom_block[1];
                            pc_data=blocks[pc_data];
                            var fun_name=pc_data.mutation.proccode;
                            var warpmod=pc_data.mutation.warp;
                            //在这里不决定是否在hat下面的所有行中插入yield 后面JLAI(js lines array ir)里面再决定
                            fun_name="f_"+tovar(fun_name);
                            var fun_argids=JSON.parse(pc_data.mutation.argumentids);
                            var fun_args=[];
                            for (const argid of fun_argids){
                                fun_args.push(vars['common'][argid+"_avg"]['usename']);
                            }
                            var str_args=fun_args.join(",");
                             
                            var fun_code=`${fun_name}(${str_args})`;
                            return {"line":"function","warp":false,"js":fun_code,'funname':fun_name};

                        //返回;line(op) ,eventid(事件ID) ,count(数量) ,funname(js里的functionname)
                        case 'event_whenflagclicked':
                        
                            //增加计数器 键不存在时可以自动初始化
                            this.event_count[hatdata.opcode]=(this.event_count[hatdata.opcode]??0)+1;
                            return {'line':'event','eventid':"flag",'count':this.event_count[hatdata.opcode],'funname':'flagclick'};

                        case 'event_whenkeypressed':
                            //console.log(hatdata);
                            var keyid=this.gfield(hatdata,"KEY_OPTION",blocks,vars,3)[0];
                            //增加计数器 键不存在时可以自动初始化 //sepc键表示特殊处理 在JLAIgen部分读取
                            this.event_count[hatdata.opcode]=(this.event_count[hatdata.opcode]??0)+1;
                            return {'line':'event','eventid':"key"+keyid,'count':this.event_count[hatdata.opcode],'funname':'keypress','spec':{"sepc":"key","key":keyid},'nocover':true};

                        case "control_start_as_clone":
                            this.event_count[hatdata.opcode]=(this.event_count[hatdata.opcode]??0)+1;
                            return {'line':'event','eventid':"clone",'count':this.event_count[hatdata.opcode],'funname':'clonestart'};

                        case 'event_whenbroadcastreceived':
                            //console.log(hatdata);
                            var msgname=this.gfield(hatdata,"BROADCAST_OPTION",blocks,vars,3)[0];
                            var msgid=tovar(this.gfield(hatdata,"BROADCAST_OPTION",blocks,vars,3)[1]);
                            //后续特殊处理广播 为了避免非法函数名 以及期望的纯英文funname(其他语言的朋友抱歉了)
                            var funname='broadcast_'+tovar(msgname);
                            this.broadcasts.push({[msgname]:funname});
                            this.broadcasts.push({[this.gfield(hatdata,"BROADCAST_OPTION",blocks,vars,3)[1]]:funname});
                            //增加计数器 键不存在时可以自动初始化 //sepc键表示特殊处理 在JLAIgen部分读取
                            this.event_count[hatdata.opcode]=(this.event_count[hatdata.opcode]??0)+1;
                            return {'line':'event','eventid':funname,'count':this.event_count[hatdata.opcode],'funname':funname};

                        case 'jsext_event_projecthead':
                            this.event_count[hatdata.opcode]=(this.event_count[hatdata.opcode]??0)+1;
                            return {'line':'code','eventid':"",'count':this.event_count[hatdata.opcode],'funname':"",intarget:false};

                        case 'jsext_event_targethead':
                            this.event_count[hatdata.opcode]=(this.event_count[hatdata.opcode]??0)+1;
                            return {'line':'code','eventid':"",'count':this.event_count[hatdata.opcode],'funname':"",intarget:true};

                        case 'jsext_js_fun':
                            var funtype=this.gfield(hatdata,"funtype",blocks,vars,3)[0];
                            var place=this.gfield(hatdata,"place",blocks,vars,3)[0];
                            var funname=this.ginput(irlist.hat,"funname",blocks,vars,3,opt);
                            return {'line':'jsfun','eventid':"",'count':this.event_count[hatdata.opcode],'funname':this.tonotstr(funname.v),'isgen':funtype=="generator",'isglobal':place=="global"};

                        case 'jsext_js_class':
                            var place=this.gfield(hatdata,"place",blocks,vars,3)[0];
                            var classname=this.ginput(irlist.hat,"classname",blocks,vars,3,opt);
                            return {'line':'jsclass','classname':this.tonotstr(classname.v),'intarget':place=="this"}

                        default:
                            console.log(hatdata);
                            console.error("不支持的hat:"+hatdata.opcode);
                            process.exit(1);
                    }

                    default:
                        console.error("不支持的hatir op:"+irlist.op);
                        process.exit(1);

                case 'line':
                    switch(irlist.opcode){
                        //设计再读一遍opcode是为了如果有yield语句需求的话 就可以在JLAI(js lines array ir)里面好判断是否插入 取决于warp模式是否开启
                        case 'procedures_call':
                            var callblock=irlist.js;
                            var callargdata=callblock.arg;
                            var callstrargs=[];
                            var str_args='';
                            for (const argin of callargdata){
                                callstrargs.push(argin.value);
                            }
                            str_args=callstrargs.join(",");
                            //在最后一层JLAI(js lines array ir)转string js里面 再考虑加不加yield* 这一层只是全部转JLAI 最后一层就不需要那么麻烦的传参了
                            var fun_code=`${callblock.call}(${str_args});`;
                            return {'line':'call','warp':callblock.warp,'js':fun_code,'funname':callblock.call};

                        case "control_wait_until":
                            return {"line":"wait_until","js":irlist.js}

                        default:
                            return {'line':'normal',js:irlist.js};//完全不需要插入yield或者yield*的乘代码:)
                }
                case "fork":
                    var forkhead=irlist.head;
                    
                    console.log(`\x1b[33m>>>进入层${depth}:${irlist.data.opcode}头部:${irlist.head}\x1b[0m`);
                    var forkjs=this.genjs(irlist.child,blocks,vars,depth+1,forkhead,targetname,{
                        "isfork":true,
                        "head":forkhead,
                        "yield":irlist.yield,
                        "patch":irlist.patch
                    })
                    console.log(`\x1b[33m<<<结束层${depth}:${irlist.data.opcode}\x1b[0m yield:${irlist}`);
                    return {'line':'fork','js':forkjs};
            }
    }

    genjs(ircode,blocks,vars,depth,head,targetname,opt={}){
        
        let lines=[];
        if (opt.isfork){
            lines.push({'line':'forknormal',"js":opt.head+`{ //第${depth}层`});
        }
        for (const irlist of ircode){
            //console.log(irlist);
            var ret=this.doir(irlist,blocks,vars,depth,head,targetname,opt);
            //if (!opt.isfork)
            if (ret.line!='fork')
                console.log(ret);
            lines.push(ret);
        }
        if (opt.isfork){
            if (opt.yield){
                lines.push({'line':'forkyield',"js":`    yield null;`});
            }
            //console.log(opt);
            if (opt.patch){
                lines.push({'line':'forknormal',"js":`${opt.patch} //第${depth}层`});
            }else{
                lines.push({'line':'forknormal',"js":`} //第${depth}层`});
            }

        }
        if (!(opt.isfork)){
            return {
                "lines":lines,
                "broadcasts":this.broadcasts
            };
        }else{
            return lines;
        }
        
    }


}

export default jsgen;
