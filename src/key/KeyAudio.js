import { Utils } from '../core/Utils.js';
import { KeyFlag } from './KeyFlag.js';

export class KeyAudio extends KeyFlag {

    constructor( f, name ) {

        super( f, name )

        this.totalFrame = 0;
        this.buffer = null;
        this.source = null;
        this.key.style.borderLeft = '1px solid ' + this.co[0];
        this.key.style.borderRight = '1px solid ' + this.co[0];
        this.cct = 'borderColor';
        this.key.style.background = 'none';

        this.flagName.onChange( function(v){ this.value = v; Utils.loadSound(this.value, this) }.bind(this) );

        if( this.value ) Utils.loadSound( this.value, this );

    }

    play( f ) {

       if(f>=this.frame && f<this.frame+this.totalFrame && this.source === null ) this.connect( f );
        
    }

    stop() {
        if( this.source === null ) return
        this.source.stop(0);
        this.source = null;
    }

    connect( f ) {

        if(!this.buffer) return;
       // if( single ) this.stop();

        this.source = Utils.Sound.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect( Utils.Sound.destination );

        let start = this.frame * this.parent.parent.frameTime;
        let begin = ( f - this.frame ) * this.parent.parent.frameTime;
        //source.start( start, bigin, NEO.frameTime );

        //if( single ) source.start( start, begin, NEO.frameTime );
        //else 
        this.source.start( start, begin );
        

    }

    clear(){

        this.flagName.clear();
        super.clear()

    }

    reSize( w ){

        super.reSize( w )

        this.flagName.c[0].style.left = this.sx + 'px';

        let max = ~~(this.w * this.totalFrame);

        this.key.style.width = (max+2) + 'px';

    }

}