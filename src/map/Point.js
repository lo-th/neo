export class Point {

    constructor( o = {} ) {

        this.x = o.x || 0;
        this.y = o.y || 0;
        this.r = 6;
        this.color = '#0AA';
        this.colorSel = '#0FF';
        this.select = false;
        this.start = o.start || false;
        this.id = o.id || 0;

        if( this.start ){

            this.color = '#AA0';
            this.colorSel = '#FF0';

        }

    }

    draw( ctx ) {

        ctx.beginPath();
        ctx.fillStyle = this.select ? this.colorSel : this.color;
        ctx.arc(this.x,this.y, this.r, 0, 2*Math.PI );
        ctx.closePath();
        ctx.fill();
        
    }

    over( x, y ) {

        this.select = (this.x-this.r <= x) && (this.x + this.r >= x) && (this.y-this.r <= y) && (this.y + this.r >= y);
        return this.select;

    }

    move( x, y ) {

        this.x = x;
        this.y = y;

    }

}