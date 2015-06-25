NEO.Proto = function(obj){

    obj = obj || {};

    this.h = 80;
    this.show = true;

    // define obj size
    /*this.setSize(obj.size);
    
    */
    if(obj.color) NEO.COLOR = obj.color;
    this.color = NEO.COLOR;
    

    //this.txt = obj.name || 'Proto';
    this.target = obj.target || null;
    this.callback = obj.callback || function(){};

    this.c = [];
    this.f = [];

    this.c[0] = NEO.DOM('NEO base');
    this.c[1] = NEO.DOM('NEO text', 'div', 'left:10px');
    this.c[2] = NEO.main.liner(20);
    this.c[3] = NEO.main.liner(80);
    this.c[4] = NEO.main.pins();

    this.c[1].textContent = this.type;

    this.f[0] = function(e){
        if(this.show) this.close();
        else this.open();
    }.bind(this);

    this.c[4].onclick = this.f[0];

}

NEO.Proto.prototype = {
    constructor: NEO.Proto,
    open:function(){
        this.show = true;
        this.setSvg(4, 'd','M 12 6 L 8 10 4 6');
        this.h = 80;
        this.applyHeight();
    },
    close:function(){
        this.show = false;
        this.setSvg(4, 'd','M 6 4 L 10 8 6 12');
        this.h = 20;
        this.applyHeight();
    },
    applyHeight:function(){
        this.c[0].style.height = this.h+'px';
    },

    init:function(){
        this.c[0].style.background = NEO.bgcolor(this.color);
        for(var i = 0; i<this.c.length; i++){
            if(i==0){ 
                if(this.target!==null) this.target.appendChild(this.c[0]);
                else NEO.main.inner.appendChild(this.c[0]);
            }
            else this.c[0].appendChild(this.c[i]);
        }
        //this.rSize();
    },
    setSvg:function(domId, type, value, id){
        this.c[domId].childNodes[id || 0].setAttributeNS(null, type, value );
    },
    /*setSize:function(sx){
        this.size = sx || UIL.WIDTH;
        this.sa = (this.size/3).toFixed(0)*1;
        this.sb = ((this.sa*2)-10).toFixed(0)*1;
    },
    setDom:function(id, type, value){
        this.c[id].style[type] = value+'px';
    },
    
    clear:function(){
        var ev = UIL.events;
        var i = this.c.length, j;
        while(i--){
            if(i==0){ 
                if(this.target!==null) this.target.removeChild(this.c[0]);
                else UIL.main.inner.removeChild(this.c[0]);
            } else {
                j = ev.length;
                while(j--){ if(this.c[i][ev[j]]!==null) this.c[i][ev[j]] = null; }
                if(this.c[i].children) this.clearDOM(this.c[i]);
                this.c[0].removeChild(this.c[i]);
            }
            this.c[i] = null;
        }

        this.c = null;
        if(this.f){
            i = this.f.length;
            while(i--) this.f[i] = null;
            this.f = null
        }
        if(this.callback)this.callback = null;
        if(this.value)this.value = null;
    },
    clearDOM:function(dom){
        while ( dom.children.length ){
            if(dom.lastChild.children) while ( dom.lastChild.children.length ) dom.lastChild.removeChild( dom.lastChild.lastChild );
            dom.removeChild( dom.lastChild );
        }
    },
    setTypeNumber:function( obj ){

        this.min = -Infinity;
        this.max = Infinity;

        this.precision = 2;
        if(obj.precision !== undefined ) this.precision = obj.precision;
        //this.prev = null;
        this.step = 0.01;
        switch(this.precision){
            case 0:  this.step = 1; break;
            case 1:  this.step = 0.1; break;
            case 2:  this.step = 0.01; break;
            case 3:  this.step = 0.001; break;
            case 4:  this.step = 0.0001; break;
        }

        if(obj.min !== undefined ) this.min = obj.min;
        if(obj.max !== undefined ) this.max = obj.max;
        if(obj.step !== undefined ) this.step = obj.step;
        
    },
    numValue:function(n){
        return Math.min( this.max, Math.max( this.min, n ) ).toFixed( this.precision )*1;
    },
    rSize:function(){
        this.c[0].style.width = this.size+'px';
        this.c[1].style.width = this.sa+'px';
    }*/
}