import { Key } from '../core/Key.js';
import { _Math } from '../core/Math.js';


export class KeyColor extends Key {

    constructor( f, color ) {

        super( f )

        this.value = color === undefined ? 0x0000FF : color;

        this.ks.background = 'none';
        this.ks.width = '16px';
        this.ks.marginLeft = '-8px';
        this.ks.left = '50%';
        this.ks.borderRadius = '7px';
        this.ks.boxShadow = '0 0 0 1px ' + _Math.hexToHtml( _Math.invertColor( this.value ));

        this.ks.border = '4px solid ' + this.co[0];
        this.cct = 'borderColor';

    }

    setColor( color ) {

        this.value = _Math.numToHex( color );
        this.ks.boxShadow = '0 0 0 1px ' + _Math.hexToHtml( _Math.invertColor( this.value ));
        this.parent.sort( true );

    }

}