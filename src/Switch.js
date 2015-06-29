NEO.Switch = function(obj){

    this.type = 'switch';
    
    NEO.Proto.call( this, obj );

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