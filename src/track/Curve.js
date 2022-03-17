import { Track } from '../core/Track.js';
import { Utils } from '../core/Utils.js';
import { _Math } from '../core/Math.js';


export class Curve extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'curve'

        o.frame = o.frame === undefined ? {x:{}} : o.frame;

        this.nAxe = 0;
        this.px = -10;

        this.range = o.frame.range || [-100,100];
        this.precision = o.frame.precision || 3;
        this.defaultTween = o.frame.def || 'linear';
        
        if( o.frame.x !== undefined ) this.nAxe++;
        if( o.frame.y !== undefined ) this.nAxe++;
        if( o.frame.z !== undefined ) this.nAxe++;
        if( o.frame.w !== undefined ) this.nAxe++;

        this.basePos = [0,0,0,0];
        this.basey = [0,0,0,0];

        //

        this.items = [];
        this.frame = [];
        this.lng = [];

        this.prev = [];
        this.next = [];


        this.loadframe = [];
        this.currentLevel = 0;

        this.value = {};
        this.axis = [ 'x', 'y', 'z', 'w' ];

        this.needTimer = true;
        this.needPrev = true;
        this.needNext = true;
        this.needTop = true;

        this.pointhide = true;

        this.origine = Utils.liner( 0, this.acolor );
        this.c[5].appendChild( this.origine );

        if( this.nAxe === 1 ) this.color = [Utils.color.key];
        else this.color = ['#F33', '#3F3', '#59F', '#F95'];

        this.curves = [];
        this.points = [];

        //var n = this.nAxe;
        //while(n--){

        for(let n = 0; n<this.nAxe;n++){

            this.curves[n] = Utils.dom( 'path', Utils.basic + 'opacity:0.75; width:100%; height:100%; left:0; top:0;',{ width:'100%', height:'100%', 'd':'', 'stroke-width':1, stroke:this.color[n], fill:'none', 'stroke-linecap':'butt' } );
            this.points[n] = Utils.dom( 'div', Utils.basic + 'left:0; margin-left:-5px; margin-top:-5px; border-radius:5px; width:10px; height:10px; border:1px solid '+this.color[n]+'; display:none' );
        
            this.c[5].appendChild( this.curves[n] );
            this.c[5].appendChild( this.points[n] );

            if( n === 0 ){ this.value.x = 0; this.loadframe[0] = o.frame.x || {}; }
            if( n === 1 ){ this.value.y = 0; this.loadframe[1] = o.frame.y || {}; }
            if( n === 2 ){ this.value.z = 0; this.loadframe[2] = o.frame.z || {}; }
            if( n === 3 ){ this.value.w = 0; this.loadframe[3] = o.frame.w || {}; }

            this.items.push([]);
            this.lng.push(0);

        }

        //this.h = o.h || 130;
        this.h = o.h || (102 + this.tt + this.tb);

        this.ofRange( this.range[0], this.range[1] );
        
        this.init();

    }

    getFrame() {

        let data = {};
        let v = this.value;
        if( v.x !== undefined ){ data['x'] = {}; this.pushValue( data.x, 0 ); }
        if( v.y !== undefined ){ data['y'] = {}; this.pushValue( data.y, 1 ); }
        if( v.z !== undefined ){ data['z'] = {}; this.pushValue( data.z, 2 ); }
        if( v.w !== undefined ){ data['w'] = {}; this.pushValue( data.w, 3 ); }

        data['range'] = [this.range[0], this.range[1]];
        return data;

    }

    pushValue( data, l ) {

        let lng = this.items[l].length;
        for( let i=0; i<lng; i++ ){
            data[ this.items[l][i].frame ] = this.items[l][i].getValue();
        }

    }

    update( f ) {

        let v = this.value;

        if( v.x !== undefined ) v.x = this.upLevel( f, 0 );
        if( v.y !== undefined ) v.y = this.upLevel( f, 1 );
        if( v.z !== undefined ) v.z = this.upLevel( f, 2 );
        if( v.w !== undefined ) v.w = this.upLevel( f, 3 );

        this.displayPoint( f );

        if( this.nAxe === 1 ) return v.x;
        return v;

    }

    upLevel( f, n ) {

        let v = this.frame[n][f];
        let v1 = [ 0, this.basePos[n], 'linear'];
        let v2 = [ this.parent.frameMax, this.basePos[n] ];
        let val = 0;
        //var p = this.precision;

        if( v !== undefined ){

            val = this.items[n][v].pos;

            this.prev[n] = v;
            this.next[n] = v < this.lng[n]-1 ? v + 1 : undefined;

        } else {
            
            let prev = this.items[n][ this.prev[n] ];
            let next = this.items[n][ this.next[n] ];

            if( prev !== undefined ) v1 = [ prev.frame, prev.pos, prev.ease ];
            if( next !== undefined ) v2 = [ next.frame, next.pos ];

            val = _Math.Tween( v1[1], v2[1], v1[2], f, v1[0], v2[0] );
               
        }

        //return NEO.fix( val, p );//val.toFixed( this.precision )*1;
        return val.toFixed( this.precision )*1;

    }

    displayPoint( f ) {

        let change = false;
        let up = false;
        let px = 0;

        if( this.select || this.parent.fullActve ){
            if( this.pointhide ){
                this.pointhide = false;
                change = true;
            }
            up = true;
            px = this.parent.frameTrack;
        } else {
            if( !this.pointhide ){
                this.pointhide = true;
                change = true;
            }
        }

        if( !change && !up ) return;

        let n = this.nAxe
        while( n-- ){

            if( change ) this.points[n].style.display = this.pointhide ? 'none' : 'block';
            this.points[n].style.top = _Math.floor( this.yFromPos( this.value[ this.axis[n] ] ) ) + 'px';
            this.points[n].style.left = px + 'px';

        }

    }

    draw( full ) {

        if(full){
            let n = this.nAxe;
            while( n-- ){
                this.drawLevel(n);
            }
        } else {
            this.drawLevel( this.currentLevel );
        }

    }

    drawLevel( n ) {

        let path = [], lng, type, i;

        let first = this.items[n][0];

        if( first !== undefined ){
            this.basePos[n] = first.pos;
            this.basey[n] = first.getY();
        } else {
            this.basePos[n] = 0;
            this.basey[n] = this.midy + 0.5;
        }

        path.push( 'M ' + 0 + ' ' + this.basey[n] );

        lng = this.lng[n];

        for( i = 0; i !== lng; i++ ){

            type = this.items[n][i].ease;

            if( type === 'linear' ) path.push(' L ' + this.items[n][i].getX() + ' ' + this.items[n][i].getY() );
            else this.besierSpline( type, this.items[n][i], this.items[n][i+1], path, n );

        }

        path.push( ' L ' + this.maxw + ' ' + this.basey[n] );

        let finalPath = path.toString().replace(/,/g, ' ');

        //this.curves[n].childNodes[0].setAttributeNS( null, 'd', path.join('\n') );
        this.curves[n].childNodes[0].setAttributeNS( null, 'd', finalPath );

    }

    besierSpline( type, item1, item2, path, n ) {

        let p = this.precision;//2;
        let x = [], y = [];
        let f1 = item1.frame;
        let f2, f;
        let a, b, c, d, px, py;
        let num = _Math.Ease.getNum( type );

        x[0] = item1.getX();
        y[0] = item1.getY();

        if( item2 === undefined ){
            f2 = this.parent.frameMax;
            x[num] = item1.getLastX( f2-1 );
            y[num] = this.basey[n];
        } else{
            f2 = item2.frame;
            x[num] = item2.getX();
            y[num] = item2.getY();
        }

        if( y[0] === y[num] ){
            path.push(' L ' + x[0] + ' ' + y[0]);
            return;
        }

        let l = ( f2 - f1 ) / (num-1);
        let xl = ( x[num] - x[0] ) / (num-1);
        let p1 = y[0];
        let p2 = y[num];

        let i = num;
        while( i-- ){

            f = f1 + ( l * i );
            //x[i] = _Math.fix( x[0] + ( xl * i ), p );
            //y[i] = _Math.fix( _Math.Tween( p1, p2, type, f, f1, f2 ), p );

            x[i] = x[0] + ( xl * i );
            y[i] = _Math.Tween( p1, p2, type, f, f1, f2 );

        }

        px = _Math.computeControlPoints( x, p );
        py = _Math.computeControlPoints( y, p );
        a = px[0];
        b = py[0];
        c = px[1];
        d = py[1];

        for ( i = 0; i < ( num - 1 ); i++ ){
            path.push( ' L '+x[i]+' '+y[i]+' C '+a[i]+' '+b[i]+' '+c[i]+' '+d[i]+' '+x[i+1]+' '+y[i+1] );
        }
    }

    ofRange( a, b ) {

        this.range[0] = a;
        this.range[1] = b;

        let total, decal;
        if( a < 0 ) { total = Math.abs(a) + Math.abs(b); decal = a; }
        else if( a > 0 ) { total = b - a; decal = a; }
        else{ total = b; decal = 0; }

        let h = this.h - this.tt - this.tb;

        this.range[2] = total / h;
        this.range[3] = h / total;

        this.range[4] = decal * this.range[3];
        this.range[5] = h;

        this.midy = this.range[5] * 0.5;
        this.origine.style.top = _Math.floor( this.midy ) + 'px';


    }

    changeHeight() {

        this.ofRange( this.range[0], this.range[1] );
        //var i = this.items.length;
        //while(i--) this.items[i].setY();

        let n = this.nAxe, i;
        while(n--){
            i = this.items[n].length;
            while(i--) this.items[n][i].setY();
        }

        this.draw( true );

    }

    yFromPos( pos ) {

        return this.range[5] - ( pos * this.range[3] ) + this.range[4];

    }

    posFromY( y ) {

        return ( ( this.range[5] - y ) * this.range[2] ) + this.range[0];

    }




    // ---------------------------------------------------------------------


    reset( f ) {

        let n = this.nAxe, tmp;
        while( n-- ){

            tmp = this.resetLevel( f, this.frame[n], this.lng[n] );
            this.prev[n] = tmp[0];
            this.next[n] = tmp[1];

       }

    }

    sort( up ){

        /*if( this.timer !== null ){
            clearTimeout( this.timer );
            this.timer = null;
        }*/

        let n = this.nAxe, i;
        while(n--){

            // sort key items

            this.items[n].sort( function ( a, b ) { return a.frame - b.frame; } );
            this.lng[n] = this.items[n].length;

            // create frame referency id

            this.frame[n] = {};

            i = this.lng[n];
            while(i--){
                this.items[n][i].setID( i, n );
                this.frame[n][ this.items[n][i].frame ] = i;
            }
        }

        // update this track

        this.draw();

        // update main frame

        if( up ) this.showUpdate();

    }

    setSize(){

        
        let n = this.nAxe, i;
        while(n--){
            i = this.lng[n];
            while(i--){
                this.items[n][i].reSize( this.w );
            }

        }

        this.draw( true );

    }

    addFrame() {

        let f, fr, n = this.nAxe;

        while(n--){
            fr = this.loadframe[n];
            for ( f in fr ) this.addItem( parseInt( f ), fr[f], n );
        }

        this.sort();

    }

    selectKey( id, level ) {

        //this.unselectAllKey();
        this.parent.unselectKey()

        level = level === undefined ? this.currentLevel : level;

        this.items[level][id].selected();
        return this.items[level][id];

    }

    unselectAllKey() {

        let n = this.nAxe, i;
        while(n--){

            i = this.lng[n];
            while(i--){
                this.items[n][i].unSelected();
            }

        }
    }

}