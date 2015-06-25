var performance, define, exports, module;
/**
 * Tween.js - Licensed under the MIT license
 * https://github.com/sole/tween.js
 * ----------------------------------------------
 *
 * See https://github.com/sole/tween.js/graphs/contributors for the full list of contributors.
 * Thank you all, you're awesome!
 */

// performance.now polyfill
( function ( root ) {

	if ( 'performance' in root === false ) {
		root.performance = {};
	}

	// IE 8
	Date.now = ( Date.now || function () {
		return new Date().getTime();
	} );

	if ( 'now' in root.performance === false ) {
		var offset = root.performance.timing && root.performance.timing.navigationStart ? performance.timing.navigationStart
		                                                                                : Date.now();

		root.performance.now = function () {
			return Date.now() - offset;
		};
	}

} )( this );

var TWEEN = TWEEN || ( function () {

	var _tweens = [];

	return {

		REVISION: '14',

		getAll: function () {

			return _tweens;

		},

		removeAll: function () {

			_tweens = [];

		},

		add: function ( tween ) {

			_tweens.push( tween );

		},

		remove: function ( tween ) {

			var i = _tweens.indexOf( tween );

			if ( i !== -1 ) {

				_tweens.splice( i, 1 );

			}

		},

		update: function ( time ) {

			if ( _tweens.length === 0 ) return false;

			var i = 0;

			time = time !== undefined ? time : window.performance.now();

			while ( i < _tweens.length ) {

				if ( _tweens[ i ].update( time ) ) {

					i++;

				} else {

					_tweens.splice( i, 1 );

				}

			}

			return true;

		}
	};

} )();

TWEEN.Tween = function ( object ) {

	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;
	var _onStopCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {

		_valuesStart[ field ] = parseFloat(object[field], 10);

	}

	this.to = function ( properties, duration ) {

		if ( duration !== undefined ) {

			_duration = duration;

		}

		_valuesEnd = properties;

		return this;

	};

	this.start = function ( time ) {

		TWEEN.add( this );

		_isPlaying = true;

		_onStartCallbackFired = false;

		_startTime = time !== undefined ? time : window.performance.now();
		_startTime += _delayTime;

		for ( var property in _valuesEnd ) {

			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {

				if ( _valuesEnd[ property ].length === 0 ) {

					continue;

				}

				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );

			}

			_valuesStart[ property ] = _object[ property ];

			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}

			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;

		}

		return this;

	};

	this.stop = function () {

		if ( !_isPlaying ) {
			return this;
		}

		TWEEN.remove( this );
		_isPlaying = false;

		if ( _onStopCallback !== null ) {

			_onStopCallback.call( _object );

		}

		this.stopChainedTweens();
		return this;

	};

	this.stopChainedTweens = function () {

		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

			_chainedTweens[ i ].stop();

		}

	};

	this.delay = function ( amount ) {

		_delayTime = amount;
		return this;

	};

	this.repeat = function ( times ) {

		_repeat = times;
		return this;

	};

	this.yoyo = function( yoyo ) {

		_yoyo = yoyo;
		return this;

	};


	this.easing = function ( easing ) {

		_easingFunction = easing;
		return this;

	};

	this.interpolation = function ( interpolation ) {

		_interpolationFunction = interpolation;
		return this;

	};

	this.chain = function () {

		_chainedTweens = arguments;
		return this;

	};

	this.onStart = function ( callback ) {

		_onStartCallback = callback;
		return this;

	};

	this.onUpdate = function ( callback ) {

		_onUpdateCallback = callback;
		return this;

	};

	this.onComplete = function ( callback ) {

		_onCompleteCallback = callback;
		return this;

	};

	this.onStop = function ( callback ) {

		_onStopCallback = callback;
		return this;

	};

	this.update = function ( time ) {

		var property;

		if ( time < _startTime ) {

			return true;

		}

		if ( _onStartCallbackFired === false ) {

			if ( _onStartCallback !== null ) {

				_onStartCallback.call( _object );

			}

			_onStartCallbackFired = true;

		}

		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		var value = _easingFunction( elapsed );

		for ( property in _valuesEnd ) {

			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];

			if ( end instanceof Array ) {

				_object[ property ] = _interpolationFunction( end, value );

			} else {

				// Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}

				// protect against non numeric properties.
				if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}

			}

		}

		if ( _onUpdateCallback !== null ) {

			_onUpdateCallback.call( _object, value );

		}

		if ( elapsed == 1 ) {

			if ( _repeat > 0 ) {

				if( isFinite( _repeat ) ) {
					_repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {

					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}

					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
					}

					_valuesStart[ property ] = _valuesStartRepeat[ property ];

				}

				if (_yoyo) {
					_reversed = !_reversed;
				}

				_startTime = time + _delayTime;

				return true;

			} else {

				if ( _onCompleteCallback !== null ) {

					_onCompleteCallback.call( _object );

				}

				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {

					_chainedTweens[ i ].start( time );

				}

				return false;

			}

		}

		return true;

	};

};


