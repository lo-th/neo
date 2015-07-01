NEO.hexToHtml = function(v){ 
    return "#" + ("000000" + v.toString(16)).substr(-6);
};
NEO.numToHex = function(v){ 
    return "0x" + ("000000" + v.toString(16)).substr(-6);
};
NEO.hexFormat = function(v){ return v.toUpperCase().replace("#", "0x"); };

NEO.lerpColor = function(a,b,lerp){
    var A = [( a >> 16 & 255 ) / 255, ( a >> 8 & 255 ) / 255, ( a & 255 ) / 255];
    var B = [( b >> 16 & 255 ) / 255, ( b >> 8 & 255 ) / 255, ( b & 255 ) / 255];
    A[0] += ( B[0] - A[0] ) * lerp;
    A[1] += ( B[1] - A[1] ) * lerp;
    A[2] += ( B[2] - A[2] ) * lerp;
    return ( A[0] * 255 ) << 16 ^ ( A[1] * 255 ) << 8 ^ ( A[2] * 255 ) << 0;
}

NEO.Color = function(obj){

    this.type = 'color';

    this.colors =  obj.colors || [];
    NEO.DID++;
    this.degradId = 'degrad'+NEO.DID;
    this.degrad = [];
    this.linear = [];
    this.degNumber = 5;
    
    NEO.Proto.call( this, obj );

    this.createDegrad();

    this.init();
}

NEO.Color.prototype = Object.create( NEO.Proto.prototype );
NEO.Color.prototype.constructor = NEO.Color;

NEO.Color.prototype.update = function(f){

    this.value = this.findColor(f);

};

NEO.Color.prototype.findColor = function(f){
    var color;
    if (this.keys.indexOf(f) > -1){ 
        color = this.colors[this.keys.indexOf(f)];
    } else {
        var c1, c2;
        var f1, f2;
        var i = this.keys.length, k;
        while(i--){
            k = this.keys[i];
            if(f>k && !c1){ c1=this.colors[i]; f1 = k; }
            if(f<k){ c2=this.colors[i]; f2 = k; }
        }
        if(!c1) color = c2;
        if(!c2) color = c1;
        if(c1 && c2){
            color = NEO.lerpColor(c1, c2, ((f-f1))/(f2-f1) );
        }
    }

    return NEO.numToHex(color || 0x0000FF);
}

NEO.Color.prototype.createDegrad = function(){
    var i;
    var degrad, linear;
    i = this.degNumber;
    while(i--){
        degrad = NEO.DOM('NEO', 'defs', 'position:absolute; left:100px; width:100px; height:60px;', {} );
        linear = NEO.DOM(null, 'linearGradient', '', {id:(this.degradId+i), x1:'0%', y1:'0%', x2:'100%', y2:'0%' }, degrad, 0 );
        NEO.DOM(null, 'rect', '', {width:'100%', height:'60', stroke:'none', x:0, fill:'url(#'+(this.degradId+i)+')'}, degrad );
        this.c[5].appendChild(degrad);
        this.degrad[i] = degrad;
        this.linear[i] = linear;
    }

    this.upDegrad();

};

NEO.Color.prototype.upDegrad = function(){
    var max = NEO.main.maxFrame;
    var fbygrad = max/this.degNumber;
    var pp = 100/this.degNumber;

    // clear old
    var i = this.linear.length;
    while(i--) NEO.clearDOM(this.linear[i].childNodes[0]);
    

    i = this.linear.length;
    while(i--){
        NEO.DOM(null, 'stop', '', { offset:0, 'stop-color':NEO.hexToHtml(this.findColor(fbygrad*i)), 'stop-opacity':1 }, this.linear[i], 0 );
    }

    var lng = this.keys.length, percent, gid;
    for(i=0; i<lng; i++){
        percent = ((this.keys[i]*100)/max).toFixed(4);
        gid = Math.floor( percent/pp );
        NEO.DOM(null, 'stop', '', { offset:((percent/pp)-gid), 'stop-color':NEO.hexToHtml(this.colors[i]), 'stop-opacity':1 }, this.linear[gid], 0 );
    }

    i = this.linear.length;
    while(i--){
        NEO.DOM(null, 'stop', '', { offset:1, 'stop-color':NEO.hexToHtml(this.findColor((fbygrad*(i+1))-1)), 'stop-opacity':1 }, this.linear[i], 0 );
    }

}

NEO.Color.prototype.moveDegrad = function(id, f){
    this.keys[id] = f;
    this.upDegrad();
};


NEO.Color.prototype.setSize = function(){
    this.c[5].style.width = NEO.main.maxSize+'px';

    var w = NEO.main.frameSize;
    var i = this.items.length, item;
    while(i--){
        item = this.items[i];
        item.reSize(w);
    }

    var size = (NEO.main.maxFrame/this.degNumber)*NEO.main.frameSize;

    i = this.degrad.length
    while(i--){
        this.degrad[i].style.width = size+'px';
        this.degrad[i].style.left = (size*i)+'px';
    }
};

// ------------------------------------------


NEO.KeyColor = function(f, color, parent){
    this.parent = parent;
    this.id = f;
    var frameSize = NEO.main.frameSize;
    this.color = color || 0x0000FF;
    var l = f*frameSize;
    this.w = frameSize;
    this.content = NEO.DOM('NEO', 'div','width:10px; height:60px; left:'+l+'px; top:0; pointer-events:auto; cursor:e-resize;');
    this.content.appendChild(NEO.DOM('NEO', 'path','left:-6px; width:24px; height:60px; top:0; ',{ d:'M 0 0 L 12 12 24 0 M 12 60 L 12 12', stroke:'rgba(0,0,0,0.3)', fill:'none', 'stroke-width':5, 'stroke-linecap':'butt' } ));
    this.content.appendChild(NEO.DOM('NEO', 'path','left:-6px; width:24px; height:60px; top:0; ',{ d:'M 0 0 L 12 12 24 0 0 0 Z', stroke:'none', fill:NEO.hexToHtml(this.color) } ));
    this.content.appendChild(NEO.DOM('NEO', 'path','left:-6px; width:24px; height:60px; top:0; ',{ d:'M 0 0 L 12 12 24 0 M 12 60 L 12 12', stroke:'#56afb2', fill:'none', 'stroke-width':1, 'stroke-linecap':'butt' } ));

    this.colorSelect = NEO.DOM('NEO', 'div','left:-6px; width:24px; height:24px; top:0; pointer-events:auto; cursor:pointer;');
    this.colorSelect.name = 'colorselect';
    this.content.appendChild(this.colorSelect);

    this.colorSelect.onclick = function(e){
        var rect = this.parent.c[0].getBoundingClientRect();
        NEO.main.showColorSelect(e.clientX, rect.top, this);
    }.bind(this);

    this.content.name = 'color';
}

NEO.KeyColor.prototype = {
    constructor: NEO.KeyColor,
    clear:function(){
        NEO.clearDOM(this.content);
        this.content = null;
    },
    reSize:function(w){
        this.w = w;
        //this.content.style.width = this.w + 'px';
        this.content.style.left = (this.id*this.w) + 'px';
    },
    move:function(f){
        this.id = f;
        this.content.style.left = (this.id*this.w) + 'px';
    },
    setColor:function(color){
        this.color = NEO.numToHex(color);
        NEO.setSVG(this.content.childNodes[1], 'fill', NEO.hexToHtml(this.color), 0);

        this.parent.sort();
        this.parent.upDegrad();

    }
}