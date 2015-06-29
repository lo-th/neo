NEO.Switch = function(obj){

    this.type = 'switch';
    
    NEO.Proto.call( this, obj );

    // click
    this.f[2] = function(e){ this.addOnMouse(e); }.bind(this);
    this.f[3] = function(e){ this.onUp(e); }.bind(this);
    this.f[4] = function(e){ this.onMove(e); }.bind(this);
    this.f[5] = function(e){ this.onOver(e); }.bind(this);


    this.c[5].onmousedown = this.f[2];
    this.c[5].onmouseup = this.f[3];
    this.c[5].onmousemove = this.f[4];
    this.c[5].onmouseover = this.f[5];

    this.init();
}

NEO.Switch.prototype = Object.create( NEO.Proto.prototype );
NEO.Switch.prototype.constructor = NEO.Switch;

NEO.Switch.prototype.update = function(f){
    var active = false;
    if (this.keys.indexOf(f) > -1) active = true;

    if(active) this.c[5].style.background = 'rgba(86,175,178,0.3)';
    else this.c[5].style.background = 'none';

    this.callback(active);
};

NEO.Switch.prototype.addOnMouse = function(e){
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
NEO.Switch.prototype.onOver = function(e){
    var f = NEO.main.getFrameClick(e.clientX);
    if (this.keys.indexOf(f) > -1) this.c[5].style.cursor = 'e-resize';
};

NEO.Switch.prototype.onUp = function(e){
    if(this.drag){
        this.c[5].style.cursor = 'pointer';
        this.drag = false;
        this.sort();
    }
};

NEO.Switch.prototype.onMove = function(e){
    var f = NEO.main.getFrameClick(e.clientX);
    if (this.keys.indexOf(f) > -1) this.c[5].style.cursor = 'e-resize';
    else this.c[5].style.cursor = 'pointer';

    if(this.drag){ 
        this.current.move(f);
        this.c[5].style.cursor = 'e-resize';
    }
};

// ------------------------------------------

NEO.KeySwitch = function(k){
    this.id = 0;
    this.endId = 0;

    var frameSize = NEO.main.frameSize;
    var l = k*frameSize;
    this.w = frameSize;
    this.content = NEO.DOM('NEO', 'div','width:'+this.w+'px; height:60px; left:'+l+'px; top:0; ');
    this.content.appendChild(NEO.DOM('NEO', 'rect','width:100%; height:60px; top:0; ',{ width:'100%', height:60, fill:'#56afb2' } ));
}
NEO.KeySwitch.prototype = {
    constructor: NEO.KeyBang,
    clear:function(){
        
    },
    reSize:function(w){
        this.w = w;
        this.content.style.width = this.w + 'px';
        this.content.style.left = (this.id*this.w) + 'px';
    },
    move:function(f){
        this.id = f;
        this.content.style.left = (this.id*this.w) + 'px';
    }
}