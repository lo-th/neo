/**
 * @author mrdoob / http://mrdoob.com/
 */

var Stats = function () {

	var now = ( self.performance && self.performance.now ) ? self.performance.now.bind( performance ) : Date.now;

	var startTime = now(), prevTime = startTime;
	var frames = 0, mode = 0;

	function createElement( tag, id, css ) {

		var element = document.createElement( tag );
		element.id = id;
		element.style.cssText = css;
		return element;

	}

	function createPanel( id, fg ) {

		//var div = createElement( 'div', id, 'padding:0 0 3px 3px;text-align:left;background:' + bg );
		var div = createElement( 'div', id, 'padding:6px 10px; text-align:left; background:none;' );

		var text = createElement( 'div', id + 'Text', 'position:absolute; width:74px; text-align:center; font-family:"Lucida Console", Monaco, monospace; font-size:11px; color:' + fg );
		//var text = createElement( 'div', id + 'Text', 'font-family:Helvetica,Arial,sans-serif;font-size:9px;font-weight:bold;line-height:15px;color:' + fg );
		text.innerHTML = id.toUpperCase();
		div.appendChild( text );

		//var graph = createElement( 'div', id + 'Graph', 'width:74px; height:30px;background:' + fg );
		var graph = createElement( 'div', id + 'Graph', 'width:74px; height:40px;background:none; border:1px solid rgba(255,255,255,0.2); border-top:none;  ' );
		//var graph = createElement( 'div', id + 'Graph', 'width:74px;height:30px;background:none' );
		div.appendChild( graph );

		for ( var i = 0; i < 74; i ++ ) {
			//graph.appendChild( createElement( 'span', '', 'width:1px; height:30px; margin-top:10px; float:left; opacity:0.9; background:none; border-bottom: 1px solid '+ fg ) );

			graph.appendChild( createElement( 'span', '', 'position:relative;  width:1px; height:1px; top:38px; float:left; border-bottom: 1px solid rgba(0,0,0,0.5); background:'+ fg ) );


		}

		return div;

	}

	function setMode( value ) {

		var children = container.children;

		for ( var i = 0; i < children.length; i ++ ) {

			children[ i ].style.display = i === value ? 'block' : 'none';

		}

		mode = value;

	}

	function updateGraph( dom, value ) {

		var child = dom.appendChild( dom.firstChild );
		//child.style.height = Math.min( 30, 30 - value * 30 ) + 'px';
		child.style.top = 8 + Math.min( 30, 30 - value * 30 ) + 'px';

	}

	//

	var container = createElement( 'div', 'stats', 'width:100px; cursor:pointer' );
	container.addEventListener( 'mousedown', function ( event ) {

		event.preventDefault();
		setMode( ++ mode % container.children.length );

	}, false );

	// FPS

	var fps = 0;///, fpsMin = Infinity, fpsMax = 0;

	var fpsDiv = createPanel( 'fps', '#0ff' );
	var fpsText = fpsDiv.children[ 0 ];
	var fpsGraph = fpsDiv.children[ 1 ];

	container.appendChild( fpsDiv );

	// MS

	var ms = 0;//, msMin = Infinity, msMax = 0;

	var msDiv = createPanel( 'ms', '#0fa' );
	var msText = msDiv.children[ 0 ];
	var msGraph = msDiv.children[ 1 ];

	container.appendChild( msDiv );

	// MEM

	if ( self.performance && self.performance.memory ) {

		var mem = 0;//, memMin = Infinity, memMax = 0;

		var memDiv = createPanel( 'mb', '#fa0' );
		var memText = memDiv.children[ 0 ];
		var memGraph = memDiv.children[ 1 ];

		container.appendChild( memDiv );

	}

	//

	setMode( mode );

	return {

		REVISION: 14,

		domElement: container,

		setMode: setMode,

		begin: function () {

			startTime = now();

		},

		end: function () {

			var time = now();

			ms = time - startTime;
			//msMin = Math.min( msMin, ms );
			//msMax = Math.max( msMax, ms );

			msText.textContent = ( ms | 0 ) + ' ms';// (' + ( msMin | 0 ) + '-' + ( msMax | 0 ) + ')';
			updateGraph( msGraph, ms / 200 );

			frames ++;

			if ( time > prevTime + 1000 ) {

				fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
				//fpsMin = Math.min( fpsMin, fps );
				//fpsMax = Math.max( fpsMax, fps );

				fpsText.textContent = fps + ' fps';// (' + fpsMin + '-' + fpsMax + ')';
				updateGraph( fpsGraph, fps / 100 );

				prevTime = time;
				frames = 0;

				if ( mem !== undefined ) {

					var heapSize = performance.memory.usedJSHeapSize;
					var heapSizeLimit = performance.memory.jsHeapSizeLimit;

					mem = Math.round( heapSize * 0.000000954 );
					//memMin = Math.min( memMin, mem );
					//memMax = Math.max( memMax, mem );

					memText.textContent = mem + ' mb';// (' + memMin + '-' + memMax + ')';
					updateGraph( memGraph, heapSize / heapSizeLimit );

				}

			}

			return time;

		},

		update: function () {

			startTime = this.end();

		}

	};

};

if ( typeof module === 'object' ) {

	module.exports = Stats;

}
