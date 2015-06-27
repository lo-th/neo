NEO.Bang = function(obj){

    this.type = 'bang';
    this.items = [];
    this.keys = obj.keys || [];
    
    NEO.Proto.call( this, obj );

    // click
    this.f[2] = function(e){ this.addMouse(e); }.bind(this);
    this.c[6].onclick = this.f[2];

    this.init();

    if(this.keys.length) this.addKeys();
}

NEO.Bang.prototype = Object.create( NEO.Proto.prototype );
NEO.Bang.prototype.constructor = NEO.Bang;

NEO.Bang.prototype.addKeys = function(){
    var i = this.keys.length, k, f;
    while(i--){
        f = this.keys[i];
        this.add(f);
    }
    this.sort();
}

NEO.Bang.prototype.addMouse = function(e){
    var f = NEO.main.getFrameClick(e.clientX);
    if (this.keys.indexOf(f) > -1) {
        this.remove(this.keys.indexOf(f));
    } else {
        this.add(f);
        this.sort();
    }
};

NEO.Bang.prototype.add = function(f){
    var k = NEO.main.keybox(f);
    this.c[5].appendChild(k);
    k.name = f;
    this.items.push(k);
};

NEO.Bang.prototype.remove = function(i){
    this.c[5].removeChild( this.items[i]);
    this.items.splice( i, 1 );
    this.sort();
};

NEO.Bang.prototype.sort = function(){
    this.items.sort( function ( a, b ) { return a.name - b.name; } );
    this.keys = [];
    var i = this.items.length;
    while(i--) this.keys.unshift(this.items[i].name);
};

NEO.Bang.prototype.update = function(f){
    var active = false;
    if (this.keys.indexOf(f) > -1) active = true;

    if(active) this.c[5].style.background = 'rgba(86,175,178,0.3)';
    else this.c[5].style.background = 'none';

    this.callback(active);
};

NEO.Bang.prototype.setSize = function(){
    this.c[5].style.width = NEO.main.maxSize+'px';
    var w = NEO.main.frameSize;
    var i = this.items.length, k;
    while(i--){
        k = this.items[i];
        k.style.width = w + 'px';
        k.style.left = (k.name*w) + 'px';

    }
};