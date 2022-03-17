import { Track } from '../core/Track.js';
import { Utils } from '../core/Utils.js';
import { _Math } from '../core/Math.js';

export class Color extends Track {

    constructor( o = {}, parent ) {

        super( o, parent )

        this.type = 'color'
    
        this.degradId = 'deg' + (parent.DID++);
        this.degrad = [];
        this.linear = [];
        this.degNumber = 5;

        this.needTimer = true
        this.needPrev = true
        this.needNext = true
        this.needTop = true

        //this.h = 60;

        this.createDegrad()

        this.init()

    }

    update( f ) {

        //super.update( f )

        let value = this.getColor(f)

        if( this.select || this.parent.fullActve ){
            this.preview.setValue( value )
        }

        return value

    }

    getColor( f ){

        let v = this.frame[ f ], p, n;

        if( v !== undefined ){
            p = v;
            n = v < this.lng-1 ? v+1 : undefined;
        } else {
            let t = this.resetLevel( f, this.frame, this.lng );
            p = t[0]
            n = t[1]
        }

        let value = v === undefined ? undefined : this.items[v].value;
        let prev = p !== undefined ? this.items[p] : undefined;
        let next = n !== undefined ? this.items[n] : undefined;

        if( value === undefined ){
            if( prev === undefined && next !== undefined) value = next.value;
            else if( next === undefined && prev !== undefined) value = prev.value;
            else if( next !== undefined && prev !== undefined) value = _Math.lerpColor( prev.value, next.value, (f-prev.frame)/(next.frame-prev.frame) );
        }

        return _Math.numToHex( value );

    }

    createDegrad() {

        let i, degrad, linear;

        i = this.degNumber;
        while(i--){
            degrad = Utils.dom( 'defs', Utils.basic + 'position:absolute; top:0px; left:100px; width:100px; height:100%;', {} );
            linear = Utils.dom( 'linearGradient', '', {id:(this.degradId+i), x1:'0%', y1:'0%', x2:'100%', y2:'0%' }, degrad, 0 );
            Utils.dom( 'rect', '', {width:'100%', height:'100%', stroke:'none', x:0, fill:'url(#'+(this.degradId+i)+')'}, degrad );
            this.c[5].appendChild(degrad);
            this.degrad[i] = degrad;
            this.linear[i] = linear;
        }

        this.overBox = Utils.dom( 'div', Utils.basic + 'position:absolute; top:0; left:0; width:100%; height:100%;' );
        this.c[5].appendChild(this.overBox);

    }


    draw() {

        let max = this.parent.frameMax
        let fbygrad = max / this.degNumber
        let pp = 100 / this.degNumber

        // clear old
        let i = this.linear.length, node
        while(i--) {
            node = this.linear[i].childNodes[0]
            while (node.firstChild) {  node.removeChild(node.firstChild); }
        }
        
        // start color
        i = this.linear.length;
        while(i--){
            Utils.dom( 'stop', '', { offset:0, 'stop-color':Utils.hexToHtml(this.getColor(fbygrad*i)), 'stop-opacity':1 }, this.linear[i], 0 )
        }

        // mid color
        let lng = this.items.length, percent, gid;
        for(i=0; i<lng; i++){
            percent = ((this.items[i].frame*100)/max).toFixed(4);
            gid = Math.floor( percent/pp );
            Utils.dom( 'stop', '', { offset:((percent/pp)-gid), 'stop-color':Utils.hexToHtml(this.items[i].value), 'stop-opacity':1 }, this.linear[gid], 0 )
        }

        // end color
        i = this.linear.length;
        while(i--){
            Utils.dom( 'stop', '', { offset:1, 'stop-color':Utils.hexToHtml( this.getColor( (fbygrad*(i+1))-1) ), 'stop-opacity':1 }, this.linear[i], 0 )
        }

    }

    over(e) {

        this.overBox.style.boxShadow = 'inset 0 0 3px rgba(0,0,0,0.5)'
        super.over(e)

    }

    out(e) {

        this.overBox.style.boxShadow = 'none'
        super.out(e)

    }

    moveDegrad( id, f ) {

        this.keys[id] = f
        this.draw()

    }

    setSize() {

        let i = this.items.length, item

        while(i--){
            item = this.items[i]
            item.reSize(this.w)
        }

        let size = Math.floor((this.parent.frameMax/this.degNumber)*this.parent.frameSize)

        i = this.degrad.length
        while(i--){
            this.degrad[i].style.width = size+'px'
            this.degrad[i].style.left = (size*i)+'px'
        }
    }

}