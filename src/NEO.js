/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_| 2015
*    @author lo.th / http://lo-th.github.io/labs/
*/

'use strict';

// need uil http://lo-th.github.io/uil/build/uil.min.js
var UIL, loop, rootUpdate;

var NEO = NEO || ( function () {
    return {
        main:null,
        REVISION: '0.2',
        DEF:false,
        DID:0,
        events:[ 'onkeyup', 'onkeydown', 'onclick', 'onchange', 'onmouseover', 'onmouseout', 'onmousemove', 'onmousedown', 'onmouseup', 'onmousewheel' ],
        WIDTH:300,
        BW:190,
        AW:100, 
        svgns:"http://www.w3.org/2000/svg",
        classDefine:function(){
            NEO.COLOR = 'NO';
            NEO.SELECT = '#035fcf';
            //NEO.SELECTDOWN = '#024699';
            //NEO.SVGB = 'rgba(0,0,0,0.2)';
            //NEO.SVGC = 'rgba(120,120,120,0.6)';
            NEO.txt1 = 'font-family:"Open Sans", sans-serif; font-size:11px; color:#cccccc; outline:0; padding:0px 10px; left:0; top:1px; height:17px; width:100px; overflow:hidden;';

            NEO.CC('NEO', 'position:absolute; pointer-events:none; box-sizing:border-box; -o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select:none; margin:0; padding:0; border:none; ');

            NEO.CC('NEO.content', 'bottom:0; left:0; width:100px;  background:none; pointer-events:auto; transition:height, 0.1s ease-out;');
            NEO.CC('NEO.topcontent', 'bottom:0; left:0; width:100px; background:none;');

            
            NEO.CC('NEO.topmenu', 'width:100%; height:24px; background:none; ');
            NEO.CC('NEO.timeBar', 'width:100px; height:20px; top:20px; background:none; pointer-events:auto; cursor:e-resize;');
            NEO.CC('NEO.timescale', 'width:100px; height:20px; background:none; bottom:0; pointer-events:auto; cursor:e-resize;');
            
            NEO.CC('NEO.scaler', 'width:200px; height:16px; top:2px; background:none;');
            NEO.CC('NEO.inner', 'width:100%; top:40px; height:auto; overflow:hidden; background:none;');

            NEO.CC('NEO.base', 'position:relative; transition:height, 0.1s ease-out; height:80px; overflow:hidden;');

            NEO.CC('NEO.track', 'position:absolute; left:0; top:20px; width:100px; height:60px; overflow:hidden; pointer-events:auto; cursor:pointer; background:none; border-top:1px solid transparent; border-bottom:1px solid transparent;');
            NEO.CC('NEO.track:hover', 'border-top:1px solid #035fcf; border-bottom:1px solid #035fcf;');

            NEO.CC('NEO.trackTop', 'position:absolute; left:0; top:20px; width:100%; height:60px; overflow:hidden; pointer-events:none; background:none; ');

            NEO.CC('NEO.text', NEO.txt1);

            NEO.DEF = true;
        },
        changecss: function (theClass,element,value) {
            var cssRules;
            
            for (var S = 0; S < document.styleSheets.length; S++){
                try{// exporer
                    document.styleSheets[S].insertRule(theClass+' { '+element+': '+value+'; }',document.styleSheets[S][cssRules].length);
                } catch(e){// chrome
                    try{document.styleSheets[S].addRule(theClass,element+': '+value+';');
                    }catch(ee){// firefox
                        try{
                            if (document.styleSheets[S]['rules']) {
                                cssRules = 'rules';
                            } else if (document.styleSheets[S]['cssRules']) {
                                cssRules = 'cssRules';
                            }/* else {
                            //no rules found... browser unknown
                            }*/
                            for (var R = 0; R < document.styleSheets[S][cssRules].length; R++) {
                                if (document.styleSheets[S][cssRules][R].selectorText == theClass) {
                                    if(document.styleSheets[S][cssRules][R].style[element]){
                                        document.styleSheets[S][cssRules][R].style[element] = value;
                                        break;
                                    }
                                }
                            }
                        } catch (eee){}
                    }
                }
            }
        },
        bgcolor: function(p, a){
            var r=48, g=48, b=48;
            a = a || 0.66;
            if(p){
                switch(p){
                    case 'r': case 'R': case 'S': r=160; b=68; break;
                    case 'g': case 'G': case 'E': g=120; b=68; break;
                    case 'b': case 'B': case 'T': b=120; g=68; break;
                    case 'no': case 'NO': a=0; break;
                }
            }

            var color = 'rgba('+r+','+g+','+b+','+a+')';
            if(a==0) color = 'none';
            return color;
        },
        setSVG:function(dom, type, value, id){
            dom.childNodes[id || 0].setAttributeNS(null, type, value );
        },
        setDOM:function(dom, type, value){
            dom.style[type] = value+'px';
        },
        clearDOM:function(dom){
            while ( dom.childNodes.length ) dom.removeChild( dom.lastChild );
            //while ( dom.children.length ) dom.removeChild( dom.lastChild );
        },
        DOM:function(cc, type, css, obj, dom, id){
            type = type || 'div';
            if(type=='rect' || type=='circle' || type=='path' || type=='polygon' || type=='text' || type=='pattern' || type=='defs' || type=='g' || type=='line' || type=='foreignObject' || type=='linearGradient' || type=='stop' || type=='animate' || type=='radialGradient' ){
                if(dom==undefined) dom = document.createElementNS( this.svgns, 'svg' );
                var g = document.createElementNS( this.svgns, type );
                g.setAttributeNS(null, 'pointer-events', 'none' );
                for(var e in obj){

                    if(e=='txt') g.textContent = obj[e];
                    else g.setAttributeNS(null, e, obj[e] );
                }

                if(id==undefined) dom.appendChild(g);
                else dom.childNodes[id || 0].appendChild(g);

                if(cc) dom.setAttribute('class', cc);
            } else {
                if(dom==undefined) dom = document.createElement(type);
                if(cc) dom.className = cc;
            }
            
            if(css) dom.style.cssText = css; 

            if(id==undefined) return dom;
            else return dom.childNodes[id || 0];
        },
        CC:function(name,rules,noAdd){
            var adds = '.';
            if(noAdd)adds='';
            if(name == '*') adds = '';
            var style = document.createElement('style');
            style.type = 'text/css';
            style.id = name;
            //console.log(name)
            document.getElementsByTagName('head')[0].appendChild(style);
            if(!(style.sheet||{}).insertRule) (style.styleSheet || style.sheet).addRule(adds+name, rules);
            else style.sheet.insertRule(adds+name+"{"+rules+"}",0);

            //console.log(style.sheet)
        }
    };
})();


