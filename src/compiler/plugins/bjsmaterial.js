
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
            case 'babylonjsmaterial_menu_SKYKEYS':
                return{
                    js(args){
                        return {v:`${args.SKYKEYS}`,t:Type.String};
                    },
                    args:[
                        genarg("SKYKEYS",Type.Any,false),
                    ]
                    
                }

            case 'babylonjsmaterial_bjs_sky_key':
                return{
                    js(args){
                        return {v:`${args.KEY.v}`,t:Type.String};
                    },
                    args:[
                        genarg("KEY",Type.Any,true),
                    ]
                    
                }

            case 'babylonjsmaterial_menu_MATKIND':
                return{
                    js(args){
                        return {v:`${args.MATKIND}`,t:Type.String};
                    },
                    args:[
                        genarg("MATKIND",Type.Any,false),
                    ]
                    
                }

            case 'babylonjsmaterial_menu_WATERKEY':
                return{
                    js(args){
                        return {v:`${args.WATERKEY}`,t:Type.String};
                    },
                    args:[
                        genarg("WATERKEY",Type.Any,false),
                    ]
                    
                }

            case 'babylonjsmaterial_bjs_create_czmat':
                return{
                    js(args){
                        return {v:`new MATERIALS.${args.MATKIND.v}(${args.NAME.v},scene)`,t:Type.String};
                    },
                    args:[
                        genarg("MATKIND",Type.Any,true),
                        genarg("NAME",Type.Any,true),
                    ]
                    
                }

            case 'babylonjsmaterial_bjs_tex':
                return{
                    js(args){
                        return {v:`new BABYLON.Texture(${args.TEX.v},scene)`,t:Type.Object};
                    },
                    args:[
                        genarg("TEX",Type.Any,true),
                    ]
                    
                }

            case 'babylonjsmaterial_bjs_water_key':
                return{
                    js(args){
                        return {v:`${args.KEY.v}`,t:Type.String};
                    },
                    args:[
                        genarg("KEY",Type.Any,true),
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