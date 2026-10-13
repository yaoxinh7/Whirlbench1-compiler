

class type{


    STRONG_NUMBER=true;



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
        let vartype=typeof(input[1]);
        console.log(input);
        if (vartype == "object"){
            //传参2情况或者数字文本情况
            if (input[1]){
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
            }
        }else{
            //传参情况'
            return 3;
        }

    }

    input_value(input,mod){
        switch(mod){
            case undefined:
                mod=this.input_mod(input);
                //console.log(mod);
                if (mod !== undefined){
                    
                    return this.input_value(input,mod);
                }
            case 1:
                if (!input[1]){
                    return 0;
                }
                return Number(input[1][1]);
            case 2:
                if (!input[1]){
                    return "";
                }
                return input[1][1];
            case 3:
                if (!input[1]){
                    return "";
                }
                return input[1];
            case 4:
                if (!input[1]){
                    return "";
                }
                return input[1][2];

        }
    }

    top_type(block,blocks,vars,ind,step_hat){
        let blockinput=Object.values(block.inputs)[ind];
        let blockop;
        
        //console.log("sure"+JSON.stringify(blockinput));
        blockinput=this.input_value(blockinput);//IqyZF#=Xh,yn;FINB:4e_avgblock
        //console.log("sure"+(blockinput)+typeof(blockinput));
        //console.log(blockinput+"_avgname");
        if (typeof(blockinput) == "string"){
            var inptype;
            //console.log(blockinput);
            if (blockinput in vars['common']){
                //变量情况
                inptype=vars['common'][blockinput].type;
                switch(inptype){
                    case "text":
                        return 2;
                    case "number":
                    case "empty":
                        return 1;
                }
            }else if(blockinput+"_list" in vars['common']){
                //列表情况
                inptype=vars['common'][blockinput].type;
                switch(inptype+"_list"){
                    case "text":
                        return 2;
                    case "number":
                    case "empty":
                        return 1;
                }
            }else if(!(blocks[blockinput] == undefined)){ 
                
            
            if(blocks[blockinput].opcode == "argument_reporter_string_number"){
                //参数情况
                
                let avgname=blocks[blockinput].fields.VALUE[0];

                //console.log("114514"+avgname);

                avgname=avgname+step_hat;
                let avgid=vars['common'][avgname];
                //console.log(avgid);
                if (avgid === undefined) {
                    console.warn("参数未找到:", avgname, "step_hat:", step_hat);
                    return 1; // 默认返回数字类型
                }
                avgid=avgid.id;

                
                blockinput=avgid;
                inptype=vars['common'][blockinput+"_avg"].type;
                switch(inptype){
                    case "text":
                        return 2;
                    case "number":
                    case "empty":
                        return 1;
                }
                return 1;
            }}else{
                //运算积木情况
                
                block=blocks[blockinput];
                if (block){
                    //console.log("sure"+JSON.stringify(blocks));
                    blockop=[blockinput].opcode;
                    //console.log(blocks[blockinput]);
                    blockinput=blocks[blockinput].inputs;
                    //console.log("sure"+JSON.stringify(blockinput));
                }else{
                    //直接情况
                    return 2;
                }

            }

            
        }else{
            return 0;
        }
        switch(blockop){
            case "argument_reporter_boolean": return 1;
            case "argument_reporter_string_number": 
                //console.log("114514");
                return 1;
            case "control_create_clone_of_menu": return 2;
            case "data_itemnumoflist": return 1;
            case "data_itemoflist": return 1;
            case "data_lengthoflist": return 1;
            case "data_listcontainsitem": return 1;
            case "data_listcontents": return 2;
            case "data_variable": return 1;
            case "event_broadcast_menu": return 2;
            case "looks_backdropnumbername": return 1;
            case "looks_backdrops": return 2;
            case "looks_costume": return 2;
            case "looks_costumenumbername": return 1;
            case "looks_size": return 1;
            case "motion_direction": return 1;
            case "motion_glideto_menu": return 2;
            case "motion_goto_menu": return 2;
            case "motion_pointtowards_menu": return 2;
            case "motion_xposition": return 1;
            case "motion_yposition": return 1;
            case "operator_add": return 1;
            case "operator_and": return 1;
            case "operator_contains": return 1;
            case "operator_divide": return 1;
            case "operator_equals": return 1;
            case "operator_gt": return 1;
            case "operator_join": return 1;
            case "operator_length": return 1;
            case "operator_letter_of": return 2;
            case "operator_lt": return 1;
            case "operator_mathop": return 1;
            case "operator_mod": return 1;
            case "operator_multiply": return 1;
            case "operator_not": return 1;
            case "operator_or": return 1;
            case "operator_random": return 1;
            case "operator_round": return 1;
            case "operator_subtract": return 1;
            case "sensing_answer": return 2;
            case "sensing_coloristouchingcolor": return 1;
            case "sensing_current": return 1;
            case "sensing_dayssince2000": return 1;
            case "sensing_distanceto": return 1;
            case "sensing_distancetomenu": return 2;
            case "sensing_keyoptions": return 1;
            case "sensing_keypressed": return 1;
            case "sensing_loud": return 1;
            case "sensing_loudness": return 1;
            case "sensing_mousedown": return 1;
            case "sensing_mousex": return 1;
            case "sensing_mousey": return 1;
            case "sensing_of": return 2;
            case "sensing_of_object_menu": return 2;
            case "sensing_setdragmode": return 2;
            case "sensing_timer": return 1;
            case "sensing_touchingcolor": return 1;
            case "sensing_touchingobject": return 1;
            case "sensing_touchingobjectmenu": return 2;
            case "sensing_userid": return 1;
            case "sensing_username": return 2;
            case "sound_volume": return 1;
        }
        //console.log(block.opcode);
        return 1
    }


    typefor(blocks,vars,block,step_hat){
        let varfield,vartest,varinput;

        switch (block.opcode){
        case "data_setvariableto":
            varfield=block.fields.VARIABLE[1];
            //console.log(target_name);
            vartest=vars['common'][varfield];
            if (vartest == undefined){
                return;
            }
            if ((vartest.type)=='text'){
                
                return;
            }

            //console.log(block.inputs.VALUE);
            varinput = this.input_mod(block.inputs.VALUE);
            

            //console.warn("变量"+vars['common'][varfield]['name']+"设为"+varinput);

            switch(varinput){
                case 1:
                    vars['common'][varfield]['type']='number';
                    break;
                case 2:
                    vars['common'][varfield]['type']='text';
                    break;
                case 3:
                case 4:
                    let input_type=this.top_type(block,blocks,vars,0,step_hat);
                    switch(input_type){
                        case 1:
                            vars['common'][varfield]['type']='number';
                            break;
                        case 2:
                            vars['common'][varfield]['type']='text';
                            break;
                    }
            }

            break;
        
        case "data_changevariableby":
            varfield=block.fields.VARIABLE[1];
            //console.log(target_name);
            vartest=vars['common'][varfield];
            if (vartest == undefined){
                return;
            }
            if (this.STRONG_NUMBER || vars['common'][varfield]['type']!=='text'){
                vars['common'][varfield]['type']='number';
            }
            break;

        case "data_insertatlist":
        case "data_replaceitemoflist":
            var listfield=block.fields.LIST[1]+"_list";
            
            var listtest=vars['common'][listfield];
            var datainput=block.inputs.INDEX;
            datainput = this.input_mod(datainput);
            //console.log(datainput);
            switch(datainput){
                case 1:
                    vars['common'][listfield]['type']='number';
                    break;
                case 2:
                    vars['common'][listfield]['type']='text';
                    break;
                case 3:
                case 4:
                    let input_type=this.top_type(block,blocks,vars,0,step_hat);
                    //console.log(input_type);
                    switch(input_type){
                        case 1:
                            vars['common'][listfield]['type']='number';
                            break;
                        case 2:
                            vars['common'][listfield]['type']='text';
                            break;
                    }
            }
            break;
        case 'data_addtolist':
            listfield=block.fields.LIST[1]+"_list";
            //console.log(target_name);
            listtest=vars['common'][listfield];
            datainput=block.inputs.ITEM;
            datainput = this.input_mod(datainput);
            switch(datainput){
                case 1:
                    vars['common'][listfield]['type']='number';
                    break;
                case 2:
                    console.log(listfield);
                    vars['common'][listfield]['type']='text';
                    break;
                case 3:
                case 4:
                    let input_type=this.top_type(block,blocks,vars,0,step_hat);
                    switch(input_type){
                        case 1:
                            vars['common'][listfield]['type']='number';
                            break;
                        case 2:
                            vars['common'][listfield]['type']='text';
                            break;
                    }
            }
            break;

        case "procedures_call":
            let custominput=block.inputs;
            let doavg=0;
            for (const avgid in custominput){
                //console.log(vars['common']);
                console.log("111"+avgid);
                
                let avgtype=vars['common'][avgid+"_avg"].type;
                if (avgtype=="text"){
                    continue;
                }
                let avginput=custominput[avgid];
                let avgctype=this.input_mod(avginput);
                //console.log(avginput);
                switch(avgctype){
                    case 1:
                        vars['common'][avgid+"_avg"].type="number";
                        break;
                    case 2:
                        vars['common'][avgid+"_avg"].type="text";
                        //console.log("   111!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                        break;
                    case 3:
                    case 4:
                        let avginput=this.top_type(block,blocks,vars,doavg,step_hat);
                        
                        switch(avginput){
                            case 1:
                                vars['common'][avgid+"_avg"]['type']='number';
                                break;
                            case 2:
                                vars['common'][avgid+"_avg"]['type']='text';
                                break;
                    }
                }
                doavg++;
            }



        }


    }
}
export default type;