TWEEN.Easing = {

	Linear: {

		None: function ( k ) {

			return k;

		}

	},

	Quadratic: {

		In: function ( k ) {

			return k * k;

		},

		Out: function ( k ) {

			return k * ( 2 - k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );

		}

	},

	Cubic: {

		In: function ( k ) {

			return k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );

		}

	},

	Quartic: {

		In: function ( k ) {

			return k * k * k * k;

		},

		Out: function ( k ) {

			return 1 - ( --k * k * k * k );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );

		}

	},

	Quintic: {

		In: function ( k ) {

			return k * k * k * k * k;

		},

		Out: function ( k ) {

			return --k * k * k * k * k + 1;

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );

		}

	},

	Sinusoidal: {

		In: function ( k ) {

			return 1 - Math.cos( k * Math.PI / 2 );

		},

		Out: function ( k ) {

			return Math.sin( k * Math.PI / 2 );

		},

		InOut: function ( k ) {

			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );

		}

	},

	Exponential: {

		In: function ( k ) {

			return k === 0 ? 0 : Math.pow( 1024, k - 1 );

		},

		Out: function ( k ) {

			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );

		},

		InOut: function ( k ) {

			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );

		}

	},

	Circular: {

		In: function ( k ) {

			return 1 - Math.sqrt( 1 - k * k );

		},

		Out: function ( k ) {

			return Math.sqrt( 1 - ( --k * k ) );

		},

		InOut: function ( k ) {

			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);

		}

	},

	Elastic: {

		In: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );

		},

		Out: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );

		},

		InOut: function ( k ) {

			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;

		}

	},

	Back: {

		In: function ( k ) {

			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );

		},

		Out: function ( k ) {

			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;

		},

		InOut: function ( k ) {

			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );

		}

	},

	Bounce: {

		In: function ( k ) {

			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );

		},

		Out: function ( k ) {

			if ( k < ( 1 / 2.75 ) ) {

				return 7.5625 * k * k;

			} else if ( k < ( 2 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;

			} else if ( k < ( 2.5 / 2.75 ) ) {

				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;

			} else {

				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;

			}

		},

		InOut: function ( k ) {

			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;

		}

	}

};

TWEEN.Interpolation = {

	Linear: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;

		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );

		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );

	},

	Bezier: function ( v, k ) {

		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;

		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}

		return b;

	},

	CatmullRom: function ( v, k ) {

		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;

		if ( v[ 0 ] === v[ m ] ) {

			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );

			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );

		} else {

			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );

			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );

		}

	},

	Utils: {

		Linear: function ( p0, p1, t ) {

			return ( p1 - p0 ) * t + p0;

		},

		Bernstein: function ( n , i ) {

			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );

		},

		Factorial: ( function () {

			var a = [ 1 ];

			return function ( n ) {

				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;

			};

		} )(),

		CatmullRom: function ( p0, p1, p2, p3, t ) {

			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;

		}

	}

};

// UMD (Universal Module Definition)
( function ( root ) {

	if ( typeof define === 'function' && define.amd ) {

		// AMD
		define( [], function () {
			return TWEEN;
		} );

	} else if ( typeof exports === 'object' ) {

		// Node.js
		module.exports = TWEEN;

	} else {

		// Global variable
		root.TWEEN = TWEEN;

	}

} )( this );

