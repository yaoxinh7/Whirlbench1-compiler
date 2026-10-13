
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
            case 'json_menu_TypedArrayKeys':
                return{
                    js(args){
                        return {v:`${tonotstr(args.TypedArrayKeys)}`,t:Type.Any};
                    },
                    args:[
                        genarg("TypedArrayKeys",Type.String,false),
                    ]
                    
                }

            case 'json_json_getkey':
                return{
                    js(args){
                        return {v:`${tonotstr(args.OBJNAME.v)}.${tonotstr(args.KEYNAME.v)}`,t:Type.Any};
                    },
                    args:[
                        genarg("OBJNAME",Type.Any,true),
                        genarg("KEYNAME",Type.Any,true),
                    ]
                    
                }

            case 'json_json_genjs_copy':
                return{
                    js(args){
                        return {v:`{${tonotstr(args.Nr.v)}}`,t:Type.Any};
                    },
                    args:[
                        genarg("Nr",Type.Any,true),
                    ]
                    
                }

            case 'json_type_typedarray':
                return{
                    js(args){
                        return {v:`new ${tonotstr(args.ArrayType)}(${tonotstr(args.INPUT.v)})`,t:Type.Object};
                    },
                    args:[
                        genarg("INPUT",Type.Any,true),
                        genarg("ArrayType",Type.String,false),
                    ]
                }

            case 'json_typedarraykeys':
                return{
                    js(args){
                        return {v:`${tonotstr(args.obj.v)}.${tonotstr(args.Key.v)}`,t:Type.Any};
                    },
                    args:[
                        genarg("obj",Type.Any,true),
                        genarg("Key",Type.String,true),
                    ]
                    
                }
        }
    }
    op(opcode){
        switch(opcode){
            

            case 'json_json_setkey':
                return{
                    js(args){
                        return `${tonotstr(args.OBJNAME.v)}.${tonotstr(args.KEYNAME.v)}=${args.VALUE.v};`
                    },
                    args:[
                        genarg("OBJNAME",Type.Any,true),
                        genarg("KEYNAME",Type.Any,true),
                        genarg("VALUE",Type.Any,true),
                    ]
                    
                }


        }
    }
}
module.exports=new ext();