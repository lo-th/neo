import { Key } from '../core/Key.js';
import { Utils } from '../core/Utils.js';

export class KeySwitch extends Key {

    constructor( f, end ) {

        super( f )

        this.end = end || (f+1);
        this.dragtype = 0;

        this.decal = 0;
        this.min = 0;
        this.max = 1;

        this.ks.borderLeft = '1px solid #FFF';
        this.ks.borderRight = '1px solid #FFF';

    }

    getValue() {

        return this.end;

    }

    reSize( w ) {

        super.reSize( w )
        this.reSizeLength();
        
    }

    reSizeLength() {

        this.lng = (this.end - this.frame);
        //var ll = Math.floor( this.w * (this.lng + 1) );
        this.ks.width = Math.floor( this.w * (this.lng + 1) ) + 'px';

    }

    over() {

        let f = this.parent.parent.framePrev
        if( Utils.inRange( f, this.frame + 2, this.end - 2 )) this.ks.cursor = 'ew-resize';
        else this.ks.cursor = 'col-resize'

        super.over()

    }

    move( f, force ) {

        let p = this.parent;
        ///this.max = p.parent.frameMax-1;

        if( this.first ){

            this.max = p.parent.frameMax-1;
            
            if( f < this.frame + 2 ) this.dragtype = 0;
            else if( f > this.end - 2 ) this.dragtype = 1;
            else this.dragtype = 2;

            if(force) this.dragtype = force;

            this.decal = f - this.frame;
            
            p.reset( this.frame );
            if( p.next !== undefined ) this.max = p.items[p.next].frame -1;
            if( p.prev !== undefined ) this.min = p.items[p.prev].end + 1;

            this.first = false;

        }

        this.ks[this.cct] = this.co[2];

        switch( this.dragtype ){

            case 1:

                f = f < this.frame+1 ? this.frame+1 : f;
                this.end = f > this.max ? this.max : f;
                this.reSizeLength();

            break;
            
            case 2:

                this.frame = f - this.decal;
                this.frame = this.frame < 0 ? 0 : this.frame; 
                this.frame = this.frame < this.min ? this.min : this.frame; 
                this.frame = this.frame + this.lng > this.max ? this.max - this.lng : this.frame;

                this.end = this.frame + this.lng;
             
                //this.l = Math.floor( this.frame * this.w );
                this.l = Math.floor( this.frame * this.w );
                this.content.style.left = this.l + 'px';


            break;
            
            default:

                f = f > this.end-1 ? this.end-1 : f;
                f = f < this.min ? this.min : f;
                Key.prototype.move.call( this, f );
                this.reSizeLength();

            break;

        }

    }

}