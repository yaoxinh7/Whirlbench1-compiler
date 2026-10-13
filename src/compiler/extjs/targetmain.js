
disposed=false;

function* movetoms(x, y, duration) {
    var startX = this.xpos;
    var startY = this.ypos;
    var begint = Date.now();
    var endTime = begint + duration;
    var currentTime;
    var upx=startX,upy=startY;
    while ((currentTime = Date.now()) < endTime) {
        var progress = (currentTime - begint) / duration;
        this.xpos = startX + (x - startX) * progress;
        this.ypos = startY + (y - startY) * progress;
        if (pendown){
            stage.drawLine(upx,upy,this.xpos,this.ypos);
        }
        upx=this.xpos;
        upy=this.ypos;
        yield null;
    }
    this.xpos = x;
    this.ypos = y;
}




function init(father){
    this.isremove=false;
    //console.log(this.custom_files[this.custom], this.xpos, this.ypos, this.direction, this.size,this.rotcxs[this.custom],this.rotcys[this.custom])
    if (this.isSprite){
        this.tardx=stage.createSprite("./assets/"+this.custom_files[this.custom], this.xpos, this.ypos, this.direction, this.size,this.rotcxs[this.custom],this.rotcys[this.custom]);
    }else{
        this.tardx=stage.createSprite("./assets/"+custom_files[this.custom], xpos, ypos, direction, size,rotcxs[this.custom],rotcys[this.custom]);
    }

    if (this.isClone){
        this.fatherTar=father;
    }else{
        this.childNum=0;
    }

    this.tasks={};

    

    return this.tardx;
}






function update(){
    this.tardx.x=this.xpos;
    this.tardx.y=this.ypos;
    this.tardx.size=this.size;
    this.tardx.direction=this.direction;
    this.tardx.visible=this.visible;
    this.tardx.ghost=this.GHOST;
}


function dispose(){
    if (this.disposed || (!this.isClone)) return;
    //console.log(this);
    if (this.tasks){
        for (const taskn in this.tasks){
            const task=this.tasks[taskn];
            task.dispose();
        }
    }
    
    this.tasks=null;
    this.tardx=null;
    this.disposed=true;
}
