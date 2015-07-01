NEO.Proto = function(obj){

    obj = obj || {};

    this.h = 80;
    this.show = true;
    this.mbutton = 0;
    this.drag = false;
    this.dragEnd = false;
    this.current = null;
    this.currentType ='none';
    this.currentIndex = -1;

    this.id = 0;
    this.items = [];
    this.keys = obj.keys || [];

    if(obj.color) NEO.COLOR = obj.color;
    this.color = NEO.COLOR;
    
    this.target = obj.target || null;
    this.callback = obj.callback || function(){};

    this.c = [];
    this.f = [];

    this.c[0] = NEO.DOM('NEO base');
    this.c[1] = NEO.DOM('NEO text', 'div', 'left:10px');
    this.c[2] = NEO.main.liner(20);
    this.c[3] = NEO.main.pins();
    this.c[4] = NEO.main.dels();

    this.c[5] = NEO.DOM('NEO track');
    this.c[6] = NEO.DOM('NEO trackTop');

    this.c[7] = NEO.main.linerBottom();

    // -- function --

    this.f[0] = function(){
        if(this.show) this.close();
        else this.open();
    }.bind(this);

    this.f[1] = function(){
        this.clear(true);
    }.bind(this);

    this.c[3].onclick = this.f[0];
    this.c[4].onclick = this.f[1];

    this.c[1].textContent = this.type;

    

    //this.setSize();
}

