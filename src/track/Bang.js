import { Track } from '../core/Track.js';


export class Bang extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'bang'
        
        this.init()

    }

    update( f ) {

        let value = this.frame[ f ] === undefined ? false : true;

        if( this.select || this.parent.fullActve ){
            this.s[5].background = value ? this.acolor : 'none'
            //this.preview.setValue( value )
        }

        return value
        
    }

}