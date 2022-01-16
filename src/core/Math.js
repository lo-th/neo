export const _Math = {

    PI: 3.141592653589793,
    PI90: 1.570796326794896,
    PI270: 4.712388980384689,
    TwoPI: 6.283185307179586,

    degtorad: 0.0174532925199432957,
    radtodeg: 57.295779513082320876,

    sqrt: Math.sqrt,
    abs: Math.abs,
    max: Math.max,
    pow: Math.pow,
    floor: Math.floor,
    round: Math.round,
    asin: Math.asin,
    sin: Math.sin,
    cos: Math.cos,

    lerp: function ( x, y, t ) { 

        return ( 1 - t ) * x + t * y; 

    },

    randInt: function ( low, high ) { 

        return low + _Math.floor( _Math.random() * ( high - low + 1 ) ); 

    },

    rand: function ( low, high ) { 

        return low + _Math.random() * ( high - low ); 

    },

    int: function( x ) { 

        return _Math.floor(x); 

    },

    fix: function( x, n ) { 

        return x.toFixed(n || 0) * 1;

    },

    // RANDOM HACK

    seed: function(s) {
        return function() {
            s = _Math.sin(s) * 10000; return s - _Math.floor(s);
        };
    },

    // usage:
    /*
    var random1 = NEO.seed(42);
    var random2 = NEO.seed(NEO.random1());
    var random = NEO.seed(NEO.random2());
    */

    ARRAY32: (typeof Float32Array !== 'undefined') ? Float32Array : Array,
    ARRAY8: (typeof Uint8Array !== 'undefined') ? Uint8Array : Array,

    Tween: function( a, b, type, t, p, n ){

        var time = ( t - p )/( n - p );
        time = time > 1 ? 1 : time;
        var r = _Math.Ease[ type ]( time );
        return a > b ? a - (( a - b ) * r ) : a + (( b - a ) * r );

    },

    Ease: {
        
        getNum:function(name){
            var n = name.substring(0,4);
            var r;
            switch(n){
                case 'quad': r = 7; break;
                case 'cubi': r = 7; break;
                case 'quar': r = 7; break;
                case 'quin': r = 7; break;
                case 'sine': r = 7; break;
                case 'expo': r = 11; break;
                case 'circ': r = 21; break;
                case 'back': r = 11; break;
                case 'elas': r = 11; break;
                case 'boun': r = 21; break;
            }
            return r;
        },

        // LINEAR
        'linear' : function (k) {
            return k;
        },

        // QUAD
        'quad-in' : function (k) { return k * k; },
        'quad-out' : function (k) { return k * ( 2 - k ); },
        'quad-in-out' : function (k) {
            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
            return - 0.5 * ( --k * ( k - 2 ) - 1 );
        },
        // CUBIC
        'cubic-in' : function (k) { return k * k * k; },
        'cubic-out' : function (k) { return --k * k * k + 1; },
        'cubic-in-out' : function (k) {
            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k + 2 );
        },

        // QUART
        'quart-in' : function (k) { return k * k * k * k; },
        'quart-out' : function (k) { return 1 - ( --k * k * k * k ); },
        'quart-in-out' : function (k) {
            if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
            return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
        },

        // QUINT
        'quint-in' : function (k) { return k * k * k * k * k; },
        'quint-out' : function (k) { return --k * k * k * k * k + 1; },
        'quint-in-out' : function (k) {
            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
        },

        // SINE
        'sine-in' : function (k) { return 1 - _Math.cos( k * _Math.PI90 ); },
        'sine-out' : function (k) { return _Math.sin( k * _Math.PI90 ); },
        'sine-in-out' : function (k) { return 0.5 * ( 1 - _Math.cos( _Math.PI * k ) ); },

        // EXPO
        'expo-in' : function (k) { return k === 0 ? 0 : _Math.pow( 1024, k - 1 ); },
        'expo-out' : function (k) { return k === 1 ? 1 : 1 - _Math.pow( 2, - 10 * k ); },
        'expo-in-out' : function (k) {
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( ( k *= 2 ) < 1 ) return 0.5 * _Math.pow( 1024, k - 1 );
            return 0.5 * ( - _Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
        },

        // CIRC
        'circ-in' : function (k) { return 1 - _Math.sqrt( 1 - k * k ); },
        'circ-out' : function (k) { return _Math.sqrt( 1 - ( --k * k ) ); },
        'circ-in-out' : function (k) {
            if ( ( k *= 2 ) < 1) return - 0.5 * ( _Math.sqrt( 1 - k * k) - 1);
            return 0.5 * ( _Math.sqrt( 1 - ( k -= 2) * k) + 1);
        },

        // ELASTIC
        'elastic-in': function (k) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p * 0.25; }
            else s = p * _Math.asin( 1 / a ) / _Math.TwoPI;
            return - ( a * _Math.pow( 2, 10 * ( k -= 1 ) ) * _Math.sin( ( k - s ) * _Math.TwoPI / p ) );
        },
        'elastic-out': function (k) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p * 0.25; }
            else s = p * _Math.asin( 1 / a ) / _Math.TwoPI;
            return ( a * _Math.pow( 2, - 10 * k) * _Math.sin( ( k - s ) * _Math.TwoPI / p ) + 1 );
        },
        'elastic-in-out': function (k) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p * 0.25; }
            else s = p * _Math.asin( 1 / a ) / _Math.TwoPI;
            if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * _Math.pow( 2, 10 * ( k -= 1 ) ) * _Math.sin( ( k - s ) * _Math.TwoPI / p ) );
            return a * _Math.pow( 2, -10 * ( k -= 1 ) ) * _Math.sin( ( k - s ) * _Math.TwoPI / p ) * 0.5 + 1;
        },

        // BACK
        'back-in': function (k) {
            var s = 1.70158;
            return k * k * ( ( s + 1 ) * k - s );
        },
        'back-out': function (k) {
            var s = 1.70158;
            return --k * k * ( ( s + 1 ) * k + s ) + 1
        },
        'back-in-out': function (k) {
            var s = 1.70158 * 1.525;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
        },

        // BOUNCE
        'bounce-in': function (k) {
            return 1 - this['bounce-out']( 1 - k );
        },
        'bounce-out': function (k) {
            if ( k < ( 1 / 2.75 ) ) return 7.5625 * k * k;
            else if ( k < ( 2 / 2.75 ) ) return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
            else if ( k < ( 2.5 / 2.75 ) ) return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
            else return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
        },
        'bounce-in-out': function (k) {
            if ( k < 0.5 ) return this['bounce-in']( k * 2 ) * 0.5;
            return this['bounce-out']( k * 2 - 1 ) * 0.5 + 0.5;
        }

    },

    // COLOR

    hexToHtml: function(v){ 

        v = v === undefined ? 0x000000 : v;
        return "#" + ("000000" + v.toString(16)).substr(-6);
        
    },

    numToHex: function(v){

        if(!v) v = 0x000000;
        return "0x" + ("000000" + v.toString(16)).substr(-6);

    },

    hexFormat: function(v){ 

        return v.toUpperCase().replace("#", "0x"); 

    },

    lerpColor: function(a,b,lerp){
        var A = [( a >> 16 & 255 ) / 255, ( a >> 8 & 255 ) / 255, ( a & 255 ) / 255];
        var B = [( b >> 16 & 255 ) / 255, ( b >> 8 & 255 ) / 255, ( b & 255 ) / 255];
        A[0] += ( B[0] - A[0] ) * lerp;
        A[1] += ( B[1] - A[1] ) * lerp;
        A[2] += ( B[2] - A[2] ) * lerp;
        return ( A[0] * 255 ) << 16 ^ ( A[1] * 255 ) << 8 ^ ( A[2] * 255 ) << 0;
    },

    invertColor: function ( color ) { 

        return 0xFFFFFF ^ color; 

    },

    // SINE

    Sine: function ( x, phase, frequency, amplitude ) {

        return (_Math.sin( ( (frequency) * x ) + (phase * _Math.degtorad) ) * amplitude);

    },

    // Besier aproximation
    // https://www.particleincell.com/2012/bezier-splines/

    computeControlPoints: function( k, p ){

        //var p = 2;
        var p1=[], p2=[], a=[], b=[], c=[], r=[], i, m;
        var n = k.length-1;
        
        // left most segment
        a[ 0 ] = 0;
        b[ 0 ] = 2;
        c[ 0 ] = 1;
        r[ 0 ] = k[ 0 ] + 2 * k[ 1 ];
        
        // internal segments
        for (i = 1; i < n - 1; i++){
            a[ i ] = 1;
            b[ i ] = 4;
            c[ i ] = 1;
            r[ i ] = 4 * k[ i ] + 2 * k[ i + 1 ];
        }
                
        // right segment
        a[ n - 1 ] = 2;
        b[ n - 1 ] = 7;
        c[ n - 1 ] = 0;
        r[ n - 1 ] = 8 * k[ n - 1 ] + k[ n ];
        
        // solves Ax=b with the Thomas algorithm
        for ( i = 1; i < n; i++ ){

            m = a[ i ] / b[ i - 1 ];
            b[ i ] -= m * c[ i - 1 ];
            r[ i ] -= m * r[ i - 1 ];

        }
     
        p1[ n - 1 ] = _Math.fix( r[ n - 1 ] / b[ n - 1 ], p );

        for ( i = n - 2; i >= 0; i-- ){ 
            p1[ i ] = _Math.fix( ( r[ i ] - c[ i ] * p1[ i + 1 ] ) / b[ i ], p );
        }
            
        // we have p1, now compute p2
        for ( i = 0; i < n-1; i++ ){ 
            p2[ i ] = _Math.fix( 2 * k[ i + 1 ] - p1[ i + 1 ], p );
        }
        
        p2[ n - 1 ] = _Math.fix( 0.5 * ( k[ n ] + p1[ n - 1 ] ), p );
        
        return [ p1, p2 ];

    }

}


