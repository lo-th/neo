
import { Utils } from './Utils.js';
import { _Math } from '../core/Math.js';


export class Pannel {

    constructor( parent ) {

        this.parent = parent;

        this.content = Utils.dom( 'div', Utils.basic + 'top:0; left:0; width:400px; height:20px; display:none; pointer-events:auto; overflow:visible; ');
        this.content.name = 'pannel'

        this.parent.content.appendChild( this.content );

        this.key = null;
        this.type = '';

        this.init();

    }

    init() {

        let h = 19

        let p = {

            //title:UIL.add('string', { target:this.content, value:'yoo', size:80, h:h, simple:true, pos:{ left:'-80px', top:'0px' } }),//.onChange( this.endEditName.bind(this) );

            // color
            color : Utils.add( 'color', { target:this.content, callback:null, name:' ', color:'n', w:100, pos:{left:'10px', top:'0px' }, simple:true, side:'down', ctype:'hex', h:h }),
            // curve
            curve1 : Utils.add( 'list', { target:this.content, list:[ 'linear','quad', 'cubic', 'quart', 'quint', 'sine', 'expo', 'circ', 'elastic', 'back', 'bounce' ], w:80, pos:{left:'10px', top:'0px'}, simple:true, side:'down', full:true, h:h, align:'left' }),
            curve2 : Utils.add( 'list',{ target:this.content, list:[ '-in', '-out', '-in-out' ], w:80, pos:{left:'92px', top:'0px'}, simple:true, side:'down', full:true, h:h, align:'left' }),
            // lfo
            lfo1 : Utils.add( 'list',{ target:this.content, list:[ 'sine', 'noise' ], w:80, pos:{left:'10px', top:'0px'}, simple:true, side:'down', full:true, h:h, align:'left' }),
            lfo2 : Utils.add( 'number',{ target:this.content, name:'frequency', min:0, max:1, value:0, precision:2, pos:{left:'92px', top:'0px'}, w:124, p:60, h:h }),
            lfo3 : Utils.add( 'number',{ target:this.content, name:'amplitude', min:0, max:1, value:0, precision:2, pos:{left:'210px', top:'0px'}, w:124, p:60,  h:h }),
            lfo4 : Utils.add( 'number',{ target:this.content, name:'seed', min:0, max:999, value:0, precision:0, pos:{left:'336px', top:'0px'}, w:100, p:50,  h:h }),
            lfo5 : Utils.add( 'number',{ target:this.content, name:'phase', min:0, max:360, value:0, precision:0, pos:{left:'336px', top:'0px'}, w:100, p:50,  h:h }),

        };
        
        //this.pannels['lfo2'] = UIL.add( 'slide',{ target:this.content, name:'freq', min:0, max:1, value:0, precision:2, pos:{left:'92px', top:'0px'}, simple:false, size:180, p:24,  sc:30, height:18 });
        //this.pannels['lfo3'] = UIL.add( 'slide',{ target:this.content, name:'ampl', min:0, max:1, value:0, precision:2, pos:{left:'274px', top:'0px'}, simple:false, size:140, p:30,  sc:30, height:18 });
        //sound
        



        this.pannels = p;
        this.hideAll();
        
    }

    resize( left, width ) {

        this.content.style.left = left + 120 +'px';
        this.content.style.width = width - 120 +'px';

    }

    move() {

        if( this.key === null ) return;

        let y =  this.key.parent.top - this.parent.box.t;
        let v = this.parent.isInView( y );

        this.display(v);
        if(v) this.content.style.top = y +'px';

    }

    /*setTitle( target, callback ){

        let y = target.top - this.parent.box.t;
        let v = this.parent.isInView( y );

        this.hideAll();

        this.display(v);
        if(v) this.content.style.top = y +'px';

        //console.log(target.name, y)

        let p = this.pannels
        let p1 =  p['title']
        p1.setValue( target.name );
        p1.display( true )
        p1.onChange ( callback );

    }

    hideTitle(){

        p1.onChange (  function(){} );
        p1.display( false )

    }*/

    setKey( key ) {

        this.key = key;
        this.type = key.parent.type;

        this.move();

        this.hideAll();

        let p = this.pannels;

        // retcheck zone for all UIL elements
        p.color.needZone();

        let p1, p2, p3, p4, p5;

        switch( this.type ){
            case 'color':
                p1 = p['color'];
                p1.display(true);
                p1.onChange ( function(v){ this.key.setColor(v); }.bind(this) );
                p1.setValue( _Math.hexToHtml( this.key.value ) );
                p1.close();
            break;
            case 'curve':
                this.key.getType();
                p1 = p['curve1'];
                p2 = p['curve2'];
                p1.display(true);
                p1.text( this.key.name );
                p1.onChange ( function(v){ this.key.setType(v); this.testEase( v, this.key.ext ); }.bind(this) );
                p2.onChange ( function(v){ this.key.setExt(v); }.bind(this) );
                this.testEase( this.key.name, this.key.ext );
            break;
            case 'lfo':
                p1 = p['lfo1'];
                p2 = p['lfo2'];
                p3 = p['lfo3'];
                p4 = p['lfo4'];
                p5 = p['lfo5'];
                p1.display(true);
                p2.display(true);
                p3.display(true);
                p1.text( this.key.curve );
                p2.setValue( this.key.frequency ); 
                p3.setValue( this.key.amplitude );
                p4.setValue( this.key.seed );
                p5.setValue( this.key.phase );
                p1.onChange ( function(v){ this.key.setValue(v,'curve'); this.testLfo( v ); }.bind(this) );
                p2.onChange ( function(v){ this.key.setValue(v,'frequency'); }.bind(this) );
                p3.onChange ( function(v){ this.key.setValue(v,'amplitude'); }.bind(this) );
                p4.onChange ( function(v){ this.key.setValue(v,'seed'); }.bind(this) );
                p5.onChange ( function(v){ this.key.setValue(v,'phase'); }.bind(this) );
                this.testLfo( this.key.curve );
            break;
            case 'sound':
                
            break;
            case 'video':
                
            break;
        }

    }

    testLfo( name ) {

        let p = this.pannels;

        if( name === 'noise' ) {
            p['lfo4'].display(true);
            p['lfo5'].display();
        } else { 
            p['lfo4'].display();
            p['lfo5'].display(true);
        }

    }

    testEase( name, pref ){

        const p = this.pannels;

        if( name === 'linear' ) p['curve2'].display();
        else{ 
            p['curve2'].display(true);
            p['curve2'].text(pref);
        }

    }

    hideAll(){

        for(let p in this.pannels){
            this.pannels[p].display();
        }

    }

    display( v ){

        if( this.key === null ) v = false;
        this.content.style.display = v ? 'block' : 'none';

    }

    clear(){

        //this.visible = false;
        this.key = null;
        this.type = '';
       // this.content.style.display = 'none';

    }


}