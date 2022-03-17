
import { Utils } from './Utils.js';
import { Key } from './Key.js';

import { KeyFlag } from '../key/KeyFlag.js';
import { KeyColor } from '../key/KeyColor.js';
import { KeyCurve } from '../key/KeyCurve.js';
import { KeySwitch } from '../key/KeySwitch.js';
import { KeyModule } from '../key/KeyModule.js';
import { KeyLfo } from '../key/KeyLfo.js';
import { KeyAudio } from '../key/KeyAudio.js';
import { KeyVideo } from '../key/KeyVideo.js';


export class Track {

    constructor( o = {}, parent ) {

        this.parent = parent;

        this.resize = o.resize !== undefined ? o.resize : true
        this.delete = o.del !== undefined ? o.del : true

        this.autoName = o.name === undefined ? true : false;
        this.name = o.name || this.type;

        this.select = false
        this.ready = false


        this.w = 10; // frame size
        this.maxw = 200;

        this.fulloverkey = false
        this.isOver = false;
        this.overid = -1
        this.overitem = null
        this.isNameEdit = false;

        this.acolor = Utils.color.action;
        
        
        this.drag = false;
        //this.dragType = '';
        this.current = null;

        this.tmpName = null;

        this.id = 0;
        
        this.loadframe = o.frame || {};

        this.items = []
        this.frame = {}
        this.lng = 0;

        this.show = true;
        this.needPrev = false;
        this.needNext = false;
        this.needTop = true;
        this.needTimer = false;
        this.isMedia = false;

        this.timer = null;

        this.drawdelay = null

        this.top = 0;
        this.tt = 20//20//16;
        this.tb = this.resize ? 8 : 2;
        this.h = o.h || 50;

        this.oldH = this.h;

        this.tmpPool = [];
        this.callback = null;

        let ty = Utils.int((this.tt-10)*0.5);
        
        this.target = o.target === undefined ? undefined : o.target;


        // graphics

        const c = [];

        const dom = Utils.dom
        const basic = Utils.basic
        const text = Utils.txt

        let lc1 = Utils.color.track1
        let lc2 = Utils.color.track2

        c[0] = dom( 'div', basic+'position:relative; overflow:hidden;pointer-events:auto;')
        c[1] = dom( 'div', Utils.css.txtselect +'left:20px; height:16px; top:2px; pointer-events:auto; cursor:pointer; border-color:transparent; ')
        c[2] = Utils.liner( this.tt, lc2 )
        c[3] = Utils.pins( this.tt )
        c[4] = this.delete ? Utils.dels(ty) : Utils.empty(ty)
        c[5] = dom( 'div', basic+'top:' + this.tt + 'px; left:0; width:100px; height:60px; overflow:hidden; pointer-events:auto; cursor:pointer; ' )
        c[6] = Utils.linerBottom( this.tb, lc1, lc2 )
        c[7] = dom( 'div', basic+'height:'+this.tt+'px;  width:100%; overflow:hidden; border-left:1px solid #555; border-right:1px solid #555; display:none;')

        c[1].name = 'trackTitle';

        this.tmpName = null

        this.c = c;

    }

    getFrame() {

        let data = {}

        let lng = this.items.length
        for( let i=0; i<lng; i++ ){
            data[ this.items[i].frame ] = this.items[i].getValue()
        }
        
        return data
        
    }

    init() {

        let s = []; // style cached

        s[0] = this.c[0].style;
        s[0].height = this.h + 'px';

        const frag = Utils.frag;

        let i = this.c.length
        while( i-- && i ){
            frag.appendChild( this.c[i] )
            s[i] = this.c[i].style
        }

        this.c[1].textContent = this.name;
        this.c[1].name = 'title';
        this.c[5].name = this.type;
        this.c[6].id = this.id;
        //this.c[6].name = 'resize';
        this.c[1].id = this.id;

            
        this.c[0].appendChild( frag );



        this.s = s;

        this.addFrame()
        this.setHeight()
        this.rightExtra()

        this.ready = true

    }

    rightExtra() {

        switch( this.type ){
            case 'bang': case 'switch':
            //this.preview = Utils.add( 'bool',{ target:this.c[0], name:' ', p:0, value:false, pos:{left:'auto', right:'30px', top:'0px'}, w:50, h:19, lock:true })
            break;
            case 'color':
            this.preview = Utils.add( 'color', { target:this.c[0], name:' ', pos:{left:'auto', right:'30px', top:'0px' }, simple:true, side:'down', ctype:'hex', w:20, h:19, radius:20, lock:true, notext:true })
            break;

        }

    }

