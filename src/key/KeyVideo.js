import { KeyFlag } from './KeyFlag.js';
import { Utils } from '../core/Utils.js';

export class KeyVideo extends KeyFlag {

    constructor( f, o = [] ) {

        super( f )

        this.name = o[0] || '';
        this.frameRate = o[1] || 24;

        this.totalFrame = 0;
        this.video = null;
        this.inPlay = false;
        //this.source = null;
        this.ks.borderLeft = '1px solid ' + this.co[0];
        this.ks.borderRight = '1px solid ' + this.co[0];
        this.cct = 'borderColor';
        //this.ks.background = 'none';

        this.flagName = Utils.add('string', { target:this.content, value:this.name, w:80, h:18, simple:true, pos:{ left:this.w+'px', top:'0px' } }).onChange( function(v){ this.name = v; Utils.loadVideo(this.name, this) }.bind(this) );

        if( this.name ) Utils.loadVideo( this.name, this );

    }

    getValue() {

        return [this.name, this.frameRate ];

    }

    seek( f ) {

        if( this.video === null ) return;
        if( !this.video.paused ) this.video.pause();

        if(f>=this.frame && f<this.frame+this.totalFrame ){ 

            this.video.currentTime = (( f-this.frame ) * this.parent.parent.frameTime) + 0.00001;

            var frame = Number(this.getFrame());
           // console.log(frame)
            /*var frames = f-this.frame;
            var direction = 'backward';

            if(frames > frame) direction = 'forward';

            this.video.currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / this.frameRate) + 0.00001);
            */



            /*if( !this.inPlay ){
                this.inPlay = true;
                this.video.play();
            }*/
            //this.connect( f );
        }
        
    }

    getFrame() {
        if( this.video === null ) return
        return Math.floor(this.video.currentTime.toFixed(5) * this.frameRate)*2;
    }

    play( f ) {

       if(f>=this.frame && f<this.frame+this.totalFrame ){ 
            if( !this.inPlay ){
                this.inPlay = true;
                this.video.play();
            }
            //this.connect( f );
        }
        
    }

    stop() {
        if( this.video === null ) return

        this.inPlay = false;
        this.video.pause();

            //console.log('pause')
        //this.source = null;
    }

    /*NEO.KeyVideo.prototype.connect = function( f ){

        if( this.video === null ) return;
        if (!this.video.paused) this.video.pause();

        var frame = Number(this.getFrame());
        /** To seek forward in the video, we must add 0.00001 to the video runtime for proper interactivity */
       // this.video.currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / this.frameRate) + 0.00001);

        //this.video.currentTime =  (( f-this.frame ) * NEO.frameTime) + 0.00001;

        /*this.source = NEO.Sound.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect( NEO.Sound.destination );

        var start = this.frame * NEO.frameTime;
        var begin = ( f-this.frame ) * NEO.frameTime;

        this.source.start( start, begin );*/
        

    //}

    clear() {

        this.flagName.clear();
        super.clear()

    }

    reSize( w ){
        
        super.reSize( w )

        this.flagName.c[0].style.left = this.sx + 'px';

        let max = ~~( this.w * this.totalFrame );

        this.ks.width = (max+2) + 'px';

    }

}