NEO.Proto.prototype = {
    constructor: NEO.Proto,

    init:function(){
        this.c[0].style.background = NEO.bgcolor(this.color);
        for(var i = 0; i<this.c.length; i++){
            if(i==0){ 
                if(this.target!==null) this.target.appendChild(this.c[0]);
                else NEO.main.inner.appendChild(this.c[0]);
            }
            else this.c[0].appendChild(this.c[i]);
        }

        this.c[5].onmouseup = function(e){ this.onUp(e); }.bind(this);
        this.c[5].onmousedown = function(e){ this.onDown(e); }.bind(this);
        this.c[5].onmousemove = function(e){ this.onMove(e); }.bind(this);
        //this.c[5].onmouseover = function(e){ this.onOver(e); }.bind(this);

        this.c[5].name = this.type;

        this.setSize();

        if(this.keys.length) this.addKeys();
    },


    update:function(f){


    },
    open:function(){
        this.show = true;
        this.setSvg(3, 'd','M 12 6 L 8 10 4 6');
        this.h = 80;
        this.c[2].style.display = 'block';
        this.applyHeight();
    },
    close:function(){
        this.show = false;
        this.setSvg(3, 'd','M 6 4 L 10 8 6 12');
        this.h = 20;
        this.c[2].style.display = 'none';
        this.applyHeight();
    },
    applyHeight:function(){
        this.c[0].style.height = this.h+'px';
        if(NEO.main) NEO.main.calc();
    },



    move:function(){
        this.c[5].style.left = -NEO.main.currentPosition+'px';
    },

    
    setSvg:function(domId, type, value, id){
        this.c[domId].childNodes[id || 0].setAttributeNS(null, type, value );
    },
  

    setDom:function(id, type, value){
        this.c[id].style[type] = value+'px';
    },
    
    clear:function(selfClear){
        var ev = NEO.events;
        var i = this.c.length, j;
        while(i--){
            if(i==0){ 
                if(this.target!==null) this.target.removeChild(this.c[0]);
                else NEO.main.inner.removeChild(this.c[0]);
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
        if(this.value) this.value = null;

        if(selfClear){
            if(NEO.main)NEO.main.remove(this.id);
        }
    },
    clearDOM:function(dom){
        while ( dom.children.length ){
            if(dom.lastChild.children) while ( dom.lastChild.children.length ) dom.lastChild.removeChild( dom.lastChild.lastChild );
            dom.removeChild( dom.lastChild );
        }
    },

    // KEY SIDE

    setSize:function(){
        this.c[5].style.width = NEO.main.maxSize+'px';

        var w = NEO.main.frameSize;
        var i = this.items.length, item;
        while(i--){
            item = this.items[i];
            item.reSize(w);
            //item.style.width = w + 'px';
            //item.style.left = (item.id*w) + 'px';
        }
    },

    addKeys:function(){
        var i = this.keys.length, k;
        while(i--){
            k = this.keys[i];
            this.add(k);
        }
        this.sort();
    },

    add:function(f){
        var item, name;// = NEO.main[this.itemType](f);
        switch(this.type){
            case 'bang' : item = new NEO.KeyBang(f); break;
            case 'switch' : item = new NEO.KeySwitch(f, this.ends[this.keys.indexOf(f)] ); break;
            case 'flag' : item = new NEO.KeyFlag(f, this.names[this.keys.indexOf(f)] ); break;
            case 'color' : item = new NEO.KeyColor(f, this.colors[this.keys.indexOf(f) ] || this.findColor(f), this); break;
        }
        this.c[5].appendChild(item.content);
        this.items.push(item);
       
        //if(name !== null) item.name = name;
    },

    remove:function(f){
        var id = this.keys.indexOf(f);
        this.c[5].removeChild(this.items[id].content);
        this.items[id].clear();
        this.items.splice( id, 1 );
        this.sort();
    },

    sort:function(){
        var i, py = 0;
        this.items.sort( function ( a, b ) { return a.id - b.id; } );

        if(this.names){
            for(i=0; i<this.items.length; i++){
                this.names[i] = this.items[i].name;
                this.items[i].setPy(py);
                if(py<2) py++;
                else py = 0;
            }
        }

        if(this.ends){
            for(i=0; i<this.items.length; i++){
                this.ends[i] = this.items[i].end;
            }
        }

        if(this.colors){
            for(i=0; i<this.items.length; i++){
                this.colors[i] = this.items[i].color;
            }
        }

        this.keys = [];
        i = this.items.length;
        while(i--) this.keys.unshift(this.items[i].id*1);
        
    },

    //----------------------------
    //
    //     MOUSE
    //
    //----------------------------

    onDown:function(e){
        var type = e.target.name || 'none';
        this.currentType = type;
        
        if(type=='input' || type=='colorselect') return;

        var f = NEO.main.getFrameClick(e.clientX);

        this.mbutton = e.which;

        if(type == 'switch' || type == 'itemSwitch'){
            var i = this.items.length, it;
            while(i--){
                it = this.items[i];
                if(f>=it.id && f<=it.end){
                    if(f==it.id){ this.drag = true; this.current = it; this.dragEnd=false; }
                    if(f==it.end){ this.drag = true; this.current = it; this.dragEnd=true; }
                }
            }
        }else{

            if (this.keys.indexOf(f) > -1) {
                if(this.mbutton == 1){
                    this.drag = true;
                    this.currentIndex = this.keys.indexOf(f);
                    this.current = this.items[this.keys.indexOf(f)];
                }
                if(this.mbutton == 3){ 
                    this.remove(f);
                    if(this.currentType=='color')this.upDegrad();
                }
            } else {
                if(this.mbutton == 1){
                    this.add(f);
                    this.sort();
                    if(this.currentType=='color')this.upDegrad();
                }
            }

        }

    },
    onOver:function(e){
        //var name = e.target.name || 'no';
        //var type = e.target.name || 'none';
        //console.log(name);
        //if(name.substring(0, 4)=='item')this.c[5].style.cursor = 'e-resize';
        //else this.c[5].style.cursor = 'pointer';
        //var f = NEO.main.getFrameClick(e.clientX);
        //if (this.keys.indexOf(f) > -1) this.c[5].style.cursor = 'e-resize';

        //if(this.drag) this.c[5].style.cursor = 'e-resize';
        //else this.c[5].style.cursor = 'pointer';
    },
    onUp:function(e){
        //var type = e.target.name || 'none';
        //console.log(type);
        if(this.drag){ 
            this.c[5].style.cursor = 'pointer';
            this.drag = false; 
            this.dragEnd = false;
            this.sort();

            if(this.currentType=='color') this.upDegrad();
        }
        this.currentType = 'none';
    },
    onMove:function(e){
        if(this.currentType=='none') return;

        var f = NEO.main.getFrameClick(e.clientX);

        /*if(this.currentType == 'switch'){
        }else{
            if (this.keys.indexOf(f) > -1) this.c[5].style.cursor = 'e-resize';
            else this.c[5].style.cursor = 'pointer';
        }*/
        

        if(this.drag){
            this.c[5].style.cursor = 'e-resize';
            //console.log(this.currentIndex)
            this.current.move(f, this.dragEnd);
            //this.c[5].style.cursor = 'e-resize';
            if(this.currentType=='color') this.moveDegrad(this.currentIndex, f);
        }
    },

}