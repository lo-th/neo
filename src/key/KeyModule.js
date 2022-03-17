import { KeySwitch } from './KeySwitch.js';
import { Utils } from '../core/Utils.js';


export class KeyModule extends KeySwitch {

    constructor( f, o = [], level ) {

        super( f )

        this.end = o[0] || (f+1);
        this.value = o[1] || level;
        this.dragtype = 0;

        this.decal = 0;

        this.min = 0;
        this.max = Utils.frameMax-1;

        this.ks.borderLeft = '1px solid #FFF';
        this.ks.borderRight = '1px solid #FFF';

        Utils.dom( 'div', Utils.basic + 'top:1px; left:1px; right:1px; bottom:1px;  background:' + Utils.SlideBG_NN, null, this.key );
        this.flagName = Utils.add('string', { target:this.content, value:this.value, w:80, h:18, simple:true, allway:true, pos:{ left:this.w+'px', top:'0px' } }).onChange( function(v){ this.value = v;  }.bind(this) ); 

    }

    clear(){

        this.flagName.clear()
        super.clear()

    }

    getValue( w ){
        
        return [ this.end, this.value ];

    }

}