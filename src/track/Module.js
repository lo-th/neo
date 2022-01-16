import { Track } from '../core/Track.js';


export class Module extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'module'

        this.needPrev = true
        this.fulloverkey = true
        this.h = 80

        this.init()

    }

    update( f ) {

        super.update( f )

        let value = this.v === undefined ? '' : this.items[this.v].value;
        let prev = this.items[this.prev];
        if( prev !== undefined ) value = f <= prev.end ? this.items[this.prev].value : '';

        if( this.select || this.parent.fullActve ){
            this.c[5].style.background = value ? this.acolor : 'none'
        }
        
        return value

    }

}