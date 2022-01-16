
import { Track } from '../core/Track.js';
import { Utils } from '../core/Utils.js';
import { _Math } from '../core/Math.js';


export class Lfo extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'lfo'

        this.needTimer = true;
        this.needPrev = true;
        this.needTop = true;

        this.pointhide = true;

        this.origine = Utils.liner( 0, this.acolor );
        this.c[5].appendChild( this.origine );

        this.curve = Utils.dom( 'path', Utils.basic + 'width:100%; height:100%; left:0; top:0;',{ width:'100%', height:'100%', 'd':'', 'stroke-width':1, stroke:Utils.color.key, fill:'none', 'stroke-linecap':'butt' } );
        this.point = Utils.dom( 'div', Utils.basic + 'left:0; margin-left:-5px; margin-top:-5px; border-radius:5px; width:10px; height:10px; border:1px solid '+Utils.color.key+'; display:none' );
        //this.c[5].appendChild(this.curveOrigine);
        this.c[5].appendChild( this.curve );
        this.c[5].appendChild( this.point );

        this.h = o.h || (102 + this.tt + this.tb);

        this.ofRange()

        this.init()

    }

    update( f ) {

        super.update( f )

        let value = 0;
        let cc;
        ///let v = this.v ? this.v : ( this.prev ? this.prev : undefined );

        let v = this.v === undefined ? ( this.prev === undefined ? undefined : this.prev ) : this.v;

        if ( v !== undefined ){

            cc = this.items[ v ];

            if( cc.curve === 'sine' ) value = _Math.Sine( f - cc.frame, cc.phase, cc.frequency, cc.amplitude );
            if( cc.curve === 'noise' ) value = cc.perlin.noise( (f - cc.frame) * cc.frequency * 0.1, 0 ) * cc.amplitude;

        }


        if( this.select || this.parent.fullActve ){
            if( this.pointhide ){
                this.pointhide = false;
                this.point.style.display = 'block';
            }

            this.point.style.top = ((value*(this.midy-10))+this.midy)+ 'px';
            this.point.style.left = this.parent.frameTrack + 'px';

        } else {
            if( !this.pointhide ){
                this.pointhide = true;
                this.point.style.display = 'none';
            }
        }

        //console.log( v )


        return value;


    }

    draw() {

        clearTimeout( this.drawdelay );
        this.drawdelay = setTimeout( this.drawCurve.bind(this), 0 )

        //this.drawCurve()

    }

    drawCurve() {

        //let midy = (this.range[5]*0.5)+0.5;
        let fsize = this.parent.frameSize;
        let max = this.parent.frameMax;//fsize * NEO.main.nframe;
        let size;
        let path = [];
        path.push('M ' + 0 + ' ' + this.midy );

        let lng = this.lng;

        for(let i=0; i!==lng; i++ ){

            if( i < lng-1 ) size = this.items[i+1].frame - this.items[i].frame;//this.items[i+1].getX();// - (fsize*0.5);
            else size = max - this.items[i].frame;

            if( this.items[i].curve === 'sine' ) this.curveSine( this.items[i], size, fsize, path );
            if( this.items[i].curve === 'noise' ) this.curveNoise( this.items[i], size, fsize, path );
            
        }

        path.push(' L ' + this.maxw + ' ' + this.midy);
        this.curve.childNodes[0].setAttributeNS(null, 'd', path.join('\n') );

    }

    curveNoise( item, size, fsize, path ) {

        let x = item.getX();
        let perlin = item.getPerlin();//perlin;
        let amplitude = item.amplitude;
        let frequency = item.frequency;
        let middle = this.midy;
        let rarity = this.w
        let m = 1;//0.25;;

        let x1, x2, y1, y2;

        let lng = size / m;

        for ( let i = 1; i < lng; i+=2 ) {

            x1 = ((i - 1) * rarity * m) + x;
            y1 = ( perlin.noise((i - 1)*frequency*0.1, 0) * amplitude * (middle-10) ) + middle;

            x2 = (i * rarity * m) + x;
            y2 =  ( perlin.noise(i*frequency*0.1, 0) * amplitude * (middle-10) ) + middle;

            x1 = x1.toFixed(2);
            x2 = x2.toFixed(2);
            y1 = y1.toFixed(2);
            y2 = y2.toFixed(2);

            path.push(' L ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2);

        }

    }

    curveSine( item, size, fsize, path ) {

        let x = item.getX();

        let x1, x2, y1, y2;
        let middle = this.midy;
        let amplitude = item.amplitude;
        let frequency = item.frequency;
        let phase = item.phase;
        let rarity = (this.w);
        let m = 0.5//0.25;
        let lng = size / m;
        
        for ( let i = 1; i < lng; i+=2 ) {

            x1 = ((i - 1) * rarity * m) + x;
            y1 = ( _Math.Sine( (i - 1)* m, phase, frequency, amplitude) * (middle-10) ) + middle;

            x2 = (i * rarity * m) + x;
            y2 = ( _Math.Sine( i* m, phase, frequency, amplitude) * (middle-10) ) + middle;

            x1 = x1.toFixed(2);
            x2 = x2.toFixed(2);
            y1 = y1.toFixed(2);
            y2 = y2.toFixed(2);

            path.push(' L ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2);

        }

    }

    ofRange() {

        //Curve.prototype.ofRange.call( this, a, b );

        let h = this.h - this.tt - this.tb;
        this.midy = h * 0.5;
        this.origine.style.top = ~~(this.midy) + 'px';

    }

    changeHeight() {

        this.ofRange();
        this.draw();

    }

}