export class Perlin {

    constructor( seed ) {

        this.grad3 = new _Math.ARRAY32([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1])

        // NOISE 2D
        this.F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        this.G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        let random = Math.random;
        if (seed){
            let random1 = _Math.seed(seed);
            let random2 = _Math.seed(random1());
            random = _Math.seed(random2());
        }
        this.p = new _Math.ARRAY8(256);
        this.perm = new _Math.ARRAY8(512);
        this.permMod12 = new _Math.ARRAY8(512);
        let i
        for (i = 0; i < 256; i++) {
            this.p[i] = random() * 256;
        }
        for (i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
            this.permMod12[i] = this.perm[i] % 12;
        }
    }

    noise (xin, yin) {
        let permMod12 = this.permMod12, perm = this.perm, grad3 = this.grad3;
        let n0=0, n1=0, n2=0;
        let s = (xin + yin) * this.F2;
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        let t = (i + j) * this.G2;
        let X0 = i - t;
        let Y0 = j - t;
        let x0 = xin - X0;
        let y0 = yin - Y0;
        let i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }
        let x1 = x0 - i1 + this.G2;
        let y1 = y0 - j1 + this.G2;
        let x2 = x0 - 1.0 + 2.0 * this.G2;
        let y2 = y0 - 1.0 + 2.0 * this.G2;
        let ii = i & 255;
        let jj = j & 255;
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            let gi0 = permMod12[ii + perm[jj]] * 3;
            t0 *= t0;
            n0 = t0 * t0 * (grad3[gi0] * x0 + grad3[gi0 + 1] * y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            let gi1 = permMod12[ii + i1 + perm[jj + j1]] * 3;
            t1 *= t1;
            n1 = t1 * t1 * (grad3[gi1] * x1 + grad3[gi1 + 1] * y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            let gi2 = permMod12[ii + 1 + perm[jj + 1]] * 3;
            t2 *= t2;
            n2 = t2 * t2 * (grad3[gi2] * x2 + grad3[gi2 + 1] * y2);
        }
        // The result is scaled to return values in the interval [-1,1].
        return 70.0 * (n0 + n1 + n2);
    }
}