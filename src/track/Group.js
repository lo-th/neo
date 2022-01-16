import { Track } from '../core/Track.js';


export class Group extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'group'

        this.init()

    }

    update( f ) {

        /*var value = this.frame[ f ] === undefined ? false : true;

        if( NEO.main.isVisible ){
            if(value) this.c[5].style.background = this.acolor;
            else this.c[5].style.background = 'none';
        }

        return value;*/
        
    }
}