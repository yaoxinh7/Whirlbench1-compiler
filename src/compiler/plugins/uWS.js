
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
    forkop(opcode){
        switch(opcode){
            case 'wsserver_httprouter':
                return{
                    js:function(args){
                        return {
                            js:`${tonotstr(args.App.v)}.${tonotstr(args.method)}(${args.URL.v},(res,req) => `,
                            patch:`})`
                        }
                    },
                    args:[
                        genarg("App", Type.Object, true),
                        genarg("URL", Type.String, true),
                        genarg("method", Type.String, false),
                    ]
                }

            case 'wsserver_appmethod':
                return{
                    js:function(args){
                        return {
                            js:`${tonotstr(args.App.v)}.ws(${args.pattern.v},`,
                            patch:`})`
                        }
                    },
                    args:[
                        genarg("App", Type.Object, true),
                        genarg("pattern", Type.String, true),
                        genarg("context", Type.Any, true),
                    ]
                }

            case 'wsserver_wsbehavior':
                return{
                    js:function(args){
                        let avgPatch='';
                        switch(args.method.v){
                            case 'open':
                                avgPatch='ws';
                                break;
                            case 'message':
                                avgPatch='ws,message,isBinary';
                                break;
                            case 'drain':
                                avgPatch='ws';
                                break;
                            case 'ping':
                                avgPatch='ws,message';
                                break;
                            case 'pong':
                                avgPatch='ws,message';
                                break;
                            case 'upgrade':
                                avgPatch='res,req,context';
                                break;
                        }
                        return {
                            js:`${tonotstr(args.method.v)}:(${avgPatch})=>`,
                            patch:`},`
                        }
                    },
                    args:[
                        genarg("method", Type.String, true),
                    ]
                }
        }
    }
    reporter(opcode){
        switch(opcode){

            case 'wsserver_menu_WsBehavior':
                return{
                    js(args){
                        return {v:`${args.WsBehavior}`,t:Type.String};
                    },
                    args:[
                        genarg("WsBehavior", Type.String, false),
                    ]    
                }

            case 'wsserver_menu_wsMethods':
                return{
                    js(args){
                        return {v:`${args.wsMethods}`,t:Type.String};
                    },
                    args:[
                        genarg("wsMethods", Type.String, false),
                    ]    
                }

            case 'wsserver_uws_app':
                return{
                    js(args){
                        return {v:`uWS.App()`,t:Type.Object};
                    },
                    args:[
                    ]    
                }

            case 'wsserver_ws_method':
                return{
                    js(args){
                        return {v:`${tonotstr(args.WsObj.v)}.${tonotstr(args.Method.v)}(${args.Input.v})`,t:Type.Any};
                    },
                    args:[
                        genarg("WsObj", Type.Object, true),
                        genarg("Method", Type.String, true),
                        genarg("Input", Type.Any, true),
                    ]
                    
                }

            case 'wsserver_resobjk':
                return{
                    js(args){
                        return {v:`${tonotstr(args.resobj.v)}.${tonotstr(args.method)}(${args.input.v})`,t:Type.Object};
                    },
                    args:[
                        genarg("resobj", Type.Object, true),
                        genarg("input", Type.Any, true),
                        genarg("method", Type.String, false),
                    ]
                    
                }

            case 'wsserver_reqobjk':
                return{
                    js(args){
                        return {v:`${tonotstr(args.reqobj.v)}.${tonotstr(args.method)}(${args.input.v})`,t:Type.Object};
                    },
                    args:[
                        genarg("reqobj", Type.Object, true),
                        genarg("input", Type.Any, true),
                        genarg("method", Type.String, false),
                    ]
                    
                }

            case 'wsserver_appkeys':
                return{
                    js(args){
                        return {v:`${tonotstr(args.App.v)}.${tonotstr(args.Method)}(${args.Input.v})`,t:Type.Object};
                    },
                    args:[
                        genarg("App", Type.Object, true),
                        genarg("Method", Type.String, false),
                        genarg("Input", Type.String, true),
                    ]
                    
                }
        }
    }
    op(opcode){
        switch(opcode){
            


            case 'wsserver_resupgrade':
                return{
                    js(args){
                        return `${tonotstr(args.Resobj.v)}.upgrade(${tonotstr(args.userData.v)},req.getHeader('sec-websocket-key'),req.getHeader('sec-websocket-protocol'),req.getHeader('sec-websocket-extensions'),context);`
                        
                    },
                    args:[
                        genarg("Resobj",Type.Object,true),
                        genarg("userData",Type.Object,true),
                    ]
                    
                }


        }
    }
}
module.exports=new ext();