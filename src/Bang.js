NEO.Bang = function(obj){

    this.keys = [];
    this.list = [];

    obj = obj || {};
    this.type = 'bang';
    NEO.Proto.call( this, obj );

    

    this.f[2] = function(e){
        this.add(e);
    }.bind(this);

    this.c[6].onclick = this.f[2];

    this.init();

}

NEO.Bang.prototype = Object.create( NEO.Proto.prototype );
NEO.Bang.prototype.constructor = NEO.Bang;

NEO.Bang.prototype.add = function(e){

    var f = NEO.main.getFrameClick(e.clientX);

    if (this.list.indexOf(f) > -1) {
        this.remove(this.list.indexOf(f));
        return;
    }

    var key = NEO.main.keybox(f);
    key.name = f;

    this.c[5].appendChild(key);
    this.keys.push(key);
    this.sort();

};

NEO.Bang.prototype.remove = function(i){

    this.c[5].removeChild( this.keys[i]);
    this.keys.splice( i, 1 );
    this.sort();

};

NEO.Bang.prototype.sort = function(){

    this.keys.sort( function ( a, b ) { return a.name - b.name; } );
    this.list = [];
    var i = this.keys.length;
    while(i--) this.list.unshift(this.keys[i].name);

};

NEO.Bang.prototype.update = function(f){

    var active = false;
    if (this.list.indexOf(f) > -1) active = true;

    if(active) this.c[5].style.background = 'rgba(86,175,178,0.3)';
    else this.c[5].style.background = 'none';

};

NEO.Bang.prototype.setSize = function(){
    this.c[5].style.width = NEO.main.maxSize+'px';
    var w = NEO.main.frameSize;
    var i = this.keys.length, k;
    while(i--){
        k = this.keys[i];
        k.style.width = w + 'px';
        k.style.left = (k.name*w) + 'px';

    }
};