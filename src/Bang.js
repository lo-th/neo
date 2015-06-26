NEO.Bang = function(obj){

    obj = obj || {};
    
    this.type = 'bang';

    this.bangs = [];

    NEO.Proto.call( this, obj );

    this.f[2] = function(e){
        this.addBangs(e);
    }.bind(this);


    this.c[6].onclick = this.f[2];

    this.init();
}

NEO.Bang.prototype = Object.create( NEO.Proto.prototype );
NEO.Bang.prototype.constructor = NEO.Bang;

//NEO.Bang.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
//};

NEO.Bang.prototype.addBangs = function(e){
    var k = NEO.main.getFrameClick(e.clientX);
    var key = NEO.main.keybox(k);
    key.name = k;

    this.c[5].appendChild(key);
    
    this.bangs.push(key);
}

NEO.Bang.prototype.update = function(f){
    var active = false;
    var i = this.bangs.length;
    while(i--){ if(this.bangs[i].name===f) active=true; }

    if(active) this.c[5].style.background = 'rgba(86,175,178,0.3)';
    else this.c[5].style.background = 'none';
}