var FRAME = ( function () {

	return {

		VERSION: 2,

		/*Curves: {
			
			Linear: function ( points ) {

				var linear = function ( p0, p1, t0, t1, t ) {

                        return ( p1 - p0 ) * ( ( t - t0 ) / ( t1 - t0 ) ) + p0;

                };

                this.points = points;
				this.value = 0;

				this.update = function ( time ) {

					if ( time <= points[ 0 ] ) {

						this.value = points[ 1 ];

					} else if ( time >= points[ points.length - 2 ] ) {

						this.value = points[ points.length - 1 ];

					} else {

						for ( var i = 0, l = points.length; i < l; i += 2 ) {

							if ( time < points[ i + 2 ] ) {

								this.value = linear( points[ i + 1 ], points[ i + 3 ], points[ i ], points[ i + 2 ], time );
								break;

							}

						}

					}

				};

			},

			Sin: function () {

				var frequency = 10;

				this.value = 0;

				this.update = function ( time ) {

					this.value = Math.sin( time * frequency );

				};

			},

			Saw: function ( frequency, offset, min, max ) {

				var delta = max - min;

				this.frequency = frequency;
				this.offset = offset;
				this.min = min;
				this.max = max;
				this.value = 0;

				this.update = function ( time ) {

					this.value = ( ( ( time - offset ) % frequency ) / frequency ) * delta + min;

				};

			}

		},*/

		Module: function ( data ) {

			if ( data === undefined ) data = {};

			this.name = '';
			this.parameters = data.parameters !== undefined ? data.parameters : {};

			this.init = data.init !== undefined ? data.init : function () {};
			this.start = data.start !== undefined ? data.start : function () {};
			this.update = data.update !== undefined ? data.update : function () {};
			this.complete = data.complete !== undefined ? data.complete : function () {};

		},

		Parameter: {

			Boolean: function ( name, value ) {
				this.name = name;
				this.value = value || true;
			},

			Color: function ( name, value ) {
				this.name = name;
				this.value = value || 0xffffff;
			},

			Float: function ( name, value, min, max ) {
				this.name = name;
				this.value = value || 0.0;
				this.min = min !== undefined ? min : - Infinity;
				this.max = max !== undefined ? max : Infinity;
			},

			Integer: function ( name, value, min, max ) {
				this.name = name;
				this.value = value || 0;
				this.min = min !== undefined ? min : - Infinity;
				this.max = max !== undefined ? max : Infinity;
			},

			String: function ( name, value ) {
				this.name = name;
				this.value = value || '';
			},

			Vector2: function ( name, value ) {
				this.name = name
				this.value = value !== undefined ? value : [ 0, 0 ];
			},

			Vector3: function ( name, value ) {
				this.name = name;
				this.value = value !== undefined ? value : [ 0, 0, 0 ];
			}

		},

		Timeline: function () {

			//var curves = [];
			var elements = [];
			var active = [];

			var next = 0, prevtime = 0;

			return {

				//curves: curves,
				elements: elements,

				add: function ( element ) {

					elements.push( element );
					this.sort();

				},

				remove: function ( element ) {

					var i = elements.indexOf( element );

					if ( i !== -1 ) {

						elements.splice( i, 1 );

					}

				},

				sort: function () {

					elements.sort( function ( a, b ) { return a.start - b.start; } );

				},
				
				update: function ( time ) {

					if ( time < prevtime ) {

						this.reset();

					}

					// add to active

					while ( elements[ next ] ) {

						var element = elements[ next ];

						if ( element.start > time ) {

							break;

						}

						if ( element.end > time ) {

							active.push( element );
							element.module.start();

						}

						next ++;

					}

					// remove from active

					var i = 0;

					while ( active[ i ] ) {

						var element = active[ i ];

						if ( element.end < time ) {

							element.module.complete();
							active.splice( i, 1 );
							continue;

						}

						i ++;

					}

					// update curves

					/*for ( var i = 0, l = curves.length; i < l; i ++ ) {

						curves[ i ].update( time );

					}*/

					// render

					active.sort( function ( a, b ) { return a.layer - b.layer; } );
					var l = active.length;
					for ( i = 0; i < l; i ++ ) {

						var element = active[ i ];
						element.module.update( ( time - element.start ) / ( element.end - element.start ) );

					}

					prevtime = time;

				},

				clear: function() {

					while ( active.length ) active.pop();
					active = [];
					next = 0;

					while(elements.length) elements.pop();
					elements = [];

				},

				reset: function () {

					while ( active.length ) active.pop();
					next = 0;

				}

			}

		},

		TimelineElement: function () {
			
			var id = 0;
			
			return function ( module, layer, start, end ) {

				this.id = id ++;
				this.module = module;
				this.layer = layer;
				this.start = start;
				this.end = end;

				this.module.init();
				
			};

		}()

	}

} )();

/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_| 2015
*    @author lo.th / http://lo-th.github.io/labs/
*/

'use strict';

// need uil http://lo-th.github.io/uil/build/uil.min.js
var UIL;

