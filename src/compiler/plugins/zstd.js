
function tonotstr(str) {
    if (typeof str === 'string' && str.startsWith('"') && str.endsWith('"')) {
        return str.slice(1, -1).replaceAll("\\\"","\"");
    }
    return str;
}
class Types{
    constructor(){
        this.Number=1;
        this.String=2;
        this.Any=3;
        this.Empty=4;
        this.Object=5;
    }
}

function genarg(key,type,isinput=false){
    return {
        key:key,
        expectType:type,
        isinput:isinput
    }
}

const Type=new Types();
class ext{
    reporter(opcode){
        switch(opcode){

            case 'zstd_menu_Methods':
                return{
                    js(args){
                        return {v:`${tonotstr(args.Methods)}`,t:Type.Object};
                    },
                    args:[
                        genarg("Methods",Type.String,false),
                    ]    
                }

            case 'zstd_methods':
                return{
                    js(args){
                        //console.log(args);
                        //process.exit()
                        return {v:`_zstdlib.${tonotstr(args.Method.v)}(${tonotstr(args.Input.v)})`,t:Type.Object};
                    },
                    args:[
                        genarg("Input",Type.Any,true),
                        genarg("Method",Type.String,true),
                    ]    
                }

   
        }
    }
    op(opcode){
        switch(opcode){
            


            case '-pointerlock_point_lockunlock':
                return{
                    js(args){
                        if (args.LOCK.v){
                            return `lockPointer();`
                        }else{
                            return `unlockPointer();`
                        }
                        
                    },
                    args:[
                        genarg("LOCK",Type.Any,true),
                    ]
                    
                }


        }
    }
}
module.exports=new ext();