
import { Utils } from '../core/Utils.js';

import { Node } from './Node.js';
import { Point } from './Point.js';
import { Link } from './Link.js';

export class Map {

    constructor( o = {} ) {

        this.doc = document;

        this.box = { l:0, r:0, t:0, b:0, w:0, h:0, d:0, m:2 };
        this.num = { ox: 50, oy: 50, dx: 0, dy: 0, tx: 0, ty: 0 };
        this.zoom = 1;
        this.ratio = 1;

        this.nodes = [];
        this.links = [];

        this.drawTimer = null;
        this.tmpLink = false;

        this.dragging = false;
        this.linking = false;
        this.dragview = false;
        this.selection = null;
        this.action = '';

        this.box.t = o.top || 20;
        this.box.b = o.bottom || 20;
        this.box.l = o.left || 20;
        this.box.r = o.right || 20;

        let dom = Utils.dom
        let basic = Utils.basic

        this.content = dom( 'div', basic + 'top:'+this.box.t+'px; left:'+this.box.l+'px; pointer-events:auto; overflow:hidden; margin-left:-'+this.box.m+'px; margin-top:-'+this.box.m+'px; this.box-sizing:this.content-this.box; border:'+this.box.m+'px solid #888;' );
        this.contentStyle = this.content.style;

        this.m_canvas = dom( 'canvas' );
        this.canvas = dom( 'canvas', 'pointer-events:auto;', null, this.content );
        this.canvas.name = 'canvas';

        this.ctx = this.m_canvas.getContext("2d");
        this.ctx_end = this.canvas.getContext("2d");

        this.doc.body.appendChild( this.content );

        this.activeEvents();
        this.resize();

    }

    activeEvents() {

        this.doc.addEventListener('dblclick'  , this, false );
        this.doc.addEventListener('mousedown'  , this, false );
        this.doc.addEventListener('mousemove'  , this, false );
        this.doc.addEventListener('mouseup'    , this, false );
        this.doc.addEventListener('mousewheel' , this, false );
        this.doc.addEventListener('contextmenu', this, false );

        window.addEventListener('resize', this, false );

    }

    handleEvent( e ) {

        //e.preventDefault();

        switch( e.type ) {

            //case 'keydown': maps.keydown( e ); break;
            case 'contextmenu': this.mouseMenu( e ); break;
            case 'mousewheel': this.wheel( e ); break;

            case 'mousedown': this.down( e ); break;
            case 'mousemove': this.move( e ); break;
            case 'mouseup': this.up( e ); break;
            case 'dblclick': this.double( e ); break;
            case 'resize': this.resize( e ); break;

        }

    }

    mouseMenu( e ) {

        e.preventDefault();
        return false;

    }


    double( e ) {

        let mouse = this.getMouse(e);
        let o = { x:mouse.x, y:mouse.y };
        this.add( o );

    }

    up( e ) {

        //e.preventDefault();

        if( (this.action === 'linkStart' || this.action === 'linkEnd') && this.selection !== null ){
            //if(this.selection === null) break;
            let mouse = this.getMouse(e);
            let i = this.nodes.length, sel = '';
            while(i--){
                sel = this.nodes[i].over( mouse.x, mouse.y );
                if( this.action === 'linkEnd' && sel === 'linkStart' ){
                    this.add({ type:'link', n2:this.nodes[i], n1:this.selection });
                    break;
                }
                if( this.action === 'linkStart' && sel === 'linkEnd' ){
                    this.add({ type:'link', n1:this.nodes[i], n2:this.selection });
                    break;
                }
            }

            this.linking = false;
            this.draw();
        }

        this.action = '';
        this.selection = null;

    }
    
    down( e ) {

        this.action = '';

        let mouse = this.getMouse(e);
        let i = this.nodes.length, sel = '';

        while(i--){

            this.action = this.nodes[i].over( mouse.x, mouse.y );
            
            if( this.action === 'linkStart' || this.action === 'linkEnd' ){
                this.selection = this.nodes[i];
                this.num.dx = this.selection.p.x;
                this.num.dy = this.selection.p.y;
                this.num.tx = mouse.x;
                this.num.ty = mouse.y;
                break;
            }else if( this.action === 'node' ){
                this.selection = this.nodes[i];
                this.num.dx = mouse.x - this.selection.x;
                this.num.dy = mouse.y - this.selection.y;
                break;
            }
        }

        if( this.action === '' && e.target.name === 'canvas' ){ 
            this.action = 'moveCanvas'
            this.num.dx = mouse.x;
            this.num.dy = mouse.y;
        }

        this.draw();

    }