var NEO = NEO || ( function () {
    return {
        main:null,
        REVISION: '0.1',
        DEF:false,
        events:[ 'onkeyup', 'onkeydown', 'onclick', 'onchange', 'onmouseover', 'onmouseout', 'onmousemove', 'onmousedown', 'onmouseup', 'onmousewheel' ],
        WIDTH:300,
        BW:190,
        AW:100, 
        svgns:"http://www.w3.org/2000/svg",
        sizer:function(w){
            this.WIDTH = w.toFixed(0);
            var s = this.WIDTH/3;
            this.BW = (s*2)-10;
            this.AW = s;

            if(this.main) this.main.changeWidth();
        },
        classDefine:function(){
            NEO.COLOR = 'NO';
            //NEO.SELECT = '#035fcf';
            //NEO.SELECTDOWN = '#024699';
            //NEO.SVGB = 'rgba(0,0,0,0.2)';
            //NEO.SVGC = 'rgba(120,120,120,0.6)';
            NEO.txt1 = 'font-family:"Open Sans", sans-serif; font-size:11px; color:#cccccc; outline:0; padding:0px 10px; left:0; top:1px; height:17px; width:100px; overflow:hidden;';

            NEO.CC('NEO', 'position:absolute; pointer-events:none; box-sizing:border-box; -o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select:none; margin:0; padding:0; ');

            NEO.CC('NEO.content', 'width:100px; overflow:hidden; background:none;');

            
            NEO.CC('NEO.topmenu', 'width:100%; height:24px; background:none; ');
            NEO.CC('NEO.timeBar', 'width:100px; height:36px; top:24px; background:none; pointer-events:auto; cursor:pointer;');
            NEO.CC('NEO.timescale', 'width:100px; height:20px; background:none; bottom:0; pointer-events:auto; cursor:pointer;');
            NEO.CC('NEO.inner', 'width:100%; top:60px; height:auto; overflow:hidden; background:none;');

            NEO.CC('NEO.base', 'position:relative; transition:height, 0.1s ease-out; height:80px; overflow:hidden;');
            NEO.CC('NEO.text', NEO.txt1);

            /*NEO.CC('NEO.mask', 'width:400px; height:100%; margin-left:-50px; pointer-events:auto; cursor:col-resize; background:none; display:none;');
            NEO.CC('NEO.inner', 'width:300px; top:0; left:0; height:auto; overflow:hidden; background:none;');

            

            

            NEO.CC('input', 'border:solid 1px rgba(0,0,0,0.2); background:rgba(0,0,0,0.2); transition: 0.1s ease-out;', true);
            NEO.CC('input:focus', 'border: solid 1px rgba(0,0,0,0); background:rgba(0,0,0,0.6);', true);

            NEO.CC('NEO.list', 'box-sizing:content-box; border:20px solid transparent; border-bottom:10px solid transparent; left:80px; top:0px; width:190px; height:90px; overflow:hidden; cursor:s-resize; pointer-events:auto; display:none;');
            NEO.CC('NEO.list-in', 'left:0; top:0; width:100%; background:rgba(0,0,0,0.2); ');
            NEO.CC('NEO.listItem', 'position:relative; height:18px; background:rgba(0,0,0,0.2); border-bottom:1px solid rgba(0,0,0,0.2); pointer-events:auto; cursor:pointer;'+NEO.txt1);
            NEO.CC('NEO.listItem:hover', 'background:'+NEO.SELECT+'; color:#FFFFFF;')

            NEO.CC('NEO.scroll-bg', 'cursor:w-resize; pointer-events:auto; background:rgba(256,0,0,0.2);');
            NEO.CC('NEO.svgbox', 'left:100px; top:1px; width:190px; height:17px; pointer-events:auto; cursor:pointer; font-family:"Open Sans", sans-serif; font-size:11px; text-align:center;');*/

            NEO.DEF = true;
        },
        bgcolor: function(p, a){
            var r=48, g=48, b=48;
            a = a || 0.66;
            if(p){
                switch(p){
                    case 'r': case 'R': case 'S': r=160; b=68; break;
                    case 'g': case 'G': case 'E': g=120; b=68; break;
                    case 'b': case 'B': case 'T': b=120; g=68; break;
                    case 'no': case 'NO': a=0; break;
                }
            }

            var color = 'rgba('+r+','+g+','+b+','+a+')';
            if(a==0) color = 'none';
            return color;
        },
        /*canvasURL:function(obj){
            var canvas = document.createElement( 'canvas' );
            canvas.width = obj.w || 20;
            canvas.height = obj.h || 20;

            var context = canvas.getContext( '2d' );
            context.fillStyle = '#444';
            context.fillRect( 0, 0, 20, 20 );
            return canvas.toDataURL();
        },*/
        setSVG:function(dom, type, value, id){
            dom.childNodes[id || 0].setAttributeNS(null, type, value );
        },
        setDOM:function(dom, type, value){
            dom.style[type] = value+'px';
        },

        DOM:function(cc, type, css, obj, dom, id){ 
            type = type || 'div';
            if(type=='rect' || type=='path' || type=='polygon' || type=='text' || type=='pattern' || type=='defs' || type=='g' || type=='line' ){
                if(dom==undefined) dom = document.createElementNS( this.svgns, 'svg' );
                var g = document.createElementNS( this.svgns, type );

                for(var e in obj){
                    if(e=='txt') g.textContent = obj[e];
                    else g.setAttributeNS(null, e, obj[e] );
                }

                if(id==undefined) dom.appendChild(g);
                else dom.childNodes[id || 0].appendChild(g);

                if(cc) dom.setAttribute('class', cc);
            } else {
                if(dom==undefined) dom = document.createElement(type);
                if(cc) dom.className = cc;
            }
            
            if(css) dom.style.cssText = css; 


            if(id==undefined) return dom;
            else return dom.childNodes[id || 0];
        },
        CC:function(name,rules,noAdd){
            var adds = '.';
            if(noAdd)adds='';
            if(name == '*') adds = '';
            var style = document.createElement('style');
            style.type = 'text/css';
            document.getElementsByTagName('head')[0].appendChild(style);
            if(!(style.sheet||{}).insertRule) (style.styleSheet || style.sheet).addRule(adds+name, rules);
            else style.sheet.insertRule(adds+name+"{"+rules+"}",0);
        }
    };
})();


