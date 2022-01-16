import { Track } from '../core/Track.js';
import { Utils } from '../core/Utils.js';


export class Audio extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'audio'

        this.range = o.range || [-100,100];

        this.needPrev = true;
        this.isMedia = true;

        this.origine = Utils.liner( 0, this.acolor );

        this.h = o.h || (102 + this.tt + this.tb);

        this.init();

    }

    update( f ) {

        super.update( f )

        let v = this.v === undefined ? (this.prev === undefined ? undefined : this.prev) : this.v;

        //var value = this.v === undefined ? null : this.items[this.v];
        //if( value === null ) value = this.prev === undefined ? null : this.items[this.prev];

        if ( v !== undefined ){ 
            if( this.parent.isPlay ) this.items[ v ].play(f);
        }

    }

    reset( f ) {

        this.stop();
        super.reset( f )

    }

    stop() {

        let i = this.items.length;
        while( i-- ) this.items[i].stop();
        
    }

}