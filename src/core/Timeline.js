/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_| 2022
*    @author lo.th / https://github.com/lo-th
*/

import { Utils } from './Utils.js';
import { Pannel } from './Pannel.js';

import { Bang } from '../track/Bang.js';
import { Flag } from '../track/Flag.js';
import { Switch } from '../track/Switch.js';
import { Module } from '../track/Module.js';
import { Color } from '../track/Color.js';
import { Curve } from '../track/Curve.js';
import { Lfo } from '../track/Lfo.js';
import { Audio } from '../track/Audio.js';
import { Video } from '../track/Video.js';

export class Timeline {

    constructor( o = {} ) {

        this.types = ['bang', 'flag', 'switch', 'module', 'color', 'curve', 'lfo', 'audio', 'video']

        this.fullActve = true;
        this.visible = true;

        this.isLoop = true;
        this.isPlay = false;
        this.isScroll = false;
        this.isDown = false

        this.tmpJSON = null;

        this.DID = 0;

        this.callback = o.callback || null;

        this.layers = [];
        this.tracks = [];
        this.data = {};

        this.trackLength = 0;

        this.colorSelect = '#035fcf';

        this.frameMax = o.maxframe || 750; 
        this.frameTime = 1/60;
        this.frameSize = 1;
        this.frameTrack = 0;

        this.frame = 0;
        this.time = 0;
        this.leftFrame = 0;
        this.zone = o.zone || 50;
        this.trackSpace = [0,0]

        // TIME

        this.temp = 0;
        this.rfps = 0;
        this.count = 0;
        this.timerStep = 0;
        this.step = 0;
        this.delta = 0;
        this.then = 0;
        this.prev = 0;

        //
        
        this.fps = 60;
        this.invFS = 0;
        this.framefix = 1;
        this.maxSize = 0;
        this.maxPos = 0;
        this.overtrack = null

        this.scy = 0;
        this.maxScy = 0;
        this.viewInvRatio = 0;

        this.currentPannel = '';
        this.currentKey = null;
        this.currentAction = '';
        this.currentResize = null;

        this.ratio = 0;
        this.invRatio = 0;
        this.minWidth = 0;
        this.maxWidth = 0;

        this.box = { l:0, t:0, r:0, b:0, w:0, h:0, d:0, lr:0, top:70, m:1 };
        this.range = { start:0, end:1, lng:1, decal:0, mid:0, midpos:0 };
        this.hhh = { total:0, full:89, scroll:0 };
        this.scalerRec = { l:0, r:0, w:0 };

        this.box.t = o.top || 0;//20
        this.box.b = o.bottom || 0;//20
        this.box.l = o.left || 0;//20
        this.box.r = o.right || 0;//20

        let dom = Utils.dom;
        let basic = Utils.css.basic;

        // CONTENT ROOT
        this.content = dom( 'div', basic + 'top:'+this.box.t+'px; left:'+this.box.l+'px; overflow:visible; pointer-events:auto; margin-left:-'+this.box.m+'px; margin-top:-'+this.box.m+'px; border:'+this.box.m+'px solid #000; box-sizing:content-box; background:rgba(0,0,0,0.25);' );

        // TOP MENU
        this.topmenu = dom( 'div', basic + 'top:0; left:0; width:100%; height:30px; overflow:visible;  background:rgba(0,0,0,0.25); ');//background:rgba(255,255,255,0.075); ');

        this.textTime = dom( 'div', Utils.css.txt + 'top:4px; left:64px; width:150px; height:22px; font-size:15px; letter-spacing:-1px; padding:5px 5px; background:rgba(0,0,0,0.25); border-radius:4px; border:1px solid rgba(80,80,80,0.25); text-shadow:none;');
        this.textTime.textContent = '0:00:00.00 | 0';
        this.topmenu.appendChild( this.textTime )

        // NAV MENU
        this.navmenu = dom( 'div', basic+'width:100%; top:30px; height:20px; overflow:hidden; padding:1px 5px; background:rgba(0,0,0,0.25);')//background:rgba(255,255,255,0.05);');
        
        // TOP TIMEBAR 
        this.timeBar = dom( 'div', basic+'width:100%; height:20px; top:'+(this.box.top-20)+'px; pointer-events:auto; cursor:col-resize; background:rgba(0,0,0,0.25);' ); //background:rgba(255,255,255,0.025);' ); 
        let tb = dom( 'div', basic+'width:100%; height:20px; top:0;', null, this.timeBar );
        let def = dom( 'defs', basic+'width:100%; height:20px; bottom:0;', {} );
        let p = dom( 'pattern', '', { id:'timeBar', x:0, y:0, width:50, height:20, patternUnits:'userSpaceOnUse', patternTransform:'translate(-0.5)' }, def, 0 );
        let g = dom( 'g', '', { stroke:Utils.color.timeline, 'stroke-width':1, fill:'none', 'stroke-linecap':"butt" }, p, 0 );
        dom( 'path', '', { d:'M0 0'}, g, 0 );
        dom( 'rect', '', { width:'100%', height:20, x:0, fill:'url(#timeBar)' }, def );
        this.pattern = def.childNodes[0].childNodes[0];
        tb.appendChild( def );
        tb.appendChild( Utils.liner( 20, Utils.color.timeline, 1 ) );
        this.timeBar.name = 'timeBar';

        // BOTTOM TIME SCALE
        this.timescale = dom( 'div', basic +'width:100%; height:20px; bottom:0; pointer-events:auto; cursor:e-resize; overflow:hidden; border-top:1px solid #888;')
        this.timescale.name = 'timescale'

        // BOTTOM TIME SCALE SCROLLER
        this.scaler = dom( 'div', basic+'width:200px; height:16px; top:2px; overflow:visible;', null, this.timescale )
        this.scaler.appendChild( Utils.liner(8) )
        let s = 'width:16px; height:16px; top:0px; pointer-events:auto; cursor:col-resize; border:2px solid #888; border-radius:8px;'
        this.sl = dom( 'div', basic+s+'left:-8px;', null, this.scaler )
        this.sr = dom( 'div', basic+s+'right:-8px;', null, this.scaler )
        this.sl.name = 'scaleLeft'
        this.sr.name = 'scaleRight'
        this.scOver = false

        // TRACK CONTENT
        this.innerContent = dom( 'div', basic + 'width:100%; top:70px; height:0px; overflow:hidden;' )
        this.inner = dom( 'div', basic + 'width:100%; top:0px; height:0px; overflow:hidden;', null, this.innerContent )

        // TIME MARKER FAKE
        let mextra = 'border-right:1px solid rgba(0,0,0,0.25); background:'+Utils.color.timeprev+'; '

        this.miniPrev = dom( 'div', basic+'width:30px; height:15px; margin-left:10px; top:52px;  font-size:14px; letter-spacing:-1px; color:'+Utils.color.timeprevtext+'; ', null, this.timescale )
        this.markerPrev = dom( 'div', basic+'top:52px; width:10px; height:60px; overflow:hidden;')
        dom( 'div', basic+mextra+'width:100%; top:0; height:16px; border-radius:4px;', null, this.markerPrev )
        dom( 'div', basic+mextra+'left:50%; margin-left:-1px; width:2px; top:18px; height:100%;', null, this.markerPrev )

        // TIME MARKER
        mextra = 'border-right:1px solid rgba(0,0,0,0.25); background:'+Utils.color.time+'; '
        this.marker = dom( 'div', basic+'top:52px; width:10px; height:60px; overflow:hidden;')
        dom( 'div', basic+mextra+'width:100%; top:0; height:16px; border-radius:4px;', null, this.marker )
        dom( 'div', basic+mextra+'left:50%; margin-left:-1px; width:2px; top:18px; height:100%;', null, this.marker )
        // TIME MARKER IN BOTTOM 
        this.mini = dom( 'div', basic+mextra+'width:1px; height:15px; top:2px; ', null, this.timescale );

        // H SCROLL
        this.hscroll = dom('div', basic+'position:absolute; width:19px; height:100px; left:auto; right:1px; top:69px; border-left:1px solid #888; border-top:1px solid #888; background:#1b1b1b; pointer-events:auto; cursor:n-resize;');
        dom( 'div', basic+ 'position:absolute; width:10px; height:20px; left:4px; top:0px; background:#666; ', null, this.hscroll );
        this.hscroll.name = 'hscroll';

        // ADD

        let frag = Utils.frag
        frag.appendChild( this.timeBar )
        frag.appendChild( this.timescale )
        frag.appendChild( this.innerContent )
        frag.appendChild( this.markerPrev )
        frag.appendChild( this.miniPrev )
        frag.appendChild( this.marker )
        frag.appendChild( this.hscroll )
        frag.appendChild( this.navmenu )
        frag.appendChild( this.topmenu )

        this.content.appendChild( frag )

        // PANNEL for key options
        this.pannel = new Pannel( this )

        if( o.parent !== undefined ) o.parent.appendChild( this.content )
        else document.body.appendChild( this.content )
        
        // 

        this.setFps( this.fps )
        this.activeEvents()
        this.initTopMenu( this.topmenu )
        this.initNavMenu( this.navmenu )
        this.miniUI()

        this.setFps( this.fps )

        this.resize()
    
        if( o.open !== undefined ) if(!o.open) this.showHide()
    }

