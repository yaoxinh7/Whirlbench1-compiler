
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
            case 'jsext_js_report_concat':
                return{
                    js(args){
                        return {v:`${tonotstr(args.JSCODE.v)}${tonotstr(args.JSCODE2.v)}`,t:Type.Any};
                    },
                    args:[
                        genarg("JSCODE",Type.Any,true),
                        genarg("JSCODE2",Type.Any,true),
                    ]
                    
                }
            
            case 'jsext_jsext_kuohao':
                return{
                    js(args){
                        return {v:`(${tonotstr(args.Nr.v)})`,t:Type.Any};
                    },
                    args:[
                        genarg("Nr",Type.Any,true),
                    ]
                    
                }

            case 'jsext_jsext_Item':
                return{
                    js(args){
                        return {v:`${tonotstr(args.Item.v)},${tonotstr(args.Item2.v)}`,t:Type.Any};
                    },
                    args:[
                        genarg("Item",Type.Any,true),
                        genarg("Item2",Type.Any,true),
                    ]
                    
                }

            case 'jsext_jsext_await':
                return{
                    js(args){
                        return {v:`yield ${args.Promise.v}`,t:Type.Any};
                    },
                    args:[
                        genarg("Promise",Type.Any,true),
                    ]
                    
                }

            case 'jsext_jsext_do':
                return{
                    js(args){
                        return {v:`${tonotstr(args.Method.v)}(${tonotstr(args.Nr.v)})`,t:Type.Any};
                    },
                    args:[
                        genarg("Method",Type.Any,true),
                        genarg("Nr",Type.Any,true),
                    ]
                    
                }


            case 'jsext_jsext_createurl':
                return{
                    js(args){
                        return {v:`URL.createObjectURL(${tonotstr(args.Blob.v)})`,t:Type.Any};
                    },
                    args:[
                        genarg("Blob",Type.Object,true),
                    ]
                    
                }

            case 'jsext_jsext_dxmethmod':
                return{
                    js(args){
                        return {v:`${tonotstr(args.DX.v)}.${tonotstr(args.SX.v)}(${tonotstr(args.INPUT.v)})`,t:Type.Any};
                    },
                    args:[
                        genarg("DX",Type.Any,true),
                        genarg("SX",Type.Any,true),
                        genarg("INPUT",Type.Any,true),
                    ]
                    
                }
        }
    }
    op(opcode){
        switch(opcode){
            


        }
    }
}
module.exports=new ext();