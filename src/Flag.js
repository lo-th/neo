NEO.Flag = function(obj){

    this.type = 'flag';

    this.names = obj.names || [];
    this.currentName = '';
    
    NEO.Proto.call( this, obj );

    this.init();
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
