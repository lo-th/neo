import { Track } from '../core/Track.js';


export class Video extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'video'

        this.needPrev = true;
        this.isMedia = true;

        this.h = o.h || (102 + this.tt + this.tb);

        this.init();

    }

    update( f ) {

        super.update( f )

        let value = 0;
        let v = this.v === undefined ? (this.prev === undefined ? undefined : this.prev) : this.v;

        if ( v !== undefined ){ 
            if( this.parent.isPlay ) this.items[ v ].play( f );
            value = this.items[ v ].getFrame();
        }

        return value;
     
    }

    reset( f ) {

        this.videoGo(f);
        super.reset( f )

    }

    stop() {

        let i = this.items.length;
        while( i-- ) this.items[i].stop();
        
    }

    videoGo(f) {

        let i = this.items.length;
        while( i-- ) this.items[i].seek( f );
        
    }

}