    draw() {

    }

    showHide() {

        if( this.show ) this.close();
        else this.open();

    }

    //------------------------
    //      change name 
    //------------------------

    editName() {

        if( this.isNameEdit ) return

        this.parent.stopEditName()

        if( !this.tmpName ){ 
            this.tmpName = Utils.add( this, 'name', { type:'string', target:this.c[0],  w:100, simple:true, allway:true, pos:{ left:'20px', top:'0px' } })
            this.tmpName.c[0].name = 'title'
        }

        
        this.tmpName.display(true)
        this.s[1].display = 'none'
        this.isNameEdit = true
    }

    endEditName() {

        if( !this.isNameEdit ) return

        this.isNameEdit = false
        this.tmpName.display()
        this.tmpName.onChange()

        this.autoName = false
        this.c[1].textContent = this.name
        this.s[1].display = 'flex'

    }

    //------------------------
    //      Track selecte 
    //------------------------

    selected() {

        this.select = true;
        this.s[1].color = '#CC0';
        if(!this.show) this.c[3].childNodes[0].style.background = '#CC0';
        this.c[3].childNodes[0].style.borderColor = '#CC0';
        this.s[7].display = 'block';

    }

    unSelected() {

        this.select = false;
        this.s[1].color = '#CCC';
        if(!this.show) this.c[3].childNodes[0].style.background = '#CCC';
        this.c[3].childNodes[0].style.borderColor = '#CCC';
        this.s[7].display = 'none';

        //this.unselectAllKey();

    }

    //------------------------
    //      Update 
    //------------------------

    update( f ) {

        this.v = this.frame[ f ];
        if(this.v !== undefined ){
            if(this.needPrev) this.prev = this.v;
            if(this.needNext) this.next = this.v < this.lng-1 ? this.v+1 : undefined;
        }

    }

    // reset function to find next and prev when timeline jump to frame and not play

    reset( f ) {

        let t = this.resetLevel( f, this.frame, this.lng );

        this.prev = t[0];
        this.next = t[1];

    }

    resetLevel( f, frame, lng ) {

        let p, n, k, ar, v = frame[ f ];

        if( v !== undefined ){

            p = v > 0 ? v-1 : undefined;
            n = v+1 < lng ? v+1 : undefined;

        } else {

            if( !this.needPrev && !this.needNext ) return [];

            ar = Object.keys( frame );

            // find prev frame

            if( this.needPrev && f > ar[ 0 ] ){
                
                k = f;
                while( p === undefined ){ k--; p = frame[ k ]; }
                
            }

            // find next frame

            if( this.needNext && f < ar[ lng-1 ] ){
               
                k = f;
                while( n === undefined ){ k++; n = frame[ k ]; }
                
            }

        }

        return [p,n];

    }

    // HEIGHT

    setHeight( h ) {

        if( h ) this.h = h;
        this.oldH = this.h;
        this.s[0].height = this.h + 'px';
        this.s[5].height = (this.h - this.tt - this.tb) + 'px';
        this.changeHeight();

    }

    applyHeight() {

        this.s[0].height = this.h + 'px';
        this.parent.calc();

    }

    changeHeight() {

    }

    rename( id ){

        this.id = id;
        this.c[6].id = this.id;
        this.c[1].id = this.id;

        if( this.autoName ){
            this.name = this.type + this.id;
            this.c[1].textContent = this.name;
        }

    }
    
    open() {

        this.show = true;
        this.h = this.oldH;
        this.c[3].childNodes[0].style.background = 'none';
        this.s[5].display = 'block';
        this.s[6].display = 'block'; 
        this.s[2].display = 'block';
        this.s[6].borderTopColor = Utils.color.trackover
        this.s[6].pointerEvents = 'auto'
        this.applyHeight();

    }

    close() {

        this.show = false;
        this.h = this.tt+2//this.tt+1;
        if(this.select) this.c[3].childNodes[0].style.background = '#CC0';
        else this.c[3].childNodes[0].style.background = '#CCC';
        this.s[5].display = 'none';
        this.s[2].display = 'none';
        this.s[6].borderTopColor = 'transparent'
        this.s[6].pointerEvents = 'none'
        this.applyHeight();

    }

