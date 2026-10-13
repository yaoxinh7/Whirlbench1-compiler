
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
            case 'curveplayer_playsec':
                return{
                    js:function(args){
                        const lines=[];
                        const patchLines=[];
                        lines.push('var _ptimer=new runtime.WTimmer();');
                        lines.push('_ptimer.start();');
                        lines.push(`while(_ptimer.time<${args.Time.v})`);
                        patchLines.push(`    ${tonotstr(args.Var.v)}=${args.Player.v}.getX(Math.max(0,Math.min(1,_ptimer.time/${args.Time.v})));`);
                        patchLines.push(`    yield null;`);
                        patchLines.push(`}`);
                        return {
                            js:lines.join('\n'),
                            patch:patchLines.join('\n')
                        }
                    },
                    args:[
                        genarg("Player", Type.String, true),
                        genarg("Time", Type.Number, true),
                        genarg("Var", Type.Any, true),
                    ]
                }
        }
    }


    reporter(opcode){
        switch(opcode){
            case 'curveplayer_newplayer':
                return {
                    js: function(args) {
                        return { v: `new runtime.CurvePlayer()`, t: Type.Object };
                    },
                    args: [
                    ]
                };

            case 'curveplayer_gencurve':
                return {
                    js: function(args) {
                        return { v: `runtime.EasingGenerator.generate('${args.Mod}','${args.Ease}',20)`, t: Type.Object };
                    },
                    args: [
                        genarg("Mod", Type.String, false),
                        genarg("Ease", Type.String, false),
                    ]
                };
        }
    }
    op(opcode){
        switch(opcode){

            case 'curveplayer_playermethod':
                return {
                    js: function(args) {
                        return `${tonotstr(args.Player.v)}.${tonotstr(args.Method)}(${args.Input.v})`;
                    },
                    args: [
                        genarg("Player", Type.Object, true),
                        genarg("Method", Type.String, false),
                        genarg("Input", Type.Any, true),
                    ]
                };



        }
    }
}
module.exports=new ext();