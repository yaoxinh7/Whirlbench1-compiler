
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
            case 'babylonjsstage_bjs_vec3':
                return{
                    js(args){
                        return {"v":`(new BABYLON.Vector3(${args.X.v},${args.Y.v},${args.Z.v}))`,"t":Type.Object}
                    },
                    args:[
                        genarg("X",Type.Number,true),
                        genarg("Y",Type.Number,true),
                        genarg("Z",Type.Number,true),
                    ]
                }

            case 'babylonjsstage_bjs_quaternion':
                return{
                    js(args){
                        return {"v":`(new BABYLON.Quaternion(${args.X.v},${args.Y.v},${args.Z.v},${args.W.v}))`,"t":Type.Object}
                    },
                    args:[
                        genarg("X",Type.Number,true),
                        genarg("Y",Type.Number,true),
                        genarg("Z",Type.Number,true),
                        genarg("W",Type.Number,true),
                    ]
                }

            case 'babylonjsstage_bjs_vec2':
                return{
                    js(args){
                        return {"v":`(new BABYLON.Vector2(${args.X.v},${args.Y.v}))`,"t":Type.Object}
                    },
                    args:[
                        genarg("X",Type.Number,true),
                        genarg("Y",Type.Number,true),
                    ]
                }

            case 'babylonjsstage_bjs_radfromangel':
                return{
                    js(args){
                        return {"v":`((${args.Angel.v})/180*Math.PI)`,"t":Type.Number}
                    },
                    args:[
                        genarg("Angel",Type.Number,true),
                    ]
                }

            case 'babylonjsstage_bjs_radtoangel':
                return{
                    js(args){
                        return {"v":`((${args.Rad.v})*180/Math.PI)`,"t":Type.Number}
                    },
                    args:[
                        genarg("Rad",Type.Number,true),
                    ]
                }

            case 'json_json_genjs':
                return{
                    js(args){
                        return {"v":`${args.Key.v}:${args.Value.v},`,"t":Type.Number}
                    },
                    args:[
                        genarg("Key",Type.Any,true),
                        genarg("Value",Type.Any,true),
                    ]
                }
            
            
        }
    }
    op(opcode){
        switch(opcode){
            case 'babylonjsstage_bjs_dispose_obj':
                return{
                    js(args){
                        return `${tonotstr(args.OBJ.v)}.dispose();`;
                    },
                    args:[
                        genarg("OBJ",Type.Number,true),
                    ]
                }

            case 'babylonjsstage_bjs_moveyxd':
                return{
                    js(args){
                        return `computeForwardYX(${args.YROT.v},${args.XROT.v},${args.DEG.v},${args.VEC3.v})`;
                    },
                    args:[
                        genarg("DEG",Type.Number,true),
                        genarg("YROT",Type.Object,true),
                        genarg("XROT",Type.Object,true),
                        genarg("VEC3",Type.Object,true),
                    ]
                }

            case 'babylonjsstage_bjs_normalize':
                return{
                    js(args){
                        return `${args.Vec3.v}.normalize();`
                    },
                    args:[
                        genarg("Vec3",Type.Object,true),
                    ]
                }

            case 'babylonjsstage_bjs_directiontoyawpitch':
                return{
                    js(args){
                        return `directionToYawPitch(${args.Vec3.v},${args.Vec2.v});`
                    },
                    args:[
                        genarg("Vec3",Type.Object,true),
                        genarg("Vec2",Type.Object,true),
                    ]
                }


        }
    }
}
module.exports=new ext();