    syncroTrack( x, mw ) {

        this.s[5].left = - x + 'px';
        if( mw ){
            this.maxw = mw;//.toFixed(2);
            this.w = this.parent.frameSize;
            this.s[5].width = mw + 'px';
            this.setSize();
        }

    }

    setID( id ) {

        this.id = id;
        this.c[6].id = this.id;
        this.c[1].id = this.id;

    }

    //------------------------
    //      Delete 
    //------------------------
    
    clear() {

        Utils.clear( this.c[0] );

        if( this.target !== undefined ) this.target.removeChild( this.c[0] );

        this.parent.remove( this.id )

        this.c = null;
        this.target = undefined;

    }

    //------------------------
    //
    //      KEY 
    //
    //------------------------

    keyOver( id, level ) {

        if( this.fulloverkey && this.overitem ) this.overitem.over()

        if( this.overid === id ) return

        this.overid = id

        if( this.overitem ){
            this.overitem.out()
            this.overitem = null
        }

        if( id !== -1 ){

            if( level !== undefined ) this.overitem = this.items[level][id]
            else this.overitem = this.items[id]
            this.overitem.over()

        }

    }

    unselectKey() {

        //this.unselectAllKey();

        if( this.current === null ) return
        this.current.unSelected()
        this.current = null

    }

    selectKey( id ) {

        this.parent.unselectKey()

        //this.unselectAllKey();      
        this.items[id].selected();
        return this.items[id];

    }

    unselectAllKey() {

        let i = this.items.length;
        while(i--){
            this.items[i].unSelected();
        }

    }

    setSize() {

        let i = this.items.length;
        while(i--) this.items[i].reSize( this.w );
        
        if(this.type === 'lfo' || this.type === 'audio') this.draw();

    }

    // add frame key at loading

    addFrame() {

        let f, fr = this.loadframe;

        if(this.isAudio){ 

            this.addFrameOnLoad();

        } else {

            for ( f in fr ) this.addItem( parseInt( f ), fr[f] );
            this.sort();

        }

    }

    // POOL loading

    addFrameOnLoad() {

        let f, fr = this.loadframe;

        this.tmpPool = [];

        for ( f in fr ) {

            if( this.tmpPool.indexOf(fr[f]) === -1 ) this.tmpPool.push(fr[f]);

        }

        this.callback = function(){ this.load_next() }.bind(this);
        this.load( this.tmpPool[0] );

    }

    load( url ) {

        if( this.isAudio ) Utils.loadSound( url, null, this.callback );

    }

    load_next() {

        this.tmpPool.shift();
        if( this.tmpPool.length === 0 ) {

            this.callback = null;

            let f, fr = this.loadframe;

            for ( f in fr ) this.addItem( parseInt( f ), fr[f] );
            this.sort();

        }
        else this.load( this.tmpPool[0] );

    }

    // add key

    addItem( f, value, level ) {

        let t = this.type[0].toUpperCase() + this.type.slice(1);

        if(t === 'Bang') t = '';
        //if(t === 'Module') t = '';
        if(t === 'Curve') level = level === undefined ? this.currentLevel : level;
        if(t === 'Module') level = this.name;

        let k;

        switch( t ){
            case 'Flag': k = new KeyFlag( f, value, level ); break;
            case 'Color': k = new KeyColor( f, value, level ); break;
            case 'Curve': k = new KeyCurve( f, value, level ); break;
            case 'Switch': k = new KeySwitch( f, value, level ); break;
            case 'Module': k = new KeyModule( f, value, level ); break;
            case 'Lfo': k = new KeyLfo( f, value, level ); break;
            case 'Audio': k = new KeyAudio( f, value, level ); break;
            case 'Video': k = new KeyVideo( f, value, level ); break;
            default: k = new Key( f, value, level ); break;
        }

        k.parent = this;
        k.reSize( this.parent.frameSize );
        this.c[5].appendChild( k.content );

        if(t === 'Curve'){
            if( this.nAxe === 1 ) k.pcolor( Utils.color.key );
            this.items[ level ].push( k );
        } else { 
            this.items.push( k );
        }
        
        return k;

    }

    // remove key

    removeID( id, level ) {

        let k = level !== undefined ? this.items[level] : this.items;
      
        this.c[5].removeChild( k[id].content );
        k[ id ].clear();
        k.splice( id, 1 );

        this.sort( true );

    }