    move( e ) {

        if( this.action === '' ) return;

        let mouse = this.getMouse(e);

        switch( this.action ){
            case 'linkStart': case 'linkEnd':
                this.num.tx = mouse.x;
                this.num.ty = mouse.y;
                this.linking = true;
            break;
            case 'node':
                this.selection.move( mouse.x - this.num.dx, mouse.y - this.num.dy );
            break;
            case 'moveCanvas':
                this.num.ox += mouse.x - this.num.dx;
                this.num.oy += mouse.y - this.num.dy;
                this.transform();
            break;

        }

        this.draw();

    }

    getMouse( e ) {

        let x = Math.floor(((e.clientX - this.box.l) - this.num.ox ) * this.ratio );
        let y = Math.floor(((e.clientY - this.box.t) - this.num.oy ) * this.ratio );
        return { x:x, y:y };

    }

    getCorner( e ) {

        let x = Math.floor( e.clientX - this.box.l );
        let y = Math.floor( e.clientY - this.box.t );
        return { x:x, y:y };

    }

    wheel( e ) {

       
        let old = this.zoom;

        let delta = 0;
        if(e.wheelDeltaY) delta = e.wheelDeltaY*0.04;
        else if(e.wheelDelta) delta = e.wheelDelta*0.2;
        else if(e.detail) delta = -e.detail*4.0;
        this.zoom += delta * 0.05;

        this.zoom = this.zoom < 1 ? 1 : this.zoom;
        this.zoom = this.zoom > 4 ? 4 : this.zoom;

        if( old === this.zoom ) return;

        let prev = this.getMouse(e);

        this.ratio = 1 / this.zoom;

        let mouse = this.getCorner(e);

        this.num.ox = mouse.x - (prev.x * this.zoom);
        this.num.oy = mouse.y - (prev.y * this.zoom);

        this.transform();

        this.draw();

    }

    // ----------------------
    //
    //   Add
    //
    // ----------------------


    add( o ) {

        o = o === undefined ? {} : o;
        let type = o.type || 'node';
        let id, n, p1, p2;

        switch(type){

            case 'node':
                o.id = this.nodes.length;
                n = new Node( o );
                p1 = new Point({ start:true });
                p2 = new Point({  });
                n.points.push( p1 );
                n.points.push( p2 );
                this.nodes.push( n );
            break;

            case 'link':
                this.links.push( new Link( o ) );
            break;

        }

        this.draw();

    }



    // ----------------------
    //
    //   Draw
    //
    // ----------------------

    transform( x, y ) {

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.translate( this.num.ox, this.num.oy );
        this.ctx.scale( this.zoom, this.zoom );
        
    }

    draw() {

        this.ctx.save();

        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.clearRect( 0, 0, this.box.w, this.box.h );

        this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
        this.ctx.fillRect( 0, 0, this.box.w, this.box.h );

        this.ctx.restore();
        
        this.origin();
        
        let i = this.links.length;
        while(i--) this.links[i].draw( this.ctx, this );

        this.drawTmpLink();

        i = this.nodes.length;
        while(i--) this.nodes[i].draw( this.ctx );

        this.render();

    }

    render() {

        this.ctx_end.clearRect( 0, 0, this.box.w, this.box.h );
        this.ctx_end.drawImage( this.m_canvas, 0, 0 );

    }

    distance(x1, x2, d) {

        d = d || 0.5;
        let x = x1>x2 ? x2+((x1-x2)*d ): x1+((x2-x1)*d);
        return x;

    }