    miniUI(){

        this.content2 = Utils.dom( 'div', Utils.basic + 'top:'+this.box.t+'px; left:10px; width:50px; height:71px' );
        
        this.openButton = Utils.add('button',{ target:this.content2, w:44, h:44, pos:{ left:'0px', top:'3px' }, simple:true }).icon( Utils.icon( 'neo', '#888', 40 ) ).onChange( this.showHide.bind(this) );
        this.playButton2 = Utils.add('button',{ target:this.content2, w:44, h:24, pos:{ left:'0px', top:'48px' }, simple:true }).onChange( this.play.bind(this) );
        this.playButton2.icon( this.playIcon, 2 )
        this.playButton2.display();

        document.body.appendChild( this.content2 )

    }



    onChange ( f ) {

        this.callback = f || null;
        return this;

    }

    floor ( x ) {

        return Math.floor(x)

    }

    load( url ) {

        let xhr = new XMLHttpRequest()
        xhr.onload = function(e) {
            Utils.fromJson( JSON.parse( xhr.responseText ) )
        }
        xhr.open('GET', url, true)
        xhr.send()

    }

    // ----------------------
    //   LAYER 
    // ----------------------

    initNavMenu( dom ) {

        let callbackAddLayer = function(v){ this.addLayer() }.bind(this);
        let callbackRemoveLayer = function(v){ this.removeLayer() }.bind(this);

        this.layers.push('ROOT')

        
        let x = 170+54
        Utils.add('button',{ target:this.navmenu, name:'+', pos:{left:x+'px'}, simple:true, w:24, h:18 }).onChange( callbackAddLayer ); x+= 26
        Utils.add('button',{ target:this.navmenu, name:'-', pos:{left:x+'px'}, simple:true, w:24, h:18 }).onChange( callbackRemoveLayer ); x+= 34
        this.layerSelector = Utils.add('selector', { target:this.navmenu, simple:true, w:60*(this.layers.length), h:18, pos:{left:x+'px'}, bDown:'#888', h:18, values:this.layers, value:'ROOT' });

    }

