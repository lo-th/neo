NEO.Flag = function(obj){

    this.type = 'flag';

    this.names = obj.names || [];
    this.value = '';
    
    NEO.Proto.call( this, obj );

    this.init();
}

NEO.Flag.prototype = Object.create( NEO.Proto.prototype );
NEO.Flag.prototype.constructor = NEO.Flag;

NEO.Flag.prototype.update = function(f){

    if(f==0) this.value = '';

    var k = this.keys.indexOf(f);

    if(k > -1){ 
        this.c[6].style.background = 'rgba(86,175,178,0.3)';
        this.value = this.items[k].name;
    }else{ 
        this.c[6].style.background = 'none';
    }
    
};


// ------------------------------------------


NEO.KeyFlag = function(f, name){
    this.id = f;
    this.name = name || 'new';
    var frameSize = NEO.main.frameSize;
    var l = f*frameSize;
    this.w = frameSize;
    this.content = NEO.DOM('NEO', 'div','width:'+this.w+'px; height:60px; left:'+l+'px; top:0; pointer-events:auto; cursor:e-resize;');
    this.content.appendChild(NEO.DOM('NEO', 'rect','width:100%; height:60px; top:0; ',{ width:'100%', height:60, fill:'#56afb2' } ));
    this.flagName = new UIL.String({target:this.content, callback:function(v){this.name = v;}.bind(this), value:this.name, color:'no', size:80, simple:true, allway:true, pos:{left:this.w+'px', top:'0px' } });
    this.content.name = 'bang';
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