    findCurve( x1, y1, x2, y2, l ) {
        let p = [];

        let complex = false;

        let dif = Math.abs(x1-x2);

        //if( dif < 25 ) complex = true;

        if( l && x1 < x2 ) complex = true;
        if( !l && x1 > x2 ) complex = true;

        let x = l ? x1-x2 : x2-x1;//x2>x1 ? x2-x1 : x1-x2;
        let y = y2-y1;//y2>y1 ? y2-y1 : y1-y2;

        let ry = y < 0 ? true : false;
        y = y < 0 ? y*-1 : y;
        y *= 0.5;


        x = dif;//x<0 ? x*-1 : x;
        x *= 0.5;
        x = x < 10 ? 10 : x;
        //x = x < 25 ? 25 : x;

        x = y < x ? y : x;

        //x = x>40 ? 40 : x;
        let r1 = x * 0.5;
        

        let midx = l ? x1 - x : x1 + x;
        let xx = l ? midx - x2 : x2 - midx;
        let rx = xx < 0 ? ( l ? false : true) : (l ? true : false);
        xx = xx<0 ? xx*-1 : xx;
        xx *= 0.5;
        xx = xx < 10 ? 10 : xx;
        xx = y<xx ? y : xx;
        let r2 = xx;



        message.textContent = complex + ' ' + dif;

        if(!complex){

            p[0] = l ? midx + r1 : midx - r1;
            p[1] = midx;
            p[2] = rx ? midx - r2 : midx + r2;
            // y
            p[3] = ry ? y1 - r1 : y1 + r1;
            p[4] = ry ? y2 + r2 : y2 - r2;

        } else {

            p[0] = l ? midx + r1 : midx - r1;
            p[1] = midx;
            p[2] = rx ? midx - r2 : midx + r2;
            p[3] = rx ? x2 - r1 : x2 + r1;
            // y
            p[4] = ry ? y1 - r1 : y1 + r1;
            p[5] = ry ? (y1 - y)+r1 : (y1 + y)-r1//ry ? y2 + r2 : y2 - r2;
            p[6] = ry ? y2 + y : y2 - y
            p[7] = ry ? (y2 + y)-r1 : (y2 - y)+r1
            p[8] = ry ? y2 + r1 : y2 - r1; 

        }
        



        return p;
    }

    drawTmpLink() {

        if(!this.linking) return;

        let left = false;
        if( this.action === 'linkStart') left = true;

        let c = left ? ["#FF0", "#0AA"] : ["#0FF", "#AA0"];

        this.ctx.lineWidth = 2;
        let grd = this.ctx.createLinearGradient( this.num.dx, this.num.dy, this.num.tx, this.num.ty );
        grd.addColorStop(0,c[0]);
        grd.addColorStop(1,c[1]);

        let p = this.findCurve( this.num.dx, this.num.dy, this.num.tx, this.num.ty, left );


        this.ctx.strokeStyle = grd;
        this.ctx.beginPath();

        this.ctx.moveTo( this.num.dx, this.num.dy );
        if(p.length === 5){
            this.ctx.lineTo( p[0], this.num.dy );
            this.ctx.quadraticCurveTo(p[1], this.num.dy, p[1], p[3]);
            this.ctx.lineTo( p[1], p[4] );
            this.ctx.quadraticCurveTo( p[1], this.num.ty, p[2], this.num.ty );
        } else {
            this.ctx.lineTo( p[0], this.num.dy );
            this.ctx.quadraticCurveTo(p[1], this.num.dy, p[1], p[4]);
            this.ctx.lineTo( p[1], p[5] );
            this.ctx.quadraticCurveTo(p[1], p[6], p[0], p[6])
            this.ctx.lineTo( this.num.tx, p[6] );
            this.ctx.quadraticCurveTo( p[3], p[6], p[3], p[7])
            this.ctx.lineTo( p[3], p[8] );
            this.ctx.quadraticCurveTo(p[3], this.num.ty, this.num.tx, this.num.ty );
        }
        this.ctx.lineTo( this.num.tx, this.num.ty );
        this.ctx.stroke();

    }

    origin() {

        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#666';
        this.ctx.beginPath();
        this.ctx.moveTo(-10, 0);
        this.ctx.lineTo(10, 0);
        this.ctx.stroke();
        this.ctx.moveTo(0, -10);
        this.ctx.lineTo(0, 10);
        this.ctx.stroke();

    }

    resize( e ) {

        this.box.h = window.innerHeight - this.box.b - this.box.t;
        this.box.w = window.innerWidth - this.box.l - this.box.r;

        this.contentStyle.width = this.box.w + 'px';
        this.contentStyle.height = this.box.h + 'px';

        this.canvas.width = this.box.w;
        this.canvas.height = this.box.h;

        this.m_canvas.width = this.box.w;
        this.m_canvas.height = this.box.h;

        this.transform();
        this.draw();

        //clearTimeout( this.drawTimer );
        //this.drawTimer = setTimeout( this.draw.bind(this), 0 );

    }
}