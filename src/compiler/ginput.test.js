const Jsgen=require("./jsgen.js");

let fail=0;
let total=0;
let test=function(name,fn){
    total++;
    try{
        fn();
        console.log("PASS",name);
    }catch(e){
        fail++;
        console.log("FAIL",name);
        console.log(String(e&&e.stack||e));
    }
}

let j=new Jsgen();

let blocks={
    ",":{
        opcode:"control_if_else",
        inputs:{
            CONDITION:[2,"cond"]
        },
        fields:{}
    },
    "cond":{
        opcode:"operator_equals",
        inputs:{
            OPERAND1:[1,[10,"1"]],
            OPERAND2:[1,[10,"1"]]
        },
        fields:{}
    },
    "anw":{
        opcode:"operator_join",
        inputs:{
            STRING1:[1,[10,"A"]],
            STRING2:[1,[10,"B"]]
        },
        fields:{}
    }
};

let vars={common:{}};

test("text input 不应因 block id 重名被当作 reporter",function(){
    let oldexit=process.exit;
    process.exit=function(code){
        throw new Error("process.exit:"+code);
    };
    try{
        let ret=j.geninputjs(blocks,[1,[10,","]],vars,2,{});
        if (ret.v!="\",\"" || ret.t!=2){
            throw new Error("unexpected ret:"+JSON.stringify(ret));
        }
    }finally{
        process.exit=oldexit;
    }
});

test("block input 应按 block id 继续递归解析",function(){
    let ret=j.geninputjs(blocks,[3,"anw",[10,""]],vars,2,{});
    if (ret.v!="runtime.strconcat(\"A\",\"B\")" || ret.t!=2){
        throw new Error("unexpected ret:"+JSON.stringify(ret));
    }
});

if (fail>0){
    console.log("RESULT",fail+"/"+total);
    process.exit(1);
}
console.log("RESULT 0/"+total);
