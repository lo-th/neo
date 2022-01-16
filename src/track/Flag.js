import { Track } from '../core/Track.js';


export class Flag extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'flag'

        this.needPrev = true;

        this.h = 84;
        this.hmax = Math.floor(( this.h - this.tt - this.tb )/18)-1;

        this.init();

    }

    update( f ) {

        super.update( f )

        let value = this.v === undefined ? '' : this.items[this.v].value;
        if( !value ) value = this.prev === undefined ? '' : this.items[this.prev].value;
        
        if( this.select || this.parent.fullActve ){
            this.c[5].style.background = this.v !== undefined ? this.acolor : 'none';
        }

        return value;

    }

    draw() {

        let py = 0;
        let lng = this.items.length;

        for( let i = 0; i !== lng; i++ ){
            this.items[i].setPy( py );
            if( py < this.hmax ) py++;
            else py = 0;
        }

    }

    changeHeight() { 

        this.hmax = Math.floor(( this.h - this.tt - this.tb )/18)-1;
        this.draw();

    }

}