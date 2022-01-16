import { Key } from '../core/Key.js';
import { Utils } from '../core/Utils.js';


export class KeyCurve extends Key {

    constructor( f, o = {}, level ) {

        super( f )

        o = o || [];
        this.pos = o[0] || 0;
        this.ease = o[1] || 'linear';
        //this.axe = o[2] || 'x';
        this.level = level;//this.setAxe();

        this.py = 0;
        
        this.ext = '';
        this.name = '';

        this.ks.width = '16px';
        this.ks.height = '16px';
        this.ks.marginLeft = '-8px';
        this.ks.marginTop = '-8px';
        this.ks.left = '50%';
        this.ks.borderRadius = '7px';
        this.ks.cursor = 'move'//'crosshair';
        this.ks.border = '3px solid ' + this.co[0];
        this.cct = 'borderColor';
        this.ks.background = 'none';

        this.color = ['#F33', '#3F3', '#59F', '#F95'];
        
        this.point = Utils.dom( 'div', Utils.basic + 'top:50%; left:50%; margin-left:-3px; margin-top:-3px; border-radius:3px; width:6px; height:6px; background:' + this.color[this.level], null, this.key );

    }

    getValue() {

        return [this.pos, this.ease]

    }

    pcolor(c) {

        this.point.style.background = c
        
    }

    clear() {

        this.key.removeChild( this.point )
        super.clear()
        
    }

    setY() {

        this.py = this.parent.yFromPos( this.pos )
        this.ks.top = ~~ this.py+'px'

    }

    getLastX( ff ) {

        return Math.floor((ff*this.w)+(this.w*0.5))

    }

    getY(){

        return this.py

    }

    setAxe(){

        let n = 0;
        if(this.axe === 'y') n = 1;
        if(this.axe === 'z') n = 2;
        if(this.axe === 'w') n = 3;
        return n;

    }

    getType(){

        let name = this.ease;
        let n = name.length;
        if( name.substring( n-7 ) === '-in-out' ){ this.name = name.substring( 0, n-7 ); this.ext = '-in-out'; }
        else if( name.substring( n-3 ) === '-in' ){  this.name = name.substring( 0, n-3 ); this.ext = '-in'; }
        else if( name.substring( n-4 ) === '-out' ){ this.name = name.substring( 0, n-4 ); this.ext = '-out'; }
        else { this.name = name; this.ext = ''; }

    }

    setType( v ) {

        this.name = v;
        this.setEase();

    }

    setExt( v ) {

        this.ext = v;
        this.setEase();

    }

    setEase() {

        if(this.name === 'linear') this.ease = this.name;
        else {
            if( this.ext === '' ) this.ext ='-in';
            this.ease = this.name + this.ext;
        }

        this.parent.currentLevel = this.level;
        this.parent.sort( true );
        //this.parent.draw();
    }

    move( f, y ) {

        let dy = 0;
        //let dx = 0;

        if( this.first ){

            this.first = false;
            this.parent.currentLevel = this.level;
            dy = y - this.py;
            this.df = f - this.frame;
            
        }

        let no = this.parent.frame[this.level][f];
        if( no !== undefined && no !== this.key.id ) f = this.frame; 

        this.ks[this.cct] = this.co[2];

        this.frame = f - this.df;
        this.l = ~~ ( this.frame * this.w );
        this.content.style.left = this.l + 'px';

        //NEO.Key.prototype.move.call( this, f - dx );

        this.py = y - dy
        this.pos = this.parent.posFromY( this.py )
        this.ks.top = ~~ this.py + 'px'

    }

    getID( e ) {

        return this.key.id

    }

    getLevel( e ) {

        return this.key.level

    }

    setID( id, n ){

        this.key.id = id
        this.level = n
        this.key.level = n

    }

}