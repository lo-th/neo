var performance, define, exports, module;
// tween.js v.0.15.0 https://github.com/sole/tween.js
void 0===Date.now&&(Date.now=function(){return(new Date).valueOf()});var TWEEN=TWEEN||function(){var n=[];return{REVISION:"14",getAll:function(){return n},removeAll:function(){n=[]},add:function(t){n.push(t)},remove:function(t){var r=n.indexOf(t);-1!==r&&n.splice(r,1)},update:function(t){if(0===n.length)return!1;var r=0;for(t=void 0!==t?t:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now();r<n.length;)n[r].update(t)?r++:n.splice(r,1);return!0}}}();TWEEN.Tween=function(n){var t=n,r={},i={},u={},o=1e3,e=0,a=!1,f=!1,c=!1,s=0,h=null,l=TWEEN.Easing.Linear.None,p=TWEEN.Interpolation.Linear,E=[],d=null,v=!1,I=null,w=null,M=null;for(var O in n)r[O]=parseFloat(n[O],10);this.to=function(n,t){return void 0!==t&&(o=t),i=n,this},this.start=function(n){TWEEN.add(this),f=!0,v=!1,h=void 0!==n?n:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now(),h+=s;for(var o in i){if(i[o]instanceof Array){if(0===i[o].length)continue;i[o]=[t[o]].concat(i[o])}r[o]=t[o],r[o]instanceof Array==!1&&(r[o]*=1),u[o]=r[o]||0}return this},this.stop=function(){return f?(TWEEN.remove(this),f=!1,null!==M&&M.call(t),this.stopChainedTweens(),this):this},this.stopChainedTweens=function(){for(var n=0,t=E.length;t>n;n++)E[n].stop()},this.delay=function(n){return s=n,this},this.repeat=function(n){return e=n,this},this.yoyo=function(n){return a=n,this},this.easing=function(n){return l=n,this},this.interpolation=function(n){return p=n,this},this.chain=function(){return E=arguments,this},this.onStart=function(n){return d=n,this},this.onUpdate=function(n){return I=n,this},this.onComplete=function(n){return w=n,this},this.onStop=function(n){return M=n,this},this.update=function(n){var f;if(h>n)return!0;v===!1&&(null!==d&&d.call(t),v=!0);var M=(n-h)/o;M=M>1?1:M;var O=l(M);for(f in i){var m=r[f]||0,N=i[f];N instanceof Array?t[f]=p(N,O):("string"==typeof N&&(N=m+parseFloat(N,10)),"number"==typeof N&&(t[f]=m+(N-m)*O))}if(null!==I&&I.call(t,O),1==M){if(e>0){isFinite(e)&&e--;for(f in u){if("string"==typeof i[f]&&(u[f]=u[f]+parseFloat(i[f],10)),a){var T=u[f];u[f]=i[f],i[f]=T}r[f]=u[f]}return a&&(c=!c),h=n+s,!0}null!==w&&w.call(t);for(var g=0,W=E.length;W>g;g++)E[g].start(n);return!1}return!0}},TWEEN.Easing={Linear:{None:function(n){return n}},Quadratic:{In:function(n){return n*n},Out:function(n){return n*(2-n)},InOut:function(n){return(n*=2)<1?.5*n*n:-.5*(--n*(n-2)-1)}},Cubic:{In:function(n){return n*n*n},Out:function(n){return--n*n*n+1},InOut:function(n){return(n*=2)<1?.5*n*n*n:.5*((n-=2)*n*n+2)}},Quartic:{In:function(n){return n*n*n*n},Out:function(n){return 1- --n*n*n*n},InOut:function(n){return(n*=2)<1?.5*n*n*n*n:-.5*((n-=2)*n*n*n-2)}},Quintic:{In:function(n){return n*n*n*n*n},Out:function(n){return--n*n*n*n*n+1},InOut:function(n){return(n*=2)<1?.5*n*n*n*n*n:.5*((n-=2)*n*n*n*n+2)}},Sinusoidal:{In:function(n){return 1-Math.cos(n*Math.PI/2)},Out:function(n){return Math.sin(n*Math.PI/2)},InOut:function(n){return.5*(1-Math.cos(Math.PI*n))}},Exponential:{In:function(n){return 0===n?0:Math.pow(1024,n-1)},Out:function(n){return 1===n?1:1-Math.pow(2,-10*n)},InOut:function(n){return 0===n?0:1===n?1:(n*=2)<1?.5*Math.pow(1024,n-1):.5*(-Math.pow(2,-10*(n-1))+2)}},Circular:{In:function(n){return 1-Math.sqrt(1-n*n)},Out:function(n){return Math.sqrt(1- --n*n)},InOut:function(n){return(n*=2)<1?-.5*(Math.sqrt(1-n*n)-1):.5*(Math.sqrt(1-(n-=2)*n)+1)}},Elastic:{In:function(n){var t,r=.1,i=.4;return 0===n?0:1===n?1:(!r||1>r?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),-(r*Math.pow(2,10*(n-=1))*Math.sin(2*(n-t)*Math.PI/i)))},Out:function(n){var t,r=.1,i=.4;return 0===n?0:1===n?1:(!r||1>r?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),r*Math.pow(2,-10*n)*Math.sin(2*(n-t)*Math.PI/i)+1)},InOut:function(n){var t,r=.1,i=.4;return 0===n?0:1===n?1:(!r||1>r?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),(n*=2)<1?-.5*r*Math.pow(2,10*(n-=1))*Math.sin(2*(n-t)*Math.PI/i):r*Math.pow(2,-10*(n-=1))*Math.sin(2*(n-t)*Math.PI/i)*.5+1)}},Back:{In:function(n){var t=1.70158;return n*n*((t+1)*n-t)},Out:function(n){var t=1.70158;return--n*n*((t+1)*n+t)+1},InOut:function(n){var t=2.5949095;return(n*=2)<1?.5*n*n*((t+1)*n-t):.5*((n-=2)*n*((t+1)*n+t)+2)}},Bounce:{In:function(n){return 1-TWEEN.Easing.Bounce.Out(1-n)},Out:function(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375},InOut:function(n){return.5>n?.5*TWEEN.Easing.Bounce.In(2*n):.5*TWEEN.Easing.Bounce.Out(2*n-1)+.5}}},TWEEN.Interpolation={Linear:function(n,t){var r=n.length-1,i=r*t,u=Math.floor(i),o=TWEEN.Interpolation.Utils.Linear;return 0>t?o(n[0],n[1],i):t>1?o(n[r],n[r-1],r-i):o(n[u],n[u+1>r?r:u+1],i-u)},Bezier:function(n,t){var r,i=0,u=n.length-1,o=Math.pow,e=TWEEN.Interpolation.Utils.Bernstein;for(r=0;u>=r;r++)i+=o(1-t,u-r)*o(t,r)*n[r]*e(u,r);return i},CatmullRom:function(n,t){var r=n.length-1,i=r*t,u=Math.floor(i),o=TWEEN.Interpolation.Utils.CatmullRom;return n[0]===n[r]?(0>t&&(u=Math.floor(i=r*(1+t))),o(n[(u-1+r)%r],n[u],n[(u+1)%r],n[(u+2)%r],i-u)):0>t?n[0]-(o(n[0],n[0],n[1],n[1],-i)-n[0]):t>1?n[r]-(o(n[r],n[r],n[r-1],n[r-1],i-r)-n[r]):o(n[u?u-1:0],n[u],n[u+1>r?r:u+1],n[u+2>r?r:u+2],i-u)},Utils:{Linear:function(n,t,r){return(t-n)*r+n},Bernstein:function(n,t){var r=TWEEN.Interpolation.Utils.Factorial;return r(n)/r(t)/r(n-t)},Factorial:function(){var n=[1];return function(t){var r,i=1;if(n[t])return n[t];for(r=t;r>1;r--)i*=r;return n[t]=i}}(),CatmullRom:function(n,t,r,i,u){var o=.5*(r-n),e=.5*(i-t),a=u*u,f=u*a;return(2*t-2*r+o+e)*f+(-3*t+3*r-2*o-e)*a+o*u+t}}},"undefined"!=typeof module&&module.exports&&(module.exports=TWEEN);
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
            //NEO.SELECT = '#035fcf';
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
            NEO.CC('NEO.inner', 'width:100%; top:40px; height:auto; overflow:hidden; background:none;');

            NEO.CC('NEO.base', 'position:relative; transition:height, 0.1s ease-out; height:80px; overflow:hidden;');

            NEO.CC('NEO.track', 'position:absolute; left:0; top:20px; width:100px; height:60px; overflow:hidden; pointer-events:auto; cursor:pointer; background:none; ');
            NEO.CC('NEO.trackTop', 'position:absolute; left:0; top:20px; width:100%; height:60px; overflow:hidden; pointer-events:none; background:none; ');

            NEO.CC('NEO.text', NEO.txt1);

            NEO.DEF = true;
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
            while ( dom.children.length ) dom.removeChild( dom.lastChild );
        },
        DOM:function(cc, type, css, obj, dom, id){
            type = type || 'div';
            if(type=='rect' || type=='path' || type=='polygon' || type=='text' || type=='pattern' || type=='defs' || type=='g' || type=='line' || type=='foreignObject' || type=='linearGradient' || type=='stop' || type=='animate' || type=='radialGradient' ){
                if(dom==undefined) dom = document.createElementNS( this.svgns, 'svg' );
                var g = document.createElementNS( this.svgns, type );

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
            document.getElementsByTagName('head')[0].appendChild(style);
            if(!(style.sheet||{}).insertRule) (style.styleSheet || style.sheet).addRule(adds+name, rules);
            else style.sheet.insertRule(adds+name+"{"+rules+"}",0);
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

    this.frameSize = 10;
    this.currentLeftFrame = 0;
    this.viewFrame = Math.round(this.width/this.frameSize);
    this.fps = 60;
    this.timerStep = 1000/this.fps;

    this.now = 0;
    this.delta = 0;
    this.then = Date.now();

    this.maxFrame = 750; // default flash

    this.maxSize = this.frameSize*this.maxFrame;
    this.currentPosition = this.currentLeftFrame*this.frameSize;
    this.ratio = this.maxFrame/this.width;
    this.invRatio = this.width/this.maxFrame;
    this.viewFrame = this.width/this.frameSize;
    this.posX = 0;

    this.timerdown = false;
    this.scrolldown = false;
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

    var callbackSize = function(v){ this.scaletime(v); }.bind(this);
    var callbackFps = function(v){ this.setFps(v); }.bind(this);
    var callbackList = function(v){ this.add(v); this.addList.text('ADD'); }.bind(this);
    var callbackPlay = function(v){ this.play(); }.bind(this);
    var callbackStart = function(v){ this.goTo(0, true); }.bind(this);
    var callbackEnd = function(v){ this.goTo(this.maxFrame, true); }.bind(this);

   
    this.sizer = new UIL.Slide({target:this.topmenu, callback:callbackSize, name:'scale', min:0.1, max:4, value:0.8, step:0.1, color:'no', size:150, pos:{left:'auto', right:'0', top:'2px' }});
    this.butFps = new UIL.Number({target:this.topmenu, callback:callbackFps, name:'fps', min:12, max:60, value:60, step:1, color:'no', size:82, pos:{left:'auto', right:'130px', top:'2px' }});
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

    this.pattern2 = NEO.DOM('NEO', 'defs', 'width:100%; height:10px; top:5px;', {} );
    p = NEO.DOM(null, 'pattern', '', {id:'timeScale', width:10, height:10, patternUnits:'userSpaceOnUse'}, this.pattern2, 0 );
    g = NEO.DOM(null, 'g', '', { stroke:'#888', 'stroke-width':'1', fill:'none'}, p, 0 );
    NEO.DOM(null, 'path', '', { d:'M0 10 L10 0 M0 5 L5 0 M5 10 L10 5'}, g, 0 );
    NEO.DOM(null, 'rect', '', {width:'100%', height:10, x:0, fill:'url(#timeScale)'}, this.pattern2 );
    this.timescale.appendChild(this.pattern2);

    this.scaler = NEO.DOM('NEO', 'rect', 'width:40px; height:16px; top:2px', {width:40, height:16, x:0, y:0, fill:'rgba(0,0,0,0.5)', stroke:'#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
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
            if(name=='timeBar'){
                this.timerdown = true;
                
            }else if(name=='timescale'){
                this.scrolldown = true;

            }
            this.f[1](e);
        }
    }.bind(this);

    // content.mouseMouve
    this.f[1] = function(e){
        var x = e.clientX;
        var y = e.clientY;
        if(y<this.topLimite)this.f[2]();

        if(this.timerdown){
            //this.frame = this.getFrameClick(x);
            //this.updateTime();

            this.goTo(this.getFrameClick(x));
        }
        if(this.scrolldown){
            this.posX = x;
            this.move();
        }
    }.bind(this);

    // content.mouseUp
    this.f[2] = function(e){
        this.timerdown = false;
        this.scrolldown = false;
    }.bind(this);

    this.content.onmousedown = this.f[0];
    this.content.onmousemove = this.f[1];
    //this.content.onmouseout = this.f[2];
    this.content.onmouseup = this.f[2];
    this.content.oncontextmenu = function(e){e.preventDefault()};



    

    this.title.text2(this.frame);

    window.addEventListener("resize", function(e){this.resize(e)}.bind(this), false );
    this.resize();

    this.scaletime(0.8);//default FLASH

    //this.scaletime(0.1);
    //this.scaletime(1);

    NEO.main = this;
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

        if(move)this.move(this.width*(f/this.maxFrame));
    },
    show:function(){
        this.content.style.display = 'block';
    },
    hide:function(){
        this.content.style.display = 'none';
    },
    autoScroll:function(){
        var right = this.currentLeftFrame+this.viewFrame;
        if(this.frame>right) {
            this.move(this.currentScrollPosition+this.miniScaleView+this.mid);
        }
    },
    move:function(x){
        x = x || this.posX;

        this.mid = this.miniScaleView*0.5;
        this.currentScrollPosition = Math.floor(Math.min( this.width-this.miniScaleView, Math.max( 0, (x-this.mid) ) ) );
        this.currentLeftFrame = Math.floor(this.currentScrollPosition*this.ratio);
        this.currentPosition =  Math.floor(this.currentLeftFrame*this.frameSize);

        if(this.currentPosition<0){ 
            this.currentPosition = 0;
            this.currentLeftFrame = 0;
        }

        this.scaler.style.left = this.currentScrollPosition+'px';
        this.timeBar.style.left = -this.currentPosition+'px';
        this.moveMarker();

        var i = this.neo.length;
        while(i--) this.neo[i].move();
    },
    moveMarker:function(){
        this.marker.style.left = ((this.frame-this.currentLeftFrame)*this.frameSize)+'px';
        this.miniFramePos.style.left = (this.frame*this.invRatio)+'px';
    },
    getFrameClick:function(x){
        var f = Math.floor(x/this.frameSize)+this.currentLeftFrame;
        if(f>this.maxFrame) f = this.maxFrame;
        return f;
    },
    scaletime:function(s){

        this.frameSize = Math.floor(s*10);
        this.maxSize = (this.maxFrame+1)*this.frameSize;

        var n = [
            Math.round(this.frameSize)+0.5,
            Math.round(this.frameSize*2)+0.5,
            Math.round(this.frameSize*3)+0.5,
            Math.round(this.frameSize*4)+0.5,
            Math.round(this.frameSize*5)+0.5,
        ];

        // timeline pattern
        var path = 'M0.5 10 L0.5 18' + 'M'+n[0]+' 15 L'+n[0]+' 18' + 'M'+n[1]+' 15 L'+n[1]+' 18' + 'M'+n[2]+' 15 L'+n[2]+' 18' + 'M'+n[3]+' 15 L'+n[3]+' 18' + 'M-0.5 20 L'+n[4]+' 20';
        NEO.setSVG(this.patternLine, 'd', path, 0);
        NEO.setSVG(this.pattern.childNodes[0], 'width', this.frameSize*5, 0);

      
        this.timeBar.style.width = this.maxSize + 'px';

        var i = this.neo.length;
        while(i--) this.neo[i].setSize();

        var middle = (this.frameSize*0.5)+0.5;
        NEO.setSVG(this.marker, 'width',this.frameSize);
        NEO.setSVG(this.marker, 'x1',middle, 1);
        NEO.setSVG(this.marker, 'x2',middle, 1);


        this.setScaler();
        this.move();

    },
    setScaler:function(){
        this.ratio = this.maxFrame/this.width;
        this.viewFrame = Math.floor(this.width/this.frameSize);
        this.miniScaleView = Math.floor(this.invRatio * this.viewFrame);

        if(this.maxSize<this.width){
            this.scaler.style.display = 'none';
        }else{
            this.scaler.style.display = 'block';
            this.scaler.style.width = this.miniScaleView+'px';
            NEO.setSVG(this.scaler, 'width',this.miniScaleView);
        }
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
            case 'switch':  n = new NEO.Switch(obj);  break;
            case 'color': n = new NEO.Color(obj); break;
            case 'curve': n = new NEO.Curve(obj); break;
            case 'lfo':   n = new NEO.Lfo(obj);  break;
            case 'audio':   n = new NEO.Audio(obj);   break;
            case 'video':   n = new NEO.Video(obj);   break;
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
        this.invRatio = this.width/this.maxFrame;

        this.content.style.height = this.height+'px';
        this.content.style.width = this.width+'px';
        this.topcontent.style.height = this.height+'px';
        this.timescale.style.width = this.width+'px';
        this.setScaler();
        this.move();

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
        return NEO.DOM('NEO', 'line', 'width:100%; height:1px; top:'+(top-1)+'px;', {x1:0, y1:0, x2:'100%', y2:0, stroke:color || '#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
    },
    linerBottom:function(color){
        return NEO.DOM('NEO', 'line', 'width:100%; height:1px; bottom:0', {x1:0, y1:0, x2:'100%', y2:0, stroke:color || '#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
    },
    vliner:function(top, color){
        return NEO.DOM('NEO', 'line', 'width:1px; height:100%; top:'+(top-1)+'px;', {x1:0, y1:0, x2:0, y2:'100%', stroke:color || '#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
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
NEO.TimerGraph = function(obj){

}

NEO.TimerGraph.prototype = {
    constructor: NEO.TimerGraph,

    init:function(){
    },
    pattern:function(){
        var t= [];
        t[0] = "<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='pp' x='0' y='0' width='50' height='20' patternUnits='userSpaceOnUse'>";
        t[1] = "<g fill='none' stroke='#f0934e' stroke-width='1'><path d='M0 5 L0 20'/><path d='M10 10 L10 20'/><path d='M20 10 L20 20'/><path d='M30 10 L30 20'/><path d='M40 10 L40 20'/><path d='M50 5 L50 20'/></g>";
        t[2] = "</pattern></defs><rect x='0' y='0' width='100%' height='20' fill='url(#pp)'/></svg>";
        return t.join("\n");
    }
}
NEO.Proto = function(obj){

    obj = obj || {};

    this.autoName = true;
    if(obj.name) this.autoName = false;

    this.name = obj.name || this.type;

    this.value = null;

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
    //this.callback = obj.callback || function(){};

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

    ;

    

    //this.setSize();
}

NEO.Proto.prototype = {
    constructor: NEO.Proto,

    init:function(){
        this.c[0].style.background = NEO.bgcolor(this.color);
        for(var i=0, lng=this.c.length; i!==lng; i++){
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

        this.c[1].textContent = this.name;
        this.c[5].name = this.type;

        this.setSize();

        if(this.keys.length) this.addKeys();
    },

    rename:function(){
        if(this.autoName){
            this.name = this.id+'-'+this.type;
            this.c[1].textContent = this.name;
        }
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
        //if(this.callback)this.callback = null;
        if(this.value) this.value = null;

        //NEO.main.data[this.name] = false;

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
        var i, py = 0, lng = this.items.length;
        this.items.sort( function ( a, b ) { return a.id - b.id; } );

        if(this.names){
            for(i=0; i!==lng; i++){
                this.names[i] = this.items[i].name;
                this.items[i].setPy(py);
                if(py<2) py++;
                else py = 0;
            }
        }

        if(this.ends){
            for(i=0; i!==lng; i++){
                this.ends[i] = this.items[i].end;
            }
        }

        if(this.colors){
            for(i=0; i!==lng; i++){
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
NEO.Curve = function(obj){

    obj = obj || {};
    
    this.type = 'curve';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Curve.prototype = Object.create( NEO.Proto.prototype );
NEO.Curve.prototype.constructor = NEO.Curve;

NEO.Curve.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
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

    var i = this.keys.length, k;
    while(i--){
        k = this.keys[i];
        if(f==k){ this.value = this.items[i].name; this.c[6].style.background = 'rgba(86,175,178,0.3)'; return;}
        if(f>k){ this.value = this.items[i].name; this.c[6].style.background = 'none';return;}
    }
    this.c[6].style.background = 'none';
    this.value = '';

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
        this.flagName.clear()
        NEO.clearDOM(this.content);
        this.content = null;
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

NEO.Lfo = function(obj){

    obj = obj || {};
    
    this.type = 'lfo';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Lfo.prototype = Object.create( NEO.Proto.prototype );
NEO.Lfo.prototype.constructor = NEO.Lfo;

NEO.Lfo.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Switch = function(obj){

    this.type = 'switch';

    this.ends = obj.ends || [];
    
    NEO.Proto.call( this, obj );

    this.init();
}

NEO.Switch.prototype = Object.create( NEO.Proto.prototype );
NEO.Switch.prototype.constructor = NEO.Switch;

NEO.Switch.prototype.update = function(f){
    //var f = NEO.frame;
    this.value = false;
    this.c[6].style.background = 'none';

    var i = this.keys.length;
    while(i--){
        if(f>=this.keys[i] && f<=this.ends[i]){ 
            this.value = true;
            this.c[6].style.background = 'rgba(86,175,178,0.3)';
            return;
        }
    }
};


// ------------------------------------------


NEO.KeySwitch = function(f, end){
    this.id = f;
    this.end = end || (f+3);
    this.length = this.end-this.id;

    var frameSize = NEO.main.frameSize;
    var l = f*frameSize;
    this.w = frameSize;
    this.content = NEO.DOM('NEO', 'div','width:'+(this.w*(this.length+1))+'px; height:60px; left:'+l+'px; top:0; pointer-events:auto; cursor:default;');
    this.content.appendChild(NEO.DOM('NEO', 'rect','width:100%; height:60px; top:0; ',{ width:'100%', height:60, fill:'rgba(86,175,178,0.5)' } ));
    this.content.appendChild(NEO.DOM('NEO', 'div','width:'+this.w+'px; height:60px; top:0; left:0; pointer-events:auto; cursor:e-resize; background:#56afb2;' ));
    this.content.appendChild(NEO.DOM('NEO', 'div','width:'+this.w+'px; height:60px; top:0; right:0; pointer-events:auto; cursor:e-resize; background:#56afb2;' ));
    this.content.name = 'switch';
    this.content.childNodes[1].name = 'switch';
    this.content.childNodes[2].name = 'switch';
}

NEO.KeySwitch.prototype = {
    constructor: NEO.KeyBang,
    clear:function(){
        NEO.clearDOM(this.content);
        this.content = null;
    },
    reSize:function(w){
        this.w = w;
        this.content.style.width = (this.w*(this.length+1)) + 'px';
        this.content.style.left = (this.id*this.w) + 'px';
        this.content.childNodes[1].style.width = this.w+'px';
        this.content.childNodes[2].style.width = this.w+'px';
    },
    move:function(f, isEnd){
        if(isEnd) this.end = f;
        else this.id = f;
        this.length = this.end-this.id;
        this.content.style.left = (this.id*this.w) + 'px';
        this.content.style.width = (this.w*(this.length+1)) + 'px';
    }
}
NEO.Audio = function(obj){

    obj = obj || {};
    
    this.type = 'audio';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Audio.prototype = Object.create( NEO.Proto.prototype );
NEO.Audio.prototype.constructor = NEO.Audio;

NEO.Audio.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Video = function(obj){

    obj = obj || {};
    
    this.type = 'video';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Video.prototype = Object.create( NEO.Proto.prototype );
NEO.Video.prototype.constructor = NEO.Video;

NEO.Video.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
