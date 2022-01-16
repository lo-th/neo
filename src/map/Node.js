export class Node {

    constructor( o = {} ) {

        this.id = o.id || 0;
        this.name = o.name || 'node-'+ this.id;

        this.points = [];

        this.w = o.w || 80;
        this.h = o.h || 20;

        this.x = 10;
        this.y = 10;

        this.p = null;

        if( o.x ) this.x = o.x - (this.w * 0.5);
        if( o.y ) this.y = o.y - (this.h * 0.5);
        
        this.color = '#666';
        this.border = '#888';
        this.borderSel = '#AAA';
        this.select = false;

    }

    draw( ctx ) {

        ctx.lineWidth = 1;
        ctx.strokeStyle = this.select ? this.borderSel : this.border;
        ctx.fillStyle = this.color;

        ctx.fillRect( this.x, this.y, this.w, this.h );
        ctx.strokeRect( this.x, this.y, this.w, this.h );

        let i = this.points.length;
        while( i-- ){
            if(i === 0) this.points[i].move( this.x, this.y + this.h*0.5 );
            if(i === 1) this.points[i].move( this.x + this.w, this.y + this.h*0.5 );
            this.points[i].draw( ctx );
        }

        //ctx.font = "11px Lucida Console";
        ctx.font = 'normal ' + 9 + 'px Helvetica,Arial,sans-serif';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = "#FFF";
        ctx.textAlign = "center";
        ctx.fillText( this.name, this.x + this.w*0.5, this.y + this.h * 0.5 );

    }

    over( x, y ) {

        let i = this.points.length;
        this.p = null;

        while( i-- ){
            if( this.points[i].over( x, y ) ) this.p = this.points[i];
        }

        if( this.p !== null ){ 
            this.select = true;
            return 'link' + (this.p.start ? 'Start' : 'End');
        } else {
            this.select = (this.x <= x) && (this.x + this.w >= x) && (this.y <= y) && (this.y + this.h >= y);
            if( this.select ) return 'node';// (this.x <= x) && (this.x + this.w >= x) && (this.y <= y) && (this.y + this.h >= y);
        }

        return '';

    }

    move( x, y ) {
        this.x = x;
        this.y = y;
    }

}