NEO.Timeline = function(css, decal){

    this.data = {};

    this.frame = 0;
    this.time = 0;
    this.height = 60;
    this.width = 100;
    this.maxTop = 145;
    this.decal = decal || 0;

    this.range = {start:0, end:136, lng:136};

    this.frameSize = 10;
    this.leftFrame = 0;
    this.maxFrame = 750; // default flash


    //this.currentLeftFrame = 0;
    //this.viewFrame = Math.round(this.width/this.frameSize);
    this.fps = 60;
    this.timerStep = 1000/this.fps;

    this.now = 0;
    this.delta = 0;
    this.then = Date.now();

    

    //this.maxSize = this.frameSize*this.maxFrame;
    //this.currentPosition = this.currentLeftFrame*this.frameSize;
    this.ratio = this.maxFrame/this.width;
    this.invRatio = this.width/this.maxFrame;
    //this.viewFrame = this.width/this.frameSize;
    //this.posX = 0;

    this.timerdown = false;
    this.scrolldown = false;
    this.currentAction = '';

    this.inPlay = false;


    this.neo = [];
    this.f = [];

    this.content = NEO.DOM('NEO content', 'div', css);
    document.body.appendChild(this.content);

    this.topcontent = NEO.DOM('NEO topcontent', 'div', css);
    document.body.appendChild(this.topcontent);

    this.top = parseFloat(this.content.style.top.substring(0,this.content.style.top.length-2));

    // TOP MENU

    this.topmenu = NEO.DOM('NEO topmenu');
    this.topmenu.appendChild(this.liner(1));

    //var callbackSize = function(v){ this.scaletime(v); }.bind(this);
    var callbackFps = function(v){ this.setFps(v); }.bind(this);
    var callbackList = function(v){ this.add(v); this.addList.text('ADD'); }.bind(this);
    var callbackPlay = function(v){ this.play(); }.bind(this);
    var callbackStart = function(v){ this.moveTo(0); }.bind(this);
    var callbackEnd = function(v){ this.moveTo(this.maxFrame); }.bind(this);

   
    //this.sizer = new UIL.Slide({target:this.topmenu, callback:callbackSize, name:'scale', min:0.1, max:4, value:0.8, step:0.1, color:'no', size:150, pos:{left:'auto', right:'0', top:'2px' }});
    this.butFps = new UIL.Number({target:this.topmenu, callback:callbackFps, name:'fps', min:12, max:60, value:60, step:1, color:'no', size:82, pos:{left:'auto', right:'0px', top:'2px' }});
    this.title = new UIL.Title({target:this.topmenu, name:'0:00:00', color:'no', size:120, height:20, pos:{top:'2px' } });
    this.addList = new UIL.List({target:this.topmenu, callback:callbackList, name:' ', color:'no', list:['bang', 'flag', 'curve', 'lfo', 'color', 'switch', 'audio', 'video'], size:80, pos:{left:'100px', top:'auto', bottom:'2px'}, simple:true, side:'up', full:true });
    this.addList.text('ADD');

    this.playButton = new UIL.Button({target:this.topmenu, callback:callbackPlay, name:'X', color:'no', size:40, pos:{left:'210px', top:'2px' }, simple:true });
    this.startButton = new UIL.Button({target:this.topmenu, callback:callbackStart, name:'X', color:'no', size:20, pos:{left:'190px', top:'2px' }, simple:true });
    this.endButton = new UIL.Button({target:this.topmenu, callback:callbackEnd, name:'X', color:'no', size:20, pos:{left:'250px', top:'2px' }, simple:true });
    this.playIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='18px' height='17px'><path fill='#CCC' d='M 14 8 L 5 3 4 4 4 13 5 14 14 9 14 8 Z'/></svg>";
    this.pauseIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='18px' height='17px'><path fill='#CCC' d='M 14 4 L 13 3 11 3 10 4 10 13 11 14 13 14 14 13 14 4 M 8 4 L 7 3 5 3 4 4 4 13 5 14 7 14 8 13 8 4 Z'/></svg>";
    this.startIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='18px' height='17px'><path fill='#CCC' d='M 11 12 L 11 10 14 10 14 7 11 7 11 5 8 8 8 9 11 12 M 7 12 L 6 12 6 5 7 5 7 3 4 3 4 14 7 14 7 12 Z'/></svg>";
    this.endIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='18px' height='17px'><path fill='#CCC' d='M 10 8 L 7 5 7 7 4 7 4 10 7 10 7 12 10 9 10 8 M 14 3 L 11 3 11 5 12 5 12 12 11 12 11 14 14 14 14 3 Z'/></svg>";
    this.playButton.icon(this.playIcon);
    this.startButton.icon(this.startIcon);
    this.endButton.icon(this.endIcon);

    // TOP TIMEBAR 

    this.timeBar = NEO.DOM('NEO timeBar');
    this.timeBar.name = 'timeBar';

    this.pattern = NEO.DOM('NEO', 'defs', 'width:100%; height:20px; bottom:0;', {} );
    var p = NEO.DOM(null, 'pattern', '', {id:'timeBar', width:50, height:20, patternUnits:'userSpaceOnUse'}, this.pattern, 0 );
    var g = NEO.DOM(null, 'g', '', { stroke:'#888', 'stroke-width':'1', fill:'none'}, p, 0 );
    NEO.DOM(null, 'path', '', { d:'M0 0'}, g, 0 );
    NEO.DOM(null, 'rect', '', {width:'100%', height:20, x:0, fill:'url(#timeBar)'}, this.pattern );

    this.patternLine = g.childNodes[0];

    this.timeBar.appendChild(this.pattern);


    // BOTTOM TIME SCALE

    this.timescale = NEO.DOM('NEO timescale');
    
    this.timescale.appendChild(this.liner(1));
    this.timescale.appendChild(this.liner(20));
    this.timescale.name = 'timescale';

    this.hatchPattern = NEO.DOM('NEO', 'defs', 'width:100%; height:10px; top:5px;', {} );
    p = NEO.DOM(null, 'pattern', '', {id:'timeScale', width:10, height:10, patternUnits:'userSpaceOnUse'}, this.hatchPattern, 0 );
    g = NEO.DOM(null, 'g', '', { stroke:'#888', 'stroke-width':'1', fill:'none'}, p, 0 );
    NEO.DOM(null, 'path', '', { d:'M0 10 L10 0 M0 5 L5 0 M5 10 L10 5'}, g, 0 );
    NEO.DOM(null, 'rect', '', {width:'100%', height:10, x:0, fill:'url(#timeScale)'}, this.hatchPattern );
    //this.timescale.appendChild(this.hatchPattern);

    // BOTTOM TIME SCALE SCROLLER

    this.scaler = NEO.DOM('NEO scaler');

    //this.scaler = NEO.DOM('NEO', 'rect', 'width:40px; height:16px; top:2px;', {width:40, height:16, x:0, y:0, fill:'rgba(0,0,0,0.5)', stroke:'#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
    this.scalerLine = this.liner(8);
    this.scalerLeft = NEO.DOM('NEO', 'circle', 'width:16px; height:16px; top:0px; left:-8px;  pointer-events:auto; cursor:pointer;', {cx:8, cy:8, r:6, fill:'rgba(0,0,0,0.5)', stroke:'#888', 'stroke-width':2} );
    this.scalerRight = NEO.DOM('NEO', 'circle', 'width:16px; height:16px; top:0px; right:-8px;  pointer-events:auto; cursor:pointer;', {cx:8, cy:8, r:6, fill:'rgba(0,0,0,0.5)', stroke:'#888', 'stroke-width':2} );
    this.scalerLeft.name = 'scaleLeft';
    this.scalerRight.name = 'scaleRight';
    this.scaler.appendChild(this.scalerLine);
    this.scaler.appendChild(this.scalerLeft);
    this.scaler.appendChild(this.scalerRight);
    this.timescale.appendChild(this.scaler);

    this.miniFramePos = this.vliner(1, '#F00');
    this.timescale.appendChild(this.miniFramePos);


    


    // TRACK CONTENT

    this.inner = NEO.DOM('NEO inner');
    


    // TIME MARKER

    this.marker = NEO.DOM('NEO', 'rect', 'width:41px; height:60px;', {width:10, height:16, x:0.5, y:21.5, fill:'rgba(255,0,0,0.3)', stroke:'#F00', 'stroke-width':1, 'stroke-linecap':'butt'} );
    NEO.DOM(null, 'line', '', { x1:5.5, y1:37, x2:5.5, y2:'100%', stroke:'#F00', 'stroke-width':1, 'stroke-linecap':'butt' }, this.marker );
    

    this.content.appendChild(this.timeBar);
    this.content.appendChild(this.timescale);
    this.content.appendChild(this.inner);
    this.content.appendChild(this.marker);
    this.content.appendChild(this.topmenu);


    // TOP CONTENT HIDDEN
    this.colorSelect = new UIL.Color({target:this.topcontent, callback:null, name:' ', color:'no', size:100, pos:{left:'10px', top:'20px', display:'none' }, simple:true, side:'up', type:'hex' });
  



    // FUNCTION

    // content.mouseDown
    this.f[0] = function(e){
        if(e.target.name){
            var name = e.target.name;
            //console.log(name);
            /*switch(name){
                case 'timeBar': this.timerdown = true; break;
                case 'timescale': this.scrolldown = true; this.currentAction = name;break;
                case 'scaleRight': NEO.setSVG(this.scalerRight, 'fill', NEO.SELECT ); break;
                case 'scaleLeft': NEO.setSVG(this.scalerLeft, 'fill', NEO.SELECT ); break;
                default : name = '';
            }*/

            if(name == 'timeBar' || name == 'timescale' || name == 'scaleRight' || name == 'scaleLeft'){ 
                this.currentAction = name;
                this.f[1](e);
            }
            else this.currentAction = '';

            
            //this.currentAction = name;
            /*if(name=='timeBar'){
                this.timerdown = true;
                
            }else if(name=='timescale'){
                this.scrolldown = true;
            }*/
            //this.f[1](e);
        } else this.currentAction = '';
    }.bind(this);

    // content.mouseMouve
    this.f[1] = function(e){
        if(!this.currentAction) return;
        //console.log('yoooo')
        var x = e.clientX;
        var y = e.clientY;

        if(y<this.topLimite) this.currentAction = '';

        switch(this.currentAction){
            case 'timeBar': this.goTo( this.getFrameClick(x) ); break;
            case 'timescale': this.moveScroll(x); break;
            case 'scaleLeft': this.changeRange(x); break;
            case 'scaleRight': this.changeRange(x, true); break;

        }

        /*if(this.timerdown){
            this.goTo(this.getFrameClick(x));
        }
        if(this.scrolldown){
            this.posX = x;
            this.move();
        }*/
    }.bind(this);

    // content.mouseUp
    this.f[2] = function(e){
        this.currentAction = '';
        //this.timerdown = false;
        // this.scrolldown = false;
    }.bind(this);

    this.f[3] = function(e){
        NEO.setSVG(e.target, 'fill', NEO.SELECT );
    }.bind(this);
    this.f[4] = function(e){
        NEO.setSVG(e.target, 'fill', 'none' );
    }.bind(this);

    this.scalerLeft.onmouseover = this.f[3];
    this.scalerLeft.onmouseout = this.f[4];
    this.scalerRight.onmouseover = this.f[3];
    this.scalerRight.onmouseout = this.f[4];

    this.content.onmousedown = this.f[0];
    this.content.onmousemove = this.f[1];
    //this.content.onmouseout = this.f[2];
    this.content.onmouseup = this.f[2];
    this.content.oncontextmenu = function(e){e.preventDefault()};


    

    this.title.text2(this.frame);

    window.addEventListener("resize", function(e){this.resize(e)}.bind(this), false );




    this.resize();

    //this.scaletime(0.8);//default FLASH

    //this.changeRange();

    //this.scaletime(0.1);
    //this.scaletime(1);

    NEO.main = this;

    //NEO.changecss('.NEO.topmenu', 'background', '#FF0');


}


