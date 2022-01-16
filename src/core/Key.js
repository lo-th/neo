import { Utils } from './Utils.js';


export class Key {

    constructor( f ) {

        this.parent = null;
        this.value = 1;

        this.co = Utils.keyColor

        this.select = false;

        this.frame = f;
        this.df = 0; // decal frame
        this.first = false;

        this.cct = 'background';

        const dom = Utils.dom;
        const basic = Utils.basic;

        this.w = 1;//this.parent.parent.frameSize;
        this.content = dom( 'div', basic+'width:1px; height:100%; left:0px; top:0; overflow:visible;' );

        this.key = dom( 'div', basic+'width:100%; height:100%; opacity:0.5; left:0; top:0; pointer-events:auto; cursor:ew-resize; background:' + this.co[0] );
        this.content.appendChild( this.key );

        this.ks = this.key.style;
        this.cs = this.content.style;

        this.key.name = 'key';

    }

    selected() {

        this.select = true;
        this.ks[this.cct] = this.co[1];
        this.parent.parent.showPannel( this );

    }

    unSelected(){

        this.select = false;
        this.ks[this.cct] = this.co[0];

    }

    getValue() {

        return this.value;

    }

    getID() {

        return this.key.id;
        
    }

    setID( id ) {

        this.key.id = id;
        
    }


    over() {

        this.ks[this.cct] = this.select ? this.co[2] : this.co[1]

    }

    out() {

        this.ks[this.cct] = this.select ? this.co[2] : this.co[0]

    }

    mmove(e) {}

    down(e) {}

    up(e) {}

    clear() {

        Utils.clear( this.content )
        this.content = null

    }

    move( f ) {

        if( this.first ){
            this.first = false;
            this.df = f - this.frame;
        }

        f = f - this.df;
        f = f < 0 ? 0 : f;

        let no = this.parent.frame[f];
        if( no !== undefined && no !== this.key.id ) f = this.frame

        this.ks[this.cct] = this.co[2]

        this.frame = f

        //this.reSize();
        //this.l = Math.round( this.frame * this.w );
        this.l = Math.floor( this.frame * this.w )
        this.cs.left = this.l + 'px'
        
    }

    reSize( w ) {

        this.w = w === undefined ? this.w : w

        //this.l = Math.round( this.frame * this.w );
        //this.sx = Math.round( this.w );

        this.l = Math.floor( this.frame * this.w )
        this.sx = Math.floor( this.w )

        this.sx = this.sx < 6 ? 6 : this.sx

        this.cs.width = this.sx + 'px'
        this.cs.left = this.l + 'px'

    }

    getX(){

        return (this.l + (this.w*0.5));

    }

}