export class Link {

    constructor( o = {} ) {

        o.n1.points[1].select = false;
        o.n2.points[0].select = false;

        this.p1 = o.n1.points[1];
        this.p2 = o.n2.points[0];
        this.r = 3;

        this.color = '#FFF';

    }

    draw( ctx, parent ) {

        ctx.beginPath();
        ctx.fillStyle = "#0FF";
        ctx.arc( this.p1.x, this.p1.y, this.r, 0, 2*Math.PI );
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = "#FF0";
        ctx.arc( this.p2.x, this.p2.y, this.r, 0, 2*Math.PI );
        ctx.closePath();
        ctx.fill();

        let dx = this.p1.x;
        let dy = this.p1.y;
        let tx = this.p2.x;
        let ty = this.p2.y;

        let p = parent.findCurve( dx, dy, tx, ty, false );

        ctx.lineWidth = 2;
        let grd = ctx.createLinearGradient( dx, dy, tx, ty );
        grd.addColorStop(0,"#0FF");
        grd.addColorStop(1,"#FF0");
        ctx.strokeStyle = grd;
        ctx.beginPath();

        ctx.moveTo( dx, dy );
        if( p.length === 5 ){
            ctx.lineTo( p[0], dy );
            ctx.quadraticCurveTo(p[1], dy, p[1], p[3]);
            ctx.lineTo( p[1], p[4] );
            ctx.quadraticCurveTo(p[1], ty, p[2], ty);
        } else {
            ctx.lineTo( p[0], dy );
            ctx.quadraticCurveTo(p[1], dy, p[1], p[4]);
            ctx.lineTo( p[1], p[5] );
            ctx.quadraticCurveTo(p[1], p[6], p[0], p[6])
            ctx.lineTo( tx, p[6] );
            ctx.quadraticCurveTo( p[3], p[6], p[3], p[7])
            ctx.lineTo( p[3], p[8] );
            ctx.quadraticCurveTo(p[3], ty, tx, ty);
        }

        ctx.lineTo( tx, ty );
        ctx.stroke();
        
    }

}