NEO.Bang = function(obj){

    this.type = 'bang';
    
    NEO.Proto.call( this, obj );

    this.init();
}

NEO.Bang.prototype = Object.create( NEO.Proto.prototype );
NEO.Bang.prototype.constructor = NEO.Bang;

NEO.Bang.prototype.update = function(f){

    if (this.keys.indexOf(f) > -1){ 
        this.value = true;
        this.c[6].style.background = 'rgba(86,175,178,0.3)';
    }else{ 
        this.value = false;
        this.c[6].style.background = 'none';
    }
    
};


// ------------------------------------------


NEO.KeyBang = function(f){
    this.id = f;
    var frameSize = NEO.main.frameSize;
    var l = f*frameSize;
    this.w = frameSize;
    this.content = NEO.DOM('NEO', 'div','width:'+this.w+'px; height:60px; left:'+l+'px; top:0; pointer-events:auto; cursor:e-resize;');
    this.content.appendChild(NEO.DOM('NEO', 'rect','width:100%; height:60px; top:0; ',{ width:'100%', height:60, fill:'#56afb2' } ));
    this.content.name = 'bang'; 
}
NEO.KeyBang.prototype = {
    constructor: NEO.KeyBang,
    clear:function(){
        NEO.clearDOM(this.content);
        this.content = null;
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