import { Utils } from '../core/Utils.js';
import { Key } from '../core/Key.js';

export class KeyFlag extends Key {

    constructor( f, name ) {

        super( f )

        this.value = name || '';
        this.flagName = Utils.add('string', { target:this.content, value:this.value, w:80, h:18, simple:true, allway:true, pos:{ left:this.w+'px', top:'0px' } }).onChange( function(v){ this.value = v; this.parent.showUpdate(); }.bind(this) );

    }

    clear() {

        this.flagName.clear();
        super.clear()

    }

    reSize( w ) {

        super.reSize( w )
        this.flagName.c[0].style.left = this.sx + 'px';

    }

    setPy( y ) {

        this.flagName.c[0].style.top = (y*18)+'px';

    }

}