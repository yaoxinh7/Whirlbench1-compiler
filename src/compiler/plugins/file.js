
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
            case 'files_files_init':
                return{
                    js(args){
                        if (!(tonotstr(args.BasePath.v) === "")){
                            return {"v":`new runtime.file(${args.Path.v},{basePath:${args.BasePath.v}})`,"t":Type.Object}
                        }else{
                            return {"v":`new runtime.file(${args.Path.v})`,"t":Type.Object}
                        }
                        
                    },
                    args:[
                        genarg("Path",Type.String,true),
                        genarg("BasePath",Type.String,true),
                    ]
                }

            case 'files_menu_Method':
                return{
                    js(args){
                        return {"v":`${args.Method}`,t:Type.Any};
                    },
                    args:[
                        genarg("Method",Type.Object,false),
                    ]
                }

            case 'files_filemethod':
                return{
                    js(args){
                        return {"v":`${tonotstr(args.Obj.v)}.${args.Method.v}(${args.Items.v})`,t:Type.Any};
                    },
                    args:[
                        genarg("Obj",Type.Object,true),
                        genarg("Method",Type.String,true),
                        genarg("Items",Type.Any,true),
                    ]
                }

            case 'files_menu_Keys':
                return{
                    js(args){
                        return {"v":`${args.Method}`,t:Type.Any};
                    },
                    args:[
                        genarg("Keys",Type.Object,false),
                    ]
                }

            case 'files_filekey':
                return{
                    js(args){
                        return {"v":`${tonotstr(args.Obj.v)}.${args.Key.v}`,t:Type.Any};
                    },
                    args:[
                        genarg("Obj",Type.Object,true),
                        genarg("Key",Type.String,true),
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