NEO.Timeline.prototype = {
    constructor: NEO.Timeline,
    stop:function(){
        this.inPlay = false;
        this.playButton.icon(this.playIcon);
    },
    play:function(){
        if(this.inPlay){
            this.stop();
        }else{
            this.inPlay = true;
            this.playButton.icon(this.pauseIcon);
            if(this.frame === this.maxFrame){
                this.frame=0;
                this.move(this.mid);
            }

            loop();
            //this.update();

        }
    },
    update:function(){

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.timerStep) {

            this.frame ++;

            this.autoScroll();
            this.updateTime();

            //var i = this.neo.length;
            //while(i--) this.neo[i].update(this.frame);

            var i = this.neo.length, k;
            while(i--){
                k = this.neo[i];
                k.update(this.frame);
                this.data[k.name] = k.value;
            }

            this.then = this.now - (this.delta % this.timerStep);

            if(this.frame == this.maxFrame){ this.stop();}
        }

    },
    goTo:function(f, move){
        this.frame = f;
        this.updateTime();

        //var i = this.neo.length;
        //while(i--) this.neo[i].update(this.frame);

        var i = this.neo.length, k;
        while(i--){
            k = this.neo[i];
            k.update(this.frame);
            this.data[k.name] = k.value;
        }

        if(rootUpdate) rootUpdate();

        //if(move)this.move(this.width*(f/this.maxFrame));
    },
    show:function(){
        this.content.style.display = 'block';
    },
    hide:function(){
        this.content.style.display = 'none';
    },
    setRatio:function(){
        this.ratio = this.maxFrame/this.width;
        this.invRatio = this.width/this.maxFrame;
    },

    autoScroll:function(){
        if(this.frame>this.range.end) {
            this.moveTo(this.range.end);
            //this.scaler.style.left = px +'px';
            //var rec = this.scaler.getBoundingClientRect();
            //this.moveScroll(rec.left+(this.range.mid*2))
        }

        /*var right = this.currentLeftFrame+this.viewFrame;
        if(this.frame>right) {
            this.move(this.currentScrollPosition+this.miniScaleView+this.mid);
        }*/
    },

    moveScroll:function(x){
        var px = (x-this.range.mid);

        if(px<0) px = 0;
        if(px>this.range.max) px = this.range.max;

        this.scaler.style.left = px +'px';

        this.moveRange();
    },

    moveTo:function(f){
        if(f> (this.maxFrame-this.range.lng)) f = this.maxFrame-this.range.lng;
        if(f<0) f=0;

        this.scaler.style.left = Math.round(f*this.invRatio) + 'px';

        this.moveRange();
    },

    moveRange:function(){
        var rec = this.scaler.getBoundingClientRect();
        this.range.start = Math.round(rec.left * this.ratio);
        this.range.end = Math.round(rec.right * this.ratio);
        this.leftFrame = this.frameSize*this.range.start;
        this.timeBar.style.left = -this.leftFrame+'px';

//this.currentScrollPosition = Math.floor(Math.min( this.width-this.miniScaleView, Math.max( 0, (x-this.mid) ) ) );
        this.moveMarker();

        var i = this.neo.length;
        while(i--) this.neo[i].syncroTrack( this.leftFrame );
    },

    
    changeRange:function(x, isRight){
        var rec = this.scaler.getBoundingClientRect();

        if(x){
            if(isRight){
                this.scaler.style.width = (rec.width+(x-rec.right))+'px';
            }else{
                this.scaler.style.left = x+'px';
                this.scaler.style.width = (rec.right-x)+'px';
            }
        }

        this.range.start = Math.round(rec.left * this.ratio);
        this.range.end = Math.round(rec.right * this.ratio);
        this.range.lng = Math.round(rec.width * this.ratio);
        this.range.mid = rec.width * 0.5;
        this.range.max = this.width - rec.width;

        this.frameSize = (this.width/this.range.lng).toFixed(2)*1;
        this.maxSize = this.frameSize*this.maxFrame;

        this.leftFrame = this.frameSize*this.range.start;
        

        this.timeBar.style.left = -this.leftFrame+'px';

        this.scaletime();

        var i = this.neo.length;
        while(i--) this.neo[i].syncroTrack( this.leftFrame, this.frameSize, this.maxSize );



        //console.log( this.range, this.frameSize );
    },

    moveMarker:function(){
        this.marker.style.left = ((this.frame-this.range.start)*this.frameSize)+'px';
        this.miniFramePos.style.left = (this.frame*this.invRatio)+'px';
    },
    getFrameClick:function(x){
        var f = Math.floor(x/this.frameSize)+this.range.start;
        if(f>this.maxFrame) f = this.maxFrame;
        return f;
    },
    scaletime:function(){

        var n = [
            Math.round(this.frameSize)+0.5,
            Math.round(this.frameSize*2)+0.5,
            Math.round(this.frameSize*3)+0.5,
            Math.round(this.frameSize*4)+0.5,
            Math.round(this.frameSize*5)+0.5,
        ];

        // timeline pattern
        var path = 'M0.5 10 L0.5 18' + 'M'+n[0]+' 15 L'+n[0]+' 18' + 'M'+n[1]+' 15 L'+n[1]+' 18' + 'M'+n[2]+' 15 L'+n[2]+' 18' + 'M'+n[3]+' 15 L'+n[3]+' 18' + 'M 0 19.5 L'+n[4]+' 19.5';//+ 'M-0.5 20 L'+n[4]+' 20';
        NEO.setSVG(this.patternLine, 'd', path, 0);
        NEO.setSVG(this.pattern.childNodes[0], 'width', this.frameSize*5, 0);

      
        
        var middle = (this.frameSize*0.5)+0.5;
        NEO.setSVG(this.marker, 'width',this.frameSize);
        NEO.setSVG(this.marker, 'x1',middle, 1);
        NEO.setSVG(this.marker, 'x2',middle, 1);

        this.timeBar.style.width = this.maxSize + 'px';

    },

    setFps:function(fps){
        this.fps = fps;
        this.timerStep = 1000/this.fps; 
        this.updateTime();
    },
    
    add:function(type, obj){
        obj = obj || {};
        var n;
        switch(type){
            case 'bang':  n = new NEO.Bang(obj); break;
            case 'flag':  n = new NEO.Flag(obj);  break;
            case 'switch':n = new NEO.Switch(obj);  break;
            case 'color': n = new NEO.Color(obj); break;
            case 'curve': n = new NEO.Curve(obj); break;
            case 'lfo':   n = new NEO.Lfo(obj);  break;
            case 'audio': n = new NEO.Audio(obj);   break;
            case 'video': n = new NEO.Video(obj);   break;
        }
        n.id = this.neo.length;
        n.rename();
        this.neo.push(n);
        this.calc();
        this.data = {};
        return n;
    },
    remove:function(id){
        this.neo.splice(id, 1);
        for(var i = 0; i< this.neo.length; i++){
            this.neo[i].id = i;
        }
        this.calc();
        this.data = {};
    },
    resize:function(e){
        this.viewWidth = window.innerWidth;
        this.viewHeight = window.innerHeight;

        this.width = this.viewWidth - this.decal;
        this.maxHeight = this.viewHeight - this.maxTop;
        

        this.content.style.height = this.height+'px';
        this.content.style.width = this.width+'px';
        this.topcontent.style.height = this.height+'px';
        this.timescale.style.width = this.width+'px';


        //this.setScaler();
        //this.move();
        this.setRatio();
        this.changeRange();

        this.topLimite = this.viewHeight-(this.height-10);
    },
    updateTime:function () {
        this.time = this.frame/this.fps;

        var minutes = Math.floor( this.time / 60 );
        var seconds = this.time % 60;
        var padding = seconds < 10 ? '0' : '';

        this.title.text2(this.frame);
        this.title.text( minutes + ':' + padding + seconds.toFixed( 2 ) );

        this.moveMarker();

        //var i = this.neo.length;
        //while(i--) this.neo[i].update(this.frame);
    },
    calc:function(){
        var total = 0;
        var i = this.neo.length;
        while(i--) total+=this.neo[i].h;
        this.height = 60+(total-1);
        this.content.style.height = this.height+'px';
        this.topcontent.style.height = this.height+'px';
        this.marker.style.height = (this.height-20)+'px';

        this.topLimite = this.viewHeight-(this.height-10);
        //if(total>this.height) this.showScroll(total);
        //else this.hideScroll();
    },


    liner:function(top, color){
        return NEO.DOM('NEO', 'line', 'width:100%; height:1px; top:'+(top-1)+'px;', {x1:0, y1:0.5, x2:'100%', y2:0.5, stroke:color || '#888888', 'stroke-width':1, 'stroke-linecap':'butt', fill:'none', 'stroke-opacity':1 } );
    },
    linerBottom:function(color){
        return NEO.DOM('NEO', 'line', 'width:100%; height:1px; bottom:0', {x1:0, y1:0.5, x2:'100%', y2:0.5, stroke:color || '#888888', 'stroke-width':1, 'stroke-linecap':'butt', fill:'none', 'stroke-opacity':1} );
    },
    vliner:function(top, color){
        return NEO.DOM('NEO', 'line', 'width:1px; height:100%; top:'+(top-1)+'px;', {x1:0, y1:0, x2:0, y2:'100%', stroke:color || '#888888', 'stroke-width':1, 'stroke-linecap':'butt', fill:'none', 'stroke-opacity':1} );
    },
    pins:function(){
        return NEO.DOM('NEO', 'path','width:16px; height:20px; left:0px; top:1px; pointer-events:auto; cursor:pointer;',{ width:16, height:16, 'd':'M 12 6 L 8 10 4 6', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' } );
    },
    
    dels:function(){
        return NEO.DOM('NEO', 'path','width:16px; height:20px; right:0px; top:1px; pointer-events:auto; cursor:pointer;',{ width:16, height:16, 'd':'M 12 12 L 8 8 4 12 M 4 4 L 8 8 12 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' } );
    },



    showColorSelect:function(x,y, key){
        this.colorSelect.setCallBack (function(v){ key.setColor(v); });
        this.colorSelect.setColor(NEO.hexToHtml(key.color));

        var tt = this.inner.getBoundingClientRect();
        
        //this.colorSelect.callback = null;
        this.colorSelect.hide();
        this.colorSelect.c[0].style.display = 'block';
        this.colorSelect.c[0].style.left = (x-20)+'px';
        this.colorSelect.c[0].style.top = (y-tt.top+40)+'px';
        

        
    }
}

NEO.classDefine();
//NEO.setRules('default', "NEO.track", "height")