    //------------------------
    //
    //      SORT
    //
    //------------------------

    sort( up ) {

        /*if( this.timer !== null ){
            clearTimeout( this.timer );
            this.timer = null;
        }*/

        // sort key items

        this.items.sort( function ( a, b ) { return a.frame - b.frame; } );
        this.lng = this.items.length;

        // create frame referency id

        let i = this.lng, k, f = {};
        while(i--){
            k = this.items[i]
            k.setID( i );
            f[ k.frame ] = i;
        }

        this.frame = f;

        // update this track
        this.draw();

        // update main frame

        if( up ) this.showUpdate();
        
    }

    showUpdate() {

        if( this.parent.isPlay ) return;
        this.parent.goTo();

    }


    //----------------------------
    //
    //     MOUSE
    //
    //----------------------------

    over( e ) {

        let name = e.target.name

        if( name !== undefined ) {

            if( name.substring( 0, 3 ) === 'key' ){

                let id = e.target.id, lvl;
                if( this.type === 'curve') lvl = e.target.level;
                this.keyOver(id, lvl)

            } else {
                this.keyOver(-1)
            }

        }

        if( this.isOver ) return

        this.isOver = true
        this.s[0].background = 'rgba(0,0,0,0.1)'
        if(!this.show) return
        this.s[2].borderTopColor = Utils.color.trackover
        this.s[6].borderTopColor = Utils.color.trackover
        this.s[5].boxShadow = 'inset 0 0 3px rgba(0,0,0,0.5)'
        
    
    }

    out( e ) {

        if( !this.isOver ) return
        //this.endEditName()
        this.isOver = false 
        this.s[0].background = 'none'
        if(!this.show) return
        this.s[2].borderTopColor = Utils.color.track2
        this.s[6].borderTopColor = Utils.color.track2
        this.s[5].boxShadow = 'none'

        //this.keyOver(-1)
        
    }

    up( e ) {

        let name = e.target.name;
        //console.log(name)
        if( name === undefined || name !== 'title') this.endEditName()
    
        if( this.drag ){

            this.drag = false
            this.s[5].cursor = 'pointer'
            this.sort( true )

        }

        //this.current = null
        

    }

    down( e ) {

        if( !this.isOver ) return

        let button = e.which;
        let name = e.target.name;
        let f = this.parent.framePrev//.getFrameClick( e.clientX );

        this.endEditName()

        this.parent.selected( this ); // this is the track selected

        if( name === undefined ) return;

        name = name.substring( 0, 3 ) === 'key' ? 'key' : name

        switch( name ){

            case 'pins':
                if( this.show ) this.close()
                else this.open()
            break;
            case 'dels':
                this.clear()
            break;
            case 'title':
                this.editName()
            break;
            case 'key':

                let id = e.target.id, lvl
                if( this.type === 'curve') lvl = e.target.level

                if( button === 1 ){
                    
                    this.current = this.selectKey( id, lvl );

                    if( this.current !== null ){

                        this.current.first = true
                        //this.dragType = name.substring( 3 );
                        this.drag = true
                        this.move( e )

                    }
                    
                }
                if( button === 3 ){
                    this.removeID( id, lvl );
                }
            break;
            case this.type:

                if( button === 1 ){ // add new  key

                    if( this.frame[f] !== undefined ) return
                    let key = this.addItem( f )
                    if( this.type === 'curve' ) key.py = e.clientY - ( this.top + this.tt ); 
                    this.sort( true )
                    this.current = this.selectKey( key.getID() )
                    this.current.first = true
                    
                    this.drag = true
                    this.move( e, 1 )

                }

            break;

        }

    }

    move( e, force ) {
        
        if( !this.drag || this.current === null ) return;


        let f = this.parent.framePrev//getFrameClick( e.clientX );
     
        if( this.type === 'curve' ){

            this.s[5].cursor = 'all-scroll';
            let y = e.clientY - ( this.top + this.tt );
            this.current.move( f, y )
            
        } else {

            this.s[5].cursor = 'e-resize';
            this.current.move( f, force )

        }

        //this.sort( true );
         
        if( this.needTimer ){ 
            clearTimeout( this.timer );
            this.timer = setTimeout( this.sort.bind(this), 0, true );
        }
        
    }

}