    removeLayer() {

        if(this.layers.length < 2) return

        this.layers = this.layers.splice(0,this.layers.length-1)
        this.layerSelector.clear()
        this.layerSelector = Utils.add('selector', { target:this.navmenu, simple:true, w:60*(this.layers.length), h:18, pos:{left:'230px'}, bDown:'#888', h:18, values:this.layers, value:'ROOT' });

    }

    addLayer() {

        if(this.layers.length > 8 ) return

        let name = 'LAYER' + (this.layers.length-1)

        this.layers.push( name )

        this.layerSelector.clear()
        this.layerSelector = Utils.add('selector', { target:this.navmenu, simple:true, w:60*(this.layers.length), h:18, pos:{left:'230px'}, bDown:'#888', h:18, values:this.layers, value:name });

    }


    // ----------------------
    //   TOP INTERFACE
    // ----------------------

    initTopMenu( dom ) {

        let callbackMemo = function(v){ Utils.saveJson( this ); }.bind(this);
        let callbackBack = function(v){ Utils.fromJson( this, this.tmpJSON ); }.bind(this);
        let callbackSave = function(v){ Utils.saveJson( this, true ); }.bind(this);
        let callbackLoad = function(){ Utils.loadJson( this ); }.bind(this)

        let callbackFps = function(v){ this.setFps(v); }.bind(this);
        let callbackMax  = function(v){ this.frameMax = v; this.setRange(); }.bind(this);
        let callbackList = function(v){ this.add(v); addList.text('ADD'); }.bind(this);
        let callbackPlay = function(v){ this.play(); }.bind(this);
        let callbackPrev = function(v){ if(this.frame) this.goTo(this.frame-1); }.bind(this);
        let callbackNext = function(v){ if(this.frame<this.frameMax-1)this.goTo(this.frame+1); }.bind(this);
        let callbackStart = function(v){ this.moveTo(0); }.bind(this);
        let callbackEnd = function(v){ this.moveTo(this.frameMax-1); }.bind(this);   

        let callbackRecord = function(v){  }.bind(this)
    
        let h = 24, x = 170+54, s1 = 2, s2 = 10

        let startButton = Utils.add('button',{ target:dom, w:h,  pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackStart ); x+=h+s1;
        let prevButton  = Utils.add('button',{ target:dom, w:h,  pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackPrev ); x+=h+s1;
        this.playButton = Utils.add('button',{ target:dom, w:40, pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackPlay ); x+=40+s1;
        let nextButton  = Utils.add('button',{ target:dom, w:h,  pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackNext ); x+=h+s1;
        let endButton   = Utils.add('button',{ target:dom, w:h,  pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackEnd ); x+=h+s2;//290

        let addList = Utils.add('list',{ target:dom, list:this.types, w:80, staticTop:true, miniCanvas:true,  pos:{left:x+'px', top:'3px'}, simple:true, side:'down', full:true, h:h, itemBg:'#333' }).onChange( callbackList ); x+=80+s2; //324
        this.addMiniTrackImg( addList )

        Utils.add('button',{ target:dom, name:'memo', w:40, pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackMemo ); x+=40+s1;
        Utils.add('button',{ target:dom, name:'back', w:40, pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackBack ); x+=40+s1;
        Utils.add('button',{ target:dom, name:'save', w:40, pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackSave ); x+=40+s1;
        Utils.add('button',{ target:dom, name:'load', w:40, pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackLoad ); x+=40+s2;

        this.recordButton = Utils.add('button',{ target:dom, w:40, pos:{ left:x+'px', top:'3px' }, simple:true, h:h }).onChange( callbackRecord ); x+=40+s1;

        // right

        Utils.add('number',{ target:dom, name:'max', min:1, value:this.frameMax, precision:0, step:1, drag:false, w:100, sa:40, center:true, h:h, pos:{left:'auto', right:'80px', top:'3px' }}).onChange( callbackMax );
        this.topFps = Utils.add('number',{ target:dom, name:'fps', min:1, max:240, value:this.fps, /*step:1,*/ precision:2, drag:false, w:80, sa:40, sb:30, center:true, h:h, pos:{left:'auto', right:'0px', top:'3px' }}).onChange( callbackFps );
        

        // SVG

        let svg = Utils.svgns;
        this.playIcon = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='#CCC' d='M 14 8 L 5 3 4 4 4 13 5 14 14 9 14 8 Z'/></svg>"
        this.pauseIcon = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='#CCC' d='M 14 4 L 13 3 11 3 10 4 10 13 11 14 13 14 14 13 14 4 M 8 4 L 7 3 5 3 4 4 4 13 5 14 7 14 8 13 8 4 Z'/></svg>"
        let startIcon = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='#CCC' d='M 11 12 L 11 10 14 10 14 7 11 7 11 5 8 8 8 9 11 12 M 7 12 L 6 12 6 5 7 5 7 3 4 3 4 14 7 14 7 12 Z'/></svg>"
        let endIcon = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='#CCC' d='M 10 8 L 7 5 7 7 4 7 4 10 7 10 7 12 10 9 10 8 M 14 3 L 11 3 11 5 12 5 12 12 11 12 11 14 14 14 14 3 Z'/></svg>"
        let prevIcon = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='#CCC' d='M 11 12 L 11 10 14 10 14 7 11 7 11 5 8 8 8 9 11 12 Z'/></svg>"
        let nextIcon = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='#CCC' d='M 10 8 L 7 5 7 7 4 7 4 10 7 10 7 12 10 9 10 8 Z'/></svg>"

        this.recordIcon = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='none' stroke='#CCC' stroke-width='2' d='M 13 9 Q 13 10.65 11.8 11.8 10.65 13 9 13 7.35 13 6.15 11.8 5 10.65 5 9 5 7.35 6.15 6.15 7.35 5 9 5 10.65 5 11.8 6.15 13 7.35 13 9 Z'/></svg>"
        this.recordIcon2 = "<svg xmlns="+svg+" width='18px' height='17px'><path fill='#CCC' stroke='#CCC' stroke-width='2' d='M 13 9 Q 13 10.65 11.8 11.8 10.65 13 9 13 7.35 13 6.15 11.8 5 10.65 5 9 5 7.35 6.15 6.15 7.35 5 9 5 10.65 5 11.8 6.15 13 7.35 13 9 Z'/></svg>"
   
        this.playButton.icon( this.playIcon, 2 )
        this.recordButton.icon( this.recordIcon, 2 )
        startButton.icon( startIcon, 2 )
        endButton.icon( endIcon, 2 )
        prevButton.icon( prevIcon, 2 )
        nextButton.icon( nextIcon, 2 )
        
    }

    addMiniTrackImg( addList ) {

        addList.text('ADD')

        let img = document.createElement('img')
        img.src = Utils.TRACK
        img.onload = function(){ 
            for(let i = 0; i<this.types.length; i++ ){
                addList.drawImage( this.types[i], img, i*20, 0, 20, 20 )
            }
        }.bind(this)

    }

    getFrame() {

        return this.frame;

    }

    setFrame( v ) {

        this.frame = v;

    }

    // ----------------------
    //   Show / Hide
    // ----------------------

    showHide() {

        if( this.visible ){

            this.visible = false
            this.content.style.visibility = 'hidden'
            this.pannel.display()
            this.selected()
            this.removeEvents()
            this.playButton2.display( true )
            this.openButton.icon( Utils.icon( 'neo', '#CCC', 40 ))

        } else {

            this.visible = true
            this.content.style.visibility = 'visible'
            this.pannel.display( true )
            this.activeEvents()
            this.playButton2.display()
            this.openButton.icon( Utils.icon( 'neo', '#888', 40 ))

        }

    }

    // ----------------------
    //   Events dispatch
    // ----------------------

    activeEvents() {

        let dom = document//.body//Utils.Dom;

        dom.addEventListener( 'pointercancel', this )
        dom.addEventListener( 'pointerleave', this )
        //dom.addEventListener( 'pointerout', this )

        dom.addEventListener( 'pointerdown', this )
        dom.addEventListener( 'pointermove', this )
        dom.addEventListener( 'pointerup', this )
        dom.addEventListener( 'wheel', this, { passive: false } )

        // KEYBOARD
        dom.addEventListener("keydown", this );
         
        dom.addEventListener('contextmenu', this )
        window.addEventListener('resize', this )

    }

    removeEvents() {

        let dom = document//.body//Utils.Dom;

        dom.removeEventListener( 'pointercancel', this )
        dom.removeEventListener( 'pointerleave', this )
        //dom.removeEventListener( 'pointerout', this )

        dom.removeEventListener( 'pointerdown', this )
        dom.removeEventListener( 'pointermove', this )
        dom.removeEventListener( 'pointerup', this )
        dom.removeEventListener( 'wheel', this )

        //dom.removeEventListener("keydown", this );

        dom.removeEventListener('contextmenu', this, false );
        window.removeEventListener('resize', this, false );

    }

    handleEvent( e ) {

        switch( e.type ) {

            case 'pointercancel': case 'pointerleave': this.out( e ); break;

            case 'keydown': this.keydown( e ); break;
            case 'contextmenu': this.mouseMenu( e ); break;
            case 'wheel': this.wheel( e ); break;

            case 'pointerdown': this.down( e ); break;
            case 'pointermove': this.move( e ); break;
            case 'pointerup': this.up( e ); break;

            case 'resize': this.resize( e ); break;

        }

    }

    keydown( e ) {

        //e.preventDefault(); 

        if( Utils.getImput() ) return

        // console.log( e.keyCode );
        switch( e.keyCode ){
            case 84: this.showHide(); break;// T
            case 32: this.play(); break;// SPACE
        }

    }

    // ----------------------
    //   Mouse Events
    // ----------------------

    out( e ) {

        //this.up(e)

    }

    mouseMenu( e ) {

        e.preventDefault();

    }

    wheel ( e ) {

        if( !this.isScroll ) return;

        let delta = 0;
        if(e.wheelDeltaY) delta= -e.wheelDeltaY*0.04;
        else if(e.wheelDelta) delta= -e.wheelDelta*0.2;
        else if(e.detail) delta = e.detail*4.0;
        this.scy += delta;
        this.setScrollY();

    }

    down( e ) {

        this.isDown = true 

        this.tracksDown(e)

        if( e.target.name ){

            let name = e.target.name;

            if( name === 'trackTitle') this.selected( this.tracks[ e.target.id ] );

            if( name === 'timeBar' || name === 'timescale' || name === 'scaleRight' || name === 'scaleLeft' || name === 'scaleBar' || name === 'hscroll' ){
                if( name === 'timeBar' && this.isPlay ) this.pause();
                if( name === 'timescale' ) this.findDecal( e.clientX );
                if( name === 'scaleBar' ) this.currentResize = this.tracks[ e.target.id ];
                this.currentAction = name;
                this.move( e );

            } else this.currentAction = '';
        } else this.currentAction = '';

    }

    move( e ) {

        if( this.isDown ) this.tracksMove(e)
        else this.trackOver(e)

        this.over(e)


        let x = e.clientX - this.box.l
        let y = e.clientY

        if( Utils.inRange( y, this.trackSpace[0] - 20, this.trackSpace[1] ) ){

            this.framePrev = this.getFrameClick( e.clientX )
            let t = this.floor(( this.framePrev - this.range.start ) * this.frameSize )
            this.markerPrev.style.left = this.miniPrev.style.left = t + 'px'
            this.miniPrev.textContent = this.framePrev 

        }
        

        if( !this.currentAction ) return;


        //x = x > (box.lr - box.l) ? (box.lr - box.l) : x;
        x = x < 0 ? 0 : x;
        
        switch( this.currentAction ){
            case 'timeBar': this.goTo( this.getFrameClick( x, true ) ); break;
            case 'timescale': this.moveScroll( x, true ); break;
            case 'scaleLeft': this.changeRange( x ); break;
            case 'scaleRight': this.changeRange( x , true ); break;
            case 'scaleBar': this.setTrackHeight( y ); break;
            case 'hscroll': this.setScrollY( y ); break;
        }
    }

    over( e ) {

        let name = e.target.name
        switch( name ){
            case 'scaleLeft': this.scalerOver( e ); break;
            case 'scaleRight': this.scalerOver( e ); break;
            default: this.scalerOut(); break;
        }

    }

    up( e ) {

        this.isDown = false

        this.tracksUp( e )

        this.currentAction = ''
        this.currentResize = null

    }

    // ----------------------------------

    scalerOver( e ) {

        e.target.style.background = this.colorSelect
        e.target.style.borderColor = this.colorSelect
        this.scOver = true 

    }

    scalerOut() { 

        if(!this.scOver || this.currentAction ) return
        this.sl.style.background = 'none'
        this.sl.style.borderColor = '#888'
        this.sr.style.background = 'none'
        this.sr.style.borderColor = '#888'
        this.scOver = false 

    }

    // BASIC FUNCTION

    pause() {

        this.isPlay = false
        this.stopMedia()
        this.playButton.icon( this.playIcon , 2 )
        this.playButton2.icon( this.playIcon , 2 )

    }

    play() {

        if(this.isPlay){

            this.pause();

        }else{

            this.isPlay = true
            this.playButton.icon( this.pauseIcon, 2 )
            this.playButton2.icon( this.pauseIcon, 2 )
            this.loop()

        }

    }

    // ----------------------
    //
    //         LOOP
    //
    // ----------------------

    loop( stamp ) {

        if( this.isPlay ) window.requestAnimationFrame( this.loop.bind( this ) )

        this.update( stamp )

    }

    // ----------------------
    //
    //         UPDATE
    //
    // ----------------------
 
    update( stamp ) {

        //console.log(this.isPlay)

        if( this.isPlay ){

            this.step = stamp === undefined ? performance.now() : stamp;
            this.delta = this.step - this.then;

            if ( this.delta <= this.timerStep ) return;

            this.then = this.step - ( this.delta % this.timerStep );

            // result fps
            if ( (this.step - 1000) > this.temp ){ this.temp = this.step; this.rfps = this.count; this.count = 0; }
            this.count++;

        }

        this.updateTime( true )

        this.tracksUpdate()

        if(this.callback) this.callback()

        if( this.isPlay ){ 
            this.autoScroll()
            this.frame++
        }

        if( this.frame >= this.frameMax ){ 
            if( this.isLoop ) this.moveTo(0)
            else this.pause()
        }

    }

    updateTime( up ) {

        let h, m, s, ps, pm, l, u, fs = this.frameSize

        if(up){

            this.time = this.frame / this.fps
            h = this.floor( this.time / 60 / 60 )
            m = this.floor( this.time / 60 ) % 60
            s = this.time % 60
            ps = s < 10 ? '0' : ''
            pm = m < 10 ? '0' : ''

            this.textTime.textContent = h + ':' + pm + m + ':' + ps + s.toFixed( 3 ) + ' | ' + this.frame
            this.frameTrack = this.floor( ( this.frame * fs ) + (this.framefix*0.5))

        }
        
        l = this.floor(( this.frame - this.range.start ) * fs )
        u = this.floor( this.frame * this.invRatio )+1

        this.marker.style.left = l + 'px'
        this.mini.style.left = u + 'px'

    }



    goTo( f ) {

        this.frame = f === undefined ? this.frame : f
        this.reset( this.frame )
        if( !this.isPlay ) this.loop()

    }

    moveTo( f ) {

        this.range.end = f-10
        this.goTo( f )
        this.autoScroll()

    }

    upMarker() {

        if( this.frame && !this.isPlay ){
            this.updateTime( true )
            this.tracksUpdate()
            //this.goTo()
        }

    }

    // ----------------------
    //   scroll
    // ----------------------

    autoScroll() {

        if( this.frame > this.range.end ) this.moveScroll( Math.round( this.frame * this.invRatio ) )
        
    }

    findDecal( x ) {

        let dif = x - this.box.l - this.range.midpos
        this.range.decal = Math.abs( dif ) < this.range.mid ? dif : 0

    }

    moveScroll( x, isMouse ) {

        if( isMouse ) x -= this.range.mid + this.range.decal

        x = x < 0 ? 0 : x
        x = x > this.range.max ? this.range.max : x

        this.moveRange( x )

    }

    // ----------------------
    //   track range
    // ----------------------

    setRange() {

        this.ratio = this.frameMax / this.box.w
        this.invRatio = this.box.w / this.frameMax

        let framePos = ( this.zone * this.frameMax ) / 100

        this.scalerRec.w = this.floor( framePos * this.invRatio )
        this.scalerRec.r = this.scalerRec.l + this.scalerRec.w
 
        this.scaler.style.width = this.scalerRec.w + 'px'

        this.minWidth = this.floor((this.box.w/30)/this.ratio)
        this.changeRange()

    }

    moveRange( x ) {

        this.scalerRec.l = x
        this.scalerRec.r = this.scalerRec.l + this.scalerRec.w
        this.scaler.style.left = this.scalerRec.l + 'px'

        this.translateRange()

        let i = this.trackLength
        while(i--) this.tracks[i].syncroTrack( this.leftFrame )

    }

    translateRange() {

        let rec = this.scalerRec;

        this.range.start = this.floor( rec.l  * this.ratio )
        this.range.end = this.floor( rec.r  * this.ratio ) - 1

        this.range.midpos = rec.l + this.range.mid
        this.leftFrame = this.floor( this.frameSize * this.range.start )

        //console.log(this.frameSize, this.leftFrame)

        this.pattern.setAttributeNS(null, 'patternTransform', 'translate('+ (-this.leftFrame-0.5) +')' )

        this.updateTime()

    }

    changeRange( x, isRight ) {

        let rec = this.scalerRec
        let box = this.box
        let w

        if( x !== undefined ){

            w = isRight ? this.floor( x - rec.l ) : this.floor( rec.r - x )
            w = w < this.minWidth ? this.minWidth : w
            w = w > box.w ? box.w : w

            if( w !== rec.w ){
                rec.w = w;
                this.scaler.style.width = rec.w +'px';
                if( isRight ){
                    rec.r = x;
                } else {
                    rec.l = x;
                    this.scaler.style.left = rec.l + 'px';
                }
            }

        }

        this.range.end = this.floor( rec.r * this.ratio );// + 1;// - 1;
        this.range.lng = this.floor( rec.w * this.ratio );
        this.range.max = box.w - rec.w;
        this.range.mid = rec.w * 0.5;

        // new frame size
        let fs = (box.w - box.d) / (this.range.lng+1);
        //let fs = (box.w - box.d) / ((rec.w * ratio2)+1);

        this.maxPos = ((box.w - box.d) - fs);
        this.frameSize = fs;

        this.invFS = 1 / fs;

        this.framefix = fs < 6 ? 6 : this.floor(fs);

        this.maxSize = this.floor( fs * this.frameMax );

        if( x !== undefined ) this.zone = ( this.range.lng * 100 ) / (this.frameMax+1 );

        this.translateRange()

        // bottom mini frame
        let mf = this.floor( box.w / this.frameMax );
        mf = mf < 2 ? 2 : mf;

        //this.mini.style.width = mf + 'px';
        this.marker.style.width = this.framefix + 'px';
        this.markerPrev.style.width = this.framefix + 'px';

        this.miniPrev.style.marginLeft = (this.framefix+5) + 'px'; 

        this.timePattern()

        this.syncroTracks()

        this.upMarker()

    }

    // top timeline pattern

    timePattern() {

        let w = this.frameSize, s, n;

        // timeline pattern
        let path;
        if( w < 5 ){
           
           n = this.floor( w ) || 1;

           switch(n){
                case 1 : s = w * this.fps; break;
                case 2 : s = w * this.fps; break;
                case 3 : s = w * (this.fps * 0.5); break;
                case 4 : s = w * (this.fps * 0.25); break;

           }

           path = 'M0 10 L0 20' + ' M'+s+' 10 L'+s+' 20';

        } else {
            s = w * 5;
            path = 'M'+0+' 10 L'+0+' 20' + 'M'+w+' 15 L'+w+' 20' + 'M'+(w*2)+' 15 L'+(w*2)+' 20' + 'M'+(w*3)+' 15 L'+(w*3)+' 20' + 'M'+(w*4)+' 15 L'+(w*4)+' 20'+ ' M'+s+' 10 L'+s+' 20';
        }

        //console.log(w)

        this.pattern.childNodes[0].childNodes[0].setAttributeNS( null, 'd', path );
        this.pattern.setAttributeNS( null, 'width', s );

    }

    // ----------------------
    //
    //         DATA
    //
    // ----------------------

    dataToString() {

        let d = this.data, v;
        for(let n in d){
            if(typeof d[n] === 'object'){ 
                v = JSON.stringify( d[n] );
                v = v.replace(/["']/g, "");
                v = v.replace(/:/g, " ");
                v = v.replace(/,/g, "|");
                v = v.slice(1, v.length-1);
                d[n] = v;
            }
        }

        let str = JSON.stringify( d );
        str = str.replace(/["']/g, "");
        str = str.slice(1, str.length-1);
        str = str.replace(/:/g, ': ');
        str = str.replace(/,/g, '<br>');
        str = str.replace(/[|]/g, ', ');

        str += '<br><br>'+ this.rfps + ' fps'
        
        return str;

    }

    info() {

        return  this.rfps + ' fps';

    }

    getFrameClick( x, dec ) {

        // root click or track click
        x = dec ? x : x - this.box.l;

        // test if outside view
        x = x > this.maxPos ? this.maxPos : x;

        let ff = this.floor(  x * this.invFS ) + this.range.start;
        //ff = ff > range.end ? range.end : ff;
        //ff = ff > NEO.frameMax-1 ? NEO.frameMax-1 : ff;
        return ff;

    }

    setFps( v ) {

        if( this.topFps )this.topFps.setValue( v )
        this.fps = v;
        this.frameTime = 1 / this.fps; // in second
        this.timerStep = this.frameTime * 1000; //1000 / NEO.FPS;
        this.updateTime( true );

    }

    // ----------------------
    //   Add track
    // ----------------------
 
    add( type, o ) {

        o = o || {};
        type = type[0].toUpperCase() + type.slice(1);

        let n;

        switch( type ){
            case 'Bang': n = new Bang( o, this ); break;
            case 'Flag': n = new Flag( o, this ); break;
            case 'Color': n = new Color( o, this ); break;
            case 'Curve': n = new Curve( o, this ); break;
            case 'Switch': n = new Switch( o, this ); break;
            case 'Module': n = new Module( o, this ); break;
            case 'Lfo': n = new Lfo( o, this ); break;
            case 'Audio': n = new Audio( o, this ); break;
            case 'Video': n = new Video( o, this ); break;
        }

        //let n = new NEO[ type ]( o );
        n.rename( this.trackLength );

        this.tracks.push( n );

        this.trackLength = this.tracks.length;
        //tracksname.push( n.name );

        if( n.target === undefined ) this.inner.appendChild( n.c[0] );

        n.syncroTrack( this.leftFrame, this.maxSize );

        //neo.data = {};
        clearTimeout( this.addTimer );
        this.addTimer = setTimeout( this.calc.bind( this ), 0 );
        //this.calc();
        
        return n;

    }

    // ----------------------
    //   Remove track
    // ----------------------

    remove( id ) {

        if( this.tracks[id].target === undefined ) this.inner.removeChild( this.tracks[id].c[0] );

        this.tracks.splice( id, 1 );

        this.trackLength = this.tracks.length

        let i = this.trackLength;
        while( i-- ) this.tracks[i].setID( i );

        //neo.data = {};
        this.calc();
        
    }

    // ----------------------
    //   clear all track
    // ----------------------

    clear() {

        let i = this.trackLength;
        while( i-- ) this.tracks[i].clear()
        
        this.tracks = []
        this.trackLength = 0
        //neo.data = {};

    }

    // ----------------------
    //   track options
    // ----------------------

    tracksDown(e) {

        if( !this.overtrack ) return
        this.overtrack.down(e)

    }

    tracksMove(e) {

        if( !this.overtrack ) return
        this.overtrack.move(e)

    }

    trackOver(e) {

        let y = e.clientY
        let i = this.trackLength, t

        if( this.overtrack !== null ){ this.overtrack.out(); this.overtrack = null; }

        while( i-- ){

            t = this.tracks[i]
            if( Utils.inRange( y, t.top, t.top + t.h ) ) this.overtrack = t
            //else t.out()

        }

        if( !this.overtrack ) return

        this.overtrack.over(e)

    }

    tracksUp(e) {

        if( !this.overtrack ) return

        this.overtrack.up( e )
        this.overtrack = null

    }

    tracksUpdate() {

        let i = this.trackLength, track
        while( i-- ) {
            track =  this.tracks[i]
            this.data[track.name] = track.update( this.frame )
        }

    }

    unselectKey() {

        let i = this.trackLength
        while( i-- ) this.tracks[i].unselectKey()

    }

    stopEditName() {

        let i = this.trackLength
        while( i-- ) this.tracks[i].endEditName()

    }

    syncroTracks() {

        let i = this.trackLength
        while( i-- ) this.tracks[i].syncroTrack( this.leftFrame, this.maxSize )

    }

    stopMedia() {

        let i = this.trackLength
        while( i-- ) if( this.tracks[i].isMedia ) this.tracks[i].stop()

    }

    upTrackTop() {

        let i = this.trackLength
        while( i-- ) if( this.tracks[i].needTop ) this.tracks[i].top = this.tracks[i].c[0].getBoundingClientRect().top

    }

    reset( f ) {

        let i = this.trackLength
        while( i-- ) this.tracks[i].reset( f )

    }

    selected( track ) {

        let i = this.trackLength
        while( i-- ) this.tracks[i].unSelected()
        if( track !== undefined ) track.selected()

    }

    // Test track height

    calc() {

        this.hhh.total = 0;
        let i = this.trackLength
        while(i--) this.hhh.total += this.tracks[i].h
        
        this.inner.style.height = this.hhh.total +'px';
        this.hhh.full = this.box.top + this.hhh.total + 19;

        this.resizeHeight();

    }

    // ----------------------
    //   resize
    // ----------------------

    resize( e ) {

        this.box.h = window.innerHeight - this.box.b - this.box.t
        this.resizeHeight()
        this.resizeWidth()
        this.upMarker()

    }

    resizeWidth() {

        this.box.w = window.innerWidth - this.box.l - this.box.r;// - (this.box.m*2);
        this.content.style.width = this.box.w + 'px';
        //this.content.style.width = (this.box.w + (this.box.m*2)) + 'px';
      
        this.topmenu.style.width = this.box.w + 'px'
        this.innerContent.style.width = this.box.w - this.box.d + 'px'
        this.timeBar.style.width = this.box.w - this.box.d + 'px'
        this.setRange()

        this.pannel.resize( this.box.l, this.box.w - this.box.d );

    }

    // ----------------------
    //   height functions
    // ----------------------
    
    resizeHeight() {

        let h = 0;
        let mth = 0;
        let oldd = this.box.d;
        let box = this.box;

        if( this.hhh.full > box.h ){ // with scroll

            h = box.h; 
            mth = ( h - ( box.top + 20 ) );
            box.d = 20;
            this.viewInvRatio = (this.hhh.total-1) / mth;
            this.hhh.scroll = mth * ( mth / (this.hhh.total-1) );
            this.maxScy = mth - this.hhh.scroll;
            this.hscroll.style.height = (mth + 1) +'px';
            this.hscroll.childNodes[0].style.height = this.floor( this.hhh.scroll ) + 'px';
            this.hscroll.style.display = 'block';
            this.isScroll = true;

        } else { // no scroll

            h = this.hhh.full;
            mth = h - ( box.top + 20 );
            box.d = 0;
            this.inner.style.top = 0 +'px';
            this.hscroll.style.display = 'none';
            this.isScroll = false;
            
        }

        this.innerContent.style.height = mth + 'px';
        this.content.style.height = h + 'px';
        this.marker.style.height = ( mth+18 ) + 'px';
        this.markerPrev.style.height = ( mth+18 ) + 'px';

        this.trackSpace = [ (box.t + box.top) , (  box.t + h ) - 20 ]

        this.upTrackTop();
        this.pannel.move();

        if( this.isScroll ) this.setScrollY();
        if( oldd !== box.d ) this.resizeWidth();

    }

    // ----------------------
    //   scroll position y
    // ---------------------

    setScrollY( y ) {

        if( y !== undefined ) this.scy = ( y - this.box.top - this.box.t ) - ( this.hhh.scroll * 0.5 );

        this.scy = this.scy < 0 ? 0 : this.scy;
        this.scy = this.scy > this.maxScy ? this.maxScy : this.scy;
        
        this.hscroll.childNodes[0].style.top = this.floor( this.scy ) + 'px';
        this.inner.style.top = this.floor( - ( this.scy * this.viewInvRatio ) ) +'px';

        this.upTrackTop();
        this.pannel.move();

    }

    // ----------------------
    //   rescale one track
    // ----------------------

    setTrackHeight( y ) {

        let ty = ( y - this.currentResize.c[0].getBoundingClientRect().top ) + 4;
        ty = ty < 40 ? 40 : ty;
        this.currentResize.setHeight( ty );

        clearTimeout( this.addTimer );
        this.addTimer = setTimeout( this.calc.bind(this), 0 );

    }

    // ----------------------
    //   option pannel
    // ----------------------

    isInView( y ) {

        let v = true;
        if( y < this.box.top ) v = false; //+ this.box.t
        if( y > this.box.h + this.box.top - 40 ) v = false;
        return v;

    }

    showPannel( key ) {

        this.pannel.setKey( key );

    }

}