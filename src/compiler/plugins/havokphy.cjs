
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
            case 'babylonjsphysics_menu_BODYPROP':
                return{
                    js(args){
                        return {v:`${args.BODYPROP}`,t:Type.String};
                    },
                    args:[
                        genarg("BODYPROP",Type.Any,false),
                    ]
                    
                }
                
            case 'babylonjsphysics_menu_MOTIONTYPE':
                return{
                    js(args){
                        return {"v":`(BABYLON.${args.MOTIONTYPE})`,t:Type.Number};
                    },
                    args:[
                        genarg("MOTIONTYPE",Type.Object,false),
                    ]
                }

            case 'babylonjsphysics_menu_RAYRESULT':
                return{
                    js(args){
                        return {"v":`${args.RAYRESULT}`,t:Type.Number};
                    },
                    args:[
                        genarg("RAYRESULT",Type.Object,false),
                    ]
                }

            case 'babylonjsphysics_menu_APPLYTYPE':
                return{
                    js(args){
                        return {"v":`${args.APPLYTYPE}`,t:Type.String};
                    },
                    args:[
                        genarg("APPLYTYPE",Type.Object,false),
                    ]
                }

            case 'babylonjsphysics_menu_ContorllerKeys':
                return{
                    js(args){
                        return {"v":`${args.ContorllerKeys}`,t:Type.String};
                    },
                    args:[
                        genarg("ContorllerKeys",Type.Object,false),
                    ]
                }

            case 'babylonjsphysics_menu_ContorllerMethmods':
                return{
                    js(args){
                        return {"v":`${args.ContorllerMethmods}`,t:Type.String};
                    },
                    args:[
                        genarg("ContorllerMethmods",Type.Object,false),
                    ]
                }
                

            case 'babylonjsphysics_bjs_get_havok_shape_mesh':
                return{
                    js(args){
                        return {"v":`(new BABYLON.PhysicsShapeMesh(${tonotstr(args.MESH.v)},scene))`,t:Type.Object};
                    },
                    args:[
                        genarg("MESH",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_get_havok_shape_sphere':
                return{
                    js(args){
                        return {"v":`(new BABYLON.PhysicsShapeSphere(${args.CENTER.v},${args.RADIUS.v},scene))`,t:Type.Object};
                    },
                    args:[
                        genarg("CENTER",Type.Object,true),
                        genarg("RADIUS",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_get_havok_shape_box':
                return{
                    js(args){
                        return {"v":`(new BABYLON.PhysicsShapeBox(${args.CENTER.v},BABYLON.Quaternion.FromEulerVector(${args.ROTATION.v}),${args.EXTENTS.v},scene))`,t:Type.Object};
                    },
                    args:[
                        genarg("CENTER",Type.Object,true),
                        genarg("ROTATION",Type.Object,true),
                        genarg("EXTENTS",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_create_physics_body':
                return{
                    js(args){
                        return {"v":`createphybody(${tonotstr(args.MESH.v)},${args.SHAPE.v},${args.MOTIONTYPE.v},${args.MASS.v},${args.POSITION.v})`,t:Type.Object}
                    },
                    args:[
                        genarg("MESH",Type.Object,true),
                        genarg("SHAPE",Type.Object,true),
                        genarg("MOTIONTYPE",Type.Object,true),
                        genarg("MASS",Type.Number,true),
                        genarg("POSITION",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_havok_raycast_option':
                return{
                    js(args){
                        return {"v":`{collideWith:${args.collisionMask.v},shouldHitTriggers:${args.skipBoundingBox.v},fastCheck:${args.fastCheck.v}}`,"t":Type.Object}
                    },
                    args:[
                        genarg("collisionMask",Type.Number,true),
                        genarg("skipBoundingBox",Type.Number,true),
                        genarg("fastCheck",Type.Number,true),
                    ]
                }

            case 'babylonjsphysics_bjs_raycastToPoint':
                return{
                    js(args){
                        return {"v":`${tonotstr(args.PhysicsEngine.v)}.raycast(${args.FROM.v},${args.TO.v},${args.OPTION.v})`,"t":Type.Object}
                    },
                    args:[
                        genarg("PhysicsEngine",Type.Object,true),
                        genarg("TO",Type.Object,true),
                        genarg("FROM",Type.Object,true),
                        genarg("OPTION",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_raycastToPointToRef':
                return{
                    js(args){
                        return {"v":`${tonotstr(args.PhysicsEngine.v)}.raycastToRef(${args.FROM.v},${args.TO.v},${tonotstr(args.Objname.v)},0xFFFFFFFF,${args.queryCollideWith.v})`,"t":Type.Object}
                    },
                    args:[
                        genarg("PhysicsEngine",Type.Object,true),
                        genarg("TO",Type.Object,true),
                        genarg("FROM",Type.Object,true),
                        genarg("queryCollideWith",Type.Object,true),
                        genarg("Objname",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_getPhysicsEngine':
                return{
                    js(args){
                        return {"v":`scene.getPhysicsEngine()`,"t":Type.Object}
                    },
                    args:[
                    ]
                }

            case 'babylonjsphysics_bjs_result_raycast':
                return{
                    js(args){
                        return {"v":`${tonotstr(args.PhysicsRaycastResult.v)}.${args.RAYRESULT.v}`,"t":Type.Object}
                    },
                    args:[
                        genarg("PhysicsRaycastResult",Type.Object,true),
                        genarg("RAYRESULT",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_newPhysicsRaycastResult':
                return{
                    js(args){
                        return {"v":`new BABYLON.PhysicsRaycastResult()`,"t":Type.Object}
                    },
                    args:[
                    ]
                }

            case 'babylonjsphysics_bjs_contorller':
                return{
                    js(args){
                        return {"v":`new BABYLON.PhysicsCharacterController(${args.Vec3.v},{capsuleHeight:${args.High.v},capsuleRadius:${args.Radius.v}},scene)`,"t":Type.Object}
                    },
                    args:[
                        genarg("Vec3",Type.Object,true),
                        genarg("High",Type.Object,true),
                        genarg("Radius",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_Contorller_Methods':
                return{
                    js(args){
                        return {"v":`${args.Contorller.v}.${args.Method.v}`,"t":Type.Object}
                    },
                    args:[
                        genarg("Contorller",Type.Object,true),
                        genarg("Method",Type.Object,true),
                    ]
                }

            case 'babylonjsphysics_bjs_Contorller_Methods_copy':
                return{
                    js(args){
                        return {"v":`${args.Contorller.v}.${args.Key.v}`,"t":Type.Object}
                    },
                    args:[
                        genarg("Contorller",Type.Object,true),
                        genarg("Key",Type.Object,true),
                    ]
                }
        }
    }
    op(opcode){
        switch(opcode){

            case 'babylonjsphysics_bjs_apply_force':
                return{
                    js(args){
                        return `${tonotstr(args.BODY.v)}.${tonotstr(args.APPLYTYPE.v)}(${args.FVEC3.v},${args.POINT.v});`
                    },
                    args:[
                        genarg("BODY",Type.Object,true),
                        genarg("APPLYTYPE",Type.String,true),
                        genarg("FVEC3",Type.Object,true),
                        genarg("POINT",Type.Object,true),
                    ]
                    
                }
            

            case 'babylonjsphysics_bjs_body_set_property':
                return{
                    js(args){
                        return `${tonotstr(args.BODY.v)}.${args.PROP.v}=${args.VALUE.v};`
                    },
                    args:[
                        genarg("BODY",Type.Any,true),
                        genarg("PROP",Type.Any,true),
                        genarg("VALUE",Type.Any,true),
                    ]
                    
                }

            case 'babylonjsphysics_bjs_phy_init':
                //console.log(111);
                return{
                    js(args){
                        
                        let lines=[];
                        lines.push(`const havokInstance=yield HavokPhysics()`);
                        lines.push(`let hk=new BABYLON.HavokPlugin(true, havokInstance);`);
                        lines.push(`scene.enablePhysics(${tonotstr(args.VEC3.v)}, hk);`);
                        return lines.join("\n");
                    },
                    args:[
                        genarg("VEC3",Type.Any,true),
                    ]
                    
                }

            case 'babylonjsphysics_bjs_transform_body_pos':
                return{
                    js(args){
                        return `teleportPhysicsBody(${tonotstr(args.BODY.v)},${tonotstr(args.VEC3.v)}.x,${tonotstr(args.VEC3.v)}.y,${tonotstr(args.VEC3.v)}.z)`;
                    },
                    args:[
                        genarg("BODY",Type.Any,true),
                        genarg("VEC3",Type.Any,true),
                    ]
                    
                }
        }
    }
}
module.exports=new ext();