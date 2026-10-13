
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
            
        }
    }
    op(opcode){
        switch(opcode){

            case 'debug_console':
                return {
                    js: function(args) {
                        return `console.${args.Action}(${args.Input.v});`;
                    },
                    args: [
                        genarg("Input", Type.Object, true),
                        genarg("Action", Type.String, false)
                    ]
                };

            case 'debug_debuggerpoint':
                return {
                    js: function(args) {
                        return `debugger;`;
                    },
                    args: [
                    ]
                };


        }
    }
}
module.exports=new ext();