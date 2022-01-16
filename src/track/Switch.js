import { Track } from '../core/Track.js';


export class Switch extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'switch'

        this.needPrev = true
        this.fulloverkey = true

        this.init()

    }

    update( f ) {

        super.update( f )

        let value = this.v === undefined ? false : true;
        let prev = this.items[this.prev];
        if( prev !== undefined ) value = f <= prev.end ? true : value;

        if( this.select || this.parent.fullActve ){
            this.c[5].style.background = value ? this.acolor : 'none'
            //this.preview.setValue( value )
        }
        
        return value;

    }
    
}