NEO.Flag = function(obj){

    this.names = obj.names || [];
    this.currentName = '';

    this.type = 'flag';
    
    NEO.Proto.call( this, obj );

    // click
    this.f[2] = function(e){ this.addOnMouse(e); }.bind(this);
    this.f[3] = function(e){ this.onUp(e); }.bind(this);
    this.f[4] = function(e){ this.onMove(e); }.bind(this);
    this.f[5] = function(e){ this.onOver(e); }.bind(this);


    this.c[6].style.pointerEvents = 'none';
    this.c[5].style.pointerEvents = 'auto';

    this.c[5].onmousedown = this.f[2];
    this.c[5].onmouseup = this.f[3];
    this.c[5].onmousemove = this.f[4];
    this.c[5].onmouseover = this.f[5];

    this.init();

    //if(this.keys.length) this.addKeys();
}

NEO.Flag.prototype = Object.create( NEO.Proto.prototype );
NEO.Flag.prototype.constructor = NEO.Flag;



NEO.Flag.prototype.update = function(f){
    if(f==0) this.currentName = '';
    var active = false;
    if (this.keys.indexOf(f) > -1) active = true;

    if(active){ 
        this.c[5].style.background = 'rgba(86,175,178,0.3)';
        this.currentName = this.items[this.keys.indexOf(f)].name;
    }
    else{ 
        this.c[5].style.background = 'none';
    }

    this.callback(this.currentName);
    
};

NEO.Flag.prototype.addOnMouse = function(e){
    //console.log(e.target.name);
    if(e.target.name) if(e.target.name!=='track')return;

    var f = NEO.main.getFrameClick(e.clientX);
    this.mbutton = e.which;

    if (this.keys.indexOf(f) > -1) {
        if(this.mbutton == 1){
            this.drag = true;
            this.current = this.items[this.keys.indexOf(f)];
        }
        if(this.mbutton == 3) this.remove(f);
    } else {
        if(this.mbutton == 1){
            this.add(f);
            this.sort();
        }
        
    }
};

NEO.Flag.prototype.onOver = function(e){
    var f = NEO.main.getFrameClick(e.clientX);
    if (this.keys.indexOf(f) > -1) this.c[5].style.cursor = 'e-resize';
};

NEO.Flag.prototype.onUp = function(e){
    if(this.drag){ this.drag = false; this.sort(); this.c[5].style.cursor = 'pointer';}
};

NEO.Flag.prototype.onMove = function(e){
    var f = NEO.main.getFrameClick(e.clientX);
    if (this.keys.indexOf(f) > -1) this.c[5].style.cursor = 'e-resize';
    else this.c[5].style.cursor = 'pointer';

    if(this.drag){ 
        this.current.move(f);
        this.c[5].style.cursor = 'e-resize';
    }

};



// ------------------------------------------

NEO.KeyFlag = function(k, name){
    this.id = 0;
    this.name = name;
    var frameSize = NEO.main.frameSize;
    var l = k*frameSize;
    this.w = frameSize;
    this.content = NEO.DOM('NEO', 'div','width:'+this.w+'px; height:60px; left:'+l+'px; top:0; ');
    this.content.appendChild(NEO.DOM('NEO', 'rect','width:100%; height:60px; top:0; ',{ width:'100%', height:60, fill:'#56afb2' } ));
    this.flagName = new UIL.String({target:this.content, callback:function(v){this.name = v;}.bind(this), value:this.name, color:'no', size:80, simple:true, allway:true, pos:{left:this.w+'px', top:'0px' } });

}
NEO.KeyFlag.prototype = {
    constructor: NEO.KeyFlag,
    clear:function(){
        
    },
    reSize:function(w){
        this.w = w;
        this.content.style.width = this.w + 'px';
        this.content.style.left = (this.id*w) + 'px';
        this.flagName.c[0].style.left = w+'px';
    },
    setPy:function(y){
        this.flagName.c[0].style.top = (y*20)+'px';
    },
    move:function(f){
        this.id = f;
        this.content.style.left = (this.id*this.w) + 'px';
    }
}
