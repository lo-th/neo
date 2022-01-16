import { Key } from '../core/Key.js';
import { Perlin } from '../core/Math.js';


export class KeyLfo extends Key {

    constructor( f, o = [] ) {

        super( f )

        this.curve = o[0] || 'sine';
        this.frequency = o[1] || 0.1; // 0 to 1
        this.amplitude = o[2] || 1.0; // 0 to 1
        this.phase = o[3] || 0; // 0 to 360
        this.seed = o[4] || 0; // 0 = random
        this.perlin = null;

        if( this.curve === 'noise' ) this.getPerlin();

    }

    getPerlin() {

        if( this.perlin === null ) this.perlin = new Perlin( this.seed );
        return this.perlin;

    }

    getValue() {

        return [ this.curve, this.frequency, this.amplitude, this.phase, this.seed ];

    }

    setValue( v, type ) {
        
        this[type] = v;
        if( type === 'noise' || type==='seed' ) this.perlin = new Perlin( this.seed );
        this.parent.draw();

    }

}