NEO.Timeline = function(css, decal){

    this.time = 0;
    this.height = 80;
    this.width = 100;
    this.decal = decal || 0;

    this.framesize = 10;
    this.currentframe = 0;
    this.currentLeftFrame = 0;
    this.fps = 60;
    this.totalFrame = 750; // default flash
    this.totalSize = this.framesize*this.totalFrame;
    this.currentPosition = this.currentLeftFrame*this.framesize;
    //this.currentLeftPosition = this.currentLeftFrame*this.framesize;
    this.ratio = this.totalFrame/this.width;
    this.viewFrame = this.width/this.framesize;
    this.posX = 0;
    
    

    this.timerdown = false;
    this.scrolldown = false;
    this.inPlay = false;


    this.neo = [];
    this.f = [];

    this.content = NEO.DOM('NEO content', 'div', css);
    document.body.appendChild(this.content);

    this.top = parseFloat(this.content.style.top.substring(0,this.content.style.top.length-2));


    // TOP MENU

    this.topmenu = NEO.DOM('NEO topmenu');
    this.topmenu.appendChild(this.liner(1));

    var callbackSize = function(v){ this.scaletime(v); }.bind(this);
    var callbackFps = function(v){ this.fps = v; this.updateTime(); }.bind(this);
    var callbackList = function(v){ this.add(v); this.addList.text('ADD'); }.bind(this);
    var callbackPlay = function(v){ this.play(); }.bind(this);

   
    this.sizer = new UIL.Slide({target:this.topmenu, callback:callbackSize, name:'scale', min:0.1, max:4, value:0.8, step:0.1, color:'no', size:150, pos:{left:'auto', right:'0', top:'2px' }});
    this.setFps = new UIL.Number({target:this.topmenu, callback:callbackFps, name:'fps', min:12, max:60, value:60, step:1, color:'no', size:82, solo:true, pos:{left:'auto', right:'130px', top:'2px' }});
    this.title = new UIL.Title({target:this.topmenu, name:'0:00:00', color:'no', size:120, height:20, pos:{top:'2px' } });
    this.addList = new UIL.List({target:this.topmenu, callback:callbackList, name:' ', color:'no', list:['bang', 'flag', 'curve', 'lfo', 'color', 'switch', 'audio', 'video'], size:150, pos:{left:'60px', top:'2px' } });
    this.addList.text('ADD');

    this.playButton = new UIL.Button({target:this.topmenu, callback:callbackPlay, name:'X', color:'no', size:41, pos:{left:'200px', top:'2px' } });
    this.playIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px'><path fill='#CCC' d='M 12 9 L 12 7 5 3 4 4 4 12 5 13 12 9 Z'/></svg>";
    this.pauseIcon = "<svg xmlns='http://www.w3.org/2000/svg' width='16px' height='16px'><path fill='#CCC' d='M 12 3 L 9 3 9 13 12 13 12 3 M 7 3 L 4 3 4 13 7 13 7 3 Z'/></svg>";
    this.playButton.icon(this.playIcon);


    // TOP TIMEBAR 

    this.timeBar = NEO.DOM('NEO timeBar');
    
    this.timeBar.name = 'timeBar';

    // special svg pattern
    this.pattern = NEO.DOM('NEO', 'defs', 'width:100%; height:20px; bottom:0;', {} );
    var p = NEO.DOM(null, 'pattern', '', {id:'timeBar', width:50, height:20, patternUnits:'userSpaceOnUse'}, this.pattern, 0 );
    var g = NEO.DOM(null, 'g', '', { stroke:'#888', 'stroke-width':'1', fill:'none'}, p, 0 );
    NEO.DOM(null, 'path', '', { d:'M0 0'}, g, 0 );
    NEO.DOM(null, 'rect', '', {width:'100%', height:20, x:0, fill:'url(#timeBar)'}, this.pattern );

    this.patternLine = g.childNodes[0];

    this.timeBar.appendChild(this.pattern);


    // BOTTOM TIME SCALE

    this.timescale = NEO.DOM('NEO timescale');
    
    this.timescale.appendChild(this.liner(1));
    this.timescale.appendChild(this.liner(20));
    this.timescale.name = 'timescale';

    this.pattern2 = NEO.DOM('NEO', 'defs', 'width:100%; height:10px; top:5px;', {} );
    p = NEO.DOM(null, 'pattern', '', {id:'timeScale', width:10, height:10, patternUnits:'userSpaceOnUse'}, this.pattern2, 0 );
    g = NEO.DOM(null, 'g', '', { stroke:'#888', 'stroke-width':'1', fill:'none'}, p, 0 );
    NEO.DOM(null, 'path', '', { d:'M0 10 L10 0 M0 5 L5 0 M5 10 L10 5'}, g, 0 );
    NEO.DOM(null, 'rect', '', {width:'100%', height:10, x:0, fill:'url(#timeScale)'}, this.pattern2 );
    this.timescale.appendChild(this.pattern2);

    this.scaler = NEO.DOM('NEO', 'rect', 'width:40px; height:16px; top:2px', {width:40, height:16, x:0, y:0, fill:'rgba(0,0,0,0.5)', stroke:'#888', 'stroke-width':'1'} );
    this.timescale.appendChild(this.scaler);

    this.miniFramePos = this.vliner(1, '#F00');
    this.timescale.appendChild(this.miniFramePos);



    // TRACK CONTENT

    this.inner = NEO.DOM('NEO inner');
    


    // TIME MARKER

    this.marker = NEO.DOM('NEO', 'rect', 'width:41px; height:60px;', {width:10, height:20, x:0.5, y:27.5, fill:'rgba(255,0,0,0.3)', stroke:'#F00', 'stroke-width':'1'} );
    NEO.DOM(null, 'line', '', { x1:5.5, y1:47.5, x2:5.5, y2:'100%', stroke:'#F00', 'stroke-width':'1' }, this.marker );
    

    this.content.appendChild(this.timeBar);
    this.content.appendChild(this.timescale);
    this.content.appendChild(this.inner);
    this.content.appendChild(this.marker);
    this.content.appendChild(this.topmenu);



    // FUNCTION

    // content.mouseDown
    this.f[0] = function(e){
        if(e.target.name){
            var name = e.target.name;
            if(name=='timeBar'){
                this.timerdown = true;
                
            }else if(name=='timescale'){
                this.scrolldown = true;

            }
            this.f[1](e);
        }
    }.bind(this);

    // content.mouseMouve
    this.f[1] = function(e){
        if(this.timerdown){
            this.currentframe = Math.floor(e.clientX/this.framesize)+this.currentLeftFrame;
            
            this.updateTime();
        }
        if(this.scrolldown){
            this.posX = e.clientX;
            this.move();
        }
    }.bind(this);

    // content.mouseUp
    this.f[2] = function(e){
        this.timerdown = false;
        this.scrolldown = false;
    }.bind(this);

    this.content.onmousedown = this.f[0];
    this.content.onmousemove = this.f[1];
    this.content.onmouseout = this.f[2];
    this.content.onmouseup = this.f[2];



    

    this.title.text2(this.currentframe);

    window.addEventListener("resize", function(e){this.resize(e)}.bind(this), false );
    this.resize();

    this.scaletime(0.8);//default FLASH
    //this.scaletime(1);

    NEO.main = this;
}


