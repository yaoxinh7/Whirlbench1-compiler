class Runtime{
    constructor(){
        this.isDebug=false;
        this.logs=[];
        this.warns=[];
        this.errors=[];
        this.mode='normal';
        this.settings={};
        this.plugins=[];
    }
    enableDebug(){
        this.isDebug=true;
    }
    log(msg,level){
        this[level].push({
            [Date.now()]:msg
        });
    }
    setMode(Mode){
        this.mode=Mode;
    }
}

export default new Runtime();