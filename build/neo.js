var performance, define, exports, module;
// tween.js v.0.15.0 https://github.com/sole/tween.js
void 0===Date.now&&(Date.now=function(){return(new Date).valueOf()});var TWEEN=TWEEN||function(){var n=[];return{REVISION:"14",getAll:function(){return n},removeAll:function(){n=[]},add:function(t){n.push(t)},remove:function(t){var r=n.indexOf(t);-1!==r&&n.splice(r,1)},update:function(t){if(0===n.length)return!1;var r=0;for(t=void 0!==t?t:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now();r<n.length;)n[r].update(t)?r++:n.splice(r,1);return!0}}}();TWEEN.Tween=function(n){var t=n,r={},i={},u={},o=1e3,e=0,a=!1,f=!1,c=!1,s=0,h=null,l=TWEEN.Easing.Linear.None,p=TWEEN.Interpolation.Linear,E=[],d=null,v=!1,I=null,w=null,M=null;for(var O in n)r[O]=parseFloat(n[O],10);this.to=function(n,t){return void 0!==t&&(o=t),i=n,this},this.start=function(n){TWEEN.add(this),f=!0,v=!1,h=void 0!==n?n:"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now?window.performance.now():Date.now(),h+=s;for(var o in i){if(i[o]instanceof Array){if(0===i[o].length)continue;i[o]=[t[o]].concat(i[o])}r[o]=t[o],r[o]instanceof Array==!1&&(r[o]*=1),u[o]=r[o]||0}return this},this.stop=function(){return f?(TWEEN.remove(this),f=!1,null!==M&&M.call(t),this.stopChainedTweens(),this):this},this.stopChainedTweens=function(){for(var n=0,t=E.length;t>n;n++)E[n].stop()},this.delay=function(n){return s=n,this},this.repeat=function(n){return e=n,this},this.yoyo=function(n){return a=n,this},this.easing=function(n){return l=n,this},this.interpolation=function(n){return p=n,this},this.chain=function(){return E=arguments,this},this.onStart=function(n){return d=n,this},this.onUpdate=function(n){return I=n,this},this.onComplete=function(n){return w=n,this},this.onStop=function(n){return M=n,this},this.update=function(n){var f;if(h>n)return!0;v===!1&&(null!==d&&d.call(t),v=!0);var M=(n-h)/o;M=M>1?1:M;var O=l(M);for(f in i){var m=r[f]||0,N=i[f];N instanceof Array?t[f]=p(N,O):("string"==typeof N&&(N=m+parseFloat(N,10)),"number"==typeof N&&(t[f]=m+(N-m)*O))}if(null!==I&&I.call(t,O),1==M){if(e>0){isFinite(e)&&e--;for(f in u){if("string"==typeof i[f]&&(u[f]=u[f]+parseFloat(i[f],10)),a){var T=u[f];u[f]=i[f],i[f]=T}r[f]=u[f]}return a&&(c=!c),h=n+s,!0}null!==w&&w.call(t);for(var g=0,W=E.length;W>g;g++)E[g].start(n);return!1}return!0}},TWEEN.Easing={Linear:{None:function(n){return n}},Quadratic:{In:function(n){return n*n},Out:function(n){return n*(2-n)},InOut:function(n){return(n*=2)<1?.5*n*n:-.5*(--n*(n-2)-1)}},Cubic:{In:function(n){return n*n*n},Out:function(n){return--n*n*n+1},InOut:function(n){return(n*=2)<1?.5*n*n*n:.5*((n-=2)*n*n+2)}},Quartic:{In:function(n){return n*n*n*n},Out:function(n){return 1- --n*n*n*n},InOut:function(n){return(n*=2)<1?.5*n*n*n*n:-.5*((n-=2)*n*n*n-2)}},Quintic:{In:function(n){return n*n*n*n*n},Out:function(n){return--n*n*n*n*n+1},InOut:function(n){return(n*=2)<1?.5*n*n*n*n*n:.5*((n-=2)*n*n*n*n+2)}},Sinusoidal:{In:function(n){return 1-Math.cos(n*Math.PI/2)},Out:function(n){return Math.sin(n*Math.PI/2)},InOut:function(n){return.5*(1-Math.cos(Math.PI*n))}},Exponential:{In:function(n){return 0===n?0:Math.pow(1024,n-1)},Out:function(n){return 1===n?1:1-Math.pow(2,-10*n)},InOut:function(n){return 0===n?0:1===n?1:(n*=2)<1?.5*Math.pow(1024,n-1):.5*(-Math.pow(2,-10*(n-1))+2)}},Circular:{In:function(n){return 1-Math.sqrt(1-n*n)},Out:function(n){return Math.sqrt(1- --n*n)},InOut:function(n){return(n*=2)<1?-.5*(Math.sqrt(1-n*n)-1):.5*(Math.sqrt(1-(n-=2)*n)+1)}},Elastic:{In:function(n){var t,r=.1,i=.4;return 0===n?0:1===n?1:(!r||1>r?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),-(r*Math.pow(2,10*(n-=1))*Math.sin(2*(n-t)*Math.PI/i)))},Out:function(n){var t,r=.1,i=.4;return 0===n?0:1===n?1:(!r||1>r?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),r*Math.pow(2,-10*n)*Math.sin(2*(n-t)*Math.PI/i)+1)},InOut:function(n){var t,r=.1,i=.4;return 0===n?0:1===n?1:(!r||1>r?(r=1,t=i/4):t=i*Math.asin(1/r)/(2*Math.PI),(n*=2)<1?-.5*r*Math.pow(2,10*(n-=1))*Math.sin(2*(n-t)*Math.PI/i):r*Math.pow(2,-10*(n-=1))*Math.sin(2*(n-t)*Math.PI/i)*.5+1)}},Back:{In:function(n){var t=1.70158;return n*n*((t+1)*n-t)},Out:function(n){var t=1.70158;return--n*n*((t+1)*n+t)+1},InOut:function(n){var t=2.5949095;return(n*=2)<1?.5*n*n*((t+1)*n-t):.5*((n-=2)*n*((t+1)*n+t)+2)}},Bounce:{In:function(n){return 1-TWEEN.Easing.Bounce.Out(1-n)},Out:function(n){return 1/2.75>n?7.5625*n*n:2/2.75>n?7.5625*(n-=1.5/2.75)*n+.75:2.5/2.75>n?7.5625*(n-=2.25/2.75)*n+.9375:7.5625*(n-=2.625/2.75)*n+.984375},InOut:function(n){return.5>n?.5*TWEEN.Easing.Bounce.In(2*n):.5*TWEEN.Easing.Bounce.Out(2*n-1)+.5}}},TWEEN.Interpolation={Linear:function(n,t){var r=n.length-1,i=r*t,u=Math.floor(i),o=TWEEN.Interpolation.Utils.Linear;return 0>t?o(n[0],n[1],i):t>1?o(n[r],n[r-1],r-i):o(n[u],n[u+1>r?r:u+1],i-u)},Bezier:function(n,t){var r,i=0,u=n.length-1,o=Math.pow,e=TWEEN.Interpolation.Utils.Bernstein;for(r=0;u>=r;r++)i+=o(1-t,u-r)*o(t,r)*n[r]*e(u,r);return i},CatmullRom:function(n,t){var r=n.length-1,i=r*t,u=Math.floor(i),o=TWEEN.Interpolation.Utils.CatmullRom;return n[0]===n[r]?(0>t&&(u=Math.floor(i=r*(1+t))),o(n[(u-1+r)%r],n[u],n[(u+1)%r],n[(u+2)%r],i-u)):0>t?n[0]-(o(n[0],n[0],n[1],n[1],-i)-n[0]):t>1?n[r]-(o(n[r],n[r],n[r-1],n[r-1],i-r)-n[r]):o(n[u?u-1:0],n[u],n[u+1>r?r:u+1],n[u+2>r?r:u+2],i-u)},Utils:{Linear:function(n,t,r){return(t-n)*r+n},Bernstein:function(n,t){var r=TWEEN.Interpolation.Utils.Factorial;return r(n)/r(t)/r(n-t)},Factorial:function(){var n=[1];return function(t){var r,i=1;if(n[t])return n[t];for(r=t;r>1;r--)i*=r;return n[t]=i}}(),CatmullRom:function(n,t,r,i,u){var o=.5*(r-n),e=.5*(i-t),a=u*u,f=u*a;return(2*t-2*r+o+e)*f+(-3*t+3*r-2*o-e)*a+o*u+t}}},"undefined"!=typeof module&&module.exports&&(module.exports=TWEEN);
var FRAME = ( function () {

	return {

		VERSION: 2,

		/*Curves: {
			
			Linear: function ( points ) {

				var linear = function ( p0, p1, t0, t1, t ) {

                        return ( p1 - p0 ) * ( ( t - t0 ) / ( t1 - t0 ) ) + p0;

                };

                this.points = points;
				this.value = 0;

				this.update = function ( time ) {

					if ( time <= points[ 0 ] ) {

						this.value = points[ 1 ];

					} else if ( time >= points[ points.length - 2 ] ) {

						this.value = points[ points.length - 1 ];

					} else {

						for ( var i = 0, l = points.length; i < l; i += 2 ) {

							if ( time < points[ i + 2 ] ) {

								this.value = linear( points[ i + 1 ], points[ i + 3 ], points[ i ], points[ i + 2 ], time );
								break;

							}

						}

					}

				};

			},

			Sin: function () {

				var frequency = 10;

				this.value = 0;

				this.update = function ( time ) {

					this.value = Math.sin( time * frequency );

				};

			},

			Saw: function ( frequency, offset, min, max ) {

				var delta = max - min;

				this.frequency = frequency;
				this.offset = offset;
				this.min = min;
				this.max = max;
				this.value = 0;

				this.update = function ( time ) {

					this.value = ( ( ( time - offset ) % frequency ) / frequency ) * delta + min;

				};

			}

		},*/

		Module: function ( data ) {

			if ( data === undefined ) data = {};

			this.name = '';
			this.parameters = data.parameters !== undefined ? data.parameters : {};

			this.init = data.init !== undefined ? data.init : function () {};
			this.start = data.start !== undefined ? data.start : function () {};
			this.update = data.update !== undefined ? data.update : function () {};
			this.complete = data.complete !== undefined ? data.complete : function () {};

		},

		Parameter: {

			Boolean: function ( name, value ) {
				this.name = name;
				this.value = value || true;
			},

			Color: function ( name, value ) {
				this.name = name;
				this.value = value || 0xffffff;
			},

			Float: function ( name, value, min, max ) {
				this.name = name;
				this.value = value || 0.0;
				this.min = min !== undefined ? min : - Infinity;
				this.max = max !== undefined ? max : Infinity;
			},

			Integer: function ( name, value, min, max ) {
				this.name = name;
				this.value = value || 0;
				this.min = min !== undefined ? min : - Infinity;
				this.max = max !== undefined ? max : Infinity;
			},

			String: function ( name, value ) {
				this.name = name;
				this.value = value || '';
			},

			Vector2: function ( name, value ) {
				this.name = name
				this.value = value !== undefined ? value : [ 0, 0 ];
			},

			Vector3: function ( name, value ) {
				this.name = name;
				this.value = value !== undefined ? value : [ 0, 0, 0 ];
			}

		},

		Timeline: function () {

			//var curves = [];
			var elements = [];
			var active = [];

			var next = 0, prevtime = 0;

			return {

				//curves: curves,
				elements: elements,

				add: function ( element ) {

					elements.push( element );
					this.sort();

				},

				remove: function ( element ) {

					var i = elements.indexOf( element );

					if ( i !== -1 ) {

						elements.splice( i, 1 );

					}

				},

				sort: function () {

					elements.sort( function ( a, b ) { return a.start - b.start; } );

				},
				
				update: function ( time ) {

					if ( time < prevtime ) {

						this.reset();

					}

					// add to active

					while ( elements[ next ] ) {

						var element = elements[ next ];

						if ( element.start > time ) {

							break;

						}

						if ( element.end > time ) {

							active.push( element );
							element.module.start();

						}

						next ++;

					}

					// remove from active

					var i = 0;

					while ( active[ i ] ) {

						var element = active[ i ];

						if ( element.end < time ) {

							element.module.complete();
							active.splice( i, 1 );
							continue;

						}

						i ++;

					}

					// update curves

					/*for ( var i = 0, l = curves.length; i < l; i ++ ) {

						curves[ i ].update( time );

					}*/

					// render

					active.sort( function ( a, b ) { return a.layer - b.layer; } );
					var l = active.length;
					for ( i = 0; i < l; i ++ ) {

						var element = active[ i ];
						element.module.update( ( time - element.start ) / ( element.end - element.start ) );

					}

					prevtime = time;

				},

				clear: function() {

					while ( active.length ) active.pop();
					active = [];
					next = 0;

					while(elements.length) elements.pop();
					elements = [];

				},

				reset: function () {

					while ( active.length ) active.pop();
					next = 0;

				}

			}

		},

		TimelineElement: function () {
			
			var id = 0;
			
			return function ( module, layer, start, end ) {

				this.id = id ++;
				this.module = module;
				this.layer = layer;
				this.start = start;
				this.end = end;

				this.module.init();
				
			};

		}()

	}

} )();

/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_| 2015
*    @author lo.th / http://lo-th.github.io/labs/
*/

'use strict';

// need uil http://lo-th.github.io/uil/build/uil.min.js
var UIL;
var loop;

var NEO = NEO || ( function () {
    return {
        main:null,
        REVISION: '0.1',
        DEF:false,
        events:[ 'onkeyup', 'onkeydown', 'onclick', 'onchange', 'onmouseover', 'onmouseout', 'onmousemove', 'onmousedown', 'onmouseup', 'onmousewheel' ],
        WIDTH:300,
        BW:190,
        AW:100, 
        svgns:"http://www.w3.org/2000/svg",
        sizer:function(w){
            this.WIDTH = w.toFixed(0);
            var s = this.WIDTH/3;
            this.BW = (s*2)-10;
            this.AW = s;

            if(this.main) this.main.changeWidth();
        },
        classDefine:function(){
            NEO.COLOR = 'NO';
            //NEO.SELECT = '#035fcf';
            //NEO.SELECTDOWN = '#024699';
            //NEO.SVGB = 'rgba(0,0,0,0.2)';
            //NEO.SVGC = 'rgba(120,120,120,0.6)';
            NEO.txt1 = 'font-family:"Open Sans", sans-serif; font-size:11px; color:#cccccc; outline:0; padding:0px 10px; left:0; top:1px; height:17px; width:100px; overflow:hidden;';

            NEO.CC('NEO', 'position:absolute; pointer-events:none; box-sizing:border-box; -o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select:none; margin:0; padding:0; ');

            NEO.CC('NEO.content', 'bottom:0; left:0; width:100px; overflow:hidden; background:none;pointer-events:auto; transition:height, 0.1s ease-out;');

            
            NEO.CC('NEO.topmenu', 'width:100%; height:24px; background:none; ');
            NEO.CC('NEO.timeBar', 'width:100px; height:20px; top:20px; background:none; pointer-events:auto; cursor:pointer;');
            NEO.CC('NEO.timescale', 'width:100px; height:20px; background:none; bottom:0; pointer-events:auto; cursor:pointer;');
            NEO.CC('NEO.inner', 'width:100%; top:40px; height:auto; overflow:hidden; background:none;');

            NEO.CC('NEO.base', 'position:relative; transition:height, 0.1s ease-out; height:80px; overflow:hidden;');
            NEO.CC('NEO.track', 'position:absolute; left:0; top:20px; width:100px; height:60px; overflow:hidden; pointer-events:auto; background:-webkit-linear-gradient( 0deg, #111 0%, #F11 100%); ');
            //NEO.CC('NEO.top', 'position:absolute; height:20px; width:100%; overflow:hidden;');
            NEO.CC('NEO.text', NEO.txt1);

            /*NEO.CC('NEO.mask', 'width:400px; height:100%; margin-left:-50px; pointer-events:auto; cursor:col-resize; background:none; display:none;');
            NEO.CC('NEO.inner', 'width:300px; top:0; left:0; height:auto; overflow:hidden; background:none;');

            

            

            NEO.CC('input', 'border:solid 1px rgba(0,0,0,0.2); background:rgba(0,0,0,0.2); transition: 0.1s ease-out;', true);
            NEO.CC('input:focus', 'border: solid 1px rgba(0,0,0,0); background:rgba(0,0,0,0.6);', true);

            NEO.CC('NEO.list', 'box-sizing:content-box; border:20px solid transparent; border-bottom:10px solid transparent; left:80px; top:0px; width:190px; height:90px; overflow:hidden; cursor:s-resize; pointer-events:auto; display:none;');
            NEO.CC('NEO.list-in', 'left:0; top:0; width:100%; background:rgba(0,0,0,0.2); ');
            NEO.CC('NEO.listItem', 'position:relative; height:18px; background:rgba(0,0,0,0.2); border-bottom:1px solid rgba(0,0,0,0.2); pointer-events:auto; cursor:pointer;'+NEO.txt1);
            NEO.CC('NEO.listItem:hover', 'background:'+NEO.SELECT+'; color:#FFFFFF;')

            NEO.CC('NEO.scroll-bg', 'cursor:w-resize; pointer-events:auto; background:rgba(256,0,0,0.2);');
            NEO.CC('NEO.svgbox', 'left:100px; top:1px; width:190px; height:17px; pointer-events:auto; cursor:pointer; font-family:"Open Sans", sans-serif; font-size:11px; text-align:center;');*/

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
        /*canvasURL:function(obj){
            var canvas = document.createElement( 'canvas' );
            canvas.width = obj.w || 20;
            canvas.height = obj.h || 20;

            var context = canvas.getContext( '2d' );
            context.fillStyle = '#444';
            context.fillRect( 0, 0, 20, 20 );
            return canvas.toDataURL();
        },*/
        setSVG:function(dom, type, value, id){
            dom.childNodes[id || 0].setAttributeNS(null, type, value );
        },
        setDOM:function(dom, type, value){
            dom.style[type] = value+'px';
        },

        DOM:function(cc, type, css, obj, dom, id){ 
            type = type || 'div';
            if(type=='rect' || type=='path' || type=='polygon' || type=='text' || type=='pattern' || type=='defs' || type=='g' || type=='line' ){
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

    this.time = 0;
    this.height = 60;
    this.width = 100;
    this.maxTop = 145;
    this.decal = decal || 0;

    this.framesize = 10;
    this.currentframe = 0;
    this.currentLeftFrame = 0;
    this.viewFrame = Math.round(this.width/this.framesize);
    this.fps = 60;
    this.timerStep = 1000/this.fps;

    this.now = 0;
    this.delta = 0;
    this.then = Date.now();

    this.totalFrame = 750; // default flash
    this.totalSize = this.framesize*this.totalFrame;
    this.currentPosition = this.currentLeftFrame*this.framesize;
    this.ratio = this.totalFrame/this.width;
    this.viewFrame = this.width/this.framesize;
    this.posX = 0;

    //this.isTimeOut = false;
    //this.timer = null;
    
    

    this.timerdown = false;
    this.scrolldown = false;
    this.inPlay = false;


    this.neo = [];
    this.f = [];

    this.content = NEO.DOM('NEO content', 'div', css);
    document.body.appendChild(this.content);

    this.top = parseFloat(this.content.style.top.substring(0,this.content.style.top.length-2));


    // TOP MENU

    this.topmenu = NEO.DOM('NEO topmenu');
    this.topmenu.appendChild(this.liner(1));

    var callbackSize = function(v){ this.scaletime(v); }.bind(this);
    var callbackFps = function(v){ this.fps = v; this.timerStep = 1000/this.fps; this.updateTime(); }.bind(this);
    var callbackList = function(v){ this.add(v); this.addList.text('ADD'); }.bind(this);
    var callbackPlay = function(v){ this.play(); }.bind(this);

   
    this.sizer = new UIL.Slide({target:this.topmenu, callback:callbackSize, name:'scale', min:0.1, max:4, value:0.8, step:0.1, color:'no', size:150, pos:{left:'auto', right:'0', top:'2px' }});
    this.setFps = new UIL.Number({target:this.topmenu, callback:callbackFps, name:'fps', min:12, max:60, value:60, step:1, color:'no', size:82, pos:{left:'auto', right:'130px', top:'2px' }});
    this.title = new UIL.Title({target:this.topmenu, name:'0:00:00', color:'no', size:120, height:20, pos:{top:'2px' } });
    this.addList = new UIL.List({target:this.topmenu, callback:callbackList, name:' ', color:'no', list:['bang', 'flag', 'curve', 'lfo', 'color', 'switch', 'audio', 'video'], size:80, pos:{left:'100px', top:'2px' }, simple:true });
    this.addList.text('ADD');

    this.playButton = new UIL.Button({target:this.topmenu, callback:callbackPlay, name:'X', color:'no', size:18, pos:{left:'190px', top:'2px' }, simple:true });
    this.playIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px'><path fill='#CCC' d='M 12 9 L 12 7 5 3 4 4 4 12 5 13 12 9 Z'/></svg>";
    this.pauseIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px'><path fill='#CCC' d='M 12 3 L 9 3 9 13 12 13 12 3 M 7 3 L 4 3 4 13 7 13 7 3 Z'/></svg>";
    this.playButton.icon(this.playIcon);


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
            this.currentframe = Math.floor(x/this.framesize)+this.currentLeftFrame;
            this.updateTime();
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



    

    this.title.text2(this.currentframe);

    window.addEventListener("resize", function(e){this.resize(e)}.bind(this), false );
    this.resize();

    this.scaletime(0.8);//default FLASH
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
            if(this.currentframe === this.totalFrame){
                this.currentframe=0;
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

            this.currentframe ++;

            this.autoScroll();
            this.updateTime();

            this.then = this.now - (this.delta % this.timerStep);


            if(this.currentframe === this.totalFrame){ this.stop();}

        }

    },
    show:function(){
        this.content.style.display = 'block';
    },
    hide:function(){
        this.content.style.display = 'none';
    },
    autoScroll:function(){
        var right = this.currentLeftFrame+this.viewFrame;
        if(this.currentframe>right) {
            this.move(this.currentScrollPosition+this.miniScaleView+this.mid);
        }
    },
    move:function(x){
        x = x || this.posX;
        this.mid = this.miniScaleView*0.5;
        this.currentScrollPosition = Math.min( this.width-this.miniScaleView, Math.max( 0, (x-this.mid) ) ).toFixed(0)*1;
        this.currentLeftFrame = Math.round(this.currentScrollPosition*this.ratio);
        this.currentPosition = this.currentLeftFrame*this.framesize;
        this.scaler.style.left = this.currentScrollPosition+'px';
        this.timeBar.style.left = -this.currentPosition+'px';
        this.moveMarker();

        var i = this.neo.length;
        while(i--) this.neo[i].move();
    },
    moveMarker:function(){
        this.marker.style.left = ((this.currentframe-this.currentLeftFrame)*this.framesize)+'px';
        this.miniFramePos.style.left = ((this.currentframe*(this.width/this.totalFrame)))+'px';
    },

    scaletime:function(s){

        var w = 100 * (100/(100*s));

        this.framesize = Math.floor(s*10);

        var ld = (this.framesize*0.5)+0.5;

        NEO.setSVG(this.pattern, 'width', 100+'%', 1);

        var n = [
            Math.round(this.framesize)+0.5,
            Math.round(this.framesize*2)+0.5,
            Math.round(this.framesize*3)+0.5,
            Math.round(this.framesize*4)+0.5,
            Math.round(this.framesize*5)+0.5,
        ];

        var path = 'M0.5 10 L0.5 18' + 'M'+n[0]+' 15 L'+n[0]+' 18' + 'M'+n[1]+' 15 L'+n[1]+' 18' + 'M'+n[2]+' 15 L'+n[2]+' 18' + 'M'+n[3]+' 15 L'+n[3]+' 18' + 'M-0.5 20 L'+n[4]+' 20';
        NEO.setSVG(this.patternLine, 'd', path, 0);
        NEO.setSVG(this.pattern.childNodes[0], 'width', this.framesize*5, 0);

        this.totalSize = this.framesize*this.totalFrame;
        //this.currentPosition = this.currentLeftFrame*this.framesize;

        //this.pattern.style.width = this.totalSize + 'px';
        this.timeBar.style.width = this.totalSize + 'px';
        //this.timeBar.style.left = this.currentPosition + 'px';
        //this.pattern.style.left = this.currentPosition +'px';

        var i = this.neo.length;
        while(i--) this.neo[i].setSize();

        NEO.setSVG(this.marker, 'width',this.framesize);
        NEO.setSVG(this.marker, 'x1',ld, 1);
        NEO.setSVG(this.marker, 'x2',ld, 1);

        //this.marker.style.left = ((this.currentframe*this.framesize)-this.currentPosition)+'px';

        this.setScaler();
        this.move();

    },
    setScaler:function(){
        this.ratio = this.totalFrame/this.width;
        this.viewFrame = Math.round(this.width/this.framesize);
        this.miniScaleView = (this.width/this.totalFrame) * this.viewFrame;
        this.scaler.style.width = this.miniScaleView+'px';
        NEO.setSVG(this.scaler, 'width',this.miniScaleView);
    },
    add:function(type, obj){
        var n;
        switch(type){
            case 'bang':  n = new NEO.Bang(obj); break;
            case 'color': n = new NEO.Color(obj); break;
            case 'curve': n = new NEO.Curve(obj); break;
            case 'flag':  n = new NEO.Flag(obj);  break;
            case 'lfo':   n = new NEO.Lfo(obj);  break;
            case 'switch':  n = new NEO.Switch(obj);  break;
            case 'audio':   n = new NEO.Audio(obj);   break;
            case 'video':   n = new NEO.Video(obj);   break;
        }
        n.id = this.neo.length;
        this.neo.push(n);
        this.calc();

        //console.log(type);
        return n;
    },
    remove:function(id){
        this.neo.splice(id, 1);
        for(var i = 0; i< this.neo.length; i++){
            this.neo[i].id = i;
        }
        this.calc();
    },
    resize:function(e){
        this.viewWidth = window.innerWidth;
        this.viewHeight = window.innerHeight;

        this.width = this.viewWidth - this.decal;
        this.maxHeight = this.viewHeight-this.maxTop;

        this.content.style.height = this.height+'px';
        this.content.style.width = this.width+'px';
        this.timescale.style.width = this.width+'px';
        this.setScaler();
        this.move();

        this.topLimite = this.viewHeight-(this.height-10);

        //console.log(this.viewFrame);


        //this.sizer.setDom(0,'left', this.width-140 );
        //this.zone = this.height-40;
        //this.calc();
        //this.f[5](0);
    },
    updateTime:function () {
        this.time = this.currentframe/this.fps;

        var minutes = Math.floor( this.time / 60 );
        var seconds = this.time % 60;
        var padding = seconds < 10 ? '0' : '';

        this.title.text2(this.currentframe);
        this.title.text( minutes + ':' + padding + seconds.toFixed( 2 ) );

        this.moveMarker();
    },
    calc:function(){
        var total = 0;
        var i = this.neo.length;
        while(i--) total+=this.neo[i].h;
        this.height = 60+(total-1);
        this.content.style.height = this.height+'px';
        this.marker.style.height = (this.height-20)+'px';

        this.topLimite = this.viewHeight-(this.height-10);
        //if(total>this.height) this.showScroll(total);
        //else this.hideScroll();
    },






    liner:function(top, color){
        var l = NEO.DOM('NEO', 'line', 'width:100%; height:1px; top:'+(top-1)+'px;', {x1:0, y1:0, x2:'100%', y2:0, stroke:color || '#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
        return l;
    },
    linerBottom:function(color){
        var l = NEO.DOM('NEO', 'line', 'width:100%; height:1px; bottom:0', {x1:0, y1:0, x2:'100%', y2:0, stroke:color || '#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
        return l;
    },
    vliner:function(top, color){
        var l = NEO.DOM('NEO', 'line', 'width:1px; height:100%; top:'+(top-1)+'px;', {x1:0, y1:0, x2:0, y2:'100%', stroke:color || '#888', 'stroke-width':1, 'stroke-linecap':'butt'} );
        return l;
    },
    pins:function(){
        var p = NEO.DOM('NEO', 'path','width:16px; height:20px; left:0px; top:1px; pointer-events:auto; cursor:pointer;',{ width:16, height:16, 'd':'M 12 6 L 8 10 4 6', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' } );
        return p;
    },
    dels:function(){
        var p = NEO.DOM('NEO', 'path','width:16px; height:20px; right:0px; top:1px; pointer-events:auto; cursor:pointer;',{ width:16, height:16, 'd':'M 12 12 L 8 8 4 12 M 4 4 L 8 8 12 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' } );
        return p;
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

    this.h = 80;
    this.show = true;

    this.id = 0;

    // define obj size
    /*this.setSize(obj.size);
    
    */
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

    this.c[6] = NEO.main.linerBottom();



    this.c[1].textContent = this.type;

    this.f[0] = function(){
        if(this.show) this.close();
        else this.open();
    }.bind(this);

    this.f[1] = function(){
        this.clear(true);
    }.bind(this);

    this.c[3].onclick = this.f[0];
    this.c[4].onclick = this.f[1];


    this.setSize();
}

NEO.Proto.prototype = {
    constructor: NEO.Proto,
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
        if(NEO.main)NEO.main.calc();
    },

    setSize:function(){
        this.c[5].style.width = NEO.main.totalSize+'px';
    },

    move:function(){
        this.c[5].style.left = -NEO.main.currentPosition+'px';
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
    },*/
    
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
    /*setTypeNumber:function( obj ){

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
NEO.Bang = function(obj){

    obj = obj || {};
    
    this.type = 'bang';

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

NEO.Bang.prototype = Object.create( NEO.Proto.prototype );
NEO.Bang.prototype.constructor = NEO.Bang;

NEO.Bang.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Color = function(obj){

    obj = obj || {};
    
    this.type = 'color';

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

NEO.Color.prototype = Object.create( NEO.Proto.prototype );
NEO.Color.prototype.constructor = NEO.Color;

NEO.Color.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
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

    obj = obj || {};
    
    this.type = 'flag';

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

NEO.Flag.prototype = Object.create( NEO.Proto.prototype );
NEO.Flag.prototype.constructor = NEO.Flag;

NEO.Flag.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
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

    obj = obj || {};
    
    this.type = 'switch';

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

NEO.Switch.prototype = Object.create( NEO.Proto.prototype );
NEO.Switch.prototype.constructor = NEO.Switch;

NEO.Switch.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
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