NEO.Timeline.prototype = {
    constructor: NEO.Timeline,
    play:function(){
        if(this.inPlay){
            this.inPlay = false;
            this.playButton.icon(this.playIcon);
        }else{
            this.inPlay = true;
            this.playButton.icon(this.pauseIcon);
        }

    },
    show:function(){
        this.content.style.display = 'block';
    },
    hide:function(){
        this.content.style.display = 'none';
    },
    move:function(){
        var x = this.posX;
        this.mid = this.miniScaleView*0.5;
        this.currentScrollPosition = Math.min( this.width-this.miniScaleView, Math.max( 0, (x-this.mid) ) ).toFixed(0)*1;
        this.currentLeftFrame = Math.round(this.currentScrollPosition*this.ratio);
        this.currentPosition = this.currentLeftFrame*this.framesize;
        this.scaler.style.left = this.currentScrollPosition;
        this.timeBar.style.left = -this.currentPosition+'px';
        this.marker.style.left = ((this.currentframe-+this.currentLeftFrame)*this.framesize)+'px';
        this.miniFramePos.style.left = ((this.currentframe*(this.width/this.totalFrame)))+'px';
    },
    scaletime:function(s){

        var w = 100 * (100/(100*s));

        this.framesize = Math.floor(s*10);//.toFixed(0)*1;
        //this.viewFrame = this.width/this.framesize;
        //console.log(w, this.framesize );

        var ld = (this.framesize*0.5)+0.5;

        NEO.setSVG(this.pattern, 'width', 100+'%', 1);

        var n = [
            Math.round(this.framesize)+0.5,
            Math.round(this.framesize*2)+0.5,
            Math.round(this.framesize*3)+0.5,
            Math.round(this.framesize*4)+0.5,
            Math.round(this.framesize*5)+0.5,
        ];

        var path = 'M0.5 10 L0.5 18' + 'M'+n[0]+' 15 L'+n[0]+' 18' + 'M'+n[1]+' 15 L'+n[1]+' 18' + 'M'+n[2]+' 15 L'+n[2]+' 18' + 'M'+n[3]+' 15 L'+n[3]+' 18' + 'M-0.5 20 L'+n[4]+' 20';
        NEO.setSVG(this.patternLine, 'd', path, 0);
        NEO.setSVG(this.pattern.childNodes[0], 'width', this.framesize*5, 0);

        this.totalSize = this.framesize*this.totalFrame;
        this.currentPosition = this.currentLeftFrame*this.framesize;

        //this.pattern.style.width = this.totalSize + 'px';
        this.timeBar.style.width = this.totalSize + 'px';
        this.timeBar.style.left = this.currentPosition + 'px';
        //this.pattern.style.left = this.currentPosition +'px';

        NEO.setSVG(this.marker, 'width',this.framesize);
        NEO.setSVG(this.marker, 'x1',ld, 1);
        NEO.setSVG(this.marker, 'x2',ld, 1);

        this.marker.style.left = ((this.currentframe*this.framesize)-this.currentPosition)+'px';

        this.setScaler();
        this.move();

    },
    setScaler:function(){
        this.ratio = this.totalFrame/this.width;
        this.viewFrame = Math.round(this.width/this.framesize);
        this.miniScaleView = (this.width/this.totalFrame) * this.viewFrame;
        this.scaler.style.width = this.miniScaleView+'px';
        NEO.setSVG(this.scaler, 'width',this.miniScaleView);
    },
    add:function(type, obj){
        var n;
        switch(type){
            case 'bang':  n = new NEO.Bang(obj); break;
            case 'color': n = new NEO.Color(obj); break;
            case 'curve': n = new NEO.Curve(obj); break;
            case 'flag':  n = new NEO.Flag(obj);  break;
            case 'lfo':   n = new NEO.Lfo(obj);  break;
            case 'switch':  n = new NEO.Switch(obj);  break;
            case 'audio':   n = new NEO.Audio(obj);   break;
            case 'video':   n = new NEO.Video(obj);   break;
        }
        this.neo.push(n);
        this.calc();

        //console.log(type);
        return n;
    },
    resize:function(e){
        this.width = window.innerWidth - this.decal;
        //this.height = window.innerHeight-this.top-5;
        this.content.style.height = this.height+'px';
        this.content.style.width = this.width+'px';
        this.timescale.style.width = this.width+'px';
        this.setScaler();
        this.move();

        //console.log(this.viewFrame);


        //this.sizer.setDom(0,'left', this.width-140 );
        //this.zone = this.height-40;
        //this.calc();
        //this.f[5](0);
    },
    updateTime:function () {
        this.time = this.currentframe/this.fps;

        var minutes = Math.floor( this.time / 60 );
        var seconds = this.time % 60;
        var padding = seconds < 10 ? '0' : '';

        this.title.text2(this.currentframe);
        this.title.text( minutes + ':' + padding + seconds.toFixed( 2 ) );

        this.marker.style.left = ((this.currentframe-this.currentLeftFrame)*this.framesize)+'px';
        this.miniFramePos.style.left = ((this.currentframe*(this.width/this.totalFrame)))+'px';
    },
    calc:function(){
        var total = 0;
        var i = this.neo.length;
        while(i--) total+=this.neo[i].h;
        this.height = 80+total;
        this.content.style.height = this.height+'px';
        this.marker.style.height = (this.height-20)+'px';
        //if(total>this.height) this.showScroll(total);
        //else this.hideScroll();
    },






    liner:function(top){
        var l = NEO.DOM('NEO', 'line', 'width:100%; height:1px; top:'+(top-1)+'px;', {x1:0, y1:0, x2:'100%', y2:0, stroke:'#888', 'stroke-width':1} );
        return l;
    },
    vliner:function(top, color){
        var l = NEO.DOM('NEO', 'line', 'width:1px; height:100%; top:'+(top-1)+'px;', {x1:0, y1:0, x2:0, y2:'100%', stroke:color, 'stroke-width':1} );
        return l;
    },
    pins:function(){
        var p = NEO.DOM('NEO', 'path','width:16px; height:20px; left:0px; top:1px; pointer-events:auto; cursor:pointer;',{ width:16, height:16, 'd':'M 12 6 L 8 10 4 6', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' } );
        return p;
    }
}



NEO.classDefine();
NEO.TimerGraph = function(obj){

}

NEO.TimerGraph.prototype = {
    constructor: NEO.TimerGraph,

    init:function(){
    },
    pattern:function(){
        var t= [];
        t[0] = "<svg xmlns='http://www.w3.org/2000/svg'><defs><pattern id='pp' x='0' y='0' width='50' height='20' patternUnits='userSpaceOnUse'>";
        t[1] = "<g fill='none' stroke='#f0934e' stroke-width='1'><path d='M0 5 L0 20'/><path d='M10 10 L10 20'/><path d='M20 10 L20 20'/><path d='M30 10 L30 20'/><path d='M40 10 L40 20'/><path d='M50 5 L50 20'/></g>";
        t[2] = "</pattern></defs><rect x='0' y='0' width='100%' height='20' fill='url(#pp)'/></svg>";
        return t.join("\n");
    }
}
NEO.Proto = function(obj){

    obj = obj || {};

    this.h = 80;
    this.show = true;

    // define obj size
    /*this.setSize(obj.size);
    
    */
    if(obj.color) NEO.COLOR = obj.color;
    this.color = NEO.COLOR;
    

    //this.txt = obj.name || 'Proto';
    this.target = obj.target || null;
    this.callback = obj.callback || function(){};

    this.c = [];
    this.f = [];

    this.c[0] = NEO.DOM('NEO base');
    this.c[1] = NEO.DOM('NEO text', 'div', 'left:10px');
    this.c[2] = NEO.main.liner(20);
    this.c[3] = NEO.main.liner(80);
    this.c[4] = NEO.main.pins();

    this.c[1].textContent = this.type;

    this.f[0] = function(e){
        if(this.show) this.close();
        else this.open();
    }.bind(this);

    this.c[4].onclick = this.f[0];

}

NEO.Proto.prototype = {
    constructor: NEO.Proto,
    open:function(){
        this.show = true;
        this.setSvg(4, 'd','M 12 6 L 8 10 4 6');
        this.h = 80;
        this.applyHeight();
    },
    close:function(){
        this.show = false;
        this.setSvg(4, 'd','M 6 4 L 10 8 6 12');
        this.h = 20;
        this.applyHeight();
    },
    applyHeight:function(){
        this.c[0].style.height = this.h+'px';
        if(NEO.main)NEO.main.calc();
    },

    init:function(){
        this.c[0].style.background = NEO.bgcolor(this.color);
        for(var i = 0; i<this.c.length; i++){
            if(i==0){ 
                if(this.target!==null) this.target.appendChild(this.c[0]);
                else NEO.main.inner.appendChild(this.c[0]);
            }
            else this.c[0].appendChild(this.c[i]);
        }
        //this.rSize();
    },
    setSvg:function(domId, type, value, id){
        this.c[domId].childNodes[id || 0].setAttributeNS(null, type, value );
    },
    /*setSize:function(sx){
        this.size = sx || UIL.WIDTH;
        this.sa = (this.size/3).toFixed(0)*1;
        this.sb = ((this.sa*2)-10).toFixed(0)*1;
    },
    setDom:function(id, type, value){
        this.c[id].style[type] = value+'px';
    },
    
    clear:function(){
        var ev = UIL.events;
        var i = this.c.length, j;
        while(i--){
            if(i==0){ 
                if(this.target!==null) this.target.removeChild(this.c[0]);
                else UIL.main.inner.removeChild(this.c[0]);
            } else {
                j = ev.length;
                while(j--){ if(this.c[i][ev[j]]!==null) this.c[i][ev[j]] = null; }
                if(this.c[i].children) this.clearDOM(this.c[i]);
                this.c[0].removeChild(this.c[i]);
            }
            this.c[i] = null;
        }

        this.c = null;
        if(this.f){
            i = this.f.length;
            while(i--) this.f[i] = null;
            this.f = null
        }
        if(this.callback)this.callback = null;
        if(this.value)this.value = null;
    },
    clearDOM:function(dom){
        while ( dom.children.length ){
            if(dom.lastChild.children) while ( dom.lastChild.children.length ) dom.lastChild.removeChild( dom.lastChild.lastChild );
            dom.removeChild( dom.lastChild );
        }
    },
    setTypeNumber:function( obj ){

        this.min = -Infinity;
        this.max = Infinity;

        this.precision = 2;
        if(obj.precision !== undefined ) this.precision = obj.precision;
        //this.prev = null;
        this.step = 0.01;
        switch(this.precision){
            case 0:  this.step = 1; break;
            case 1:  this.step = 0.1; break;
            case 2:  this.step = 0.01; break;
            case 3:  this.step = 0.001; break;
            case 4:  this.step = 0.0001; break;
        }

        if(obj.min !== undefined ) this.min = obj.min;
        if(obj.max !== undefined ) this.max = obj.max;
        if(obj.step !== undefined ) this.step = obj.step;
        
    },
    numValue:function(n){
        return Math.min( this.max, Math.max( this.min, n ) ).toFixed( this.precision )*1;
    },
    rSize:function(){
        this.c[0].style.width = this.size+'px';
        this.c[1].style.width = this.sa+'px';
    }*/
}
NEO.Bang = function(obj){

    obj = obj || {};
    
    this.type = 'bang';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Bang.prototype = Object.create( NEO.Proto.prototype );
NEO.Bang.prototype.constructor = NEO.Bang;

NEO.Bang.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Color = function(obj){

    obj = obj || {};
    
    this.type = 'color';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Color.prototype = Object.create( NEO.Proto.prototype );
NEO.Color.prototype.constructor = NEO.Color;

NEO.Color.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Curve = function(obj){

    obj = obj || {};
    
    this.type = 'curve';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Curve.prototype = Object.create( NEO.Proto.prototype );
NEO.Curve.prototype.constructor = NEO.Curve;

NEO.Curve.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Flag = function(obj){

    obj = obj || {};
    
    this.type = 'flag';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Flag.prototype = Object.create( NEO.Proto.prototype );
NEO.Flag.prototype.constructor = NEO.Flag;

NEO.Flag.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Lfo = function(obj){

    obj = obj || {};
    
    this.type = 'lfo';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Lfo.prototype = Object.create( NEO.Proto.prototype );
NEO.Lfo.prototype.constructor = NEO.Lfo;

NEO.Lfo.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Switch = function(obj){

    obj = obj || {};
    
    this.type = 'switch';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Switch.prototype = Object.create( NEO.Proto.prototype );
NEO.Switch.prototype.constructor = NEO.Switch;

NEO.Switch.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Audio = function(obj){

    obj = obj || {};
    
    this.type = 'audio';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Audio.prototype = Object.create( NEO.Proto.prototype );
NEO.Audio.prototype.constructor = NEO.Audio;

NEO.Audio.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
NEO.Video = function(obj){

    obj = obj || {};
    
    this.type = 'video';

    NEO.Proto.call( this, obj );

    this.value = obj.value || false;

    /*this.c[2] = UIL.DOM('UIL svgbox', 'rect', 'width:17px;', {width:17, height:17, fill:UIL.SVGB, 'stroke-width':1, stroke:UIL.SVGC });
    this.c[3] = UIL.DOM('UIL svgbox', 'path','width:17px; pointer-events:none;',{ width:17, height:17, d:'M 4 9 L 6 12 14 4', 'stroke-width':2, stroke:'#e2e2e2', fill:'none', 'stroke-linecap':'butt' });

    if(!this.value) this.c[3].style.display = 'none';

    this.f[0] = function(e){
        if(this.value){
            this.value = false;
            this.c[3].style.display = 'none';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.2)');
        } else {
            this.value = true;
            this.c[3].style.display = 'block';
            UIL.setSVG(this.c[2], 'fill','rgba(0,0,0,0.4)');
        }
        this.callback( this.value );
    }.bind(this);

    this.c[2].onclick = this.f[0];*/

    this.init();
}

NEO.Video.prototype = Object.create( NEO.Proto.prototype );
NEO.Video.prototype.constructor = NEO.Video;

NEO.Video.prototype.rSize = function(){
    //NEO.Proto.prototype.rSize.call( this );
    //this.setDom(2, 'left', this.sa);
    //this.setDom(3, 'left', this.sa);
};
