/**
 * @license
 * Copyright 2010-2021 Neo.js Authors
 * SPDX-License-Identifier: MIT
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.NEO = {}));
})(this, (function (exports) { 'use strict';

	// Polyfills
	// performance.now
	//var now;
	function perfnow(global) {
		// make sure we have an object to work with
		if (!('performance' in global)) {
			global.performance = {};
		}

		var perf = global.performance; // handle vendor prefixing

		global.performance.now = perf.now || perf.mozNow || perf.msNow || perf.oNow || perf.webkitNow || // fallback to Date
		Date.now || function () {
			return new Date().getTime();
		};
	}

	perfnow(self);
	/*
	(function(w){
			var perfNow;
			var perfNowNames = ['now', 'webkitNow', 'msNow', 'mozNow'];
			if(!!w['performance']) for(var i = 0; i < perfNowNames.length; ++i){
					var n = perfNowNames[i];
					if(!!w['performance'][n]){
							perfNow = function(){return w['performance'][n]()};
							break;
					}
			}
			if(!perfNow) perfNow = Date.now;
			
	})(window);
	*/

	if (Number.EPSILON === undefined) {
		Number.EPSILON = Math.pow(2, -52);
	} //


	if (Math.sign === undefined) {
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
		Math.sign = function (x) {
			return x < 0 ? -1 : x > 0 ? 1 : +x;
		};
	}

	if (Function.prototype.name === undefined) {
		// Missing in IE9-11.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/name
		Object.defineProperty(Function.prototype, 'name', {
			get: function () {
				return this.toString().match(/^\s*function\s*([^\(\s]*)/)[1];
			}
		});
	}

	if (Object.assign === undefined) {
		// Missing in IE.
		// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
		(function () {
			Object.assign = function (target) {

				if (target === undefined || target === null) {
					throw new TypeError('Cannot convert undefined or null to object');
				}

				var output = Object(target);

				for (var index = 1; index < arguments.length; index++) {
					var source = arguments[index];

					if (source !== undefined && source !== null) {
						for (var nextKey in source) {
							if (Object.prototype.hasOwnProperty.call(source, nextKey)) {
								output[nextKey] = source[nextKey];
							}
						}
					}
				}

				return output;
			};
		})();
	}

	/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */
	var saveAs = function (e) {

		if (typeof e === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
			return;
		}

		var t = e.document,
				n = function () {
			return e.URL || e.webkitURL || e;
		},
				r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"),
				o = ("download" in r),
				a = function (e) {
			var t = new MouseEvent("click");
			e.dispatchEvent(t);
		},
				i = /constructor/i.test(e.HTMLElement) || e.safari,
				f = /CriOS\/[\d]+/.test(navigator.userAgent),
				u = function (t) {
			(e.setImmediate || e.setTimeout)(function () {
				throw t;
			}, 0);
		},
				s = "application/octet-stream",
				d = 1e3 * 40,
				c = function (e) {
			var t = function () {
				if (typeof e === "string") {
					n().revokeObjectURL(e);
				} else {
					e.remove();
				}
			};

			setTimeout(t, d);
		},
				l = function (e, t, n) {
			t = [].concat(t);
			var r = t.length;

			while (r--) {
				var o = e["on" + t[r]];

				if (typeof o === "function") {
					try {
						o.call(e, n || e);
					} catch (a) {
						u(a);
					}
				}
			}
		},
				p = function (e) {
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)) {
				return new Blob([String.fromCharCode(65279), e], {
					type: e.type
				});
			}

			return e;
		},
				v = function (t, u, d) {
			if (!d) {
				t = p(t);
			}

			var v = this,
					w = t.type,
					m = w === s,
					y,
					h = function () {
				l(v, "writestart progress write writeend".split(" "));
			},
					S = function () {
				if ((f || m && i) && e.FileReader) {
					var r = new FileReader();

					r.onloadend = function () {
						var t = f ? r.result : r.result.replace(/^data:[^;]*;/, "data:attachment/file;");
						var n = e.open(t, "_blank");
						if (!n) e.location.href = t;
						t = undefined;
						v.readyState = v.DONE;
						h();
					};

					r.readAsDataURL(t);
					v.readyState = v.INIT;
					return;
				}

				if (!y) {
					y = n().createObjectURL(t);
				}

				if (m) {
					e.location.href = y;
				} else {
					var o = e.open(y, "_blank");

					if (!o) {
						e.location.href = y;
					}
				}

				v.readyState = v.DONE;
				h();
				c(y);
			};

			v.readyState = v.INIT;

			if (o) {
				y = n().createObjectURL(t);
				setTimeout(function () {
					r.href = y;
					r.download = u;
					a(r);
					h();
					c(y);
					v.readyState = v.DONE;
				});
				return;
			}

			S();
		},
				w = v.prototype,
				m = function (e, t, n) {
			return new v(e, t || e.name || "download", n);
		};

		if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
			return function (e, t, n) {
				t = t || e.name || "download";

				if (!n) {
					e = p(e);
				}

				return navigator.msSaveOrOpenBlob(e, t);
			};
		}

		w.abort = function () {};

		w.readyState = w.INIT = 0;
		w.WRITING = 1;
		w.DONE = 2;
		w.error = w.onwritestart = w.onprogress = w.onwrite = w.onabort = w.onerror = w.onwriteend = null;
		return m;
	}(typeof self !== "undefined" && self || typeof window !== "undefined" && window);

	/**
	 * @license
	 * Copyright 2010-2021 Uil.js Authors
	 * SPDX-License-Identifier: MIT
	 */

	/**
	 * @author lth / https://github.com/lo-th
	 */
	// INTENAL FUNCTION
	const R = {
		ui: [],
		dom: null,
		ID: null,
		lock: false,
		wlock: false,
		current: -1,
		needReZone: true,
		isEventsInit: false,
		isLeave: false,
		downTime: 0,
		prevTime: 0,
		prevDefault: ['contextmenu', 'wheel'],
		pointerEvent: ['pointerdown', 'pointermove', 'pointerup'],
		eventOut: ['pointercancel', 'pointerout', 'pointerleave'],
		xmlserializer: null,
		tmpTime: null,
		tmpImage: null,
		oldCursor: 'auto',
		input: null,
		parent: null,
		firstImput: true,
		hiddenImput: null,
		hiddenSizer: null,
		hasFocus: false,
		startInput: false,
		inputRange: [0, 0],
		cursorId: 0,
		str: '',
		pos: 0,
		startX: -1,
		moveX: -1,
		debugInput: false,
		isLoop: false,
		listens: [],
		e: {
			type: null,
			clientX: 0,
			clientY: 0,
			keyCode: NaN,
			key: null,
			delta: 0
		},
		isMobile: false,
		now: null,
		getTime: function () {
			return self.performance && self.performance.now ? self.performance.now.bind(performance) : Date.now;
		},
		add: function (o) {
			R.ui.push(o);
			R.getZone(o);
			if (!R.isEventsInit) R.initEvents();
		},
		testMobile: function () {
			let n = navigator.userAgent;
			if (n.match(/Android/i) || n.match(/webOS/i) || n.match(/iPhone/i) || n.match(/iPad/i) || n.match(/iPod/i) || n.match(/BlackBerry/i) || n.match(/Windows Phone/i)) return true;else return false;
		},
		remove: function (o) {
			let i = R.ui.indexOf(o);

			if (i !== -1) {
				R.removeListen(o);
				R.ui.splice(i, 1);
			}

			if (R.ui.length === 0) {
				R.removeEvents();
			}
		},
		// ----------------------
		//	 EVENTS
		// ----------------------
		initEvents: function () {
			if (R.isEventsInit) return;
			let dom = document.body;
			R.isMobile = R.testMobile();
			R.now = R.getTime();

			if (!R.isMobile) {
				dom.addEventListener('wheel', R, {
					passive: false
				});
			} else {
				dom.style.touchAction = 'none';
			}

			dom.addEventListener('pointercancel', R);
			dom.addEventListener('pointerleave', R); //dom.addEventListener( 'pointerout', R )

			dom.addEventListener('pointermove', R);
			dom.addEventListener('pointerdown', R);
			dom.addEventListener('pointerup', R);
			dom.addEventListener('keydown', R, false);
			dom.addEventListener('keyup', R, false);
			window.addEventListener('resize', R.resize, false); //window.onblur = R.out;
			//window.onfocus = R.in;

			R.isEventsInit = true;
			R.dom = dom;
		},
		removeEvents: function () {
			if (!R.isEventsInit) return;
			let dom = document.body;

			if (!R.isMobile) {
				dom.removeEventListener('wheel', R);
			}

			dom.removeEventListener('pointercancel', R);
			dom.removeEventListener('pointerleave', R); //dom.removeEventListener( 'pointerout', R );

			dom.removeEventListener('pointermove', R);
			dom.removeEventListener('pointerdown', R);
			dom.removeEventListener('pointerup', R);
			dom.removeEventListener('keydown', R);
			dom.removeEventListener('keyup', R);
			window.removeEventListener('resize', R.resize);
			R.isEventsInit = false;
		},
		resize: function () {
			R.needReZone = true;
			let i = R.ui.length,
					u;

			while (i--) {
				u = R.ui[i];
				if (u.isGui && !u.isCanvasOnly && u.autoResize) u.calc();
			}
		},
		out: function () {
			console.log('im am out');
			R.clearOldID();
		},
		in: function () {
			console.log('im am in'); //	R.clearOldID();
		},
		// ----------------------
		//	 HANDLE EVENTS
		// ----------------------
		fakeUp: function () {
			this.handleEvent({
				type: 'pointerup'
			});
		},
		handleEvent: function (event) {
			//if(!event.type) return;
			if (R.prevDefault.indexOf(event.type) !== -1) event.preventDefault();
			R.findZone();
			let e = R.e;
			let leave = false;
			if (event.type === 'keydown') R.keydown(event);
			if (event.type === 'keyup') R.keyup(event);
			if (event.type === 'wheel') e.delta = event.deltaY > 0 ? 1 : -1;else e.delta = 0;
			let ptype = event.pointerType; // mouse, pen, touch

			e.clientX = (ptype === 'touch' ? event.pageX : event.clientX) || 0;
			e.clientY = (ptype === 'touch' ? event.pageY : event.clientY) || 0;
			e.type = event.type;

			if (R.eventOut.indexOf(event.type) !== -1) {
				leave = true;
				e.type = 'mouseup';
			}

			if (event.type === 'pointerleave') {
				R.isLeave = true;
			}

			if (event.type === 'pointerdown') e.type = 'mousedown';
			if (event.type === 'pointerup') e.type = 'mouseup';

			if (event.type === 'pointermove') {
				if (R.isLeave) {
					// if user resize outside this document
					R.isLeave = false;
					R.resize();
				}

				e.type = 'mousemove';
			} // double click test


			if (e.type === 'mousedown') {
				R.downTime = R.now();
				let time = R.downTime - R.prevTime; // double click on imput

				if (time < 200) {
					R.selectAll();
					return false;
				}

				R.prevTime = R.downTime;
			} // for imput


			if (e.type === 'mousedown') R.clearInput(); // mouse lock

			if (e.type === 'mousedown') R.lock = true;
			if (e.type === 'mouseup') R.lock = false; //if( R.current !== null && R.current.neverlock ) R.lock = false;

			/*if( e.type === 'mousedown' && event.button === 1){
					R.cursor()
					e.preventDefault();
					e.stopPropagation();
			}*/

			if (R.isMobile && e.type === 'mousedown') R.findID(e);
			if (e.type === 'mousemove' && !R.lock) R.findID(e);

			if (R.ID !== null) {
				if (R.ID.isCanvasOnly) {
					e.clientX = R.ID.mouse.x;
					e.clientY = R.ID.mouse.y;
				}

				R.ID.handleEvent(e);
			}

			if (R.isMobile && e.type === 'mouseup') R.clearOldID();
			if (leave) R.clearOldID();
		},
		// ----------------------
		//	 ID
		// ----------------------
		findID: function (e) {
			let i = R.ui.length,
					next = -1,
					u,
					x,
					y;

			while (i--) {
				u = R.ui[i];

				if (u.isCanvasOnly) {
					x = u.mouse.x;
					y = u.mouse.y;
				} else {
					x = e.clientX;
					y = e.clientY;
				}

				if (R.onZone(u, x, y)) {
					next = i;

					if (next !== R.current) {
						R.clearOldID();
						R.current = next;
						R.ID = u;
					}

					break;
				}
			}

			if (next === -1) R.clearOldID();
		},
		clearOldID: function () {
			if (!R.ID) return;
			R.current = -1;
			R.ID.reset();
			R.ID = null;
			R.cursor();
		},
		// ----------------------
		//	 GUI / GROUP FUNCTION
		// ----------------------
		calcUis: function (uis, zone, py) {
			//console.log('calc_uis')
			let i = uis.length,
					u,
					px = 0,
					n = 0,
					tw;
			let height = 0;
			let m = 1;

			while (i--) {
				u = uis[n];
				n++;
				if (u.isGroup) u.calcUis();
				u.zone.w = u.w;
				u.zone.h = u.h;
				m = u.margin;

				if (!u.autoWidth) {
					if (px === 0) {
						height += u.h + m;
					}

					u.zone.x = zone.x + px;
					u.zone.y = py;
					tw = R.getWidth(u);
					if (tw) u.zone.w = u.w = tw; // focrce width if content is canvas
					else if (u.fw) u.zone.w = u.w = u.fw; //console.log( u.name, u.zone.w, u.w, zone, tw )
					//console.log(	tw )

					px += u.zone.w;

					if (px >= zone.w) {
						py += u.h + m;
						px = 0;
					}
				} else {
					px = 0;
					u.zone.x = zone.x;
					u.zone.y = py;
					py += u.h + m;
					height += u.h + m;
				}
			}

			return height;
		},
		findTarget: function (uis, e) {
			let i = uis.length;

			while (i--) {
				if (R.onZone(uis[i], e.clientX, e.clientY)) return i;
			}

			return -1;
		},
		// ----------------------
		//	 ZONE
		// ----------------------
		findZone: function (force) {
			if (!R.needReZone && !force) return;
			var i = R.ui.length,
					u;

			while (i--) {
				u = R.ui[i];
				R.getZone(u);
				if (u.isGui) u.calcUis();
			}

			R.needReZone = false;
		},
		onZone: function (o, x, y) {
			if (x === undefined || y === undefined) return false;
			let z = o.zone;
			let mx = x - z.x;
			let my = y - z.y;
			let over = mx >= 0 && my >= 0 && mx <= z.w && my <= z.h;
			if (over) o.local.set(mx, my);else o.local.neg();
			return over;
		},
		getWidth: function (o) {
			//return o.getDom().offsetWidth
			return o.getDom().clientWidth; //let r = o.getDom().getBoundingClientRect();
			//return (r.width)
			//return Math.floor(r.width)
		},
		getZone: function (o) {
			if (o.isCanvasOnly) return;
			let r = o.getDom().getBoundingClientRect(); //if( !r.width ) return
			//o.zone = { x:Math.floor(r.left), y:Math.floor(r.top), w:Math.floor(r.width), h:Math.floor(r.height) };
			//o.zone = { x:Math.round(r.left), y:Math.round(r.top), w:Math.round(r.width), h:Math.round(r.height) };

			o.zone = {
				x: r.left,
				y: r.top,
				w: r.width,
				h: r.height
			}; //console.log(o.name, o.zone)
		},
		// ----------------------
		//	 CURSOR
		// ----------------------
		cursor: function (name) {
			name = name ? name : 'auto';

			if (name !== R.oldCursor) {
				document.body.style.cursor = name;
				R.oldCursor = name;
			}
		},
		// ----------------------
		//	 CANVAS
		// ----------------------
		toCanvas: function (o, w, h, force) {
			if (!R.xmlserializer) R.xmlserializer = new XMLSerializer(); // prevent exesive redraw

			if (force && R.tmpTime !== null) {
				clearTimeout(R.tmpTime);
				R.tmpTime = null;
			}

			if (R.tmpTime !== null) return;
			if (R.lock) R.tmpTime = setTimeout(function () {
				R.tmpTime = null;
			}, 10); ///

			let isNewSize = false;
			if (w !== o.canvas.width || h !== o.canvas.height) isNewSize = true;
			if (R.tmpImage === null) R.tmpImage = new Image();
			let img = R.tmpImage; //new Image();

			let htmlString = R.xmlserializer.serializeToString(o.content);
			let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '"><foreignObject style="pointer-events: none; left:0;" width="100%" height="100%">' + htmlString + '</foreignObject></svg>';

			img.onload = function () {
				let ctx = o.canvas.getContext("2d");

				if (isNewSize) {
					o.canvas.width = w;
					o.canvas.height = h;
				} else {
					ctx.clearRect(0, 0, w, h);
				}

				ctx.drawImage(this, 0, 0);
				o.onDraw();
			};

			img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg); //img.src = 'data:image/svg+xml;base64,'+ window.btoa( svg );

			img.crossOrigin = '';
		},
		// ----------------------
		//	 INPUT
		// ----------------------
		setHidden: function () {
			if (R.hiddenImput === null) {
				//let css = R.parent.css.txtselect + 'padding:0; width:auto; height:auto; '
				//let css = R.parent.css.txt + 'padding:0; width:auto; height:auto; text-shadow:none;'
				//css += 'left:10px; top:auto; border:none; color:#FFF; background:#000;' + hide;
				R.hiddenImput = document.createElement('input');
				R.hiddenImput.type = 'text'; //R.hiddenImput.style.cssText = css + 'bottom:30px;' + (R.debugInput ? '' : 'transform:scale(0);');

				R.hiddenSizer = document.createElement('div'); //R.hiddenSizer.style.cssText = css + 'bottom:60px;';

				document.body.appendChild(R.hiddenImput);
				document.body.appendChild(R.hiddenSizer);
			}

			let hide = R.debugInput ? '' : 'opacity:0; zIndex:0;';
			let css = R.parent.css.txtselect + 'padding:0; width:auto; height:auto; left:10px; top:auto; color:#FFF; background:#000;' + hide;
			R.hiddenImput.style.cssText = css + 'bottom:10px;' + (R.debugInput ? '' : 'transform:scale(0);');
			R.hiddenSizer.style.cssText = css + 'bottom:40px;';
			R.hiddenImput.style.width = R.input.clientWidth + 'px';
			R.hiddenImput.value = R.str;
			R.hiddenSizer.innerHTML = R.str;
			R.hasFocus = true;
		},
		clearHidden: function (p) {
			if (R.hiddenImput === null) return;
			R.hasFocus = false;
		},
		clickPos: function (x) {
			let i = R.str.length,
					l = 0,
					n = 0;

			while (i--) {
				l += R.textWidth(R.str[n]);
				if (l >= x) break;
				n++;
			}

			return n;
		},
		upInput: function (x, down) {
			if (R.parent === null) return false;
			let up = false;

			if (down) {
				let id = R.clickPos(x);
				R.moveX = id;

				if (R.startX === -1) {
					R.startX = id;
					R.cursorId = id;
					R.inputRange = [R.startX, R.startX];
				} else {
					let isSelection = R.moveX !== R.startX;

					if (isSelection) {
						if (R.startX > R.moveX) R.inputRange = [R.moveX, R.startX];else R.inputRange = [R.startX, R.moveX];
					}
				}

				up = true;
			} else {
				if (R.startX !== -1) {
					R.hasFocus = true;
					R.hiddenImput.focus();
					R.hiddenImput.selectionStart = R.inputRange[0];
					R.hiddenImput.selectionEnd = R.inputRange[1];
					R.startX = -1;
					up = true;
				}
			}

			if (up) R.selectParent();
			return up;
		},
		selectAll: function () {
			if (!R.parent) return;
			R.str = R.input.textContent;
			R.inputRange = [0, R.str.length];
			R.hasFocus = true;
			R.hiddenImput.focus();
			R.hiddenImput.selectionStart = R.inputRange[0];
			R.hiddenImput.selectionEnd = R.inputRange[1];
			R.cursorId = R.inputRange[1];
			R.selectParent();
		},
		selectParent: function () {
			var c = R.textWidth(R.str.substring(0, R.cursorId));
			var e = R.textWidth(R.str.substring(0, R.inputRange[0]));
			var s = R.textWidth(R.str.substring(R.inputRange[0], R.inputRange[1]));
			R.parent.select(c, e, s, R.hiddenSizer.innerHTML);
		},
		textWidth: function (text) {
			if (R.hiddenSizer === null) return 0;
			text = text.replace(/ /g, '&nbsp;');
			R.hiddenSizer.innerHTML = text;
			return R.hiddenSizer.clientWidth;
		},
		clearInput: function () {
			if (R.parent === null) return;
			if (!R.firstImput) R.parent.validate(true);
			R.clearHidden();
			R.parent.unselect(); //R.input.style.background = 'none';

			R.input.style.background = R.parent.colors.back;
			R.input.style.borderColor = R.parent.colors.border; //R.input.style.color = R.parent.colors.text;

			R.parent.isEdit = false;
			R.input = null;
			R.parent = null;
			R.str = '', R.firstImput = true;
		},
		setInput: function (Input, parent) {
			R.clearInput();
			R.input = Input;
			R.parent = parent;
			R.input.style.background = R.parent.colors.backoff;
			R.input.style.borderColor = R.parent.colors.select; //R.input.style.color = R.parent.colors.textSelect;

			R.str = R.input.textContent;
			R.setHidden();
		},
		keydown: function (e) {
			if (R.parent === null) return;
			let keyCode = e.which;
			e.shiftKey; //console.log( keyCode )

			R.firstImput = false;

			if (R.hasFocus) {
				// hack to fix touch event bug in iOS Safari
				window.focus();
				R.hiddenImput.focus();
			}

			R.parent.isEdit = true; // e.preventDefault();
			// add support for Ctrl/Cmd+A selection
			//if ( keyCode === 65 && (e.ctrlKey || e.metaKey )) {
			//R.selectText();
			//e.preventDefault();
			//return self.render();
			//}

			if (keyCode === 13) {
				//enter
				R.clearInput(); //} else if( keyCode === 9 ){ //tab key
				// R.input.textContent = '';
			} else {
				if (R.input.isNum) {
					if (e.keyCode > 47 && e.keyCode < 58 || e.keyCode > 95 && e.keyCode < 106 || e.keyCode === 190 || e.keyCode === 110 || e.keyCode === 8 || e.keyCode === 109) {
						R.hiddenImput.readOnly = false;
					} else {
						R.hiddenImput.readOnly = true;
					}
				} else {
					R.hiddenImput.readOnly = false;
				}
			}
		},
		keyup: function (e) {
			if (R.parent === null) return;
			R.str = R.hiddenImput.value;
			if (R.parent.allEqual) R.parent.sameStr(R.str); // numeric samùe value
			else R.input.textContent = R.str;
			R.cursorId = R.hiddenImput.selectionStart;
			R.inputRange = [R.hiddenImput.selectionStart, R.hiddenImput.selectionEnd];
			R.selectParent(); //if( R.parent.allway ) 

			R.parent.validate();
		},
		// ----------------------
		//
		//	 LISTENING
		//
		// ----------------------
		loop: function () {
			if (R.isLoop) requestAnimationFrame(R.loop);
			R.update();
		},
		update: function () {
			let i = R.listens.length;

			while (i--) R.listens[i].listening();
		},
		removeListen: function (proto) {
			let id = R.listens.indexOf(proto);
			if (id !== -1) R.listens.splice(id, 1);
			if (R.listens.length === 0) R.isLoop = false;
		},
		addListen: function (proto) {
			let id = R.listens.indexOf(proto);
			if (id !== -1) return false;
			R.listens.push(proto);

			if (!R.isLoop) {
				R.isLoop = true;
				R.loop();
			}

			return true;
		}
	};
	const Roots = R;
	/**
	 * @author lth / https://github.com/lo-th
	 */

	const T = {
		transition: 0.2,
		frag: document.createDocumentFragment(),
		colorRing: null,
		joystick_0: null,
		joystick_1: null,
		circular: null,
		knob: null,
		pad2d: null,
		svgns: "http://www.w3.org/2000/svg",
		links: "http://www.w3.org/1999/xlink",
		htmls: "http://www.w3.org/1999/xhtml",
		DOM_SIZE: ['height', 'width', 'top', 'left', 'bottom', 'right', 'margin-left', 'margin-right', 'margin-top', 'margin-bottom'],
		SVG_TYPE_D: ['pattern', 'defs', 'transform', 'stop', 'animate', 'radialGradient', 'linearGradient', 'animateMotion', 'use', 'filter', 'feColorMatrix'],
		SVG_TYPE_G: ['svg', 'rect', 'circle', 'path', 'polygon', 'text', 'g', 'line', 'foreignObject'],
		PI: Math.PI,
		TwoPI: Math.PI * 2,
		pi90: Math.PI * 0.5,
		pi60: Math.PI / 3,
		torad: Math.PI / 180,
		todeg: 180 / Math.PI,
		clamp: function (v, min, max) {
			v = v < min ? min : v;
			v = v > max ? max : v;
			return v;
		},
		size: {
			w: 240,
			h: 20,
			p: 30,
			s: 8
		},
		// ----------------------
		//	 COLOR
		// ----------------------
		defineColor: function (o, cc = T.colors) {
			let color = { ...cc
			};
			let textChange = ['fontFamily', 'fontWeight', 'fontShadow', 'fontSize'];
			let changeText = false;
			if (o.font) o.fontFamily = o.font;
			if (o.shadow) o.fontShadow = o.shadow;
			if (o.weight) o.fontWeight = o.weight;
			if (o.fontColor) o.text = o.fontColor;
			if (o.color) o.text = o.color;

			if (o.text) {
				color.text = o.text;

				if (!o.fontColor && !o.color) {
					color.title = T.ColorLuma(o.text, -0.25);
					color.titleoff = T.ColorLuma(o.text, -0.5);
				}

				color.textOver = T.ColorLuma(o.text, 0.25);
				color.textSelect = T.ColorLuma(o.text, 0.5);
			}

			if (o.button) {
				color.button = o.button;
				color.border = T.ColorLuma(o.button, 0.1);
				color.overoff = T.ColorLuma(o.button, 0.2);
			}

			if (o.select) {
				color.select = o.select;
				color.over = T.ColorLuma(o.select, -0.1);
			}

			if (o.itemBg) o.back = o.itemBg;

			if (o.back) {
				color.back = o.back;
				color.backoff = T.ColorLuma(o.back, -0.1);
			}

			if (o.fontSelect) color.textSelect = o.fontSelect;
			if (o.groupBorder) color.gborder = o.groupBorder;
			if (o.transparent) o.bg = 'none';
			if (o.bg) color.background = color.backgroundOver = o.bg;
			if (o.bgOver) color.backgroundOver = o.bgOver;

			for (let m in color) {
				if (o[m]) color[m] = o[m];
			}

			for (let m in o) {
				if (textChange.indexOf(m) !== -1) changeText = true;
			}

			if (changeText) T.defineText(color);
			return color;
		},
		colors: {
			content: 'none',
			background: 'rgba(50,50,50,0.3)',
			backgroundOver: 'rgba(50,50,50,0.4)',
			title: '#CCC',
			titleoff: '#BBB',
			text: '#DDD',
			textOver: '#EEE',
			textSelect: '#FFF',
			//inputBg: 'rgba(0,0,0,0.25)',
			//itemBg:'rgba(0,0,0,0.25)',
			back: 'rgba(0,0,0,0.2)',
			backoff: 'rgba(0,0,0,0.3)',
			//inputOver: 'rgba(0,0,0,0.2)',
			// input and button border
			border: '#4c4c4c',
			borderSize: 1,
			gborder: 'none',
			button: '#3c3c3c',
			overoff: '#5c5c5c',
			over: '#024699',
			select: '#308AFF',
			action: '#FF3300',
			//fontFamily: 'Tahoma',
			fontFamily: 'Consolas,monaco,monospace',
			fontWeight: 'normal',
			fontShadow: '#000',
			fontSize: 12,
			radius: 4,
			hide: 'rgba(0,0,0,0)'
		},
		// style css
		css: {
			//unselect: '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select:none;', 
			basic: 'position:absolute; pointer-events:none; box-sizing:border-box; margin:0; padding:0; overflow:hidden; ' + '-o-user-select:none; -ms-user-select:none; -khtml-user-select:none; -webkit-user-select:none; -moz-user-select:none;',
			button: 'display:flex; justify-content:center; align-items:center; text-align:center;'
			/*txt: T.css.basic + 'font-family:'+ T.colors.fontFamily +'; font-size:'+T.colors.fontSize+'px; color:'+T.colors.text+'; padding:2px 10px; left:0; top:2px; height:16px; width:100px; overflow:hidden; white-space: nowrap;',
			txtselect:	T.css.txt + 'display:flex; justify-content:left; align-items:center; text-align:left;' +'padding:2px 5px; border:1px dashed ' + T.colors.border + '; background:'+ T.colors.txtselectbg+';',
			item: T.css.txt + 'position:relative; background:rgba(0,0,0,0.2); margin-bottom:1px;',*/

		},
		// svg path
		svgs: {
			group: 'M 7 7 L 7 8 8 8 8 7 7 7 M 5 7 L 5 8 6 8 6 7 5 7 M 3 7 L 3 8 4 8 4 7 3 7 M 7 5 L 7 6 8 6 8 5 7 5 M 6 6 L 6 5 5 5 5 6 6 6 M 7 3 L 7 4 8 4 8 3 7 3 M 6 4 L 6 3 5 3 5 4 6 4 M 3 5 L 3 6 4 6 4 5 3 5 M 3 3 L 3 4 4 4 4 3 3 3 Z',
			arrow: 'M 3 8 L 8 5 3 2 3 8 Z',
			arrowDown: 'M 5 8 L 8 3 2 3 5 8 Z',
			arrowUp: 'M 5 2 L 2 7 8 7 5 2 Z',
			solid: 'M 13 10 L 13 1 4 1 1 4 1 13 10 13 13 10 M 11 3 L 11 9 9 11 3 11 3 5 5 3 11 3 Z',
			body: 'M 13 10 L 13 1 4 1 1 4 1 13 10 13 13 10 M 11 3 L 11 9 9 11 3 11 3 5 5 3 11 3 M 5 4 L 4 5 4 10 9 10 10 9 10 4 5 4 Z',
			vehicle: 'M 13 6 L 11 1 3 1 1 6 1 13 3 13 3 11 11 11 11 13 13 13 13 6 M 2.4 6 L 4 2 10 2 11.6 6 2.4 6 M 12 8 L 12 10 10 10 10 8 12 8 M 4 8 L 4 10 2 10 2 8 4 8 Z',
			articulation: 'M 13 9 L 12 9 9 2 9 1 5 1 5 2 2 9 1 9 1 13 5 13 5 9 4 9 6 5 8 5 10 9 9 9 9 13 13 13 13 9 Z',
			character: 'M 13 4 L 12 3 9 4 5 4 2 3 1 4 5 6 5 8 4 13 6 13 7 9 8 13 10 13 9 8 9 6 13 4 M 6 1 L 6 3 8 3 8 1 6 1 Z',
			terrain: 'M 13 8 L 12 7 Q 9.06 -3.67 5.95 4.85 4.04 3.27 2 7 L 1 8 7 13 13 8 M 3 8 Q 3.78 5.420 5.4 6.6 5.20 7.25 5 8 L 7 8 Q 8.39 -0.16 11 8 L 7 11 3 8 Z',
			joint: 'M 7.7 7.7 Q 8 7.45 8 7 8 6.6 7.7 6.3 7.45 6 7 6 6.6 6 6.3 6.3 6 6.6 6 7 6 7.45 6.3 7.7 6.6 8 7 8 7.45 8 7.7 7.7 M 3.35 8.65 L 1 11 3 13 5.35 10.65 Q 6.1 11 7 11 8.28 11 9.25 10.25 L 7.8 8.8 Q 7.45 9 7 9 6.15 9 5.55 8.4 5 7.85 5 7 5 6.54 5.15 6.15 L 3.7 4.7 Q 3 5.712 3 7 3 7.9 3.35 8.65 M 10.25 9.25 Q 11 8.28 11 7 11 6.1 10.65 5.35 L 13 3 11 1 8.65 3.35 Q 7.9 3 7 3 5.7 3 4.7 3.7 L 6.15 5.15 Q 6.54 5 7 5 7.85 5 8.4 5.55 9 6.15 9 7 9 7.45 8.8 7.8 L 10.25 9.25 Z',
			ray: 'M 9 11 L 5 11 5 12 9 12 9 11 M 12 5 L 11 5 11 9 12 9 12 5 M 11.5 10 Q 10.9 10 10.45 10.45 10 10.9 10 11.5 10 12.2 10.45 12.55 10.9 13 11.5 13 12.2 13 12.55 12.55 13 12.2 13 11.5 13 10.9 12.55 10.45 12.2 10 11.5 10 M 9 10 L 10 9 2 1 1 2 9 10 Z',
			collision: 'M 11 12 L 13 10 10 7 13 4 11 2 7.5 5.5 9 7 7.5 8.5 11 12 M 3 2 L 1 4 4 7 1 10 3 12 8 7 3 2 Z',
			map: 'M 13 1 L 1 1 1 13 13 13 13 1 M 12 2 L 12 7 7 7 7 12 2 12 2 7 7 7 7 2 12 2 Z',
			material: 'M 13 1 L 1 1 1 13 13 13 13 1 M 12 2 L 12 7 7 7 7 12 2 12 2 7 7 7 7 2 12 2 Z',
			texture: 'M 13 4 L 13 1 1 1 1 4 5 4 5 13 9 13 9 4 13 4 Z',
			object: 'M 10 1 L 7 4 4 1 1 1 1 13 4 13 4 5 7 8 10 5 10 13 13 13 13 1 10 1 Z',
			none: 'M 9 5 L 5 5 5 9 9 9 9 5 Z',
			cursor: 'M 4 7 L 1 10 1 12 2 13 4 13 7 10 9 14 14 0 0 5 4 7 Z'
		},
		getImput: function () {
			return Roots.input ? true : false;
		},
		setStyle: function (data) {
			for (var o in data) {
				if (T.colors[o]) T.colors[o] = data[o];
			}

			T.setText();
		},
		// ----------------------
		// custom text
		// ----------------------
		defineText: function (o) {
			T.setText(o.fontSize, o.text, o.fontFamily, o.fontShadow, o.fontWeight);
		},
		setText: function (size, color, font, shadow, weight) {
			let cc = T.colors;
			if (font === undefined) font = cc.fontFamily;
			if (size === undefined) size = cc.fontSize;
			if (shadow === undefined) shadow = cc.fontShadow;
			if (weight === undefined) weight = cc.fontWeight;
			let align = 'display:flex; justify-content:left; align-items:center; text-align:left;';
			T.css.txt = T.css.basic + align + 'font-family:' + font + '; font-weight:' + weight + '; font-size:' + size + 'px; color:' + cc.text + '; padding:0px 10px; left:0; top:2px; height:16px; width:100px; overflow:hidden; white-space: nowrap;';
			if (shadow !== 'none') T.css.txt += ' text-shadow: 1px 1px 1px ' + shadow + ';';
			T.css.txtselect = T.css.txt + 'padding:0px 4px; border:1px dashed ' + cc.border + ';'; //T.css.item = T.css.txt + ' position:relative; margin-bottom:1px; '//display:block; padding:4px 4px;';//

			T.css.item = T.css.txt + ' position:relative; margin-bottom:1px; display:block; padding:2px 4px;'; //
		},
		// note
		//https://developer.mozilla.org/fr/docs/Web/CSS/css_flexible_box_layout/aligning_items_in_a_flex_container

		/*cloneColor: function () {
					let cc = Object.assign({}, T.colors );
				return cc;
			},*/
		// intern function
		cloneCss: function () {
			//let cc = Object.assign({}, T.css );
			return { ...T.css
			};
		},
		clone: function (o) {
			return o.cloneNode(true);
		},
		setSvg: function (dom, type, value, id, id2) {
			if (id === -1) dom.setAttributeNS(null, type, value);else if (id2 !== undefined) dom.childNodes[id || 0].childNodes[id2 || 0].setAttributeNS(null, type, value);else dom.childNodes[id || 0].setAttributeNS(null, type, value);
		},
		setCss: function (dom, css) {
			for (let r in css) {
				if (T.DOM_SIZE.indexOf(r) !== -1) dom.style[r] = css[r] + 'px';else dom.style[r] = css[r];
			}
		},
		set: function (g, o) {
			for (let att in o) {
				if (att === 'txt') g.textContent = o[att];
				if (att === 'link') g.setAttributeNS(T.links, 'xlink:href', o[att]);else g.setAttributeNS(null, att, o[att]);
			}
		},
		get: function (dom, id) {
			if (id === undefined) return dom; // root
			else if (!isNaN(id)) return dom.childNodes[id]; // first child
			else if (id instanceof Array) {
				if (id.length === 2) return dom.childNodes[id[0]].childNodes[id[1]];
				if (id.length === 3) return dom.childNodes[id[0]].childNodes[id[1]].childNodes[id[2]];
			}
		},
		dom: function (type, css, obj, dom, id) {
			type = type || 'div';

			if (T.SVG_TYPE_D.indexOf(type) !== -1 || T.SVG_TYPE_G.indexOf(type) !== -1) {
				// is svg element
				if (type === 'svg') {
					dom = document.createElementNS(T.svgns, 'svg');
					T.set(dom, obj);
					/*	} else if ( type === 'use' ) {
									dom = document.createElementNS( T.svgns, 'use' );
								T.set( dom, obj );
					*/
				} else {
					// create new svg if not def
					if (dom === undefined) dom = document.createElementNS(T.svgns, 'svg');
					T.addAttributes(dom, type, obj, id);
				}
			} else {
				// is html element
				if (dom === undefined) dom = document.createElementNS(T.htmls, type);else dom = dom.appendChild(document.createElementNS(T.htmls, type));
			}

			if (css) dom.style.cssText = css;
			if (id === undefined) return dom;else return dom.childNodes[id || 0];
		},
		addAttributes: function (dom, type, o, id) {
			let g = document.createElementNS(T.svgns, type);
			T.set(g, o);
			T.get(dom, id).appendChild(g);
			if (T.SVG_TYPE_G.indexOf(type) !== -1) g.style.pointerEvents = 'none';
			return g;
		},
		clear: function (dom) {
			T.purge(dom);

			while (dom.firstChild) {
				if (dom.firstChild.firstChild) T.clear(dom.firstChild);
				dom.removeChild(dom.firstChild);
			}
		},
		purge: function (dom) {
			let a = dom.attributes,
					i,
					n;

			if (a) {
				i = a.length;

				while (i--) {
					n = a[i].name;
					if (typeof dom[n] === 'function') dom[n] = null;
				}
			}

			a = dom.childNodes;

			if (a) {
				i = a.length;

				while (i--) {
					T.purge(dom.childNodes[i]);
				}
			}
		},
		// ----------------------
		//	 SVG Effects function
		// ----------------------
		addSVGGlowEffect: function () {
			if (document.getElementById('UILGlow') !== null) return;
			let svgFilter = T.initUILEffects();
			let filter = T.addAttributes(svgFilter, 'filter', {
				id: 'UILGlow',
				x: '-20%',
				y: '-20%',
				width: '140%',
				height: '140%'
			});
			T.addAttributes(filter, 'feGaussianBlur', {
				in: 'SourceGraphic',
				stdDeviation: '3',
				result: 'uilBlur'
			});
			let feMerge = T.addAttributes(filter, 'feMerge', {});

			for (let i = 0; i <= 3; i++) {
				T.addAttributes(feMerge, 'feMergeNode', {
					in: 'uilBlur'
				});
			}

			T.addAttributes(feMerge, 'feMergeNode', {
				in: 'SourceGraphic'
			});
		},
		initUILEffects: function () {
			let svgFilter = document.getElementById('UILSVGEffects');

			if (svgFilter === null) {
				svgFilter = T.dom('svg', undefined, {
					id: 'UILSVGEffects',
					width: '0',
					height: '0'
				});
				document.body.appendChild(svgFilter);
			}

			return svgFilter;
		},
		// ----------------------
		//	 Color function
		// ----------------------
		ColorLuma: function (hex, l) {
			if (hex === 'n') hex = '#000'; // validate hex string

			hex = String(hex).replace(/[^0-9a-f]/gi, '');

			if (hex.length < 6) {
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}

			l = l || 0; // convert to decimal and change luminosity

			let rgb = "#",
					c,
					i;

			for (i = 0; i < 3; i++) {
				c = parseInt(hex.substr(i * 2, 2), 16);
				c = Math.round(Math.min(Math.max(0, c + c * l), 255)).toString(16);
				rgb += ("00" + c).substr(c.length);
			}

			return rgb;
		},
		findDeepInver: function (c) {
			return c[0] * 0.3 + c[1] * .59 + c[2] * .11 <= 0.6;
		},
		lerpColor: function (c1, c2, factor) {
			let newColor = {};

			for (let i = 0; i < 3; i++) {
				newColor[i] = c1[i] + (c2[i] - c1[i]) * factor;
			}

			return newColor;
		},
		hexToHtml: function (v) {
			v = v === undefined ? 0x000000 : v;
			return "#" + ("000000" + v.toString(16)).substr(-6);
		},
		htmlToHex: function (v) {
			return v.toUpperCase().replace("#", "0x");
		},
		u255: function (c, i) {
			return parseInt(c.substring(i, i + 2), 16) / 255;
		},
		u16: function (c, i) {
			return parseInt(c.substring(i, i + 1), 16) / 15;
		},
		unpack: function (c) {
			if (c.length == 7) return [T.u255(c, 1), T.u255(c, 3), T.u255(c, 5)];else if (c.length == 4) return [T.u16(c, 1), T.u16(c, 2), T.u16(c, 3)];
		},
		p255: function (c) {
			let h = Math.round(c * 255).toString(16);
			if (h.length < 2) h = '0' + h;
			return h;
		},
		pack: function (c) {
			return '#' + T.p255(c[0]) + T.p255(c[1]) + T.p255(c[2]);
		},
		htmlRgb: function (c) {
			return 'rgb(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ')';
		},
		pad: function (n) {
			if (n.length == 1) n = '0' + n;
			return n;
		},
		rgbToHex: function (c) {
			let r = Math.round(c[0] * 255).toString(16);
			let g = Math.round(c[1] * 255).toString(16);
			let b = Math.round(c[2] * 255).toString(16);
			return '#' + T.pad(r) + T.pad(g) + T.pad(b); // return '#' + ( '000000' + ( ( c[0] * 255 ) << 16 ^ ( c[1] * 255 ) << 8 ^ ( c[2] * 255 ) << 0 ).toString( 16 ) ).slice( - 6 );
		},
		hueToRgb: function (p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
			return p;
		},
		rgbToHsl: function (c) {
			let r = c[0],
					g = c[1],
					b = c[2],
					min = Math.min(r, g, b),
					max = Math.max(r, g, b),
					delta = max - min,
					h = 0,
					s = 0,
					l = (min + max) / 2;
			if (l > 0 && l < 1) s = delta / (l < 0.5 ? 2 * l : 2 - 2 * l);

			if (delta > 0) {
				if (max == r && max != g) h += (g - b) / delta;
				if (max == g && max != b) h += 2 + (b - r) / delta;
				if (max == b && max != r) h += 4 + (r - g) / delta;
				h /= 6;
			}

			return [h, s, l];
		},
		hslToRgb: function (c) {
			let p,
					q,
					h = c[0],
					s = c[1],
					l = c[2];
			if (s === 0) return [l, l, l];else {
				q = l <= 0.5 ? l * (s + 1) : l + s - l * s;
				p = l * 2 - q;
				return [T.hueToRgb(p, q, h + 0.33333), T.hueToRgb(p, q, h), T.hueToRgb(p, q, h - 0.33333)];
			}
		},
		// ----------------------
		//	 SVG MODEL
		// ----------------------
		makeGradiant: function (type, settings, parent, colors) {
			T.dom(type, null, settings, parent, 0);
			let n = parent.childNodes[0].childNodes.length - 1,
					c;

			for (let i = 0; i < colors.length; i++) {
				c = colors[i]; //T.dom( 'stop', null, { offset:c[0]+'%', style:'stop-color:'+c[1]+'; stop-opacity:'+c[2]+';' }, parent, [0,n] );

				T.dom('stop', null, {
					offset: c[0] + '%',
					'stop-color': c[1],
					'stop-opacity': c[2]
				}, parent, [0, n]);
			}
		},

		/*makeGraph: function () {
					let w = 128;
				let radius = 34;
				let svg = T.dom( 'svg', T.css.basic , { viewBox:'0 0 '+w+' '+w, width:w, height:w, preserveAspectRatio:'none' } );
				T.dom( 'path', '', { d:'', stroke:T.colors.text, 'stroke-width':4, fill:'none', 'stroke-linecap':'butt' }, svg );//0
				//T.dom( 'rect', '', { x:10, y:10, width:108, height:108, stroke:'rgba(0,0,0,0.3)', 'stroke-width':2 , fill:'none'}, svg );//1
				//T.dom( 'circle', '', { cx:64, cy:64, r:radius, fill:T.colors.button, stroke:'rgba(0,0,0,0.3)', 'stroke-width':8 }, svg );//0
				
				//T.dom( 'circle', '', { cx:64, cy:64, r:radius+7, stroke:'rgba(0,0,0,0.3)', 'stroke-width':7 , fill:'none'}, svg );//2
				//T.dom( 'path', '', { d:'', stroke:'rgba(255,255,255,0.3)', 'stroke-width':2, fill:'none', 'stroke-linecap':'round', 'stroke-opacity':0.5 }, svg );//3
				T.graph = svg;
			},*/
		makePad: function (model) {
			let ww = 256;
			let svg = T.dom('svg', T.css.basic + 'position:relative;', {
				viewBox: '0 0 ' + ww + ' ' + ww,
				width: ww,
				height: ww,
				preserveAspectRatio: 'none'
			});
			let w = 200;
			let d = (ww - w) * 0.5,
					m = 20;
			Tools$1.dom('rect', '', {
				x: d,
				y: d,
				width: w,
				height: w,
				fill: T.colors.back
			}, svg); // 0

			Tools$1.dom('rect', '', {
				x: d + m * 0.5,
				y: d + m * 0.5,
				width: w - m,
				height: w - m,
				fill: T.colors.button
			}, svg); // 1
			// Pointer

			Tools$1.dom('line', '', {
				x1: d + m * 0.5,
				y1: ww * 0.5,
				x2: d + (w - m * 0.5),
				y2: ww * 0.5,
				stroke: T.colors.back,
				'stroke-width': 2
			}, svg); // 2

			Tools$1.dom('line', '', {
				x1: ww * 0.5,
				x2: ww * 0.5,
				y1: d + m * 0.5,
				y2: d + (w - m * 0.5),
				stroke: T.colors.back,
				'stroke-width': 2
			}, svg); // 3

			Tools$1.dom('circle', '', {
				cx: ww * 0.5,
				cy: ww * 0.5,
				r: 5,
				stroke: T.colors.text,
				'stroke-width': 5,
				fill: 'none'
			}, svg); // 4

			T.pad2d = svg;
		},
		makeKnob: function (model) {
			let w = 128;
			let radius = 34;
			let svg = T.dom('svg', T.css.basic + 'position:relative;', {
				viewBox: '0 0 ' + w + ' ' + w,
				width: w,
				height: w,
				preserveAspectRatio: 'none'
			});
			T.dom('circle', '', {
				cx: 64,
				cy: 64,
				r: radius,
				fill: T.colors.button,
				stroke: 'rgba(0,0,0,0.3)',
				'stroke-width': 8
			}, svg); //0

			T.dom('path', '', {
				d: '',
				stroke: T.colors.text,
				'stroke-width': 4,
				fill: 'none',
				'stroke-linecap': 'round'
			}, svg); //1

			T.dom('circle', '', {
				cx: 64,
				cy: 64,
				r: radius + 7,
				stroke: 'rgba(0,0,0,0.1)',
				'stroke-width': 7,
				fill: 'none'
			}, svg); //2

			T.dom('path', '', {
				d: '',
				stroke: 'rgba(255,255,255,0.3)',
				'stroke-width': 2,
				fill: 'none',
				'stroke-linecap': 'round',
				'stroke-opacity': 0.5
			}, svg); //3

			T.knob = svg;
		},
		makeCircular: function (model) {
			let w = 128;
			let radius = 40;
			let svg = T.dom('svg', T.css.basic + 'position:relative;', {
				viewBox: '0 0 ' + w + ' ' + w,
				width: w,
				height: w,
				preserveAspectRatio: 'none'
			});
			T.dom('circle', '', {
				cx: 64,
				cy: 64,
				r: radius,
				stroke: 'rgba(0,0,0,0.1)',
				'stroke-width': 10,
				fill: 'none'
			}, svg); //0

			T.dom('path', '', {
				d: '',
				stroke: T.colors.text,
				'stroke-width': 7,
				fill: 'none',
				'stroke-linecap': 'butt'
			}, svg); //1

			T.circular = svg;
		},
		makeJoystick: function (model) {
			//+' background:#f00;'
			let w = 128,
					ccc;
			let radius = Math.floor((w - 30) * 0.5);
			let innerRadius = Math.floor(radius * 0.6);
			let svg = T.dom('svg', T.css.basic + 'position:relative;', {
				viewBox: '0 0 ' + w + ' ' + w,
				width: w,
				height: w,
				preserveAspectRatio: 'none'
			});
			T.dom('defs', null, {}, svg);
			T.dom('g', null, {}, svg);

			if (model === 0) {
				// gradian background
				ccc = [[40, 'rgb(0,0,0)', 0.3], [80, 'rgb(0,0,0)', 0], [90, 'rgb(50,50,50)', 0.4], [100, 'rgb(50,50,50)', 0]];
				T.makeGradiant('radialGradient', {
					id: 'grad',
					cx: '50%',
					cy: '50%',
					r: '50%',
					fx: '50%',
					fy: '50%'
				}, svg, ccc); // gradian shadow

				ccc = [[60, 'rgb(0,0,0)', 0.5], [100, 'rgb(0,0,0)', 0]];
				T.makeGradiant('radialGradient', {
					id: 'gradS',
					cx: '50%',
					cy: '50%',
					r: '50%',
					fx: '50%',
					fy: '50%'
				}, svg, ccc); // gradian stick

				let cc0 = ['rgb(40,40,40)', 'rgb(48,48,48)', 'rgb(30,30,30)'];
				let cc1 = ['rgb(1,90,197)', 'rgb(3,95,207)', 'rgb(0,65,167)'];
				ccc = [[30, cc0[0], 1], [60, cc0[1], 1], [80, cc0[1], 1], [100, cc0[2], 1]];
				T.makeGradiant('radialGradient', {
					id: 'gradIn',
					cx: '50%',
					cy: '50%',
					r: '50%',
					fx: '50%',
					fy: '50%'
				}, svg, ccc);
				ccc = [[30, cc1[0], 1], [60, cc1[1], 1], [80, cc1[1], 1], [100, cc1[2], 1]];
				T.makeGradiant('radialGradient', {
					id: 'gradIn2',
					cx: '50%',
					cy: '50%',
					r: '50%',
					fx: '50%',
					fy: '50%'
				}, svg, ccc); // graph

				T.dom('circle', '', {
					cx: 64,
					cy: 64,
					r: radius,
					fill: 'url(#grad)'
				}, svg); //2

				T.dom('circle', '', {
					cx: 64 + 5,
					cy: 64 + 10,
					r: innerRadius + 10,
					fill: 'url(#gradS)'
				}, svg); //3

				T.dom('circle', '', {
					cx: 64,
					cy: 64,
					r: innerRadius,
					fill: 'url(#gradIn)'
				}, svg); //4

				T.joystick_0 = svg;
			} else {
				// gradian shadow
				ccc = [[69, 'rgb(0,0,0)', 0], [70, 'rgb(0,0,0)', 0.3], [100, 'rgb(0,0,0)', 0]];
				T.makeGradiant('radialGradient', {
					id: 'gradX',
					cx: '50%',
					cy: '50%',
					r: '50%',
					fx: '50%',
					fy: '50%'
				}, svg, ccc);
				T.dom('circle', '', {
					cx: 64,
					cy: 64,
					r: radius,
					fill: 'none',
					stroke: 'rgba(100,100,100,0.25)',
					'stroke-width': '4'
				}, svg); //2

				T.dom('circle', '', {
					cx: 64,
					cy: 64,
					r: innerRadius + 14,
					fill: 'url(#gradX)'
				}, svg); //3

				T.dom('circle', '', {
					cx: 64,
					cy: 64,
					r: innerRadius,
					fill: 'none',
					stroke: 'rgb(100,100,100)',
					'stroke-width': '4'
				}, svg); //4

				T.joystick_1 = svg;
			}
		},
		makeColorRing: function () {
			let w = 256;
			let svg = T.dom('svg', T.css.basic + 'position:relative;', {
				viewBox: '0 0 ' + w + ' ' + w,
				width: w,
				height: w,
				preserveAspectRatio: 'none'
			});
			T.dom('defs', null, {}, svg);
			T.dom('g', null, {}, svg);
			let s = 30; //stroke

			let r = (w - s) * 0.5;
			let mid = w * 0.5;
			let n = 24,
					nudge = 8 / r / n * Math.PI,
					a1 = 0;
			let am, tan, d2, a2, ar, i, j, path, ccc;
			let color = [];

			for (i = 0; i <= n; ++i) {
				d2 = i / n;
				a2 = d2 * T.TwoPI;
				am = (a1 + a2) * 0.5;
				tan = 1 / Math.cos((a2 - a1) * 0.5);
				ar = [Math.sin(a1), -Math.cos(a1), Math.sin(am) * tan, -Math.cos(am) * tan, Math.sin(a2), -Math.cos(a2)];
				color[1] = T.rgbToHex(T.hslToRgb([d2, 1, 0.5]));

				if (i > 0) {
					j = 6;

					while (j--) {
						ar[j] = (ar[j] * r + mid).toFixed(2);
					}

					path = ' M' + ar[0] + ' ' + ar[1] + ' Q' + ar[2] + ' ' + ar[3] + ' ' + ar[4] + ' ' + ar[5];
					ccc = [[0, color[0], 1], [100, color[1], 1]];
					T.makeGradiant('linearGradient', {
						id: 'G' + i,
						x1: ar[0],
						y1: ar[1],
						x2: ar[4],
						y2: ar[5],
						gradientUnits: "userSpaceOnUse"
					}, svg, ccc);
					T.dom('path', '', {
						d: path,
						'stroke-width': s,
						stroke: 'url(#G' + i + ')',
						'stroke-linecap': "butt"
					}, svg, 1);
				}

				a1 = a2 - nudge;
				color[0] = color[1];
			}

			let tw = 84.90; // black / white

			ccc = [[0, '#FFFFFF', 1], [50, '#FFFFFF', 0], [50, '#000000', 0], [100, '#000000', 1]];
			T.makeGradiant('linearGradient', {
				id: 'GL0',
				x1: 0,
				y1: mid - tw,
				x2: 0,
				y2: mid + tw,
				gradientUnits: "userSpaceOnUse"
			}, svg, ccc);
			ccc = [[0, '#7f7f7f', 1], [50, '#7f7f7f', 0.5], [100, '#7f7f7f', 0]];
			T.makeGradiant('linearGradient', {
				id: 'GL1',
				x1: mid - 49.05,
				y1: 0,
				x2: mid + 98,
				y2: 0,
				gradientUnits: "userSpaceOnUse"
			}, svg, ccc);
			T.dom('g', null, {
				'transform-origin': '128px 128px',
				'transform': 'rotate(0)'
			}, svg); //2

			T.dom('polygon', '', {
				points: '78.95 43.1 78.95 212.85 226 128',
				fill: 'red'
			}, svg, 2); // 2,0

			T.dom('polygon', '', {
				points: '78.95 43.1 78.95 212.85 226 128',
				fill: 'url(#GL1)',
				'stroke-width': 1,
				stroke: 'url(#GL1)'
			}, svg, 2); //2,1

			T.dom('polygon', '', {
				points: '78.95 43.1 78.95 212.85 226 128',
				fill: 'url(#GL0)',
				'stroke-width': 1,
				stroke: 'url(#GL0)'
			}, svg, 2); //2,2

			T.dom('path', '', {
				d: 'M 255.75 136.5 Q 256 132.3 256 128 256 123.7 255.75 119.5 L 241 128 255.75 136.5 Z',
				fill: 'none',
				'stroke-width': 2,
				stroke: '#000'
			}, svg, 2); //2,3
			//T.dom( 'circle', '', { cx:128+113, cy:128, r:6, 'stroke-width':3, stroke:'#000', fill:'none' }, svg, 2 );//2.3

			T.dom('circle', '', {
				cx: 128,
				cy: 128,
				r: 6,
				'stroke-width': 2,
				stroke: '#000',
				fill: 'none'
			}, svg); //3

			T.colorRing = svg;
		},
		icon: function (type, color, w) {
			w = w || 40; //color = color || '#DEDEDE';

			let viewBox = '0 0 256 256'; //let viewBox = '0 0 '+ w +' '+ w;

			let t = ["<svg xmlns='" + T.svgns + "' version='1.1' xmlns:xlink='" + T.htmls + "' style='pointer-events:none;' preserveAspectRatio='xMinYMax meet' x='0px' y='0px' width='" + w + "px' height='" + w + "px' viewBox='" + viewBox + "'><g>"];

			switch (type) {
				case 'logo':
					t[1] = "<path id='logoin' fill='" + color + "' stroke='none' d='" + T.logoFill_d + "'/>";
					break;

				case 'donate':
					t[1] = "<path id='logoin' fill='" + color + "' stroke='none' d='" + T.logo_donate + "'/>";
					break;

				case 'neo':
					t[1] = "<path id='logoin' fill='" + color + "' stroke='none' d='" + T.logo_neo + "'/>";
					break;

				case 'github':
					t[1] = "<path id='logoin' fill='" + color + "' stroke='none' d='" + T.logo_github + "'/>";
					break;

				case 'save':
					t[1] = "<path stroke='" + color + "' stroke-width='4' stroke-linejoin='round' stroke-linecap='round' fill='none' d='M 26.125 17 L 20 22.95 14.05 17 M 20 9.95 L 20 22.95'/><path stroke='" + color;
					t[1] += "' stroke-width='2.5' stroke-linejoin='round' stroke-linecap='round' fill='none' d='M 32.6 23 L 32.6 25.5 Q 32.6 28.5 29.6 28.5 L 10.6 28.5 Q 7.6 28.5 7.6 25.5 L 7.6 23'/>";
					break;
			}

			t[2] = "</g></svg>";
			return t.join("\n");
		},
		logoFill_d: `
		M 171 150.75 L 171 33.25 155.5 33.25 155.5 150.75 Q 155.5 162.2 147.45 170.2 139.45 178.25 128 178.25 116.6 178.25 108.55 170.2 100.5 162.2 100.5 150.75 
		L 100.5 33.25 85 33.25 85 150.75 Q 85 168.65 97.55 181.15 110.15 193.75 128 193.75 145.9 193.75 158.4 181.15 171 168.65 171 150.75 
		M 200 33.25 L 184 33.25 184 150.8 Q 184 174.1 167.6 190.4 151.3 206.8 128 206.8 104.75 206.8 88.3 190.4 72 174.1 72 150.8 L 72 33.25 56 33.25 56 150.75 
		Q 56 180.55 77.05 201.6 98.2 222.75 128 222.75 157.8 222.75 178.9 201.6 200 180.55 200 150.75 L 200 33.25 Z
		`,
		logo_github: `
		M 180.5 70 Q 186.3 82.4 181.55 96.55 196.5 111.5 189.7 140.65 183.65 168.35 146 172.7 152.5 178.7 152.55 185.9 L 152.55 218.15 Q 152.84 224.56 159.15 223.3 
		159.21 223.3 159.25 223.3 181.14 216.25 198.7 198.7 228 169.4 228 128 228 86.6 198.7 57.3 169.4 28 128 28 86.6 28 57.3 57.3 28 86.6 28 128 28 169.4 57.3 198.7 74.85 
		216.25 96.75 223.3 96.78 223.3 96.8 223.3 103.16 224.54 103.45 218.15 L 103.45 200 Q 82.97 203.1 75.1 196.35 69.85 191.65 68.4 185.45 64.27 177.055 59.4 174.15 49.20 
		166.87 60.8 167.8 69.85 169.61 75.7 180 81.13 188.09 90 188.55 98.18 188.86 103.45 185.9 103.49 178.67 110 172.7 72.33 168.33 66.3 140.65 59.48 111.49 74.45 96.55 69.7 
		82.41 75.5 70 84.87 68.74 103.15 80 115.125 76.635 128 76.85 140.85 76.65 152.85 80 171.1 68.75 180.5 70 Z
		`,
		logo_neo: `
		M 219 52 L 206 52 206 166 Q 206 183.4 193.75 195.65 181.4 208 164 208 146.6 208 134.35 195.65 122 183.4 122 166 L 122 90 Q 122 77.6 113.15 68.85 104.4 60 92 60 79.55 
		60 70.75 68.85 62 77.6 62 90 L 62 204 75 204 75 90 Q 75 83 79.95 78 84.95 73 92 73 99 73 104 78 109 83 109 90 L 109 166 Q 109 188.8 125.15 204.85 141.2 221 164 221 
		186.75 221 202.95 204.85 219 188.8 219 166 L 219 52 M 194 52 L 181 52 181 166 Q 181 173 176.05 178 171.05 183 164 183 157 183 152 178 147 173 147 166 L 147 90 Q 147 
		67.2 130.85 51.15 114.8 35 92 35 69.25 35 53.05 51.15 37 67.2 37 90 L 37 204 50 204 50 90 Q 50 72.6 62.25 60.35 74.6 48 92 48 109.4 48 121.65 60.35 134 72.6 134 90 L 
		134 166 Q 134 178.4 142.85 187.15 151.6 196 164 196 176.45 196 185.25 187.15 194 178.4 194 166 L 194 52 Z
		`,
		logo_donate: `
		M 171.3 80.3 Q 179.5 62.15 171.3 45.8 164.1 32.5 141.35 30.1 L 94.35 30.1 Q 89.35 30.4 88.3 35.15 L 70.5 148.05 Q 70.2 152.5 73.7 152.6 L 100.95 152.6 107 111.6 Q 108.75 
		106.55 112.6 106.45 130.45 108.05 145.3 103.9 163.35 98.75 171.3 80.3 M 179.8 71.5 Q 178.6 79.75 174.9 87.85 168.45 102.9 151.9 109.15 140.65 113.95 117.55 113 113.15 
		112.75 111 117.45 L 102.7 169.95 Q 102.45 173.8 105.5 173.85 L 128.95 173.85 Q 132.2 174.2 133.35 169.65 L 138.3 139.95 Q 139.75 135.6 143.1 135.5 146.6 135.75 150.6 135.65 
		154.55 135.5 157.35 135.1 160.15 134.7 166.75 132.35 181.35 127.4 187.9 111.2 194.25 95.75 189.5 81.95 186.75 74.85 179.8 71.5 M 103.5 209.9 Q 103.5 202.85 99.7 198.85 95.95 
		194.75 89.4 194.75 82.8 194.75 79.05 198.85 75.3 202.9 75.3 209.9 75.3 216.85 79.05 220.95 82.8 225.05 89.4 225.05 95.95 225.05 99.7 221 103.5 216.95 103.5 209.9 M 95.45 205.5 
		Q 95.95 207.3 95.95 209.9 95.95 212.65 95.45 214.35 94.95 216 94 217.3 93.1 218.45 91.9 219 90.7 219.55 89.4 219.55 88.15 219.55 86.95 219.05 85.75 218.55 84.8 217.3 83.9 216.15 
		83.4 214.35 82.85 212.6 82.85 209.9 82.85 207.3 83.4 205.45 83.95 203.55 84.85 202.45 85.9 201.2 86.95 200.75 88.05 200.25 89.4 200.25 90.7 200.25 91.85 200.8 93.05 201.3 94 202.5 
		94.9 203.65 95.45 205.5 M 153.3 195.35 L 145.3 195.35 135.5 224.45 142.8 224.45 144.6 218.5 153.75 218.5 155.6 224.45 163.1 224.45 153.3 195.35 M 152.15 213.25 L 146.25 213.25 
		149.2 203.65 152.15 213.25 M 116.75 195.35 L 107.8 195.35 107.8 224.45 114.5 224.45 114.5 204.2 125.7 224.45 132.75 224.45 132.75 195.35 126.05 195.35 126.05 212.05 116.75 195.35 M 
		66.5 197.65 Q 64.15 196.15 61.45 195.75 58.8 195.35 55.75 195.35 L 46.7 195.35 46.7 224.45 55.8 224.45 Q 58.8 224.45 61.5 224.05 64.15 223.6 66.4 222.15 69.15 220.45 70.9 217.2 
		72.7 214 72.7 209.95 72.7 205.7 71 202.6 69.35 199.5 66.5 197.65 M 64.2 205 Q 65.2 207 65.2 209.9 65.2 212.75 64.25 214.75 63.3 216.75 61.5 217.85 60 218.85 58.3 218.9 56.6 219 
		54.15 219 L 54 219 54 200.8 54.15 200.8 Q 56.4 200.8 58.05 200.9 59.7 200.95 61.15 201.75 63.2 202.95 64.2 205 M 210.2 195.35 L 190.5 195.35 190.5 224.45 210.2 224.45 210.2 218.9 
		197.75 218.9 197.75 211.55 209.2 211.55 209.2 206 197.75 206 197.75 200.9 210.2 200.9 210.2 195.35 M 187.5 195.35 L 163 195.35 163 200.9 171.6 200.9 171.6 224.45 178.9 224.45 178.9 
		200.9 187.5 200.9 187.5 195.35 Z
		`
	};
	T.setText();
	const Tools$1 = T; ///https://wicg.github.io/file-system-access/#api-filesystemfilehandle-getfile

	class V2 {
		constructor(x = 0, y = 0) {
			this.x = x;
			this.y = y;
		}

		set(x, y) {
			this.x = x;
			this.y = y;
			return this;
		}

		divide(v) {
			this.x /= v.x;
			this.y /= v.y;
			return this;
		}

		multiply(v) {
			this.x *= v.x;
			this.y *= v.y;
			return this;
		}

		multiplyScalar(scalar) {
			this.x *= scalar;
			this.y *= scalar;
			return this;
		}

		divideScalar(scalar) {
			return this.multiplyScalar(1 / scalar);
		}

		length() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		}

		angle() {
			// computes the angle in radians with respect to the positive x-axis
			var angle = Math.atan2(this.y, this.x);
			if (angle < 0) angle += 2 * Math.PI;
			return angle;
		}

		addScalar(s) {
			this.x += s;
			this.y += s;
			return this;
		}

		negate() {
			this.x *= -1;
			this.y *= -1;
			return this;
		}

		neg() {
			this.x = -1;
			this.y = -1;
			return this;
		}

		isZero() {
			return this.x === 0 && this.y === 0;
		}

		copy(v) {
			this.x = v.x;
			this.y = v.y;
			return this;
		}

		equals(v) {
			return v.x === this.x && v.y === this.y;
		}

		nearEquals(v, n) {
			return v.x.toFixed(n) === this.x.toFixed(n) && v.y.toFixed(n) === this.y.toFixed(n);
		}

		lerp(v, alpha) {
			if (v === null) {
				this.x -= this.x * alpha;
				this.y -= this.y * alpha;
			} else {
				this.x += (v.x - this.x) * alpha;
				this.y += (v.y - this.y) * alpha;
			}

			return this;
		}

	}
	/**
	 * @author lth / https://github.com/lo-th
	 */


	class Proto {
		constructor(o = {}) {
			// disable mouse controle
			this.lock = o.lock || false; // for button

			this.neverlock = false; // only simple space 

			this.isSpace = o.isSpace || false; // if is on gui or group

			this.main = o.main || null;
			this.isUI = o.isUI || false;
			this.group = o.group || null;
			this.isListen = false; //this.parentGroup = null;
			//if( o.select !== undefined ) o.selectable = o.select

			this.isSelectable = o.selectable !== undefined ? o.selectable : false;
			this.unselectable = o.unselect !== undefined ? o.unselect : this.isSelectable;
			this.ontop = o.ontop ? o.ontop : false; // 'beforebegin' 'afterbegin' 'beforeend' 'afterend'

			this.css = this.main ? this.main.css : Tools$1.css;
			this.colors = Tools$1.defineColor(o, this.main ? this.group ? this.group.colors : this.main.colors : Tools$1.colors);
			this.svgs = Tools$1.svgs;
			this.zone = {
				x: 0,
				y: 0,
				w: 0,
				h: 0
			};
			this.local = new V2().neg();
			this.isCanvasOnly = false;
			this.isSelect = false; // percent of title

			this.p = o.p !== undefined ? o.p : Tools$1.size.p;
			this.w = this.isUI ? this.main.size.w : Tools$1.size.w;
			if (o.w !== undefined) this.w = o.w;
			this.h = this.isUI ? this.main.size.h : Tools$1.size.h;
			if (o.h !== undefined) this.h = o.h;
			if (!this.isSpace) this.h = this.h < 11 ? 11 : this.h;else this.lock = true; // decale for canvas only

			this.fw = o.fw || 0;
			/*this.dc = 0
			if(this.isUI){
					if( this.main.isCanvasOnly && this.fw) this.dc = (this.main.zone.w - this.w)*0.5
			}*/

			this.autoWidth = o.auto || true; // auto width or flex 

			this.isOpen = false; // open statu
			// radius for toolbox

			this.radius = o.radius || this.colors.radius;
			this.transition = o.transition || Tools$1.transition; // only for number

			this.isNumber = false;
			this.noNeg = o.noNeg || false;
			this.allEqual = o.allEqual || false; // only most simple 

			this.mono = false; // stop listening for edit slide text

			this.isEdit = false; // no title 

			this.simple = o.simple || false;
			if (this.simple) this.sa = 0; // define obj size

			this.setSize(this.w); // title size

			if (o.sa !== undefined) this.sa = o.sa;
			if (o.sb !== undefined) this.sb = o.sb;
			if (this.simple) this.sb = this.w - this.sa; // last number size for slide

			this.sc = o.sc === undefined ? 47 : o.sc; // for listening object

			this.objectLink = null;
			this.isSend = false;
			this.val = null;
			this.txt = o.name || '';
			this.name = o.rename || this.txt;
			this.target = o.target || null; // callback

			this.callback = o.callback === undefined ? null : o.callback;
			this.endCallback = null;
			this.openCallback = o.openCallback === undefined ? null : o.openCallback;
			this.closeCallback = o.closeCallback === undefined ? null : o.closeCallback; // if no callback take one from group or gui

			if (this.callback === null && this.isUI && this.main.callback !== null) {
				this.callback = this.group ? this.group.callback : this.main.callback;
			} // elements


			this.c = []; // style 

			this.s = []; //this.c[0] = Tools.dom( 'div', this.css.basic + this.css.button +'align-self:stretch; position:relative; height:20px; overflow:hidden;'); //float:left;
			//this.c[0] = Tools.dom( 'div',	'order: 1;' ); //

			this.useFlex = this.isUI ? this.main.useFlex : false;
			let flexible = this.useFlex ? 'disply:flex; justify-content:center; align-items:center; text-align:center; flex: 1 100%;' : 'float:left;';
			this.c[0] = Tools$1.dom('div', this.css.basic + flexible + 'position:relative; height:20px;'); //this.c[0] = Tools.dom( 'div', this.css.basic +'position:relative; height:20px; align-self: auto;');

			this.s[0] = this.c[0].style; // bottom margin

			this.margin = o.margin || 1;

			if (this.isUI && this.margin) {
				this.s[0].boxSizing = 'content-box'; //this.s[0].marginBottom = this.margin + 'px';

				if (this.margin * 0.5 === Math.floor(this.margin * 0.5)) {
					this.s[0].borderTop = this.margin * 0.5 + 'px solid transparent';
					this.s[0].borderBottom = this.margin * 0.5 + 'px solid transparent';
				} else {
					this.s[0].borderBottom = this.margin + 'px solid transparent';
				}
			} // with title


			if (!this.simple) {
				this.c[1] = Tools$1.dom('div', this.css.txt);
				this.s[1] = this.c[1].style;
				this.c[1].textContent = this.name;
				this.s[1].color = this.lock ? this.colors.titleoff : this.colors.title;
			}

			if (o.pos) {
				this.s[0].position = 'absolute';

				for (let p in o.pos) {
					this.s[0][p] = o.pos[p];
				}

				this.mono = true;
			}

			if (o.css) this.s[0].cssText = o.css;
		} // ----------------------
		// make the node
		// ----------------------


		init() {
			this.zone.h = this.h;
			this.zone.w = this.w;
			let s = this.s; // style cache

			let c = this.c; // div cach

			s[0].height = this.h + 'px';
			if (this.isUI) s[0].background = this.colors.background;

			if (!this.autoWidth && this.useFlex) {
				s[0].flex = '1 0 auto';
				s[0].minWidth = this.minw + 'px';
				s[0].textAlign = 'center';
			} else {
				if (this.isUI) s[0].width = '100%';
			} //if( this.autoHeight ) s[0].transition = 'height 0.01s ease-out';


			if (c[1] !== undefined && this.autoWidth) {
				s[1] = c[1].style;
				s[1].height = this.h - 4 + 'px';
				s[1].lineHeight = this.h - 8 + 'px';
			}

			let frag = Tools$1.frag;

			for (let i = 1, lng = c.length; i !== lng; i++) {
				if (c[i] !== undefined) {
					frag.appendChild(c[i]);
					s[i] = c[i].style;
				}
			}

			let pp = this.target !== null ? this.target : this.isUI ? this.main.inner : document.body;
			if (this.ontop) pp.insertAdjacentElement('afterbegin', c[0]);else pp.appendChild(c[0]);
			c[0].appendChild(frag);
			this.rSize(); // ! solo proto

			if (!this.isUI) {
				this.c[0].style.pointerEvents = 'auto';
				Roots.add(this);
			}

			if (this.baseH && this.transition && this.isUI) {
				this.c[0].style.transition = 'height ' + this.transition + 's ease-out';
			}
		} // from Tools


		dom(type, css, obj, dom, id) {
			return Tools$1.dom(type, css, obj, dom, id);
		}

		setSvg(dom, type, value, id, id2) {
			Tools$1.setSvg(dom, type, value, id, id2);
		}

		setCss(dom, css) {
			Tools$1.setCss(dom, css);
		}

		clamp(value, min, max) {
			return Tools$1.clamp(value, min, max);
		}

		getColorRing() {
			if (!Tools$1.colorRing) Tools$1.makeColorRing();
			return Tools$1.clone(Tools$1.colorRing);
		}

		getJoystick(model) {
			if (!Tools$1['joystick_' + model]) Tools$1.makeJoystick(model);
			return Tools$1.clone(Tools$1['joystick_' + model]);
		}

		getCircular(model) {
			if (!Tools$1.circular) Tools$1.makeCircular(model);
			return Tools$1.clone(Tools$1.circular);
		}

		getKnob(model) {
			if (!Tools$1.knob) Tools$1.makeKnob(model);
			return Tools$1.clone(Tools$1.knob);
		}

		getPad2d(model) {
			if (!Tools$1.pad2d) Tools$1.makePad(model);
			return Tools$1.clone(Tools$1.pad2d);
		} // from Roots


		cursor(name) {
			Roots.cursor(name);
		} /////////


		update() {}

		reset() {} /////////


		getDom() {
			return this.c[0];
		}

		uiout() {
			if (this.lock) return;
			if (this.s) this.s[0].background = this.colors.background;
		}

		uiover() {
			if (this.lock) return;
			if (this.s) this.s[0].background = this.colors.backgroundOver;
		}

		rename(s) {
			if (this.c[1] !== undefined) this.c[1].textContent = s;
		}

		listen() {
			this.isListen = Roots.addListen(this);
			return this;
		}

		listening() {
			if (this.objectLink === null) return;
			if (this.isSend) return;
			if (this.isEdit) return;
			this.setValue(this.objectLink[this.val]);
		}

		setValue(v) {
			if (this.isNumber) this.value = this.numValue(v); //else if( v instanceof Array && v.length === 1 ) v = v[0];
			else this.value = v;
			this.update();
		} // ----------------------
		// update every change
		// ----------------------


		onChange(f) {
			if (this.isSpace) return;
			this.callback = f || null;
			return this;
		} // ----------------------
		// update only on end
		// ----------------------


		onFinishChange(f) {
			if (this.isSpace) return;
			this.callback = null;
			this.endCallback = f;
			return this;
		} // ----------------------
		// event on open close
		// ----------------------


		onOpen(f) {
			this.openCallback = f;
			return this;
		}

		onClose(f) {
			this.closeCallback = f;
			return this;
		} // ----------------------
		//	send back value
		// ----------------------


		send(v) {
			v = v || this.value;
			if (v instanceof Array && v.length === 1) v = v[0];
			this.isSend = true;
			if (this.objectLink !== null) this.objectLink[this.val] = v;
			if (this.callback) this.callback(v, this.val);
			this.isSend = false;
		}

		sendEnd(v) {
			v = v || this.value;
			if (v instanceof Array && v.length === 1) v = v[0];
			if (this.endCallback) this.endCallback(v);
			if (this.objectLink !== null) this.objectLink[this.val] = v;
		} // ----------------------
		// clear node
		// ----------------------


		dispose() {
			if (this.isListen) Roots.removeListen(this);
			Tools$1.clear(this.c[0]);

			if (this.target !== null) {
				if (this.group !== null) this.group.clearOne(this);else this.target.removeChild(this.c[0]);
			} else {
				if (this.isUI) this.main.clearOne(this);else document.body.removeChild(this.c[0]);
			}

			if (!this.isUI) Roots.remove(this);
			this.c = null;
			this.s = null;
			this.callback = null;
			this.target = null;
			this.isListen = false;
		}

		clear() {} // ----------------------
		// change size 
		// ----------------------


		getWidth() {
			let nw = Roots.getWidth(this);
			if (nw) this.w = nw;
		}

		setSize(sx) {
			if (!this.autoWidth) return;
			this.w = sx;

			if (this.simple) {
				this.sb = this.w - this.sa;
			} else {
				let pp = this.w * (this.p / 100);
				this.sa = Math.floor(pp + 10);
				this.sb = Math.floor(this.w - pp - 20);
			}
		}

		rSize() {
			if (!this.autoWidth) return;
			if (!this.isUI) this.s[0].width = this.w + 'px';
			if (!this.simple) this.s[1].width = this.sa + 'px';
		} // ----------------------
		// for numeric value
		// ----------------------


		setTypeNumber(o) {
			this.isNumber = true;
			this.value = 0;

			if (o.value !== undefined) {
				if (typeof o.value === 'string') this.value = o.value * 1;else this.value = o.value;
			}

			this.min = o.min === undefined ? -Infinity : o.min;
			this.max = o.max === undefined ? Infinity : o.max;
			this.precision = o.precision === undefined ? 2 : o.precision;
			let s;

			switch (this.precision) {
				case 0:
					s = 1;
					break;

				case 1:
					s = 0.1;
					break;

				case 2:
					s = 0.01;
					break;

				case 3:
					s = 0.001;
					break;

				case 4:
					s = 0.0001;
					break;

				case 5:
					s = 0.00001;
					break;
			}

			this.step = o.step === undefined ? s : o.step;
			this.range = this.max - this.min;
			this.value = this.numValue(this.value);
		}

		numValue(n) {
			if (this.noNeg) n = Math.abs(n);
			return Math.min(this.max, Math.max(this.min, n)).toFixed(this.precision) * 1;
		} // ----------------------
		//	 EVENTS DEFAULT
		// ----------------------


		handleEvent(e) {
			//if(!this.s) return false
			if (this.lock) return;
			if (this.neverlock) Roots.lock = false;
			if (!this[e.type]) return console.error(e.type, 'this type of event no existe !');
			return this[e.type](e);
		}

		wheel(e) {
			return false;
		}

		mousedown(e) {
			return false;
		}

		mousemove(e) {
			return false;
		}

		mouseup(e) {
			return false;
		}

		keydown(e) {
			return false;
		}

		keyup(e) {
			return false;
		}
		/*dragstart ( e ) { return false; }
		dragover ( e ) { return false; }
		dragenter ( e ) { return false; }
		dragleave ( e ) { return false; }
		dragend ( e ) { return false; }
		drop ( e ) { return false; }*/
		// ----------------------
		// object referency
		// ----------------------


		setReferency(obj, val) {
			this.objectLink = obj;
			this.val = val;
		}

		display(v) {
			v = v || false;
			this.s[0].visibility = v ? 'visible' : 'hidden'; //this.s[0].display = v ? (this.useFlex? 'flex':'block') : 'none'
		} // ----------------------
		// resize height 
		// ----------------------


		open() {
			if (this.isOpen) return;
			this.isOpen = true;
			if (this.openCallback) this.openCallback();
		}

		close() {
			if (!this.isOpen) return;
			this.isOpen = false;
			if (this.closeCallback) this.closeCallback();
		}

		needZone() {
			Roots.needReZone = true;
		}

		rezone() {
			Roots.needReZone = true;
		} // ----------------------
		//	INPUT
		// ----------------------


		select() {}

		unselect() {}

		setInput(Input) {
			Roots.setInput(Input, this);
		}

		upInput(x, down) {
			return Roots.upInput(x, down);
		} // ----------------------
		// special item 
		// ----------------------


		selected(b) {
			this.isSelect = b || false;
		}

	}

	class Bool extends Proto {
		constructor(o = {}) {
			super(o);
			this.value = o.value || false;
			this.model = o.mode !== undefined ? o.mode : 0;
			this.onName = o.rename || this.txt;
			if (o.onName) o.onname = o.onName;
			if (o.onname) this.onName = o.onname;
			this.inh = o.inh || Math.floor(this.h * 0.8);
			this.inw = o.inw || 36;
			let cc = this.colors;

			if (this.model === 0) {
				let t = Math.floor(this.h * 0.5) - (this.inh - 2) * 0.5;
				this.c[2] = this.dom('div', this.css.basic + 'background:' + cc.inputBg + '; height:' + (this.inh - 2) + 'px; width:' + this.inw + 'px; top:' + t + 'px; border-radius:10px; border:2px solid ' + cc.back);
				this.c[3] = this.dom('div', this.css.basic + 'height:' + (this.inh - 6) + 'px; width:16px; top:' + (t + 2) + 'px; border-radius:10px; background:' + cc.button + ';');
			} else {
				this.p = 0;
				if (this.c[1] !== undefined) this.c[1].textContent = '';
				this.c[2] = this.dom('div', this.css.txt + this.css.button + 'top:1px; background:' + cc.button + '; height:' + (this.h - 2) + 'px; border:1px solid ' + cc.border + '; border-radius:' + this.radius + 'px;');
			}

			this.stat = -1;
			this.init();
			this.update();
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mousedown(e) {
			this.value = !this.value;
			this.update(true);
			return this.mousemove(e);
		}

		mousemove(e) {
			this.cursor('pointer');
			return this.mode(true);
		}

		reset() {
			this.cursor();
			return this.mode();
		} // ----------------------
		//	 MODE
		// ----------------------


		mode(over) {
			let change = false;
			let cc = this.colors,
					s,
					s2,
					n,
					v = this.value;
			if (over) n = v ? 4 : 3;else n = v ? 2 : 1;

			if (this.stat !== n) {
				this.stat = n;

				if (this.model !== 0) {
					s = this.s[2];

					switch (n) {
						case 1:
							s.color = cc.text;
							s.background = cc.button;
							break;

						case 2:
							s.color = cc.textSelect;
							s.background = cc.select;
							break;

						case 3:
							s.color = cc.textOver;
							s.background = cc.overoff;
							break;

						case 4:
							s.color = cc.textOver;
							s.background = cc.over;
							break;
					}

					this.c[2].innerHTML = v ? this.onName : this.name;
				} else {
					s = this.s[2];
					s2 = this.s[3];

					switch (n) {
						case 1:
							s.background = s.borderColor = cc.back;
							s2.background = cc.button;
							break;

						case 2:
							s.background = s.borderColor = cc.select;
							s2.background = cc.button;
							break;

						case 3:
							s.background = s.borderColor = cc.back;
							s2.background = cc.overoff;
							break;

						case 4:
							s.background = s.borderColor = cc.select;
							s2.background = cc.over;
							break;
					}

					this.s[3].marginLeft = v ? '17px' : '2px';
					this.c[1].textContent = v ? this.onName : this.name;
				}

				change = true;
			}

			return change;
		} // ----------------------


		update(up) {
			this.mode();
			if (up) this.send();
		}

		rSize() {
			super.rSize();
			let s = this.s;
			let w = this.w - 10 - this.inw;

			if (this.model === 0) {
				s[2].left = w + 'px';
				s[3].left = w + 'px';
			} else {
				s[2].left = this.sa + 'px';
				s[2].width = this.w - 20 + 'px';
			}
		}

	}

	class Button extends Proto {
		constructor(o = {}) {
			super(o);
			this.value = o.value || '';
			this.values = o.value || this.txt;
			if (o.values) this.values = o.values;
			this.onName = o.onName || null;
			this.on = false;
			this.customSize = o.forceWidth || -1;
			if (typeof this.values === 'string') this.values = [this.values];
			this.isDown = false;
			this.neverlock = true;
			this.isLoadButton = o.loader || false;
			this.isDragButton = o.drag || false;
			this.res = 0;
			if (this.isDragButton) this.isLoadButton = true;
			this.lng = this.values.length;
			this.tmp = [];
			this.stat = [];
			let sel,
					cc = this.colors;

			for (let i = 0; i < this.lng; i++) {
				sel = false;
				if (this.values[i] === this.value && this.isSelectable) sel = true;
				this.c[i + 2] = this.dom('div', this.css.txt + this.css.button + 'top:1px; height:' + (this.h - 2) + 'px; border:' + cc.borderSize + 'px solid ' + cc.border + '; border-radius:' + this.radius + 'px;');
				this.c[i + 2].style.background = sel ? cc.select : cc.button;
				this.c[i + 2].style.color = sel ? cc.textSelect : cc.text;
				this.c[i + 2].innerHTML = this.values[i];
				this.stat[i] = sel ? 3 : 1;
			}

			if (!o.value && !o.values) {
				if (this.c[1] !== undefined) {
					this.txt = '';
					this.c[1].textContent = '';
				}
			}

			if (!this.txt) this.p = 0; //

			if (this.isLoadButton) this.initLoader();

			if (this.isDragButton) {
				this.lng++;
				this.initDrager();
			} //if( this.onName !== '' ) this.values[0] = this.on;


			this.init();
		}

		onOff() {
			this.on = !this.on;
			this.label(this.on ? this.onName : this.txt);
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return -1;
			let i = this.lng;
			let t = this.tmp;

			while (i--) {
				if (l.x > t[i][0] && l.x < t[i][2]) return i;
			}

			return -1;
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			if (!this.isDown) return false;
			this.isDown = false;

			if (this.res !== -1) {
				if (this.value === this.values[this.res] && this.unselectable) this.value = '';else this.value = this.values[this.res];
				if (this.onName !== null) this.onOff();
				if (!this.isLoadButton) this.send();
			}

			return this.mousemove(e);
		}

		mousedown(e) {
			if (this.isDown) return false;
			this.isDown = true;
			return this.mousemove(e);
		}

		mousemove(e) {
			let up = false;
			this.res = this.testZone(e);

			if (this.res !== -1) {
				this.cursor('pointer');
				up = this.modes(this.isDown ? 3 : 2, this.res);
			} else {
				up = this.reset();
			}

			return up;
		} // ----------------------


		modes(N = 1, id = -1) {
			let i = this.lng,
					w,
					n,
					r = false;

			while (i--) {
				n = N;
				w = this.isSelectable ? this.values[i] === this.value : false;

				if (i === id) {
					if (w && n === 2) n = 3;
				} else {
					n = 1;
					if (w) n = 4;
				} //if( this.mode( n, i ) ) r = true


				r = this.mode(n, i);
			}

			return r;
		}

		mode(n, id) {
			//if(!this.s) return false
			let change = false;
			let cc = this.colors,
					s = this.s;
			let i = id + 2;

			if (this.stat[id] !== n) {
				this.stat[id] = n;

				switch (n) {
					case 1:
						s[i].color = cc.text;
						s[i].background = cc.button;
						break;

					case 2:
						s[i].color = cc.textOver;
						s[i].background = cc.overoff;
						break;

					case 3:
						s[i].color = cc.textOver;
						s[i].background = cc.over;
						break;

					case 4:
						s[i].color = cc.textSelect;
						s[i].background = cc.select;
						break;
				}

				change = true;
			}

			return change;
		} // ----------------------


		reset() {
			this.res = -1;
			this.cursor();
			return this.modes();
		} // ----------------------


		dragover(e) {
			e.preventDefault();
			this.s[4].borderColor = this.colors.select;
			this.s[4].color = this.colors.select;
		}

		dragend(e) {
			e.preventDefault();
			this.s[4].borderColor = this.color.text;
			this.s[4].color = this.color.text;
		}

		drop(e) {
			e.preventDefault();
			this.dragend(e);
			this.fileSelect(e.dataTransfer.files[0]);
		}

		initDrager() {
			this.c[4] = this.dom('div', this.css.txt + ' text-align:center; line-height:' + (this.h - 8) + 'px; border:1px dashed ' + this.color.text + '; top:2px;	height:' + (this.h - 4) + 'px; border-radius:' + this.radius + 'px; pointer-events:auto;'); // cursor:default;

			this.c[4].textContent = 'DRAG';
			this.c[4].addEventListener('dragover', function (e) {
				this.dragover(e);
			}.bind(this), false);
			this.c[4].addEventListener('dragend', function (e) {
				this.dragend(e);
			}.bind(this), false);
			this.c[4].addEventListener('dragleave', function (e) {
				this.dragend(e);
			}.bind(this), false);
			this.c[4].addEventListener('drop', function (e) {
				this.drop(e);
			}.bind(this), false); //this.c[2].events = [	];
			//this.c[4].events = [ 'dragover', 'dragend', 'dragleave', 'drop' ];
		}

		addLoader(n, callbackLoad) {
			this.callbackLoad = callbackLoad;
			let l = this.dom('input', this.css.basic + 'top:0px; opacity:0; height:100%; width:100%; pointer-events:auto; cursor:pointer;'); //

			l.name = 'loader';
			l.type = "file";
			l.addEventListener('change', function (e) {
				this.fileSelect(e.target.files[0]);
			}.bind(this), false);
			this.c[n].appendChild(l);
			return this;
		}

		initLoader() {
			this.c[3] = this.dom('input', this.css.basic + 'top:0px; opacity:0; height:' + this.h + 'px; pointer-events:auto; cursor:pointer;'); //

			this.c[3].name = 'loader';
			this.c[3].type = "file";
			this.c[3].addEventListener('change', function (e) {
				this.fileSelect(e.target.files[0]);
			}.bind(this), false); //this.c[3].addEventListener( 'mousedown', function(e){	}.bind(this), false );
			//this.c[2].events = [	];
			//this.c[3].events = [ 'change', 'mouseover', 'mousedown', 'mouseup', 'mouseout' ];
			//this.hide = document.createElement('input');
		}

		fileSelect(file) {
			let dataUrl = ['png', 'jpg', 'mp4', 'webm', 'ogg'];
			let dataBuf = ['sea', 'z', 'hex', 'bvh', 'BVH', 'glb']; //if( ! e.target.files ) return;
			//let file = e.target.files[0];
			//this.c[3].type = "null";
			// console.log( this.c[4] )

			if (file === undefined) return;
			let reader = new FileReader();
			let fname = file.name;
			let type = fname.substring(fname.lastIndexOf('.') + 1, fname.length);
			if (dataUrl.indexOf(type) !== -1) reader.readAsDataURL(file);else if (dataBuf.indexOf(type) !== -1) reader.readAsArrayBuffer(file); //reader.readAsArrayBuffer( file );
			else reader.readAsText(file); // if( type === 'png' || type === 'jpg' || type === 'mp4' || type === 'webm' || type === 'ogg' ) reader.readAsDataURL( file );
			//else if( type === 'z' ) reader.readAsBinaryString( file );
			//else if( type === 'sea' || type === 'bvh' || type === 'BVH' || type === 'z') reader.readAsArrayBuffer( file );
			//else if(	) reader.readAsArrayBuffer( file );
			//else reader.readAsText( file );

			reader.onload = function (e) {
				if (this.callbackLoad) this.callbackLoad(e.target.result, fname, type); //if( this.callback ) this.callback( e.target.result, fname, type );
				//this.c[3].type = "file";
				//this.send( e.target.result ); 
			}.bind(this);
		}

		label(string, n) {
			n = n || 2;
			this.c[n].textContent = string;
		}

		icon(string, y = 0, n = 2) {
			//if(y) this.s[n].margin = ( y ) +'px 0px';
			this.s[n].padding = y + 'px 0px';
			this.c[n].innerHTML = string;
			return this;
		}

		rSize() {
			super.rSize();
			let s = this.s;
			let w = this.sb;
			let d = this.sa;
			let i = this.lng;
			let dc = 3;
			let size = Math.floor((w - dc * (i - 1)) / i);

			if (this.customSize !== -1) {
				size = this.customSize; // d = (this.s-size)*0.5
			}

			while (i--) {
				this.tmp[i] = [Math.floor(d + size * i + dc * i), size];
				this.tmp[i][2] = this.tmp[i][0] + this.tmp[i][1];
				s[i + 2].left = this.tmp[i][0] + 'px';
				s[i + 2].width = this.tmp[i][1] + 'px';
			}

			if (this.isDragButton) {
				s[4].left = d + size + dc + 'px';
				s[4].width = size + 'px';
			}

			if (this.isLoadButton) {
				s[3].left = d + 'px';
				s[3].width = size + 'px';
			}
		}

	}

	class Circular extends Proto {
		constructor(o = {}) {
			super(o);
			this.isCyclic = o.cyclic || false;
			this.model = o.stype || 0;
			if (o.mode !== undefined) this.model = o.mode;
			this.autoWidth = false;
			this.minw = this.w;
			this.diam = o.diam || this.w;
			this.setTypeNumber(o);
			this.twoPi = Tools$1.TwoPI;
			this.pi90 = Tools$1.pi90;
			this.offset = new V2();
			this.h = o.h || this.w + 10;
			this.top = 0;
			this.c[0].style.width = this.w + 'px';

			if (this.c[1] !== undefined) {
				this.c[1].style.width = '100%';
				this.c[1].style.justifyContent = 'center';
				this.top = 10;
				this.h += 10;
			}

			this.percent = 0;
			this.cmode = 0;
			let cc = this.colors;
			this.c[2] = this.dom('div', this.css.txt + 'justify-content:center; top:' + (this.h - 20) + 'px; width:100%; color:' + cc.text); // svg

			this.c[3] = this.getCircular();
			this.setSvg(this.c[3], 'stroke', cc.back, 0);
			this.setSvg(this.c[3], 'd', this.makePath(), 1);
			this.setSvg(this.c[3], 'stroke', cc.text, 1);
			this.setSvg(this.c[3], 'viewBox', '0 0 ' + this.diam + ' ' + this.diam);
			this.setCss(this.c[3], {
				width: this.diam,
				height: this.diam,
				left: 0,
				top: this.top
			});
			this.init();
			this.update();
		}

		mode(mode) {
			if (this.cmode === mode) return false;
			let cc = this.colors;
			let color;

			switch (mode) {
				case 0:
					// base
					this.s[2].color = cc.text;
					this.setSvg(this.c[3], 'stroke', cc.back, 0);
					color = this.model > 0 ? Tools$1.pack(Tools$1.lerpColor(Tools$1.unpack(Tools$1.ColorLuma(cc.text, -0.75)), Tools$1.unpack(cc.text), this.percent)) : cc.text;
					this.setSvg(this.c[3], 'stroke', color, 1);
					break;

				case 1:
					// down
					this.s[2].color = cc.textOver;
					this.setSvg(this.c[3], 'stroke', cc.backoff, 0);
					color = this.model > 0 ? Tools$1.pack(Tools$1.lerpColor(Tools$1.unpack(Tools$1.ColorLuma(cc.text, -0.75)), Tools$1.unpack(cc.text), this.percent)) : cc.textOver;
					this.setSvg(this.c[3], 'stroke', color, 1);
					break;
			}

			this.cmode = mode;
			return true;
		}

		reset() {
			this.isDown = false;
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			if (l.y <= this.c[1].offsetHeight) return 'title';else if (l.y > this.h - this.c[2].offsetHeight) return 'text';else return 'circular';
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			this.isDown = false;
			this.sendEnd();
			return this.mode(0);
		}

		mousedown(e) {
			this.isDown = true;
			this.old = this.value;
			this.oldr = null;
			this.mousemove(e);
			return this.mode(1);
		}

		mousemove(e) {
			if (!this.isDown) return; //console.log('over')

			let off = this.offset;
			off.x = this.w * 0.5 - (e.clientX - this.zone.x);
			off.y = this.diam * 0.5 - (e.clientY - this.zone.y - this.top);
			this.r = off.angle() - this.pi90;
			this.r = (this.r % this.twoPi + this.twoPi) % this.twoPi;

			if (this.oldr !== null) {
				let dif = this.r - this.oldr;
				this.r = Math.abs(dif) > Math.PI ? this.oldr : this.r;
				if (dif > 6) this.r = 0;
				if (dif < -6) this.r = this.twoPi;
			}

			let steps = 1 / this.twoPi;
			let value = this.r * steps;
			let n = this.range * value + this.min - this.old;

			if (n >= this.step || n <= this.step) {
				n = ~~(n / this.step);
				this.value = this.numValue(this.old + n * this.step);
				this.update(true);
				this.old = this.value;
				this.oldr = this.r;
			}
		}

		wheel(e) {
			let name = this.testZone(e);

			if (name === 'circular') {
				let v = this.value - this.step * e.delta;

				if (v > this.max) {
					v = this.isCyclic ? this.min : this.max;
				} else if (v < this.min) {
					v = this.isCyclic ? this.max : this.min;
				}

				this.setValue(v);
				this.old = v;
				this.update(true);
				return true;
			}

			return false;
		} // ----------------------


		makePath() {
			let r = 40;
			let d = 24;
			let a = this.percent * this.twoPi - 0.001;
			let x2 = r + r * Math.sin(a) + d;
			let y2 = r - r * Math.cos(a) + d;
			let big = a > Math.PI ? 1 : 0;
			return "M " + (r + d) + "," + d + " A " + r + "," + r + " 0 " + big + " 1 " + x2 + "," + y2;
		}

		update(up) {
			this.c[2].textContent = this.value;
			this.percent = (this.value - this.min) / this.range;
			this.setSvg(this.c[3], 'd', this.makePath(), 1);

			if (this.model > 0) {
				let cc = this.colors;
				let color = Tools$1.pack(Tools$1.lerpColor(Tools$1.unpack(Tools$1.ColorLuma(cc.text, -0.75)), Tools$1.unpack(cc.text), this.percent));
				this.setSvg(this.c[3], 'stroke', color, 1);
			}

			if (up) this.send();
		}

	}

	class Color$1 extends Proto {
		constructor(o = {}) {
			super(o); //this.autoHeight = true;

			this.ctype = o.ctype || 'hex';
			this.wfixe = 256;
			this.cw = this.sb > 256 ? 256 : this.sb;
			if (o.cw != undefined) this.cw = o.cw; // color up or down

			this.side = o.side || 'down';
			this.up = this.side === 'down' ? 0 : 1;
			this.baseH = this.h;
			this.offset = new V2();
			this.decal = new V2();
			this.pp = new V2();
			this.c[2] = this.dom('div', this.css.txt + 'height:' + (this.h - 4) + 'px;' + 'border-radius:' + this.radius + 'px; line-height:' + (this.h - 8) + 'px;');
			this.s[2] = this.c[2].style;
			this.s[2].textShadow = 'none';

			if (this.up) {
				this.s[2].top = 'auto';
				this.s[2].bottom = '2px';
			} //this.c[0].style.textAlign = 'center';
			//this.c[0].style.flex = '1 0 auto'


			this.c[3] = this.getColorRing();
			this.c[3].style.visibility = 'hidden';
			this.hsl = null;
			this.value = '#ffffff';

			if (o.value !== undefined) {
				if (o.value instanceof Array) this.value = Tools$1.rgbToHex(o.value);else if (!isNaN(o.value)) this.value = Tools$1.hexToHtml(o.value);else this.value = o.value;
			}

			this.bcolor = null;
			this.isDown = false;
			this.fistDown = false;
			this.notext = o.notext || false;
			this.tr = 98;
			this.tsl = Math.sqrt(3) * this.tr;
			this.hue = 0;
			this.d = 256;
			this.setColor(this.value);
			this.init();
			if (o.open !== undefined) this.open();
		}

		testZone(mx, my) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';

			if (this.up && this.isOpen) {
				if (l.y > this.wfixe) return 'title';else return 'color';
			} else {
				if (l.y < this.baseH + 2) return 'title';else if (this.isOpen) return 'color';
			}
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			this.isDown = false;
			this.d = 256;
		}

		mousedown(e) {
			let name = this.testZone(e.clientX, e.clientY); //if( !name ) return;

			if (name === 'title') {
				if (!this.isOpen) this.open();else this.close();
				return true;
			}

			if (name === 'color') {
				this.isDown = true;
				this.fistDown = true;
				this.mousemove(e);
			}
		}

		mousemove(e) {
			let name = this.testZone(e.clientX, e.clientY);
			let off,
					d,
					hue,
					sat,
					lum,
					rad,
					x,
					y,
					rr,
					T = Tools$1;
			if (name === 'title') this.cursor('pointer');

			if (name === 'color') {
				off = this.offset;
				off.x = e.clientX - (this.zone.x + this.decal.x + this.mid);
				off.y = e.clientY - (this.zone.y + this.decal.y + this.mid);
				d = off.length() * this.ratio;
				rr = off.angle();
				if (rr < 0) rr += 2 * T.PI;
				if (d < 128) this.cursor('crosshair');else if (!this.isDown) this.cursor();

				if (this.isDown) {
					if (this.fistDown) {
						this.d = d;
						this.fistDown = false;
					}

					if (this.d < 128) {
						if (this.d > this.tr) {
							// outside hue
							hue = (rr + T.pi90) / T.TwoPI;
							this.hue = (hue + 1) % 1;
							this.setHSL([(hue + 1) % 1, this.hsl[1], this.hsl[2]]);
						} else {
							// triangle
							x = off.x * this.ratio;
							y = off.y * this.ratio;
							let rr = this.hue * T.TwoPI + T.PI;
							if (rr < 0) rr += 2 * T.PI;
							rad = Math.atan2(-y, x);
							if (rad < 0) rad += 2 * T.PI;
							let rad0 = (rad + T.pi90 + T.TwoPI + rr) % T.TwoPI,
									rad1 = rad0 % (2 / 3 * T.PI) - T.pi60,
									a = 0.5 * this.tr,
									b = Math.tan(rad1) * a,
									r = Math.sqrt(x * x + y * y),
									maxR = Math.sqrt(a * a + b * b);

							if (r > maxR) {
								let dx = Math.tan(rad1) * r;
								let rad2 = Math.atan(dx / maxR);
								if (rad2 > T.pi60) rad2 = T.pi60;else if (rad2 < -T.pi60) rad2 = -T.pi60;
								rad += rad2 - rad1;
								rad0 = (rad + T.pi90 + T.TwoPI + rr) % T.TwoPI, rad1 = rad0 % (2 / 3 * T.PI) - T.pi60;
								b = Math.tan(rad1) * a;
								r = maxR = Math.sqrt(a * a + b * b);
							}

							lum = Math.sin(rad0) * r / this.tsl + 0.5;
							let w = 1 - Math.abs(lum - 0.5) * 2;
							sat = (Math.cos(rad0) * r + this.tr / 2) / (1.5 * this.tr) / w;
							sat = T.clamp(sat, 0, 1);
							this.setHSL([this.hsl[0], sat, lum]);
						}
					}
				}
			}
		} // ----------------------


		setHeight() {
			this.h = this.isOpen ? this.wfixe + this.baseH + 5 : this.baseH;
			this.s[0].height = this.h + 'px';
			this.zone.h = this.h;
		}

		parentHeight(t) {
			if (this.group !== null) this.group.calc(t);else if (this.isUI) this.main.calc(t);
		}

		open() {
			super.open();
			this.setHeight();
			if (this.up) this.zone.y -= this.wfixe + 5;
			let t = this.h - this.baseH;
			this.s[3].visibility = 'visible'; //this.s[3].display = 'block';

			this.parentHeight(t);
		}

		close() {
			super.close();
			if (this.up) this.zone.y += this.wfixe + 5;
			let t = this.h - this.baseH;
			this.setHeight();
			this.s[3].visibility = 'hidden'; //this.s[3].display = 'none';

			this.parentHeight(-t);
		}

		update(up) {
			let cc = Tools$1.rgbToHex(Tools$1.hslToRgb([this.hsl[0], 1, 0.5]));
			this.moveMarkers();
			this.value = this.bcolor;
			this.setSvg(this.c[3], 'fill', cc, 2, 0);
			this.s[2].background = this.bcolor;
			if (!this.notext) this.c[2].textContent = Tools$1.htmlToHex(this.bcolor);
			this.invert = Tools$1.findDeepInver(this.rgb);
			this.s[2].color = this.invert ? '#fff' : '#000';
			if (!up) return;
			if (this.ctype === 'array') this.send(this.rgb);
			if (this.ctype === 'rgb') this.send(Tools$1.htmlRgb(this.rgb));
			if (this.ctype === 'hex') this.send(Tools$1.htmlToHex(this.value));
			if (this.ctype === 'html') this.send();
		}

		setValue(v) {
			if (v instanceof Array) this.value = Tools$1.rgbToHex(v);else if (!isNaN(v)) this.value = Tools$1.hexToHtml(v);else this.value = v;
			this.setColor(this.value);
			this.update();
		}

		setColor(color) {
			let unpack = Tools$1.unpack(color);

			if (this.bcolor !== color && unpack) {
				this.bcolor = color;
				this.rgb = unpack;
				this.hsl = Tools$1.rgbToHsl(this.rgb);
				this.hue = this.hsl[0];
				this.update();
			}

			return this;
		}

		setHSL(hsl) {
			this.hsl = hsl;
			this.rgb = Tools$1.hslToRgb(hsl);
			this.bcolor = Tools$1.rgbToHex(this.rgb);
			this.update(true);
			return this;
		}

		moveMarkers() {
			let p = this.pp;
			let T = Tools$1;
			this.invert ? '#fff' : '#000';
			let a = this.hsl[0] * T.TwoPI;
			let third = 2 / 3 * T.PI;
			let r = this.tr;
			let h = this.hsl[0];
			let s = this.hsl[1];
			let l = this.hsl[2];
			let angle = (a - T.pi90) * T.todeg;
			h = -a + T.pi90;
			let hx = Math.cos(h) * r;
			let hy = -Math.sin(h) * r;
			let sx = Math.cos(h - third) * r;
			let sy = -Math.sin(h - third) * r;
			let vx = Math.cos(h + third) * r;
			let vy = -Math.sin(h + third) * r;
			let mx = (sx + vx) / 2,
					my = (sy + vy) / 2;
			a = (1 - 2 * Math.abs(l - .5)) * s;
			let x = sx + (vx - sx) * l + (hx - mx) * a;
			let y = sy + (vy - sy) * l + (hy - my) * a;
			p.set(x, y).addScalar(128); //let ff = (1-l)*255;
			// this.setSvg( this.c[3], 'stroke', 'rgb('+ff+','+ff+','+ff+')', 3 );

			this.setSvg(this.c[3], 'transform', 'rotate(' + angle + ' )', 2);
			this.setSvg(this.c[3], 'cx', p.x, 3);
			this.setSvg(this.c[3], 'cy', p.y, 3);
			this.setSvg(this.c[3], 'stroke', this.invert ? '#fff' : '#000', 2, 3);
			this.setSvg(this.c[3], 'stroke', this.invert ? '#fff' : '#000', 3);
			this.setSvg(this.c[3], 'fill', this.bcolor, 3);
		}

		rSize() {
			//Proto.prototype.rSize.call( this );
			super.rSize();
			let s = this.s;
			s[2].width = this.sb + 'px';
			s[2].left = this.sa + 'px';
			this.rSizeColor(this.cw);
			this.decal.x = Math.floor((this.w - this.wfixe) * 0.5); //s[3].left = this.decal.x + 'px';
		}

		rSizeColor(w) {
			if (w === this.wfixe) return;
			this.wfixe = w;
			let s = this.s; //this.decal.x = Math.floor((this.w - this.wfixe) * 0.5);

			this.decal.y = this.side === 'up' ? 2 : this.baseH + 2;
			this.mid = Math.floor(this.wfixe * 0.5);
			this.setSvg(this.c[3], 'viewBox', '0 0 ' + this.wfixe + ' ' + this.wfixe);
			s[3].width = this.wfixe + 'px';
			s[3].height = this.wfixe + 'px'; //s[3].left = this.decal.x + 'px';

			s[3].top = this.decal.y + 'px';
			this.ratio = 256 / this.wfixe;
			this.square = 1 / (60 * (this.wfixe / 256));
			this.setHeight();
		}

	}

	class Fps extends Proto {
		constructor(o = {}) {
			super(o);
			this.round = Math.round; //this.autoHeight = true;

			this.baseH = this.h;
			this.hplus = o.hplus || 50;
			this.res = o.res || 40;
			this.l = 1;
			this.precision = o.precision || 0;
			this.custom = o.custom || false;
			this.names = o.names || ['FPS', 'MS'];
			let cc = o.cc || ['220,220,220', '255,255,0']; // this.divid = [ 100, 100, 100 ];
			// this.multy = [ 30, 30, 30 ];

			this.adding = o.adding || false;
			this.range = o.range || [165, 100, 100];
			this.alpha = o.alpha || 0.25;
			this.values = [];
			this.points = [];
			this.textDisplay = [];

			if (!this.custom) {
				this.now = Roots.getTime();
				this.startTime = 0; //this.now()

				this.prevTime = 0; //this.startTime;

				this.frames = 0;
				this.ms = 0;
				this.fps = 0;
				this.mem = 0;
				this.mm = 0;
				this.isMem = self.performance && self.performance.memory ? true : false; // this.divid = [ 100, 200, 1 ];
				// this.multy = [ 30, 30, 30 ];

				if (this.isMem) {
					this.names.push('MEM');
					cc.push('0,255,255');
				}

				this.txt = o.name || 'Fps';
			}

			let fltop = Math.floor(this.h * 0.5) - 6;
			this.c[1].textContent = this.txt;
			this.c[0].style.cursor = 'pointer';
			this.c[0].style.pointerEvents = 'auto';
			let panelCss = 'display:none; left:10px; top:' + this.h + 'px; height:' + (this.hplus - 8) + 'px; box-sizing:border-box; background: rgba(0, 0, 0, 0.2); border:1px solid ' + this.colors.border + ';';
			if (this.radius !== 0) panelCss += 'border-radius:' + this.radius + 'px;';
			this.c[2] = this.dom('path', this.css.basic + panelCss, {});
			this.c[2].setAttribute('viewBox', '0 0 ' + this.res + ' 50');
			this.c[2].setAttribute('height', '100%');
			this.c[2].setAttribute('width', '100%');
			this.c[2].setAttribute('preserveAspectRatio', 'none'); //this.dom( 'path', null, { fill:'rgba(255,255,0,0.3)', 'stroke-width':1, stroke:'#FF0', 'vector-effect':'non-scaling-stroke' }, this.c[2] );
			//this.dom( 'path', null, { fill:'rgba(0,255,255,0.3)', 'stroke-width':1, stroke:'#0FF', 'vector-effect':'non-scaling-stroke' }, this.c[2] );
			// arrow

			this.c[3] = this.dom('path', this.css.basic + 'position:absolute; width:10px; height:10px; left:4px; top:' + fltop + 'px;', {
				d: this.svgs.arrow,
				fill: this.colors.text,
				stroke: 'none'
			}); // result test

			this.c[4] = this.dom('div', this.css.txt + 'position:absolute; left:10px; top:' + (this.h + 2) + 'px; display:none; width:100%; text-align:center;'); // bottom line

			if (o.bottomLine) this.c[4] = this.dom('div', this.css.basic + 'width:100%; bottom:0px; height:1px; background: rgba(255, 255, 255, 0.2);');
			this.isShow = false;
			let s = this.s;
			s[1].marginLeft = '10px';
			s[1].lineHeight = this.h - 4;
			s[1].color = this.colors.text;
			s[1].fontWeight = 'bold';
			if (this.radius !== 0) s[0].borderRadius = this.radius + 'px';
			if (this.colors.gborder !== 'none') s[0].border = '1px solid ' + this.colors.gborder;
			let j = 0;

			for (j = 0; j < this.names.length; j++) {
				let base = [];
				let i = this.res + 1;

				while (i--) base.push(50);

				this.range[j] = 1 / this.range[j] * 49;
				this.points.push(base);
				this.values.push(0); //	this.dom( 'path', null, { fill:'rgba('+cc[j]+',0.5)', 'stroke-width':1, stroke:'rgba('+cc[j]+',1)', 'vector-effect':'non-scaling-stroke' }, this.c[2] );

				this.textDisplay.push("<span style='color:rgb(" + cc[j] + ")'> " + this.names[j] + " ");
			}

			j = this.names.length;

			while (j--) {
				this.dom('path', null, {
					fill: 'rgba(' + cc[j] + ',' + this.alpha + ')',
					'stroke-width': 1,
					stroke: 'rgba(' + cc[j] + ',1)',
					'vector-effect': 'non-scaling-stroke'
				}, this.c[2]);
			}

			this.init(); //if( this.isShow ) this.show();
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mousedown(e) {
			if (this.isShow) this.close();else this.open();
		} // ----------------------

		/*mode: function ( mode ) {
					let s = this.s;
					switch(mode){
						case 0: // base
								s[1].color = this.colors.text;
								//s[1].background = 'none';
						break;
						case 1: // over
								s[1].color = '#FFF';
								//s[1].background = UIL.SELECT;
						break;
						case 2: // edit / down
								s[1].color = this.colors.text;
								//s[1].background = UIL.SELECTDOWN;
						break;
					}
		},*/


		tick(v) {
			this.values = v;
			if (!this.isShow) return;
			this.drawGraph();
			this.upText();
		}

		makePath(point) {
			let p = '';
			p += 'M ' + -1 + ' ' + 50;

			for (let i = 0; i < this.res + 1; i++) {
				p += ' L ' + i + ' ' + point[i];
			}

			p += ' L ' + (this.res + 1) + ' ' + 50;
			return p;
		}

		upText(val) {
			let v = val || this.values,
					t = '';

			for (let j = 0, lng = this.names.length; j < lng; j++) t += this.textDisplay[j] + v[j].toFixed(this.precision) + '</span>';

			this.c[4].innerHTML = t;
		}

		drawGraph() {
			let svg = this.c[2];
			let i = this.names.length,
					v,
					old = 0,
					n = 0;

			while (i--) {
				if (this.adding) v = (this.values[n] + old) * this.range[n];else v = this.values[n] * this.range[n];
				this.points[n].shift();
				this.points[n].push(50 - v);
				this.setSvg(svg, 'd', this.makePath(this.points[n]), i + 1);
				old += this.values[n];
				n++;
			}
		}

		open() {
			super.open();
			this.h = this.hplus + this.baseH;
			this.setSvg(this.c[3], 'd', this.svgs.arrowDown);

			if (this.group !== null) {
				this.group.calc(this.hplus);
			} else if (this.isUI) this.main.calc(this.hplus);

			this.s[0].height = this.h + 'px';
			this.s[2].display = 'block';
			this.s[4].display = 'block';
			this.isShow = true;
			if (!this.custom) Roots.addListen(this);
		}

		close() {
			super.close();
			this.h = this.baseH;
			this.setSvg(this.c[3], 'd', this.svgs.arrow);

			if (this.group !== null) {
				this.group.calc(-this.hplus);
			} else if (this.isUI) this.main.calc(-this.hplus);

			this.s[0].height = this.h + 'px';
			this.s[2].display = 'none';
			this.s[4].display = 'none';
			this.isShow = false;
			if (!this.custom) Roots.removeListen(this);
			this.c[4].innerHTML = '';
		} ///// AUTO FPS //////


		begin() {
			this.startTime = this.now();
		}

		end() {
			let time = this.now();
			this.ms = time - this.startTime;
			this.frames++;

			if (time > this.prevTime + 1000) {
				this.fps = this.round(this.frames * 1000 / (time - this.prevTime));
				this.prevTime = time;
				this.frames = 0;

				if (this.isMem) {
					let heapSize = performance.memory.usedJSHeapSize;
					let heapSizeLimit = performance.memory.jsHeapSizeLimit;
					this.mem = this.round(heapSize * 0.000000954);
					this.mm = heapSize / heapSizeLimit;
				}
			}

			this.values = [this.fps, this.ms, this.mm];
			this.drawGraph();
			this.upText([this.fps, this.ms, this.mem]);
			return time;
		}

		listening() {
			if (!this.custom) this.startTime = this.end();
		}

		rSize() {
			let s = this.s;
			let w = this.w;
			s[0].width = w + 'px';
			s[1].width = w + 'px';
			s[2].left = 10 + 'px';
			s[2].width = w - 20 + 'px';
			s[4].width = w - 20 + 'px';
		}

	}

	class Graph extends Proto {
		constructor(o = {}) {
			super(o);
			this.value = o.value !== undefined ? o.value : [0, 0, 0];
			this.lng = this.value.length;
			this.precision = o.precision !== undefined ? o.precision : 2;
			this.multiplicator = o.multiplicator || 1;
			this.neg = o.neg || false;
			this.line = o.line !== undefined ? o.line : true; //if(this.neg)this.multiplicator*=2;

			this.autoWidth = o.autoWidth !== undefined ? o.autoWidth : true;
			this.isNumber = false;
			this.isDown = false;
			this.h = o.h || 128 + 10;
			this.rh = this.h - 10;
			this.top = 0;
			this.c[0].style.width = this.w + 'px';

			if (this.c[1] !== undefined) {
				// with title
				this.c[1].style.width = this.w + 'px';

				if (!this.autoWidth) {
					this.c[1].style.width = '100%';
					this.c[1].style.justifyContent = 'center';
				} //this.c[1].style.background = '#ff0000';
				//this.c[1].style.textAlign = 'center';


				this.top = 10;
				this.h += 10;
			}

			this.gh = this.rh - 28;
			this.gw = this.w - 28; //this.c[2] = this.dom( 'div', this.css.txt + 'justify-content:center; text-align: justify; column-count:'+this.lng+'; top:'+(this.h-20)+'px; width:100%; color:'+ this.colors.text );
			//let colum = 'column-count:'+this.lng+'; column:'+this.lng+'; break-inside: column; top:'

			this.c[2] = this.dom('div', this.css.txt + 'display:block; text-align:center; padding:0px 0px; top:' + (this.h - 20) + 'px; left:14px; width:' + this.gw + 'px;	color:' + this.colors.text); //this.c[2].textContent = this.value;

			this.c[2].innerHTML = this.valueToHtml();
			let svg = this.dom('svg', this.css.basic, {
				viewBox: '0 0 ' + this.w + ' ' + this.rh,
				width: this.w,
				height: this.rh,
				preserveAspectRatio: 'none'
			});
			this.setCss(svg, {
				width: this.w,
				height: this.rh,
				left: 0,
				top: this.top
			});
			this.dom('path', '', {
				d: '',
				stroke: this.colors.text,
				'stroke-width': 2,
				fill: 'none',
				'stroke-linecap': 'butt'
			}, svg);
			this.dom('rect', '', {
				x: 10,
				y: 10,
				width: this.gw + 8,
				height: this.gh + 8,
				stroke: 'rgba(0,0,0,0.3)',
				'stroke-width': 1,
				fill: 'none'
			}, svg);
			this.iw = (this.gw - 4 * (this.lng - 1)) / this.lng;
			let t = [];
			this.cMode = [];
			this.v = [];

			for (let i = 0; i < this.lng; i++) {
				t[i] = [14 + i * this.iw + i * 4, this.iw];
				t[i][2] = t[i][0] + t[i][1];
				this.cMode[i] = 0;
				if (this.neg) this.v[i] = (1 + this.value[i] / this.multiplicator) * 0.5;else this.v[i] = this.value[i] / this.multiplicator;
				this.dom('rect', '', {
					x: t[i][0],
					y: 14,
					width: t[i][1],
					height: 1,
					fill: this.colors.text,
					'fill-opacity': 0.3
				}, svg);
			}

			this.tmp = t;
			this.c[3] = svg; //console.log(this.w)

			this.init();

			if (this.c[1] !== undefined) {
				this.c[1].style.top = 0 + 'px';
				this.c[1].style.height = 20 + 'px';
				this.s[1].lineHeight = 20 - 5 + 'px';
			}

			this.update(false);
		}

		setValue(value) {
			this.value = value;
			this.lng = this.value.length;

			for (var i = 0; i < this.lng; i++) {
				if (this.neg) this.v[i] = (1 + value[i] / this.multiplicator) * 0.5;else this.v[i] = value[i] / this.multiplicator;
			}

			this.update();
		}

		valueToHtml() {
			let i = this.lng,
					n = 0,
					r = '<table style="width:100%;"><tr>';
			let w = 100 / this.lng;
			let style = 'width:' + w + '%;'; //' text-align:center;'

			while (i--) {
				if (n === this.lng - 1) r += '<td style=' + style + '>' + this.value[n] + '</td></tr></table>';else r += '<td style=' + style + '>' + this.value[n] + '</td>';
				n++;
			}

			return r;
		}

		updateSVG() {
			if (this.line) this.setSvg(this.c[3], 'd', this.makePath(), 0);

			for (let i = 0; i < this.lng; i++) {
				this.setSvg(this.c[3], 'height', this.v[i] * this.gh, i + 2);
				this.setSvg(this.c[3], 'y', 14 + (this.gh - this.v[i] * this.gh), i + 2);
				if (this.neg) this.value[i] = ((this.v[i] * 2 - 1) * this.multiplicator).toFixed(this.precision) * 1;else this.value[i] = (this.v[i] * this.multiplicator).toFixed(this.precision) * 1;
			} //this.c[2].textContent = this.value;


			this.c[2].innerHTML = this.valueToHtml();
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			let i = this.lng;
			let t = this.tmp;

			if (l.y > this.top && l.y < this.h - 20) {
				while (i--) {
					if (l.x > t[i][0] && l.x < t[i][2]) return i;
				}
			}

			return '';
		}

		mode(n, name) {
			if (n === this.cMode[name]) return false;
			let a;

			switch (n) {
				case 0:
					a = 0.3;
					break;

				case 1:
					a = 0.6;
					break;

				case 2:
					a = 1;
					break;
			}

			this.reset();
			this.setSvg(this.c[3], 'fill-opacity', a, name + 2);
			this.cMode[name] = n;
			return true;
		} // ----------------------
		//	 EVENTS
		// ----------------------


		reset() {
			let nup = false; //this.isDown = false;

			let i = this.lng;

			while (i--) {
				if (this.cMode[i] !== 0) {
					this.cMode[i] = 0;
					this.setSvg(this.c[3], 'fill-opacity', 0.3, i + 2);
					nup = true;
				}
			}

			return nup;
		}

		mouseup(e) {
			this.isDown = false;
			if (this.current !== -1) return this.reset();
		}

		mousedown(e) {
			this.isDown = true;
			return this.mousemove(e);
		}

		mousemove(e) {
			let nup = false;
			let name = this.testZone(e);

			if (name === '') {
				nup = this.reset(); //this.cursor();
			} else {
				nup = this.mode(this.isDown ? 2 : 1, name); //this.cursor( this.current !== -1 ? 'move' : 'pointer' );

				if (this.isDown) {
					this.v[name] = this.clamp(1 - (e.clientY - this.zone.y - this.top - 10) / this.gh, 0, 1);
					this.update(true);
				}
			}

			return nup;
		} // ----------------------


		update(up) {
			this.updateSVG();
			if (up) this.send();
		}

		makePath() {
			let p = "",
					h,
					w,
					wn,
					wm,
					ow,
					oh; //let g = this.iw*0.5

			for (let i = 0; i < this.lng; i++) {
				h = 14 + (this.gh - this.v[i] * this.gh);
				w = 14 + i * this.iw + i * 4;
				wm = w + this.iw * 0.5;
				wn = w + this.iw;
				if (i === 0) p += 'M ' + w + ' ' + h + ' T ' + wm + ' ' + h;else p += ' C ' + ow + ' ' + oh + ',' + w + ' ' + h + ',' + wm + ' ' + h;
				if (i === this.lng - 1) p += ' T ' + wn + ' ' + h;
				ow = wn;
				oh = h;
			}

			return p;
		}

		rSize() {
			super.rSize();
			let s = this.s;
			if (this.c[1] !== undefined) s[1].width = this.w + 'px';
			s[3].width = this.w + 'px';
			let gw = this.w - 28;
			let iw = (gw - 4 * (this.lng - 1)) / this.lng;
			let t = [];
			s[2].width = gw + 'px';

			for (let i = 0; i < this.lng; i++) {
				t[i] = [14 + i * iw + i * 4, iw];
				t[i][2] = t[i][0] + t[i][1];
			}

			this.tmp = t;
		}

	}

	class Group extends Proto {
		constructor(o = {}) {
			super(o);
			this.isGroup = true;
			this.ADD = o.add;
			this.uis = [];
			this.isEmpty = true;
			this.autoHeight = true;
			this.current = -1;
			this.targetIn = null;
			this.decal = 0;
			this.baseH = this.h;
			let fltop = Math.floor(this.h * 0.5) - 6;
			this.isLine = o.line !== undefined ? o.line : false;
			this.decal = 0;

			if (o.group) {
				this.decal = o.group.decal ? o.group.decal : 0;
				this.decal += 6;
			}

			this.useFlex = true;
			let flexible = this.useFlex ? 'display:flex; flex-flow: row wrap;' : '';
			this.c[2] = this.dom('div', this.css.basic + flexible + 'width:100%; left:0; height:auto; overflow:hidden; top:' + this.h + 'px'); // 

			this.c[3] = this.dom('path', this.css.basic + 'position:absolute; width:10px; height:10px; left:0; top:' + fltop + 'px;', {
				d: this.svgs.group,
				fill: this.colors.text,
				stroke: 'none'
			});
			this.c[4] = this.dom('path', this.css.basic + 'position:absolute; width:10px; height:10px; left:' + (4 + this.decal) + 'px; top:' + fltop + 'px;', {
				d: this.svgs.arrow,
				fill: this.colors.text,
				stroke: 'none'
			}); // bottom line

			if (this.isLine) this.c[5] = this.dom('div', this.css.basic + 'background:rgba(255, 255, 255, 0.2); width:100%; left:0; height:1px; bottom:0px');
			let s = this.s;
			s[0].height = this.h + 'px';
			s[1].height = this.h + 'px';
			this.c[1].name = 'group';
			s[1].marginLeft = 10 + this.decal + 'px';
			s[1].lineHeight = this.h - 4;
			s[1].color = this.colors.text;
			s[1].fontWeight = 'bold';
			if (this.radius !== 0) s[0].borderRadius = this.radius + 'px'; //if( o.border ) s[0].border = '1px solid ' + o.border;

			/*if(this.decal){
					s[0].boxSizing = 'border-box';
					s[0].backgroundClip = 'border-box';
					s[0].border = (this.decal/3)+'px solid ' + o.group.colors.background;
			}*/

			this.init();
			this.setBG(o.bg);
			if (o.open !== undefined) this.open(); //s[0].background = this.bg;
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			let name = '';
			if (l.y < this.baseH) name = 'title';else {
				if (this.isOpen) name = 'content';
			}
			return name;
		}

		clearTarget() {
			if (this.current === -1) return false; // if(!this.targetIn ) return;

			this.targetIn.uiout();
			this.targetIn.reset();
			this.current = -1;
			this.targetIn = null;
			this.cursor();
			return true;
		}

		reset() {
			this.clearTarget();
		} // ----------------------
		//	 EVENTS
		// ----------------------


		handleEvent(e) {
			let type = e.type;
			let change = false;
			let targetChange = false;
			let name = this.testZone(e);
			if (!name) return;

			switch (name) {
				case 'content':
					this.cursor();
					if (Roots.isMobile && type === 'mousedown') this.getNext(e, change);
					if (this.targetIn) targetChange = this.targetIn.handleEvent(e); //if( type === 'mousemove' ) change = this.styles('def');

					if (!Roots.lock) this.getNext(e, change);
					break;

				case 'title':
					this.cursor('pointer');

					if (type === 'mousedown') {
						if (this.isOpen) this.close();else this.open();
					}

					break;
			}

			if (this.isDown) change = true;
			if (targetChange) change = true;
			return change;
		}

		getNext(e, change) {
			let next = Roots.findTarget(this.uis, e);

			if (next !== this.current) {
				this.clearTarget();
				this.current = next;
			}

			if (next !== -1) {
				this.targetIn = this.uis[this.current];
				this.targetIn.uiover();
			}
		} // ----------------------

		/*calcH () {
					let lng = this.uis.length, i, u,	h=0, px=0, tmph=0;
				for( i = 0; i < lng; i++){
						u = this.uis[i];
						if( !u.autoWidth ){
									if(px===0) h += u.h+1;
								else {
										if(tmph<u.h) h += u.h-tmph;
								}
								tmph = u.h;
									//tmph = tmph < u.h ? u.h : tmph;
								px += u.w;
								if( px+u.w > this.w ) px = 0;
							}
						else h += u.h+1;
				}
					return h;
		}*/


		setBG(bg) {
			if (bg !== undefined) this.colors.background = bg;
			this.c[0].style.background = this.colors.background;
			let i = this.uis.length;

			while (i--) {
				this.uis[i].setBG(this.colors.background);
			}
		}

		add() {
			let a = arguments;

			if (typeof a[1] === 'object') {
				a[1].isUI = this.isUI;
				a[1].target = this.c[2];
				a[1].main = this.main;
				a[1].group = this;
			} else if (typeof arguments[1] === 'string') {
				if (a[2] === undefined) [].push.call(a, {
					isUI: true,
					target: this.c[2],
					main: this.main
				});else {
					a[2].isUI = true;
					a[2].target = this.c[2];
					a[2].main = this.main;
					a[2].group = this;
				}
			} //let n = add.apply( this, a );


			let u = this.ADD.apply(this, a);
			this.uis.push(u); //this.calc()

			this.isEmpty = false;
			return u;
		} // remove one node


		remove(n) {
			if (n.dispose) n.dispose();
		} // clear all iner 


		dispose() {
			this.clear();
			if (this.isUI) this.main.calc();
			super.dispose(); //Proto.prototype.clear.call( this );
		}

		clear() {
			this.empty();
		}

		empty() {
			this.close();
			let i = this.uis.length,
					item;

			while (i--) {
				item = this.uis.pop();
				this.c[2].removeChild(item.c[0]);
				item.clear(true); //this.uis[i].clear()
			}

			this.isEmpty = true;
			this.h = this.baseH;
		} // clear one element


		clearOne(n) {
			let id = this.uis.indexOf(n);

			if (id !== -1) {
				this.calc(-(this.uis[id].h + 1));
				this.c[2].removeChild(this.uis[id].c[0]);
				this.uis.splice(id, 1);

				if (this.uis.length === 0) {
					this.isEmpty = true;
					this.close();
				}
			}
		}

		open() {
			super.open();
			this.setSvg(this.c[4], 'd', this.svgs.arrowDown);
			this.rSizeContent();
			this.h - this.baseH;
			this.parentHeight();
		}

		close() {
			super.close();
			this.h - this.baseH;
			this.setSvg(this.c[4], 'd', this.svgs.arrow);
			this.h = this.baseH;
			this.s[0].height = this.h + 'px';
			this.parentHeight();
		}

		calcUis() {
			if (!this.isOpen) this.h = this.baseH;else this.h = Roots.calcUis(this.uis, this.zone, this.zone.y + this.baseH) + this.baseH;
			this.s[0].height = this.h + 'px'; //console.log('G', this.h)
			//if( !this.isOpen ) return;
			//this.h = Roots.calcUis( this.uis, this.zone, this.zone.y + this.baseH )+this.baseH;
		}

		parentHeight(t) {
			if (this.group !== null) this.group.calc(t);else if (this.isUI) this.main.calc(t);
		}

		calc(y) {
			if (!this.isOpen) return;
			/*
				if( y !== undefined ){ 
					this.h += y;
					if( this.isUI ) this.main.calc( y );
			} else {
					this.h = this.calcH() + this.baseH;
			}
			this.s[0].height = this.h + 'px';*/
			// if(this.isOpen)

			if (this.isUI) this.main.calc();else this.calcUis();
			this.s[0].height = this.h + 'px';
		}

		rSizeContent() {
			let i = this.uis.length;

			while (i--) {
				this.uis[i].setSize(this.w);
				this.uis[i].rSize();
			} //this.calc()

		}

		rSize() {
			super.rSize();
			let s = this.s;
			s[3].left = this.sa + this.sb - 17 + 'px';
			s[1].width = this.w + 'px';
			s[2].width = this.w + 'px';
			if (this.isOpen) this.rSizeContent();
		}

	}

	class Joystick extends Proto {
		constructor(o = {}) {
			super(o);
			this.autoWidth = false;
			this.value = [0, 0];
			this.minw = this.w;
			this.diam = o.diam || this.w;
			this.joyType = 'analogique';
			this.model = o.mode !== undefined ? o.mode : 0;
			this.precision = o.precision || 2;
			this.multiplicator = o.multiplicator || 1;
			this.pos = new V2();
			this.tmp = new V2();
			this.interval = null; //this.radius = this.w * 0.5;
			//this.distance = this.radius*0.25;

			this.distance = this.diam * 0.5 * 0.25;
			this.h = o.h || this.w + 10;
			this.top = 0;
			this.c[0].style.width = this.w + 'px';

			if (this.c[1] !== undefined) {
				// with title
				this.c[1].style.width = '100%';
				this.c[1].style.justifyContent = 'center';
				this.top = 10;
				this.h += 10;
			}

			let cc = this.colors;
			this.c[2] = this.dom('div', this.css.txt + 'justify-content:center; top:' + (this.h - 20) + 'px; width:100%; color:' + cc.text);
			this.c[2].textContent = this.value;
			this.c[3] = this.getJoystick(this.model);
			this.setSvg(this.c[3], 'viewBox', '0 0 ' + this.diam + ' ' + this.diam);
			this.setCss(this.c[3], {
				width: this.diam,
				height: this.diam,
				left: 0,
				top: this.top
			});
			this.ratio = 128 / this.w;
			this.init();
			this.update(false);
		}

		mode(mode) {
			let cc = this.colors;

			switch (mode) {
				case 0:
					// base
					if (this.model === 0) {
						this.setSvg(this.c[3], 'fill', 'url(#gradIn)', 4);
						this.setSvg(this.c[3], 'stroke', '#000', 4);
					} else {
						this.setSvg(this.c[3], 'stroke', 'rgba(100,100,100,0.25)', 2); //this.setSvg( this.c[3], 'stroke', 'rgb(0,0,0,0.1)', 3 );

						this.setSvg(this.c[3], 'stroke', '#666', 4);
						this.setSvg(this.c[3], 'fill', 'none', 4);
					}

					break;

				case 1:
					// over
					if (this.model === 0) {
						this.setSvg(this.c[3], 'fill', 'url(#gradIn2)', 4);
						this.setSvg(this.c[3], 'stroke', 'rgba(0,0,0,0)', 4);
					} else {
						this.setSvg(this.c[3], 'stroke', 'rgba(48,138,255,0.25)', 2); //this.setSvg( this.c[3], 'stroke', 'rgb(0,0,0,0.3)', 3 );

						this.setSvg(this.c[3], 'stroke', cc.select, 4);
						this.setSvg(this.c[3], 'fill', 'rgba(48,138,255,0.25)', 4);
					}

					break;
			}
		} // ----------------------
		//	 EVENTS
		// ----------------------


		addInterval() {
			if (this.interval !== null) this.stopInterval();
			if (this.pos.isZero()) return;
			this.interval = setInterval(function () {
				this.update();
			}.bind(this), 10);
		}

		stopInterval() {
			if (this.interval === null) return;
			clearInterval(this.interval);
			this.interval = null;
		}

		reset() {
			this.addInterval();
			this.mode(0);
		}

		mouseup(e) {
			this.addInterval();
			this.isDown = false;
		}

		mousedown(e) {
			this.isDown = true;
			this.mousemove(e);
			this.mode(2);
		}

		mousemove(e) {
			this.mode(1);
			if (!this.isDown) return; //this.tmp.x = this.radius - ( e.clientX - this.zone.x );
			//this.tmp.y = this.radius - ( e.clientY - this.zone.y - this.top );

			this.tmp.x = this.w * 0.5 - (e.clientX - this.zone.x);
			this.tmp.y = this.diam * 0.5 - (e.clientY - this.zone.y - this.top);
			let distance = this.tmp.length();

			if (distance > this.distance) {
				let angle = Math.atan2(this.tmp.x, this.tmp.y);
				this.tmp.x = Math.sin(angle) * this.distance;
				this.tmp.y = Math.cos(angle) * this.distance;
			}

			this.pos.copy(this.tmp).divideScalar(this.distance).negate();
			this.update();
		}

		setValue(v) {
			if (v === undefined) v = [0, 0];
			this.pos.set(v[0] || 0, v[1] || 0);
			this.updateSVG();
		}

		update(up) {
			if (up === undefined) up = true;

			if (this.interval !== null) {
				if (!this.isDown) {
					this.pos.lerp(null, 0.3);
					this.pos.x = Math.abs(this.pos.x) < 0.01 ? 0 : this.pos.x;
					this.pos.y = Math.abs(this.pos.y) < 0.01 ? 0 : this.pos.y;
					if (this.isUI && this.main.isCanvas) this.main.draw();
				}
			}

			this.updateSVG();
			if (up) this.send();
			if (this.pos.isZero()) this.stopInterval();
		}

		updateSVG() {
			//let x = this.radius - ( -this.pos.x * this.distance );
			//let y = this.radius - ( -this.pos.y * this.distance );
			let x = this.diam * 0.5 - -this.pos.x * this.distance;
			let y = this.diam * 0.5 - -this.pos.y * this.distance;

			if (this.model === 0) {
				let sx = x + this.pos.x * 5 + 5;
				let sy = y + this.pos.y * 5 + 10;
				this.setSvg(this.c[3], 'cx', sx * this.ratio, 3);
				this.setSvg(this.c[3], 'cy', sy * this.ratio, 3);
			} else {
				this.setSvg(this.c[3], 'cx', x * this.ratio, 3);
				this.setSvg(this.c[3], 'cy', y * this.ratio, 3);
			}

			this.setSvg(this.c[3], 'cx', x * this.ratio, 4);
			this.setSvg(this.c[3], 'cy', y * this.ratio, 4);
			this.value[0] = (this.pos.x * this.multiplicator).toFixed(this.precision) * 1;
			this.value[1] = (this.pos.y * this.multiplicator).toFixed(this.precision) * 1;
			this.c[2].textContent = this.value;
		}

		clear() {
			this.stopInterval();
			super.clear();
		}

	}

	class Knob extends Proto {
		constructor(o = {}) {
			super(o);
			this.isCyclic = o.cyclic || false;
			this.model = o.stype || 0;
			if (o.mode !== undefined) this.model = o.mode;
			this.autoWidth = false;
			this.setTypeNumber(o);
			this.minw = this.w;
			this.diam = o.diam || this.w;
			this.mPI = Math.PI * 0.8;
			this.toDeg = 180 / Math.PI;
			this.cirRange = this.mPI * 2;
			this.offset = new V2();
			this.h = o.h || this.w + 10;
			this.top = 0;
			this.c[0].style.width = this.w + 'px';

			if (this.c[1] !== undefined) {
				this.c[1].style.width = '100%';
				this.c[1].style.justifyContent = 'center';
				this.top = 10;
				this.h += 10;
			}

			this.percent = 0;
			this.cmode = 0;
			let cc = this.colors;
			this.c[2] = this.dom('div', this.css.txt + 'justify-content:center; top:' + (this.h - 20) + 'px; width:100%; color:' + cc.text);
			this.c[3] = this.getKnob();
			this.setSvg(this.c[3], 'fill', cc.button, 0);
			this.setSvg(this.c[3], 'stroke', cc.text, 1);
			this.setSvg(this.c[3], 'stroke', cc.text, 3);
			this.setSvg(this.c[3], 'd', this.makeGrad(), 3);
			this.setSvg(this.c[3], 'viewBox', '0 0 ' + this.diam + ' ' + this.diam);
			this.setCss(this.c[3], {
				width: this.diam,
				height: this.diam,
				left: 0,
				top: this.top
			});

			if (this.model > 0) {
				Tools$1.dom('path', '', {
					d: '',
					stroke: cc.text,
					'stroke-width': 2,
					fill: 'none',
					'stroke-linecap': 'round'
				}, this.c[3]); //4

				if (this.model == 2) {
					Tools$1.addSVGGlowEffect();
					this.setSvg(this.c[3], 'style', 'filter: url("#UILGlow");', 4);
				}
			}

			this.r = 0;
			this.init();
			this.update();
		}

		mode(mode) {
			let cc = this.colors;
			if (this.cmode === mode) return false;

			switch (mode) {
				case 0:
					// base
					this.s[2].color = cc.text;
					this.setSvg(this.c[3], 'fill', cc.button, 0); //this.setSvg( this.c[3], 'stroke','rgba(255,0,0,0.2)', 2);

					this.setSvg(this.c[3], 'stroke', cc.text, 1);
					break;

				case 1:
					// down
					this.s[2].color = cc.textOver;
					this.setSvg(this.c[3], 'fill', cc.select, 0); //this.setSvg( this.c[3], 'stroke','rgba(0,0,0,0.6)', 2);

					this.setSvg(this.c[3], 'stroke', cc.textOver, 1);
					break;
			}

			this.cmode = mode;
			return true;
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			if (l.y <= this.c[1].offsetHeight) return 'title';else if (l.y > this.h - this.c[2].offsetHeight) return 'text';else return 'knob';
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			this.isDown = false;
			this.sendEnd();
			return this.mode(0);
		}

		mousedown(e) {
			this.isDown = true;
			this.old = this.value;
			this.oldr = null;
			this.mousemove(e);
			return this.mode(1);
		}

		mousemove(e) {
			if (!this.isDown) return;
			let off = this.offset; //off.x = this.radius - ( e.clientX - this.zone.x );
			//off.y = this.radius - ( e.clientY - this.zone.y - this.top );

			off.x = this.w * 0.5 - (e.clientX - this.zone.x);
			off.y = this.diam * 0.5 - (e.clientY - this.zone.y - this.top);
			this.r = -Math.atan2(off.x, off.y);
			if (this.oldr !== null) this.r = Math.abs(this.r - this.oldr) > Math.PI ? this.oldr : this.r;
			this.r = this.r > this.mPI ? this.mPI : this.r;
			this.r = this.r < -this.mPI ? -this.mPI : this.r;
			let steps = 1 / this.cirRange;
			let value = (this.r + this.mPI) * steps;
			let n = this.range * value + this.min - this.old;

			if (n >= this.step || n <= this.step) {
				n = Math.floor(n / this.step);
				this.value = this.numValue(this.old + n * this.step);
				this.update(true);
				this.old = this.value;
				this.oldr = this.r;
			}
		}

		wheel(e) {
			let name = this.testZone(e);

			if (name === 'knob') {
				let v = this.value - this.step * e.delta;

				if (v > this.max) {
					v = this.isCyclic ? this.min : this.max;
				} else if (v < this.min) {
					v = this.isCyclic ? this.max : this.min;
				}

				this.setValue(v);
				this.old = v;
				this.update(true);
				return true;
			}

			return false;
		}

		makeGrad() {
			let d = '',
					step,
					range,
					a,
					x,
					y,
					x2,
					y2,
					r = 64;
			let startangle = Math.PI + this.mPI;
			let endangle = Math.PI - this.mPI; //let step = this.step>5 ? this.step : 1;

			if (this.step > 5) {
				range = this.range / this.step;
				step = (startangle - endangle) / range;
			} else {
				step = (startangle - endangle) / r * 2;
				range = r * 0.5;
			}

			for (let i = 0; i <= range; ++i) {
				a = startangle - step * i;
				x = r + Math.sin(a) * (r - 20);
				y = r + Math.cos(a) * (r - 20);
				x2 = r + Math.sin(a) * (r - 24);
				y2 = r + Math.cos(a) * (r - 24);
				d += 'M' + x + ' ' + y + ' L' + x2 + ' ' + y2 + ' ';
			}

			return d;
		}

		update(up) {
			this.c[2].textContent = this.value;
			this.percent = (this.value - this.min) / this.range;
			let sa = Math.PI + this.mPI;
			let ea = this.percent * this.cirRange - this.mPI;
			let sin = Math.sin(ea);
			let cos = Math.cos(ea);
			let x1 = 25 * sin + 64;
			let y1 = -(25 * cos) + 64;
			let x2 = 20 * sin + 64;
			let y2 = -(20 * cos) + 64;
			this.setSvg(this.c[3], 'd', 'M ' + x1 + ' ' + y1 + ' L ' + x2 + ' ' + y2, 1);

			if (this.model > 0) {
				let x1 = 36 * Math.sin(sa) + 64;
				let y1 = 36 * Math.cos(sa) + 64;
				let x2 = 36 * sin + 64;
				let y2 = -36 * cos + 64;
				let big = ea <= Math.PI - this.mPI ? 0 : 1;
				this.setSvg(this.c[3], 'd', 'M ' + x1 + ',' + y1 + ' A ' + 36 + ',' + 36 + ' 1 ' + big + ' 1 ' + x2 + ',' + y2, 4);
				let color = Tools$1.pack(Tools$1.lerpColor(Tools$1.unpack(Tools$1.ColorLuma(this.colors.text, -0.75)), Tools$1.unpack(this.colors.text), this.percent));
				this.setSvg(this.c[3], 'stroke', color, 4);
			}

			if (up) this.send();
		}

	}

	class List extends Proto {
		constructor(o = {}) {
			super(o); // images

			this.path = o.path || '';
			this.format = o.format || '';
			this.isWithImage = this.path !== '' ? true : false;
			this.preLoadComplete = false;
			this.tmpImage = {};
			this.tmpUrl = []; //this.autoHeight = false;

			let align = o.align || 'center'; // scroll size

			let ss = o.scrollSize || 10;
			this.ss = ss + 1;
			this.sMode = 0;
			this.tMode = 0;
			this.listOnly = o.listOnly || false;
			this.staticTop = o.staticTop || false;
			this.isSelectable = this.listOnly;
			if (o.select !== undefined) o.selectable = o.select;
			if (o.selectable !== undefined) this.isSelectable = o.selectable;
			if (this.txt === '') this.p = 0;
			let fltop = Math.floor(this.h * 0.5) - 5;
			let cc = this.colors;
			this.c[2] = this.dom('div', this.css.basic + 'top:0; display:none; border-radius:' + this.radius + 'px;');
			this.c[3] = this.dom('div', this.css.item + 'position:absolute; text-align:' + align + '; line-height:' + (this.h - 4) + 'px; top:1px; background:' + cc.button + '; height:' + (this.h - 2) + 'px; border:1px solid ' + cc.border + '; border-radius:' + this.radius + 'px;');
			this.c[4] = this.dom('path', this.css.basic + 'position:absolute; width:10px; height:10px; top:' + fltop + 'px;', {
				d: this.svgs.arrow,
				fill: cc.text,
				stroke: 'none'
			});
			this.scrollerBack = this.dom('div', this.css.basic + 'right:0px; width:' + ss + 'px; background:' + cc.back + '; display:none;');
			this.scroller = this.dom('div', this.css.basic + 'right:' + (ss - ss * 0.25) * 0.5 + 'px; width:' + ss * 0.25 + 'px; background:' + cc.text + '; display:none; ');
			this.c[3].style.color = cc.text;
			this.list = [];
			this.refObject = null;

			if (o.list) {
				if (o.list instanceof Array) {
					this.list = o.list;
				} else {
					this.refObject = o.list;

					for (let g in this.refObject) this.list.push(g);
				}
			}

			this.items = [];
			this.prevName = '';
			this.baseH = this.h;
			this.itemHeight = o.itemHeight || this.h - 3; // force full list 

			this.full = o.full || false;
			this.py = 0;
			this.ww = this.sb;
			this.scroll = false;
			this.isDown = false;
			this.current = null; // list up or down

			this.side = o.side || 'down';
			this.up = this.side === 'down' ? 0 : 1;

			if (this.up) {
				this.c[2].style.top = 'auto';
				this.c[3].style.top = 'auto';
				this.c[4].style.top = 'auto'; //this.c[5].style.top = 'auto';

				this.c[2].style.bottom = this.h - 2 + 'px';
				this.c[3].style.bottom = '1px';
				this.c[4].style.bottom = fltop + 'px';
			} else {
				this.c[2].style.top = this.baseH + 'px';
			}

			this.listIn = this.dom('div', this.css.basic + 'left:0; top:0; width:100%; background:none;');
			this.listIn.name = 'list';
			this.topList = 0;
			this.c[2].appendChild(this.listIn);
			this.c[2].appendChild(this.scrollerBack);
			this.c[2].appendChild(this.scroller);

			if (o.value !== undefined) {
				if (!isNaN(o.value)) this.value = this.list[o.value];else this.value = o.value;
			} else {
				this.value = this.list[0];
			}

			this.isOpenOnStart = o.open || false;

			if (this.listOnly) {
				this.baseH = 5;
				this.c[3].style.display = 'none';
				this.c[4].style.display = 'none';
				this.c[2].style.top = this.baseH + 'px';
				this.isOpenOnStart = true;
			}

			this.miniCanvas = o.miniCanvas || false;
			this.canvasBg = o.canvasBg || 'rgba(0,0,0,0)';
			this.imageSize = o.imageSize || [20, 20]; // dragout function

			this.drag = o.drag || false;
			this.dragout = o.dragout || false;
			this.dragstart = o.dragstart || null;
			this.dragend = o.dragend || null; //this.c[0].style.background = '#FF0000'

			if (this.isWithImage) this.preloadImage(); // } else {
			// populate list

			this.setList(this.list);
			this.init();
			if (this.isOpenOnStart) this.open(true); // }
		}
		/*send ( v ) {
					super.send( v );
					//Proto.prototype.send.call( this, v );
		}*/
		// image list


		preloadImage() {
			this.preLoadComplete = false;
			this.tmpImage = {};

			for (let i = 0; i < this.list.length; i++) this.tmpUrl.push(this.list[i]);

			this.loadOne();
		}

		nextImg() {
			this.tmpUrl.shift();

			if (this.tmpUrl.length === 0) {
				this.preLoadComplete = true;
				this.addImages();
				/*this.setList( this.list );
				this.init();
				if( this.isOpenOnStart ) this.open();*/
			} else this.loadOne();
		}

		loadOne() {
			let self = this;
			let name = this.tmpUrl[0];
			let img = document.createElement('img');
			img.style.cssText = 'position:absolute; width:' + self.imageSize[0] + 'px; height:' + self.imageSize[1] + 'px';
			img.setAttribute('src', this.path + name + this.format);
			img.addEventListener('load', function () {
				self.imageSize[2] = img.width;
				self.imageSize[3] = img.height;
				self.tmpImage[name] = img;
				self.nextImg();
			});
		} //


		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';

			if (this.up && this.isOpen) {
				if (l.y > this.h - this.baseH) return 'title';else {
					if (this.scroll && l.x > this.sa + this.sb - this.ss) return 'scroll';
					if (l.x > this.sa) return this.testItems(l.y - this.baseH);
				}
			} else {
				if (l.y < this.baseH + 2) return 'title';else {
					if (this.isOpen) {
						if (this.scroll && l.x > this.sa + this.sb - this.ss) return 'scroll';
						if (l.x > this.sa) return this.testItems(l.y - this.baseH);
					}
				}
			}

			return '';
		}

		testItems(y) {
			let name = '';
			let i = this.items.length,
					item,
					a,
					b;

			while (i--) {
				item = this.items[i];
				a = item.posy + this.topList;
				b = item.posy + this.itemHeight + 1 + this.topList;

				if (y >= a && y <= b) {
					name = 'item' + i;
					this.modeItem(0);
					this.current = item;
					this.modeItem(1);
					return name;
				}
			}

			return name;
		}

		modeItem(mode) {
			if (!this.current) return;
			if (this.current.select && mode === 0) mode = 2;
			let cc = this.colors;

			switch (mode) {
				case 0:
					// base
					this.current.style.background = cc.back;
					this.current.style.color = cc.text;
					break;

				case 1:
					// over
					this.current.style.background = cc.over;
					this.current.style.color = cc.textOver;
					break;

				case 2:
					// edit / down
					this.current.style.background = cc.select;
					this.current.style.color = cc.textSelect;
					break;
			}
		}

		unSelected() {
			if (!this.current) return;
			this.modeItem(0);
			this.current = null;
		}

		selected() {
			if (!this.current) return;
			this.resetItems();
			this.modeItem(2);
			this.current.select = true;
		}

		resetItems() {
			let i = this.items.length;

			while (i--) {
				this.items[i].select = false;
				this.items[i].style.background = this.colors.back;
				this.items[i].style.color = this.colors.text;
			}
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			this.isDown = false;
		}

		mousedown(e) {
			let name = this.testZone(e);
			if (!name) return false;

			if (name === 'scroll') {
				this.isDown = true;
				this.mousemove(e);
			} else if (name === 'title') {
				this.modeTitle(2);

				if (!this.listOnly) {
					if (!this.isOpen) this.open();else this.close();
				}
			} else {
				// is item
				if (this.current) {
					this.value = this.list[this.current.id];
					if (this.isSelectable) this.selected(); //this.value = this.refObject !== null ? this.refObject[this.list[this.current.id]]	: this.list[this.current.id]
					//this.value = this.current.textContent;

					this.send(this.refObject !== null ? this.refObject[this.list[this.current.id]] : this.value);

					if (!this.listOnly) {
						this.close();
						this.setTopItem();
					}
				}
			}

			return true;
		}

		mousemove(e) {
			let nup = false;
			let name = this.testZone(e);
			if (!name) return nup;

			if (name === 'title') {
				this.unSelected();
				this.modeTitle(1);
				this.cursor('pointer');
			} else if (name === 'scroll') {
				this.cursor('s-resize');
				this.modeScroll(1);

				if (this.isDown) {
					this.modeScroll(2);
					let top = this.zone.y + this.baseH - 2;
					this.update(e.clientY - top - this.sh * 0.5);
				} //if(this.isDown) this.listmove(e);

			} else {
				// is item
				this.modeTitle(0);
				this.modeScroll(0);
				this.cursor('pointer');
			}

			if (name !== this.prevName) nup = true;
			this.prevName = name;
			return nup;
		}

		wheel(e) {
			let name = this.testZone(e);
			if (name === 'title') return false;
			this.py += e.delta * 10;
			this.update(this.py);
			return true;
		} // ----------------------


		reset() {
			this.prevName = '';
			this.unSelected();
			this.modeTitle(0);
			this.modeScroll(0); //console.log('this is reset')
		}

		modeScroll(mode) {
			if (mode === this.sMode) return;
			let s = this.scroller.style;
			let cc = this.colors;

			switch (mode) {
				case 0:
					// base
					s.background = cc.text;
					break;

				case 1:
					// over
					s.background = cc.select;
					break;

				case 2:
					// edit / down
					s.background = cc.select;
					break;
			}

			this.sMode = mode;
		}

		modeTitle(mode) {
			if (mode === this.tMode) return;
			let s = this.s;
			let cc = this.colors;

			switch (mode) {
				case 0:
					// base
					s[3].color = cc.text;
					s[3].background = cc.button;
					break;

				case 1:
					// over
					s[3].color = cc.textOver;
					s[3].background = cc.overoff;
					break;

				case 2:
					// edit / down
					s[3].color = cc.textSelect;
					s[3].background = cc.overoff;
					break;
			}

			this.tMode = mode;
		}

		clearList() {
			while (this.listIn.children.length) this.listIn.removeChild(this.listIn.lastChild);

			this.items = [];
		}

		setList(list) {
			this.clearList();
			this.list = list;
			this.length = this.list.length;
			this.maxItem = this.full ? this.length : 5;
			this.maxItem = this.length < this.maxItem ? this.length : this.maxItem;
			this.maxHeight = this.maxItem * (this.itemHeight + 1) + 2;
			this.max = this.length * (this.itemHeight + 1) + 2;
			this.ratio = this.maxHeight / this.max;
			this.sh = this.maxHeight * this.ratio;
			this.range = this.maxHeight - this.sh;
			this.c[2].style.height = this.maxHeight + 'px';
			this.scrollerBack.style.height = this.maxHeight + 'px';
			this.scroller.style.height = this.sh + 'px';

			if (this.max > this.maxHeight) {
				this.ww = this.sb - this.ss;
				this.scroll = true;
			}

			if (this.miniCanvas) {
				this.tmpCanvas = document.createElement('canvas');
				this.tmpCanvas.width = this.imageSize[0];
				this.tmpCanvas.height = this.imageSize[1];
				this.tmpCtx = this.tmpCanvas.getContext("2d");
				this.tmpCtx.fillStyle = this.canvasBg;
				this.tmpCtx.fillRect(0, 0, this.imageSize[0], this.imageSize[1]);
			}

			let item, n; //, l = this.sb;

			for (let i = 0; i < this.length; i++) {
				n = this.list[i];
				item = this.dom('div', this.css.item + 'width:' + this.ww + 'px; height:' + this.itemHeight + 'px; line-height:' + (this.itemHeight - 5) + 'px; color:' + this.colors.text + '; background:' + this.colors.back + ';');
				item.name = 'item' + i;
				item.id = i;
				item.select = false;
				item.posy = (this.itemHeight + 1) * i;
				this.listIn.appendChild(item);
				this.items.push(item);
				if (n === this.value) this.current = item; //if( this.isWithImage ) item.appendChild( this.tmpImage[n] );

				if (!this.isWithImage) item.textContent = n;

				if (this.miniCanvas) {
					let c = new Image();
					c.src = this.tmpCanvas.toDataURL();
					/*let c = document.createElement('canvas')
						c.width = this.imageSize[0]
					c.height = this.imageSize[1]
					let ctx = c.getContext("2d")
					ctx.fillStyle = this.canvasBg
					ctx.fillRect(0, 0, this.imageSize[0], this.imageSize[1])*/

					c.style.cssText = 'position:relative; pointer-events:none; display:inline-block; float:left; margin-left:0px; margin-right:5px; top:2px'; //c.style.cssText = 'display:flex; align-content: flex-start; flex-wrap: wrap;'
					//item.style.float = 'right'

					item.appendChild(c);
					this.tmpImage[n] = c;
				}

				if (this.dragout) {
					item.img = this.tmpImage[n];
					item.style.pointerEvents = 'auto';
					item.draggable = "true";
					item.addEventListener('dragstart', this.dragstart || function () {
						/*console.log('drag start')*/
					});
					item.addEventListener('drag', this.drag || function () {
						/*console.log('drag start')*/
					}); //item.addEventListener('dragover', this);
					//item.addEventListener('dragenter', this);

					item.addEventListener('dragleave', function () {
						Roots.fakeUp();
					});
					item.addEventListener('dragend', this.dragend || function () {
						/*console.log('drag end')*/
					}.bind(this)); //item.addEventListener('drop', function(){console.log('drop')})
				}
			}

			this.setTopItem();
			if (this.isSelectable) this.selected();
		}

		drawImage(name, image, x, y, w, h) {
			this.tmpCtx.clearRect(0, 0, this.imageSize[0], this.imageSize[1]);
			this.tmpCtx.drawImage(image, x, y, w, h, 0, 0, this.imageSize[0], this.imageSize[1]);
			this.tmpImage[name].src = this.tmpCanvas.toDataURL();
			/*let c = this.tmpImage[name]
			let ctx = c.getContext("2d")
			ctx.drawImage(image, x, y, w, h, 0, 0, this.imageSize[0], this.imageSize[1])*/
		}

		addImages() {
			let lng = this.list.length;

			for (let i = 0; i < lng; i++) {
				this.items[i].appendChild(this.tmpImage[this.list[i]]);
			}

			this.setTopItem();
		}

		setValue(value) {
			if (!isNaN(value)) this.value = this.list[value];else this.value = value;
			this.setTopItem();
		}

		setTopItem() {
			if (this.staticTop) return;

			if (this.isWithImage) {
				if (!this.preLoadComplete) return;

				if (!this.c[3].children.length) {
					this.canvas = document.createElement('canvas');
					this.canvas.width = this.imageSize[0];
					this.canvas.height = this.imageSize[1];
					this.canvas.style.cssText = 'position:absolute; top:0px; left:0px;';
					this.ctx = this.canvas.getContext("2d");
					this.c[3].appendChild(this.canvas);
				}

				this.tmpImage[this.value];
				this.ctx.drawImage(this.tmpImage[this.value], 0, 0, this.imageSize[2], this.imageSize[3], 0, 0, this.imageSize[0], this.imageSize[1]);
			} else this.c[3].textContent = this.value;

			if (this.miniCanvas) {
				if (!this.c[3].children.length) {
					this.canvas = document.createElement('canvas');
					this.canvas.width = this.imageSize[0];
					this.canvas.height = this.imageSize[1];
					(this.h - this.imageSize[1]) * 0.5;
					this.canvas.style.cssText = 'position:relative; pointer-events:none; display:inline-block; float:left; margin-left:0px; margin-right:5px; top:2px'; //this.canvas.style.cssText = 'position:absolute; top:'+h+'px; left:5px;'

					this.ctx = this.canvas.getContext("2d");
					this.c[3].style.textAlign = 'left';
					this.c[3].appendChild(this.canvas);
				}

				this.ctx.drawImage(this.tmpImage[this.value], 0, 0);
			}
		} // ----- LIST


		update(y) {
			if (!this.scroll) return;
			y = y < 0 ? 0 : y;
			y = y > this.range ? this.range : y;
			this.topList = -Math.floor(y / this.ratio);
			this.listIn.style.top = this.topList + 'px';
			this.scroller.style.top = Math.floor(y) + 'px';
			this.py = y;
		}

		parentHeight(t) {
			if (this.group !== null) this.group.calc(t);else if (this.isUI) this.main.calc(t);
		}

		open(first) {
			super.open();
			this.update(0);
			this.h = this.maxHeight + this.baseH + 5;

			if (!this.scroll) {
				this.topList = 0;
				this.h = this.baseH + 5 + this.max;
				this.scroller.style.display = 'none';
				this.scrollerBack.style.display = 'none';
			} else {
				this.scroller.style.display = 'block';
				this.scrollerBack.style.display = 'block';
			}

			this.s[0].height = this.h + 'px';
			this.s[2].display = 'block';

			if (this.up) {
				this.zone.y -= this.h - (this.baseH - 10);
				this.setSvg(this.c[4], 'd', this.svgs.arrowUp);
			} else {
				this.setSvg(this.c[4], 'd', this.svgs.arrowDown);
			}

			this.rSizeContent();
			let t = this.h - this.baseH;
			this.zone.h = this.h;
			if (!first) this.parentHeight(t);
		}

		close() {
			super.close();
			if (this.up) this.zone.y += this.h - (this.baseH - 10);
			let t = this.h - this.baseH;
			this.h = this.baseH;
			this.s[0].height = this.h + 'px';
			this.s[2].display = 'none';
			this.setSvg(this.c[4], 'd', this.svgs.arrow);
			this.zone.h = this.h;
			this.parentHeight(-t);
		} // -----


		text(txt) {
			this.c[3].textContent = txt;
		}

		rSizeContent() {
			let i = this.length;

			while (i--) this.listIn.children[i].style.width = this.ww + 'px';
		}

		rSize() {
			super.rSize(); //Proto.prototype.rSize.call( this );

			let s = this.s;
			let w = this.sb;
			let d = this.sa;
			if (s[2] === undefined) return;
			s[2].width = w + 'px';
			s[2].left = d + 'px';
			s[3].width = w + 'px';
			s[3].left = d + 'px';
			s[4].left = d + w - 17 + 'px';
			this.ww = w;
			if (this.max > this.maxHeight) this.ww = w - this.ss;
			if (this.isOpen) this.rSizeContent();
		}

	}

	class Numeric extends Proto {
		constructor(o = {}) {
			super(o);
			this.setTypeNumber(o);
			this.allway = o.allway || false;
			this.isDown = false;
			this.value = [0];
			this.multy = 1;
			this.invmulty = 1;
			this.isSingle = true;
			this.isAngle = false;
			this.isVector = false;

			if (o.isAngle) {
				this.isAngle = true;
				this.multy = Tools$1.torad;
				this.invmulty = Tools$1.todeg;
			}

			this.isDrag = o.drag || false;

			if (o.value !== undefined) {
				if (!isNaN(o.value)) {
					this.value = [o.value];
				} else if (o.value instanceof Array) {
					this.value = o.value;
					this.isSingle = false;
				} else if (o.value instanceof Object) {
					this.value = [];
					if (o.value.x !== undefined) this.value[0] = o.value.x;
					if (o.value.y !== undefined) this.value[1] = o.value.y;
					if (o.value.z !== undefined) this.value[2] = o.value.z;
					if (o.value.w !== undefined) this.value[3] = o.value.w;
					this.isVector = true;
					this.isSingle = false;
				}
			}

			this.lng = this.value.length;
			this.tmp = [];
			this.current = -1;
			this.prev = {
				x: 0,
				y: 0,
				d: 0,
				v: 0
			};
			let cc = this.colors; // bg

			this.c[2] = this.dom('div', this.css.basic + ' background:' + cc.select + '; top:4px; width:0px; height:' + (this.h - 8) + 'px;');
			this.cMode = [];
			let i = this.lng;

			while (i--) {
				if (this.isAngle) this.value[i] = (this.value[i] * 180 / Math.PI).toFixed(this.precision);
				this.c[3 + i] = this.dom('div', this.css.txtselect + ' height:' + (this.h - 4) + 'px; color:' + cc.text + '; background:' + cc.back + '; borderColor:' + cc.border + '; border-radius:' + this.radius + 'px;');
				if (o.center) this.c[2 + i].style.textAlign = 'center';
				this.c[3 + i].textContent = this.value[i];
				this.c[3 + i].style.color = this.colors.text;
				this.c[3 + i].isNum = true;
				this.cMode[i] = 0;
			} // selection


			this.selectId = 3 + this.lng;
			this.c[this.selectId] = this.dom('div', this.css.txtselect + 'position:absolute; top:4px; height:' + (this.h - 8) + 'px; padding:0px 0px; width:0px; color:' + cc.textSelect + '; background:' + cc.select + '; border:none; border-radius:0px;'); // cursor

			this.cursorId = 4 + this.lng;
			this.c[this.cursorId] = this.dom('div', this.css.basic + 'top:4px; height:' + (this.h - 8) + 'px; width:0px; background:' + cc.text + ';');
			this.init();
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			let i = this.lng;
			let t = this.tmp;

			while (i--) {
				if (l.x > t[i][0] && l.x < t[i][2]) return i;
			}

			return '';
		}
		/* mode: function ( n, name ) {
					 if( n === this.cMode[name] ) return false;
					 //let m;
					 /*switch(n){
							 case 0: m = this.colors.border; break;
						 case 1: m = this.colors.borderOver; break;
						 case 2: m = this.colors.borderSelect;	break;
					 }*/

		/*		 this.reset();
				 //this.c[name+2].style.borderColor = m;
				 this.cMode[name] = n;
					 return true;
			 },*/
		// ----------------------
		//	 EVENTS
		// ----------------------


		mousedown(e) {
			let name = this.testZone(e);

			if (!this.isDown) {
				this.isDown = true;

				if (name !== '') {
					this.current = name;
					this.prev = {
						x: e.clientX,
						y: e.clientY,
						d: 0,
						v: this.isSingle ? parseFloat(this.value) : parseFloat(this.value[this.current])
					};
					this.setInput(this.c[3 + this.current]);
				}

				return this.mousemove(e);
			}

			return false;
			/*
				if( name === '' ) return false;
					this.current = name;
			this.isDown = true;
				this.prev = { x:e.clientX, y:e.clientY, d:0, v: this.isSingle ? parseFloat(this.value) : parseFloat( this.value[ this.current ] )	};
					return this.mode( 2, name );*/
		}

		mouseup(e) {
			if (this.isDown) {
				this.isDown = false; //this.current = -1;

				this.prev = {
					x: 0,
					y: 0,
					d: 0,
					v: 0
				};
				return this.mousemove(e);
			}

			return false;
			/*let name = this.testZone( e );
			this.isDown = false;
				if( this.current !== -1 ){ 
						//let tm = this.current;
					let td = this.prev.d;
						this.current = -1;
					this.prev = { x:0, y:0, d:0, v:0 };
						if( !td ){
								this.setInput( this.c[ 3 + name ] );
							return true;//this.mode( 2, name );
						} else {
							return this.reset();//this.mode( 0, tm );
					}
				}*/
		}

		mousemove(e) {
			let nup = false;
			let x = 0;
			let name = this.testZone(e);
			if (name === '') this.cursor();else {
				if (!this.isDrag) this.cursor('text');else this.cursor(this.current !== -1 ? 'move' : 'pointer');
			}

			if (this.isDrag) {
				if (this.current !== -1) {
					this.prev.d += e.clientX - this.prev.x - (e.clientY - this.prev.y);
					let n = this.prev.v + this.prev.d * this.step;
					this.value[this.current] = this.numValue(n);
					this.c[3 + this.current].textContent = this.value[this.current];
					this.validate();
					this.prev.x = e.clientX;
					this.prev.y = e.clientY;
					nup = true;
				}
			} else {
				if (this.isDown) x = e.clientX - this.zone.x - 3;
				if (this.current !== -1) x -= this.tmp[this.current][0];
				return this.upInput(x, this.isDown);
			}

			return nup;
		} //keydown: function ( e ) { return true; },
		// ----------------------


		reset() {
			let nup = false; //this.isDown = false;
			//this.current = 0;

			/* let i = this.lng;
			 while(i--){ 
					 if(this.cMode[i]!==0){
							 this.cMode[i] = 0;
							 //this.c[2+i].style.borderColor = this.colors.border;
							 nup = true;
					 }
			 }*/

			return nup;
		}

		setValue(v) {
			if (this.isVector) {
				if (v.x !== undefined) this.value[0] = v.x;
				if (v.y !== undefined) this.value[1] = v.y;
				if (v.z !== undefined) this.value[2] = v.z;
				if (v.w !== undefined) this.value[3] = v.w;
			} else {
				if (this.isSingle) this.value = [v];else this.value = v;
			}

			this.update();
		}

		sameStr(str) {
			let i = this.value.length;

			while (i--) this.c[3 + i].textContent = str;
		}

		update(up) {
			let i = this.value.length;

			while (i--) {
				this.value[i] = this.numValue(this.value[i] * this.invmulty);
				this.c[3 + i].textContent = this.value[i];
			}

			if (up) this.send();
		}

		send(v) {
			v = v || this.value;
			this.isSend = true;

			if (this.objectLink !== null) {
				if (this.isVector) {
					this.objectLink[this.val].fromArray(v);
					/*this.objectLink[ this.val ].x = v[0];
					this.objectLink[ this.val ].y = v[1];
					this.objectLink[ this.val ].z = v[2];
					if( v[3] ) this.objectLink[ this.val ].w = v[3];*/
				} else {
					this.objectLink[this.val] = v;
				}
			}

			if (this.callback) this.callback(v, this.val);
			this.isSend = false;
		} // ----------------------
		//	 INPUT
		// ----------------------


		select(c, e, w, t) {
			let s = this.s;
			let d = this.current !== -1 ? this.tmp[this.current][0] + 5 : 0;
			s[this.cursorId].width = '1px';
			s[this.cursorId].left = d + c + 'px'; //s[2].left = ( d + e ) + 'px';
			//s[2].width = w + 'px';

			s[this.selectId].left = d + e + 'px';
			s[this.selectId].width = w + 'px';
			this.c[this.selectId].innerHTML = t;
		}

		unselect() {
			let s = this.s;
			if (!s) return;
			this.c[this.selectId].innerHTML = '';
			s[this.selectId].width = 0 + 'px';
			s[this.cursorId].width = 0 + 'px';
		}

		validate(force) {
			let ar = [];
			let i = this.lng;
			if (this.allway) force = true;

			while (i--) {
				if (!isNaN(this.c[3 + i].textContent)) {
					let nx = this.numValue(this.c[3 + i].textContent);
					this.c[3 + i].textContent = nx;
					this.value[i] = nx;
				} else {
					// not number
					this.c[3 + i].textContent = this.value[i];
				}

				ar[i] = this.value[i] * this.multy;
			}

			if (!force) return;
			if (this.isSingle) this.send(ar[0]);else this.send(ar);
		} // ----------------------
		//	 REZISE
		// ----------------------


		rSize() {
			super.rSize();
			let w = Math.floor((this.sb + 5) / this.lng) - 5;
			let s = this.s;
			let i = this.lng;

			while (i--) {
				this.tmp[i] = [Math.floor(this.sa + w * i + 5 * i), w];
				this.tmp[i][2] = this.tmp[i][0] + this.tmp[i][1];
				s[3 + i].left = this.tmp[i][0] + 'px';
				s[3 + i].width = this.tmp[i][1] + 'px';
			}
		}

	}

	class Slide extends Proto {
		constructor(o = {}) {
			super(o);
			this.setTypeNumber(o);
			this.model = o.stype || 0;
			if (o.mode !== undefined) this.model = o.mode; //this.defaultBorderColor = this.colors.hide;

			this.isDown = false;
			this.isOver = false;
			this.allway = o.allway || false;
			this.isDeg = o.isDeg || false;
			this.isCyclic = o.cyclic || false;
			this.firstImput = false;
			let cc = this.colors; //this.c[2] = this.dom( 'div', this.css.txtselect + 'letter-spacing:-1px; text-align:right; width:47px; border:1px dashed '+this.defaultBorderColor+'; color:'+ this.colors.text );
			//this.c[2] = this.dom( 'div', this.css.txtselect + 'text-align:right; width:47px; border:1px dashed '+this.defaultBorderColor+'; color:'+ this.colors.text );

			this.c[2] = this.dom('div', this.css.txtselect + 'border:none; background:none; width:47px; color:' + cc.text + ';'); //this.c[2] = this.dom( 'div', this.css.txtselect + 'letter-spacing:-1px; text-align:right; width:47px; color:'+ this.colors.text );

			this.c[3] = this.dom('div', this.css.basic + ' top:0; height:' + this.h + 'px;');
			this.c[4] = this.dom('div', this.css.basic + 'background:' + cc.back + '; top:2px; height:' + (this.h - 4) + 'px;');
			this.c[5] = this.dom('div', this.css.basic + 'left:4px; top:5px; height:' + (this.h - 10) + 'px; background:' + cc.text + ';');
			this.c[2].isNum = true; //this.c[2].style.height = (this.h-4) + 'px';
			//this.c[2].style.lineHeight = (this.h-8) + 'px';

			this.c[2].style.height = this.h - 2 + 'px';
			this.c[2].style.lineHeight = this.h - 10 + 'px';

			if (this.model !== 0) {
				let h1 = 4,
						h2 = 8,
						ww = this.h - 4,
						ra = 20;

				if (this.model === 2) {
					h1 = 4; //2

					h2 = 8;
					ra = 2;
					ww = (this.h - 4) * 0.5;
				}

				if (this.model === 3) this.c[5].style.visible = 'none';
				this.c[4].style.borderRadius = h1 + 'px';
				this.c[4].style.height = h2 + 'px';
				this.c[4].style.top = this.h * 0.5 - h1 + 'px';
				this.c[5].style.borderRadius = h1 * 0.5 + 'px';
				this.c[5].style.height = h1 + 'px';
				this.c[5].style.top = this.h * 0.5 - h1 * 0.5 + 'px';
				this.c[6] = this.dom('div', this.css.basic + 'border-radius:' + ra + 'px; margin-left:' + -ww * 0.5 + 'px; border:1px solid ' + cc.border + '; background:' + cc.button + '; left:4px; top:2px; height:' + (this.h - 4) + 'px; width:' + ww + 'px;');
			}

			this.init();
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			if (l.x >= this.txl) return 'text';else if (l.x >= this.sa) return 'scroll';else return '';
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			if (this.isDown) this.isDown = false;
		}

		mousedown(e) {
			let name = this.testZone(e);
			if (!name) return false;

			if (name === 'scroll') {
				this.isDown = true;
				this.old = this.value;
				this.mousemove(e);
			}
			/*if( name === 'text' ){
					this.setInput( this.c[2], function(){ this.validate() }.bind(this) );
			}*/


			return true;
		}

		mousemove(e) {
			let nup = false;
			let name = this.testZone(e);

			if (name === 'scroll') {
				this.mode(1);
				this.cursor('w-resize'); //} else if(name === 'text'){ 
				//this.cursor('pointer');
			} else {
				this.cursor();
			}

			if (this.isDown) {
				let n = (e.clientX - (this.zone.x + this.sa) - 3) / this.ww * this.range + this.min - this.old;

				if (n >= this.step || n <= this.step) {
					n = Math.floor(n / this.step);
					this.value = this.numValue(this.old + n * this.step);
					this.update(true);
					this.old = this.value;
				}

				nup = true;
			}

			return nup;
		}

		wheel(e) {
			let name = this.testZone(e);

			if (name === 'scroll') {
				let v = this.value - this.step * e.delta;

				if (v > this.max) {
					v = this.isCyclic ? this.min : this.max;
				} else if (v < this.min) {
					v = this.isCyclic ? this.max : this.min;
				}

				this.setValue(v);
				this.old = v;
				this.update(true);
				return true;
			}

			return false;
		} //keydown: function ( e ) { return true; },
		// ----------------------


		validate() {
			let n = this.c[2].textContent;

			if (!isNaN(n)) {
				this.value = this.numValue(n);
				this.update(true);
			} else this.c[2].textContent = this.value + (this.isDeg ? '°' : '');
		}

		reset() {
			//this.clearInput();
			this.isDown = false;
			this.mode(0);
		}

		mode(mode) {
			let s = this.s;
			let cc = this.colors;

			switch (mode) {
				case 0:
					// base
					// s[2].border = '1px solid ' + this.colors.hide;
					s[2].color = cc.text;
					s[4].background = cc.back;
					s[5].background = cc.text;
					break;

				case 1:
					// scroll over
					//s[2].border = '1px dashed ' + this.colors.hide;
					s[2].color = cc.textOver;
					s[4].background = cc.back;
					s[5].background = cc.textOver;
					break;

				/* case 2: 
						 s[2].border = '1px solid ' + this.colors.borderSelect;
				 break;
				 case 3: 
						 s[2].border = '1px dashed ' + this.colors.text;//this.colors.borderSelect;
				 break;
				 case 4: 
						 s[2].border = '1px dashed ' + this.colors.hide;
				 break;*/
			}
		}

		update(up) {
			let ww = Math.floor(this.ww * ((this.value - this.min) / this.range));
			if (this.model !== 3) this.s[5].width = ww + 'px';
			if (this.s[6]) this.s[6].left = this.sa + ww + 3 + 'px';
			this.c[2].textContent = this.value + (this.isDeg ? '°' : '');
			if (up) this.send();
		}

		rSize() {
			super.rSize();
			let w = this.sb - this.sc;
			this.ww = w - 6;
			let tx = this.sc;
			if (this.isUI || !this.simple) tx = this.sc + 10;
			this.txl = this.w - tx + 2; //let ty = Math.floor(this.h * 0.5) - 8;

			let s = this.s;
			s[2].width = this.sc - 6 + 'px';
			s[2].left = this.txl + 4 + 'px'; //s[2].top = ty + 'px';

			s[3].left = this.sa + 'px';
			s[3].width = w + 'px';
			s[4].left = this.sa + 'px';
			s[4].width = w + 'px';
			s[5].left = this.sa + 3 + 'px';
			this.update();
		}

	}

	class TextInput extends Proto {
		constructor(o = {}) {
			super(o);
			this.cmode = 0;
			this.value = o.value || '';
			this.placeHolder = o.placeHolder || '';
			this.allway = o.allway || false;
			this.editable = o.edit !== undefined ? o.edit : true;
			this.isDown = false;
			let cc = this.colors; // text

			this.c[2] = this.dom('div', this.css.txtselect + 'height:' + (this.h - 4) + 'px; color:' + cc.text + '; background:' + cc.back + '; borderColor:' + cc.border + '; border-radius:' + this.radius + 'px;');
			this.c[2].textContent = this.value; // selection

			this.c[3] = this.dom('div', this.css.txtselect + 'position:absolute; top:4px; height:' + (this.h - 8) + 'px; padding:0px 0px; width:0px; color:' + cc.textSelect + '; background:' + cc.select + '; border:none; border-radius:0px;'); // cursor

			this.c[4] = this.dom('div', this.css.basic + 'top:4px; height:' + (this.h - 8) + 'px; width:0px; background:' + cc.text + ';'); // fake

			this.c[5] = this.dom('div', this.css.txtselect + 'height:' + (this.h - 4) + 'px; justify-content: center; font-style: italic; color:' + cc.border + ';');
			if (this.value === '') this.c[5].textContent = this.placeHolder;
			this.init();
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			if (l.x >= this.sa) return 'text';
			return '';
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			if (!this.editable) return;

			if (this.isDown) {
				this.isDown = false;
				return this.mousemove(e);
			}

			return false;
		}

		mousedown(e) {
			if (!this.editable) return;
			let name = this.testZone(e);

			if (!this.isDown) {
				this.isDown = true;
				if (name === 'text') this.setInput(this.c[2]);
				return this.mousemove(e);
			}

			return false;
		}

		mousemove(e) {
			if (!this.editable) return;
			let name = this.testZone(e); //let l = this.local;
			//if( l.x === -1 && l.y === -1 ){ return;}
			//if( l.x >= this.sa ) this.cursor('text');
			//else this.cursor();

			let x = 0;
			if (name === 'text') this.cursor('text');else this.cursor();
			if (this.isDown) x = e.clientX - this.zone.x;
			return this.upInput(x - this.sa - 3, this.isDown);
		}

		update() {
			this.c[2].textContent = this.value;
		} // ----------------------


		reset() {
			this.cursor();
		} // ----------------------
		//	 INPUT
		// ----------------------


		select(c, e, w, t) {
			let s = this.s;
			let d = this.sa + 5;
			s[4].width = '1px';
			s[4].left = d + e + 'px';
			s[3].left = d + e + 'px';
			s[3].width = w + 'px';
			this.c[3].innerHTML = t;
		}

		unselect() {
			let s = this.s;
			if (!s) return;
			s[3].width = 0 + 'px';
			this.c[3].innerHTML = 't';
			s[4].width = 0 + 'px';
		}

		validate(force) {
			if (this.allway) force = true;
			this.value = this.c[2].textContent;
			if (this.value !== '') this.c[5].textContent = '';else this.c[5].textContent = this.placeHolder;
			if (!force) return;
			this.send();
		} // ----------------------
		//	 REZISE
		// ----------------------


		rSize() {
			super.rSize();
			let s = this.s;
			s[2].left = this.sa + 'px';
			s[2].width = this.sb + 'px';
			s[5].left = this.sa + 'px';
			s[5].width = this.sb + 'px';
		}

	}

	class Title extends Proto {
		constructor(o = {}) {
			super(o);
			let prefix = o.prefix || '';
			this.c[2] = this.dom('div', this.css.txt + 'justify-content:right; width:60px; line-height:' + (this.h - 8) + 'px; color:' + this.colors.text);

			if (this.h === 31) {
				this.s[0].height = this.h + 'px';
				this.s[1].top = 8 + 'px';
				this.c[2].style.top = 8 + 'px';
			}

			let s = this.s;
			s[1].justifyContent = o.align || 'left'; //s[1].textAlign = o.align || 'left';

			s[1].fontWeight = o.fontWeight || 'bold';
			this.c[1].textContent = this.txt.substring(0, 1).toUpperCase() + this.txt.substring(1).replace("-", " ");
			this.c[2].textContent = prefix;
			this.init();
		}

		text(txt) {
			this.c[1].textContent = txt;
		}

		text2(txt) {
			this.c[2].textContent = txt;
		}

		rSize() {
			super.rSize();
			this.s[1].width = this.w + 'px'; //- 50 + 'px';

			this.s[2].left = this.w + 'px'; //- ( 50 + 26 ) + 'px';
		}

		setColor(c) {
			this.s[1].color = c;
			this.s[2].color = c;
		}

	}

	class Select extends Proto {
		constructor(o = {}) {
			super(o);
			this.value = o.value || '';
			this.isDown = false;

			this.onActif = o.onActif || function () {};

			o.prefix || '';
			this.c[2] = this.dom('div', this.css.txt + this.css.button + ' top:1px; background:' + this.colors.button + '; height:' + (this.h - 2) + 'px; border:' + this.colors.buttonBorder + '; border-radius:15px; width:30px; left:10px;');
			this.c[2].style.color = this.fontColor;
			this.c[3] = this.dom('div', this.css.txtselect + 'height:' + (this.h - 4) + 'px; background:' + this.colors.inputBg + '; borderColor:' + this.colors.inputBorder + '; border-radius:' + this.radius + 'px;');
			this.c[3].textContent = this.value;
			let fltop = Math.floor(this.h * 0.5) - 7;
			this.c[4] = this.dom('path', this.css.basic + 'position:absolute; width:14px; height:14px; left:5px; top:' + fltop + 'px;', {
				d: this.svgs['cursor'],
				fill: this.fontColor,
				stroke: 'none'
			});
			this.stat = 1;
			this.isActif = false;
			this.init();
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			if (l.x > this.sa && l.x < this.sa + 30) return 'over';
			return '0';
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			if (this.isDown) {
				//this.value = false;
				this.isDown = false; //this.send();

				return this.mousemove(e);
			}

			return false;
		}

		mousedown(e) {
			let name = this.testZone(e);
			if (!name) return false;
			this.isDown = true; //this.value = this.values[ name-2 ];
			//this.send();

			return this.mousemove(e);
		}

		mousemove(e) {
			let up = false;
			let name = this.testZone(e); //let sel = false;
			//console.log(name)

			if (name === 'over') {
				this.cursor('pointer');
				up = this.mode(this.isDown ? 3 : 2);
			} else {
				up = this.reset();
			}

			return up;
		} // ----------------------


		apply(v) {
			v = v || '';

			if (v !== this.value) {
				this.value = v;
				this.c[3].textContent = this.value;
				this.send();
			}

			this.mode(1);
		}

		update() {
			this.mode(3);
		}

		mode(n) {
			let change = false;
			let cc = this.colors;

			if (this.stat !== n) {
				if (n === 1) this.isActif = false;

				if (n === 3) {
					if (!this.isActif) {
						this.isActif = true;
						n = 4;
						this.onActif(this);
					} else {
						this.isActif = false;
					}
				}

				if (n === 2 && this.isActif) n = 4;
				this.stat = n;

				switch (n) {
					case 1:
						this.s[2].color = cc.text;
						this.s[2].background = cc.button;
						break;
					// base

					case 2:
						this.s[2].color = cc.textOver;
						this.s[2].background = cc.over;
						break;
					// over

					case 3:
						this.s[2].color = cc.textSelect;
						this.s[2].background = cc.select;
						break;
					// down

					case 4:
						this.s[2].color = cc.textSelect;
						this.s[2].background = cc.action;
						break;
					// actif
				}

				change = true;
			}

			return change;
		}

		reset() {
			this.cursor();
			return this.mode(this.isActif ? 4 : 1);
		}

		text(txt) {
			this.c[3].textContent = txt;
		}

		rSize() {
			super.rSize();
			let s = this.s;
			s[2].left = this.sa + 'px';
			s[3].left = this.sa + 40 + 'px';
			s[3].width = this.sb - 40 + 'px';
			s[4].left = this.sa + 8 + 'px';
		}

	} //import { Proto } from '../core/Proto.js';


	class Selector extends Button {
		constructor(o = {}) {
			if (o.selectable === undefined) o.selectable = true;
			super(o);
		}

	}

	class Empty extends Proto {
		constructor(o = {}) {
			o.isSpace = true;
			o.margin = 0;
			if (!o.h) o.h = 10;
			super(o);
			this.init();
		}

	}

	class Item extends Proto {
		constructor(o = {}) {
			super(o);
			this.p = 100;
			this.value = this.txt;
			this.status = 1;
			this.itype = o.itype || 'none';
			this.val = this.itype;
			this.graph = this.svgs[this.itype];
			let fltop = Math.floor(this.h * 0.5) - 7;
			this.c[2] = this.dom('path', this.css.basic + 'position:absolute; width:14px; height:14px; left:5px; top:' + fltop + 'px;', {
				d: this.graph,
				fill: this.colors.text,
				stroke: 'none'
			});
			this.s[1].marginLeft = 20 + 'px';
			this.init();
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mousemove(e) {
			this.cursor('pointer'); //up = this.modes( this.isDown ? 3 : 2, name );
		}

		mousedown(e) {
			if (this.isUI) this.main.resetItem();
			this.selected(true);
			this.send();
			return true;
		}

		uiout() {
			if (this.isSelect) this.mode(3);else this.mode(1);
		}

		uiover() {
			if (this.isSelect) this.mode(4);else this.mode(2);
		}

		update() {}
		/*rSize () {
				
				super.rSize();
			}*/


		mode(n) {
			let change = false;

			if (this.status !== n) {
				this.status = n;
				let s = this.s,
						cc = this.colors;

				switch (n) {
					case 1:
						this.status = 1;
						s[1].color = cc.text;
						s[0].background = 'none';
						break;

					case 2:
						this.status = 2;
						s[1].color = cc.textOver;
						s[0].background = cc.back;
						break;

					case 3:
						this.status = 3;
						s[1].color = cc.textSelect;
						s[0].background = cc.select;
						break;

					case 4:
						this.status = 4;
						s[1].color = cc.textOver;
						s[0].background = cc.over;
						break;
				}

				change = true;
			}

			return change;
		}

		reset() {
			this.cursor(); // return this.mode( 1 );
		}

		selected(b) {
			if (this.isSelect) this.mode(1);
			this.isSelect = b || false;
			if (this.isSelect) this.mode(3);
		}

	}

	class Grid extends Proto {
		constructor(o = {}) {
			super(o);
			this.values = o.values || [];
			if (typeof this.values === 'string') this.values = [this.values];
			this.lng = this.values.length;
			this.value = o.value || null;
			this.isSelectable = o.selectable || false;
			this.spaces = o.spaces || [5, 3];
			this.bsize = o.bsize || [90, 20];
			if (o.h) this.bsize[1] = o.h;
			this.bsizeMax = this.bsize[0];
			this.tmp = [];
			this.stat = [];
			this.grid = [2, Math.round(this.lng * 0.5)];
			this.h = this.grid[1] * (this.bsize[1] + this.spaces[1]) + this.spaces[1];
			this.c[1].textContent = '';
			this.c[2] = this.dom('table', this.css.basic + 'width:100%; top:' + (this.spaces[1] - 2) + 'px; height:auto; border-collapse:separate; border:none; border-spacing: ' + (this.spaces[0] - 2) + 'px ' + (this.spaces[1] - 2) + 'px;');
			let n = 0,
					b,
					td,
					tr,
					sel;
			this.res = -1;
			this.isDown = false;
			this.neverlock = true;
			this.buttons = [];
			this.stat = [];
			this.tmpX = [];
			this.tmpY = [];
			let cc = this.colors;

			for (let i = 0; i < this.grid[1]; i++) {
				tr = this.c[2].insertRow();
				tr.style.cssText = 'pointer-events:none;';

				for (let j = 0; j < this.grid[0]; j++) {
					td = tr.insertCell();
					td.style.cssText = 'pointer-events:none;';

					if (this.values[n]) {
						sel = false;
						if (this.values[n] === this.value && this.isSelectable) sel = true;
						b = document.createElement('div');
						b.style.cssText = this.css.txt + this.css.button + 'position:static; width:' + this.bsize[0] + 'px; height:' + this.bsize[1] + 'px; border:' + cc.borderSize + 'px solid ' + cc.border + '; left:auto; right:auto; border-radius:' + this.radius + 'px;';
						b.style.background = sel ? cc.select : cc.button;
						b.style.color = sel ? cc.textSelect : cc.text;
						b.innerHTML = this.values[n];
						td.appendChild(b);
						this.buttons.push(b);
						this.stat.push(1);
					} else {
						b = document.createElement('div');
						b.style.cssText = this.css.txt + 'position:static; width:' + this.bsize[0] + 'px; height:' + this.bsize[1] + 'px; text-align:center; left:auto; right:auto; background:none;';
						td.appendChild(b);
					}

					if (j === 0) b.style.cssText += 'float:right;';else b.style.cssText += 'float:left;';
					n++;
				}
			}

			this.init();
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return -1;
			let tx = this.tmpX;
			let ty = this.tmpY;
			let id = -1;
			let c = -1;
			let line = -1;
			let i = this.grid[0];

			while (i--) {
				if (l.x > tx[i][0] && l.x < tx[i][1]) c = i;
			}

			i = this.grid[1];

			while (i--) {
				if (l.y > ty[i][0] && l.y < ty[i][1]) line = i;
			}

			if (c !== -1 && line !== -1) {
				id = c + line * 2;
				if (id > this.lng - 1) id = -1;
			}

			return id;
		} // ----------------------
		//	 EVENTS
		// ----------------------


		mouseup(e) {
			if (!this.isDown) return false;
			this.isDown = false;

			if (this.res !== -1) {
				this.value = this.values[this.res];
				this.send();
			}

			return this.mousemove(e);
		}

		mousedown(e) {
			if (this.isDown) return false;
			this.isDown = true;
			return this.mousemove(e);
		}

		mousemove(e) {
			let up = false;
			this.res = this.testZone(e);

			if (this.res !== -1) {
				this.cursor('pointer');
				up = this.modes(this.isDown ? 3 : 2, this.res);
			} else {
				up = this.reset();
			}

			return up;
		} // ----------------------
		//	 MODE
		// -----------------------


		modes(N = 1, id = -1) {
			let i = this.lng,
					w,
					n,
					r = false;

			while (i--) {
				n = N;
				w = this.isSelectable ? this.values[i] === this.value : false;

				if (i === id) {
					if (w && n === 2) n = 3;
				} else {
					n = 1;
					if (w) n = 4;
				}

				if (this.mode(n, i)) r = true;
			}

			return r;
		}

		mode(n, id) {
			let change = false;
			let cc = this.colors,
					s = this.buttons;
			let i = id;

			if (this.stat[id] !== n) {
				this.stat[id] = n;

				switch (n) {
					case 1:
						s[i].style.color = cc.text;
						s[i].style.background = cc.button;
						break;

					case 2:
						s[i].style.color = cc.textOver;
						s[i].style.background = cc.overoff;
						break;

					case 3:
						s[i].style.color = cc.textOver;
						s[i].style.background = cc.over;
						break;

					case 4:
						s[i].style.color = cc.textSelect;
						s[i].style.background = cc.select;
						break;
				}

				change = true;
			}

			return change;
		} // ----------------------


		reset() {
			this.res = -1;
			this.cursor();
			return this.modes();
		}

		label(string, n) {
			this.buttons[n].textContent = string;
		}

		icon(string, y, n) {
			this.buttons[n].style.padding = (y || 0) + 'px 0px';
			this.buttons[n].innerHTML = string;
		}

		testW() {
			let vw = this.spaces[0] * 3 + this.bsizeMax * 2,
					rz = false;

			if (vw > this.w) {
				this.bsize[0] = (this.w - this.spaces[0] * 3) * 0.5;
				rz = true;
			} else {
				if (this.bsize[0] !== this.bsizeMax) {
					this.bsize[0] = this.bsizeMax;
					rz = true;
				}
			}

			if (!rz) return;
			let i = this.buttons.length;

			while (i--) this.buttons[i].style.width = this.bsize[0] + 'px';
		}

		rSize() {
			super.rSize();
			this.testW();
			let mid;
			this.tmpX = [];
			this.tmpY = [];

			for (let j = 0; j < this.grid[0]; j++) {
				if (j === 0) {
					mid = this.w * 0.5 - this.spaces[0] * 0.5;
					this.tmpX.push([mid - this.bsize[0], mid]);
				} else {
					mid = this.w * 0.5 + this.spaces[0] * 0.5;
					this.tmpX.push([mid, mid + this.bsize[0]]);
				}
			}

			mid = this.spaces[1];

			for (let i = 0; i < this.grid[1]; i++) {
				this.tmpY.push([mid, mid + this.bsize[1]]);
				mid += this.bsize[1] + this.spaces[1];
			}
		}

	}

	class Pad2D extends Proto {
		constructor(o = {}) {
			super(o);
			this.autoWidth = false;
			this.minw = this.w;
			this.diam = o.diam || this.w; //this.margin = 15;

			this.pos = new V2(0, 0);
			this.maxPos = 90;
			this.model = o.stype || 0;
			if (o.mode !== undefined) this.model = o.mode;
			this.min = o.min === undefined ? -1 : o.min;
			this.max = o.max === undefined ? 1 : o.max;
			this.range = (this.max - this.min) * 0.5;
			this.cmode = 0; //console.log(this.range)

			this.precision = o.precision === undefined ? 2 : o.precision;
			/*this.bounds = {};
			this.bounds.x1 = o.x1 || -1;
			this.bounds.x2 = o.x2 || 1;
			this.bounds.y1 = o.y1 || -1;
			this.bounds.y2 = o.y2 || 1;
				this.lerpX = this.lerp( this.margin, this.w - this.margin , this.bounds.x1, this.bounds.x2 );
			this.lerpY = this.lerp( this.margin, this.w - this.margin , this.bounds.y1, this.bounds.y2 );
				this.alerpX = this.lerp( this.bounds.x1, this.bounds.x2, this.margin, this.w - this.margin );
			this.alerpY = this.lerp( this.bounds.y1, this.bounds.y2, this.margin, this.w - this.margin );*/

			this.value = Array.isArray(o.value) && o.value.length == 2 ? o.value : [0, 0];
			this.h = o.h || this.w + 10;
			this.top = 0;
			this.c[0].style.width = this.w + 'px'; // Title

			if (this.c[1] !== undefined) {
				// with title
				this.c[1].style.width = '100%';
				this.c[1].style.justifyContent = 'center';
				this.top = 10;
				this.h += 10;
			}

			let cc = this.colors; // Value

			this.c[2] = this.dom('div', this.css.txt + 'justify-content:center; top:' + (this.h - 20) + 'px; width:100%; color:' + cc.text);
			this.c[2].textContent = this.value; // Pad

			let pad = this.getPad2d();
			this.setSvg(pad, 'fill', cc.back, 0);
			this.setSvg(pad, 'fill', cc.button, 1);
			this.setSvg(pad, 'stroke', cc.back, 2);
			this.setSvg(pad, 'stroke', cc.back, 3);
			this.setSvg(pad, 'stroke', cc.text, 4);
			this.setSvg(pad, 'viewBox', '0 0 ' + this.diam + ' ' + this.diam);
			this.setCss(pad, {
				width: this.diam,
				height: this.diam,
				left: 0,
				top: this.top
			});
			this.c[3] = pad;
			this.init();
			this.setValue();
		}

		testZone(e) {
			let l = this.local;
			if (l.x === -1 && l.y === -1) return '';
			if (l.y <= this.c[1].offsetHeight) return 'title';else if (l.y > this.h - this.c[2].offsetHeight) return 'text';else return 'pad';
			/*if( ( l.x >= this.margin ) && ( l.x <= this.w - this.margin ) && ( l.y >= this.top + this.margin ) && ( l.y <= this.top + this.w - this.margin ) ) {
					return 'pad';
			}*/
			//return '';
		}

		mouseup(e) {
			this.isDown = false;
			return this.mode(0);
		}

		mousedown(e) {
			if (this.testZone(e) === 'pad') {
				this.isDown = true;
				this.mousemove(e);
				return this.mode(1);
			}
		}

		mousemove(e) {
			if (!this.isDown) return;
			let x = this.w * 0.5 - (e.clientX - this.zone.x);
			let y = this.diam * 0.5 - (e.clientY - this.zone.y - this.top);
			let r = 256 / this.diam;
			x = -(x * r);
			y = -(y * r);
			x = Tools$1.clamp(x, -this.maxPos, this.maxPos);
			y = Tools$1.clamp(y, -this.maxPos, this.maxPos); //let x = e.clientX - this.zone.x;
			//let y = e.clientY - this.zone.y - this.top;

			/*if( x < this.margin ) x = this.margin;
			if( x > this.w - this.margin ) x = this.w - this.margin;
			if( y < this.margin ) y = this.margin;
			if( y > this.w - this.margin ) y = this.w - this.margin;*/
			//console.log(x,y)

			this.setPos([x, y]);
			this.update(true);
		}

		mode(mode) {
			if (this.cmode === mode) return false;
			let cc = this.colors;

			switch (mode) {
				case 0:
					// base
					this.s[2].color = cc.text;
					this.setSvg(this.c[3], 'fill', cc.back, 0);
					this.setSvg(this.c[3], 'fill', cc.button, 1);
					this.setSvg(this.c[3], 'stroke', cc.back, 2);
					this.setSvg(this.c[3], 'stroke', cc.back, 3);
					this.setSvg(this.c[3], 'stroke', cc.text, 4);
					break;

				case 1:
					// down
					this.s[2].color = cc.textSelect;
					this.setSvg(this.c[3], 'fill', cc.backoff, 0);
					this.setSvg(this.c[3], 'fill', cc.overoff, 1);
					this.setSvg(this.c[3], 'stroke', cc.backoff, 2);
					this.setSvg(this.c[3], 'stroke', cc.backoff, 3);
					this.setSvg(this.c[3], 'stroke', cc.textSelect, 4);
					break;
			}

			this.cmode = mode;
			return true;
		}

		update(up) {
			//if( up === undefined ) up = true;
			this.c[2].textContent = this.value;
			this.updateSVG();
			if (up) this.send();
		}

		updateSVG() {
			if (this.model == 1) {
				this.setSvg(this.c[3], 'y1', this.pos.y, 2);
				this.setSvg(this.c[3], 'y2', this.pos.y, 2);
				this.setSvg(this.c[3], 'x1', this.pos.x, 3);
				this.setSvg(this.c[3], 'x2', this.pos.x, 3);
			}

			this.setSvg(this.c[3], 'cx', this.pos.x, 4);
			this.setSvg(this.c[3], 'cy', this.pos.y, 4);
		}

		setPos(p) {
			//if( p === undefined ) p = [ this.w / 2, this.w / 2 ];
			this.pos.set(p[0] + 128, p[1] + 128);
			let r = 1 / this.maxPos;
			this.value[0] = (p[0] * r * this.range).toFixed(this.precision);
			this.value[1] = (p[1] * r * this.range).toFixed(this.precision);
		}

		setValue(v, up = false) {
			if (v === undefined) v = this.value;
			/*if ( v[0] < this.bounds.x1 ) v[0] = this.bounds.x1;
			if ( v[0] > this.bounds.x2 ) v[0] = this.bounds.x2;
			if ( v[1] < this.bounds.y1 ) v[1] = this.bounds.y1;
			if ( v[1] > this.bounds.y2 ) v[1] = this.bounds.y2;*/

			this.value[0] = Math.min(this.max, Math.max(this.min, v[0])).toFixed(this.precision) * 1;
			this.value[1] = Math.min(this.max, Math.max(this.min, v[1])).toFixed(this.precision) * 1;
			this.pos.set(this.value[0] / this.range * this.maxPos + 128, this.value[1] / this.range * this.maxPos + 128); //console.log(this.pos)

			this.update(up);
		}
		/*lerp( s1, s2, d1, d2, c = true ) {
					let s = ( d2 - d1 ) / ( s2 - s1 );
					return c ? ( v ) => { 
						return ( ( v < s1 ? s1 : v > s2 ? s2 : v ) - s1 ) * s + d1
				} : ( v ) => { 
					return ( v - s1 ) * s + d1
				}
			}*/


	}

	const add$1 = function () {
		let a = arguments;
		let type,
				o,
				ref = false,
				n = null;

		if (typeof a[0] === 'string') {
			type = a[0];
			o = a[1] || {};
		} else if (typeof a[0] === 'object') {
			// like dat gui
			ref = true;
			if (a[2] === undefined) [].push.call(a, {});
			type = a[2].type ? a[2].type : autoType(a[0][a[1]], a[2]);
			o = a[2];
			o.name = a[1];

			if (type === 'list') {
				o.list = a[0][a[1]];
			} else o.value = a[0][a[1]];
		}

		let name = type.toLowerCase();
		if (name === 'group') o.add = add$1;

		switch (name) {
			case 'bool':
			case 'boolean':
				n = new Bool(o);
				break;

			case 'button':
				n = new Button(o);
				break;

			case 'circular':
				n = new Circular(o);
				break;

			case 'color':
				n = new Color$1(o);
				break;

			case 'fps':
				n = new Fps(o);
				break;

			case 'graph':
				n = new Graph(o);
				break;

			case 'group':
				n = new Group(o);
				break;

			case 'joystick':
				n = new Joystick(o);
				break;

			case 'knob':
				n = new Knob(o);
				break;

			case 'list':
				n = new List(o);
				break;

			case 'numeric':
			case 'number':
				n = new Numeric(o);
				break;

			case 'slide':
				n = new Slide(o);
				break;

			case 'textInput':
			case 'string':
				n = new TextInput(o);
				break;

			case 'title':
			case 'text':
				n = new Title(o);
				break;

			case 'select':
				n = new Select(o);
				break;

			case 'selector':
				n = new Selector(o);
				break;

			case 'empty':
			case 'space':
				n = new Empty(o);
				break;

			case 'item':
				n = new Item(o);
				break;

			case 'grid':
				n = new Grid(o);
				break;

			case 'pad2d':
			case 'pad':
				n = new Pad2D(o);
				break;
		}

		if (n !== null) {
			if (ref) n.setReferency(a[0], a[1]);
			return n;
		}
	};

	const autoType = function (v, o) {
		let type = 'slide';
		if (typeof v === 'boolean') type = 'bool';else if (typeof v === 'string') {
			if (v.substring(0, 1) === '#') type = 'color';else type = 'string';
		} else if (typeof v === 'number') {
			if (o.ctype) type = 'color';else type = 'slide';
		} else if (typeof v === 'array' && v instanceof Array) {
			if (typeof v[0] === 'number') type = 'number';else if (typeof v[0] === 'string') type = 'list';
		} else if (typeof v === 'object' && v instanceof Object) {
			if (v.x !== undefined) type = 'number';else type = 'list';
		}
		return type;
	};

	/**	 _	 _____ _	 _	 
	*		| | |_	 _| |_| |
	*		| |_ _| | |	_	|
	*		|___|_|_| |_| |_| 2017
	*		@author lo.th / https://github.com/lo-th
	*/
	const Utils = {
		doc: document,
		Dom: document.body,
		frag: document.createDocumentFragment(),
		icon: Tools$1.icon,
		// css
		getImput: Tools$1.getImput,
		css: Tools$1.css,
		basic: Tools$1.css.basic,
		txt: Tools$1.css.txt,
		svgns: "http://www.w3.org/2000/svg",
		htmls: "http://www.w3.org/1999/xhtml",
		// function 
		dom: Tools$1.dom,
		clear: Tools$1.clear,
		setSvg: Tools$1.setSvg,
		hexToHtml: Tools$1.hexToHtml,
		// bitmap
		TRACK: `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAUCAYAAAAk0RfcAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAl1JREFUeNrsWkFWwjAQbUJ34AHwALhwiXuee7YegXIALlAOoHtk6dKlHED3cAAvoM+13ZI4rQmmpS1JU1/TMv
		Pe0GRe81+S+ZlMUjwPBaVDQmQhDENuAwTtSaaOeIjXDJ4tWBYD8RCvKTyKmxRKl8SXhbvNZmyFtN2mqoiHeE3g+YXJNWPJG5zSGx27UeIuMKrgHNpSuip9kbG5Dr7al1LMCnh9oQOh/cwzlqeK88gZG0LSeKkchla2fqn1cKbwBPo2g3xgbXCwm2XnPc9HeZjUlYE7IdnJc1jAcYHH+Z
		+ajTPw9vsVY2xUarPwqbqwYuKlSGpA5hhHVdVHeZjUpdWMpNYNz3wCvyOPkIXX681jPThcL7IH0Padcr4ostVFZhs/5OFkSe0koV3ZJrVSGTcIfQVR7w36GpkzjsS56gfoI5RHhTYDAqta5EuTKJ1HZol/itQ+krllZLYdIuehGGsEBLmI77oI53EuvkvZKpyVXPClj2Q+HzKX+sLzPp
		3unyZX8B66bcLYALbuaRJRKxJDkgNI/J09BEobPF+het+2s5CPDHFbDls/5LdA5CEUxyI92FljA2l7v3gTwH9QbVAfMyA0MYycRXm00dUd7JZl+XgyJwU7KkbolqUFoEtw9LKWYA+LBPACznkkF4i0QfGFUGqchiT3znVEakFqEzJjhG4Dif/xnCEIe3vKZktqk+icug3JI/WJDyu+6U
		TWMcE2GNptKV03jRcJ/TrzhWjylfDofc15PyL083RqlZNdh2GqjniI1wQe5tAo3TpEywL+oRzxuoSHgtIJ+RFgALOc3s25JFD0AAAAAElFTkSuQmCC`,
		X0: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA' + 'oAAAAKAgMAAADwXCcuAAAACVBMVEVMaXHi4uLi4uLDusitAAAAAnRSTlMAgJsrThgAAAA' + 'lSURBVHicYxBgcGBIYZzIIMnmxsAWycnAuIQFjEFskBhIDqgGAGxoBXlOWpMvAAAAAElFTkSuQmCC)',
		SlideBG: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA' + 'UAAAAFAQMAAAC3obSmAAAABlBMVEVMaXH///+a4ocPAAAAAnRSTlMAM8lDrC4AAAASSURBVHicY3BgaGDgYBBgUAAABkIA+fbHMRYAAAAASUVORK5CYII=)',
		SlideBG_NN: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA' + 'UAAAAFCAYAAACNbyblAAAALElEQVQImV3MsQ0AIAwDwUsmYTRGyeg0SAi7eekKF8bbwu4ETCdAJ0Ddfr8H+wEEqTj7jz0AAAAASUVORK5CYII=)',
		// VAR
		FPS: 60,
		frameTime: 1 / 60,
		frameSize: 1,
		frameMax: 1,
		frameTrack: 0,
		color: {
			track1: 'rgba(128,128,128,1)',
			// green
			track2: 'rgba(128,128,128,0.5)',
			// green
			trackover: 'rgba(160,220,55,0.5)',
			time: 'rgba(189,65,40,0.75)',
			//red,
			timeprev: 'rgba(128,128,128,0.75)',
			//grey,
			timeprevtext: 'rgba(180,180,180,1)',
			//grey,
			timeline: 'rgba(128,128,128,1)',
			//'rgba(189,171,40,0.75)',//yellow
			// blue
			select: '#035fcf',
			key: 'rgba(86,175,178,1)',
			action: 'rgba(86,175,178,0.1)'
		},
		keyColor: ['#6BB', '#BB6', '#F66'],
		soundLibs: {},
		inRange: function (v, min, max, exclud) {
			if (exclud) return v > min && v < max;else return v >= min && v <= max;
		},
		int: function (n) {
			return Math.floor(n);
		},
		liner: function (t, color, s) {
			color = color === undefined ? 'rgba(128,128,128,0.5)' : color;
			s = s || 1;
			return Utils.dom('div', Utils.basic + 'width:100%; height:1px; border-top:' + s + 'px solid ' + color + '; top:' + (t - s) + 'px;');
		},
		vliner: function (css, color) {
			if (color === undefined) color = '#888';
			return Utils.dom('div', Utils.basic + 'width:1px; height:100%; background:' + color + ';' + css);
		},
		linerBottom: function (t, color, color2) {
			if (color === undefined) color = '#888';
			if (color2 === undefined) color2 = '#rgba(128,128,128,0.5)';
			let scaleBar = Utils.dom('div', Utils.basic + 'width:100%; height:' + t + 'px; bottom:0; background:none; pointer-events:auto; cursor:row-resize; border-top:1px solid ' + color2 + '; border-bottom:1px solid ' + color + ';'); //let scaleBar = Utils.dom( 'div', Utils.basic+'width:100%; height:'+(t+1)+'px; bottom:0; background:none; pointer-events:auto; cursor:n-resize; border-top:1px solid '+color2+'; border-bottom:1px solid '+color+';');
			//Utils.dom( 'div', Utils.basic+'width:100%; height:3px; top:2px; background:' + Utils.SlideBG, null, scaleBar	);

			Utils.dom('div', Utils.basic + 'width:100%; height:4px; top:1px; background:' + Utils.SlideBG, null, scaleBar);
			scaleBar.name = 'scaleBar';
			return scaleBar;
		},
		pins: function (t) {
			let ty = ~~((t - 10) * 0.5);
			let p = Utils.dom('div', Utils.basic + 'width:20px; height:' + t + 'px; pointer-events:auto; cursor:pointer;');
			Utils.dom('div', Utils.basic + 'width:10px; height:10px; border-radius:5px; border:2px solid #ccc; top:' + ty + 'px; left:5px;', null, p);
			p.name = 'pins';
			return p;
		},
		dels: function (t) {
			let p = Utils.dom('div', Utils.basic + 'width:10px; height:10px; right:5px; top:' + (t || 5) + 'px; pointer-events:auto; cursor:pointer; background:' + Utils.X0 + ';');
			p.name = 'dels';
			return p;
		},
		saveJson: function (o, toFile) {
			let data = {
				frameMax: o.frameMax,
				"track": {}
			}; // save tracks

			let lng = o.tracks.length,
					t;

			for (let i = 0; i < lng; i++) {
				t = o.tracks[i];
				data.track[t.name] = {
					type: t.type,
					'frame': t.getFrame()
				};
			}

			let output = JSON.stringify(data, null);
			output = output.replace('"frameMax"', '\n"frameMax"');
			output = output.replace('"track":{', '\n"track":{\n		');
			output = output.replace(/}},/g, '}},\n		');
			output = output.replace('}}}}', '}}\n		}\n}');

			if (toFile) {
				let blob = new Blob([output], {
					type: 'text/plain;charset=utf-8'
				});
				saveAs(blob, "neo.json");
			} else {
				o.tmpJSON = output;
				console.log('timeline in memory');
			}
			/*
				// test value
			let objectURL = window.URL.createObjectURL( blob );
			window.open( objectURL, '_blank' );
			window.focus();
				*/

		},
		fromJson: function (o, result) {
			if (result === undefined) return;
			o.clear();
			let data = JSON.parse(result); // add track

			let t;

			for (let name in data.track) {
				t = data.track[name];
				o.add(t.type, {
					name: name,
					frame: t.frame
				});
			}
		},
		// VIDEO
		loadVideo: function (url, k) {
			let video = document.createElement('VIDEO');
			let source = document.createElement("source");
			source.setAttribute("src", './assets/video/' + url);
			source.setAttribute("type", "video/mp4");
			video.appendChild(source);
			video.load();
			video.addEventListener('loadeddata', function () {
				video.autoplay = false; //let maxi = Math.floor(video.duration.toFixed(0) * k.framerate )*2;

				let maxi = Math.floor(video.duration.toFixed(0) * k.frameRate * 2);
				k.totalFrame = Math.floor(video.duration.toFixed(0) * Utils.FPS); //* k.framerate );
				//trying to get 45 Hz ( = 60 / 2 + 60 / 4), the nearest from 48 = 2*24

				k.reSize();
				k.video = video;
				console.log(k.totalFrame, maxi);
				let w = video.videoWidth;
				let h = video.videoHeight; // preview

				document.body.insertBefore(video, document.body.firstChild);
				video.style.cssText = 'pointer-events:none; position:absolute; left:50%; top:50%; width:' + w + 'px; height:' + h + 'px; margin:' + -h * 0.5 + 'px ' + -w * 0.5 + 'px';
			}, false);
		},
		// Sound
		Sound: null,
		loadSound: function (url, k, callback) {
			if (!Utils.Sound) Utils.Sound = new (window.AudioContext || window.webkitAudioContext || window.MozAudioContext || window.oAudioContext || window.msAudioContext)();
			let name = url.substring(url.lastIndexOf('/'), url.lastIndexOf('.')); // if already loaded

			if (Utils.soundLibs[name] !== undefined) {
				if (k !== null) Utils.makeSoundKey(name, k);
				if (callback !== undefined) callback();
				return;
			} //let context = new (window.AudioContext || window.webkitAudioContext || window.MozAudioContext || window.oAudioContext || window.msAudioContext)();


			let xhr = new XMLHttpRequest();
			xhr.open('GET', './assets/sound/' + url, true);
			xhr.responseType = 'arraybuffer';

			xhr.onload = function (e) {
				Utils.Sound.decodeAudioData(xhr.response, function (buffer) {
					Utils.soundLibs[name] = {
						imgs: Utils.soundToImg(Utils.soundPeaks(buffer, true)),
						totalFrame: Math.round(buffer.duration * 60),
						buffer: buffer
					};
					console.log('loading sound: ' + name);
					if (k !== null) Utils.makeSoundKey(name, k);
					if (callback !== undefined) callback();
				});
			};

			xhr.onerror = function (e) {
				console.log(e);
			};

			xhr.send();
		},
		makeSoundKey: function (name, k) {
			Utils.clear(k.key);
			let s = Utils.soundLibs[name];

			for (let i = 0; i < s.imgs.length; i++) k.key.appendChild(s.imgs[i].cloneNode());

			k.totalFrame = s.totalFrame;
			k.buffer = s.buffer;
			k.reSize();
		},
		soundPeaks: function (buffer, split) {
			let lng = Math.round(buffer.duration * 60); //NEO.FPS

			let sampleSize = buffer.length / lng;
			let sampleStep = Math.floor(sampleSize * 0.1) || 1; //~~(sampleSize / 10) || 1;

			let channels = buffer.numberOfChannels;
			let splitPeaks = [];
			let mergedPeaks = [];

			for (let c = 0; c < channels; c++) {
				let peaks = splitPeaks[c] = [];
				let chan = buffer.getChannelData(c);

				for (let i = 0; i < lng; i++) {
					let start = Math.floor(i * sampleSize);
					let end = Math.floor(start + sampleSize);
					let max = 0;

					for (let j = start; j < end; j += sampleStep) {
						let value = chan[j];

						if (value > max) {
							max = value; // faster than Math.abs
						} else if (-value > max) {
							max = -value;
						}
					}

					peaks[i] = max;

					if (c == 0 || max > mergedPeaks[i]) {
						mergedPeaks[i] = max;
					}
				}
			}

			return split ? splitPeaks : mergedPeaks;
		},
		soundToImg: function (p, target) {
			let imgs = [];
			let c1 = p[0];
			let c2 = p[1];
			let mono = c2 === undefined ? true : false;
			let w = c1.length;
			let num = Math.floor(w / 500);
			let last = w - num * 500;
			let invw = 1 / w;
			let pp = 500 * 100 * invw;
			let pp2 = last * 100 * invw;
			let canvas = document.createElement("canvas");
			canvas.height = 100;
			canvas.width = 500;
			let canvasEnd = document.createElement("canvas");
			canvasEnd.height = 100;
			canvasEnd.width = last;
			let colors = ['rgba(86,175,178,0.3)', 'rgba(86,175,178,0.75)'];
			let ctx = canvas.getContext("2d");
			let ctx2 = canvasEnd.getContext("2d"); //ctx.lineWidth = 2;

			let n = 0,
					i,
					j,
					k,
					img;
			let midy = mono ? 50 : 25;
			let a, b;

			for (i = 0; i <= num; i++) {
				k = 500;

				if (i === num) {
					k = last;
					pp = pp2;
					canvas = canvasEnd;
					ctx = ctx2;
				}

				ctx.clearRect(0, 0, 500, 100);
				ctx.beginPath();

				for (j = 0; j < k; j++) {
					a = Math.round(c1[j + n] * midy); // || 0.5;

					ctx.fillStyle = colors[0];
					ctx.fillRect(j, midy - a, 1, a * 2);
					ctx.fillStyle = colors[1];
					ctx.fillRect(j, midy - a, 1, 1);
					ctx.fillRect(j, midy + a, 1, 1); //ctx.lineTo(j+0.5, midy-a);

					if (!mono) {
						b = Math.round(c2[j + n] * midy); // || 0.5;

						ctx.fillStyle = colors[0];
						ctx.fillRect(j, 75 - b, 1, b * 2);
						ctx.fillStyle = colors[1];
						ctx.fillRect(j, 75 - b, 1, 1);
						ctx.fillRect(j, 75 + b, 1, 1);
					}
				} //ctx.stroke();
				//ctx.fill();


				n += 500;
				img = document.createElement("img");
				img.src = canvas.toDataURL();
				img.style.cssText = 'image-rendering:pixelated; pointer-events:none; position:relative; width:' + pp + '%; height:100%; display:inline-block; '; //-webkit-filter: invert(100%); filter: invert(100%);

				imgs.push(img);
			}

			ctx = null;
			canvas = null;
			return imgs;
		}
	};

	const _Math = {
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
		lerp: function (x, y, t) {
			return (1 - t) * x + t * y;
		},
		randInt: function (low, high) {
			return low + _Math.floor(_Math.random() * (high - low + 1));
		},
		rand: function (low, high) {
			return low + _Math.random() * (high - low);
		},
		int: function (x) {
			return _Math.floor(x);
		},
		fix: function (x, n) {
			return x.toFixed(n || 0) * 1;
		},
		// RANDOM HACK
		seed: function (s) {
			return function () {
				s = _Math.sin(s) * 10000;
				return s - _Math.floor(s);
			};
		},
		// usage:

		/*
		var random1 = NEO.seed(42);
		var random2 = NEO.seed(NEO.random1());
		var random = NEO.seed(NEO.random2());
		*/
		ARRAY32: typeof Float32Array !== 'undefined' ? Float32Array : Array,
		ARRAY8: typeof Uint8Array !== 'undefined' ? Uint8Array : Array,
		Tween: function (a, b, type, t, p, n) {
			var time = (t - p) / (n - p);
			time = time > 1 ? 1 : time;

			var r = _Math.Ease[type](time);

			return a > b ? a - (a - b) * r : a + (b - a) * r;
		},
		Ease: {
			getNum: function (name) {
				var n = name.substring(0, 4);
				var r;

				switch (n) {
					case 'quad':
						r = 7;
						break;

					case 'cubi':
						r = 7;
						break;

					case 'quar':
						r = 7;
						break;

					case 'quin':
						r = 7;
						break;

					case 'sine':
						r = 7;
						break;

					case 'expo':
						r = 11;
						break;

					case 'circ':
						r = 21;
						break;

					case 'back':
						r = 11;
						break;

					case 'elas':
						r = 11;
						break;

					case 'boun':
						r = 21;
						break;
				}

				return r;
			},
			// LINEAR
			'linear': function (k) {
				return k;
			},
			// QUAD
			'quad-in': function (k) {
				return k * k;
			},
			'quad-out': function (k) {
				return k * (2 - k);
			},
			'quad-in-out': function (k) {
				if ((k *= 2) < 1) return 0.5 * k * k;
				return -0.5 * (--k * (k - 2) - 1);
			},
			// CUBIC
			'cubic-in': function (k) {
				return k * k * k;
			},
			'cubic-out': function (k) {
				return --k * k * k + 1;
			},
			'cubic-in-out': function (k) {
				if ((k *= 2) < 1) return 0.5 * k * k * k;
				return 0.5 * ((k -= 2) * k * k + 2);
			},
			// QUART
			'quart-in': function (k) {
				return k * k * k * k;
			},
			'quart-out': function (k) {
				return 1 - --k * k * k * k;
			},
			'quart-in-out': function (k) {
				if ((k *= 2) < 1) return 0.5 * k * k * k * k;
				return -0.5 * ((k -= 2) * k * k * k - 2);
			},
			// QUINT
			'quint-in': function (k) {
				return k * k * k * k * k;
			},
			'quint-out': function (k) {
				return --k * k * k * k * k + 1;
			},
			'quint-in-out': function (k) {
				if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
				return 0.5 * ((k -= 2) * k * k * k * k + 2);
			},
			// SINE
			'sine-in': function (k) {
				return 1 - _Math.cos(k * _Math.PI90);
			},
			'sine-out': function (k) {
				return _Math.sin(k * _Math.PI90);
			},
			'sine-in-out': function (k) {
				return 0.5 * (1 - _Math.cos(_Math.PI * k));
			},
			// EXPO
			'expo-in': function (k) {
				return k === 0 ? 0 : _Math.pow(1024, k - 1);
			},
			'expo-out': function (k) {
				return k === 1 ? 1 : 1 - _Math.pow(2, -10 * k);
			},
			'expo-in-out': function (k) {
				if (k === 0) return 0;
				if (k === 1) return 1;
				if ((k *= 2) < 1) return 0.5 * _Math.pow(1024, k - 1);
				return 0.5 * (-_Math.pow(2, -10 * (k - 1)) + 2);
			},
			// CIRC
			'circ-in': function (k) {
				return 1 - _Math.sqrt(1 - k * k);
			},
			'circ-out': function (k) {
				return _Math.sqrt(1 - --k * k);
			},
			'circ-in-out': function (k) {
				if ((k *= 2) < 1) return -0.5 * (_Math.sqrt(1 - k * k) - 1);
				return 0.5 * (_Math.sqrt(1 - (k -= 2) * k) + 1);
			},
			// ELASTIC
			'elastic-in': function (k) {
				var s,
						a = 0.1,
						p = 0.4;
				if (k === 0) return 0;
				if (k === 1) return 1;

				if (!a || a < 1) {
					a = 1;
					s = p * 0.25;
				} else s = p * _Math.asin(1 / a) / _Math.TwoPI;

				return -(a * _Math.pow(2, 10 * (k -= 1)) * _Math.sin((k - s) * _Math.TwoPI / p));
			},
			'elastic-out': function (k) {
				var s,
						a = 0.1,
						p = 0.4;
				if (k === 0) return 0;
				if (k === 1) return 1;

				if (!a || a < 1) {
					a = 1;
					s = p * 0.25;
				} else s = p * _Math.asin(1 / a) / _Math.TwoPI;

				return a * _Math.pow(2, -10 * k) * _Math.sin((k - s) * _Math.TwoPI / p) + 1;
			},
			'elastic-in-out': function (k) {
				var s,
						a = 0.1,
						p = 0.4;
				if (k === 0) return 0;
				if (k === 1) return 1;

				if (!a || a < 1) {
					a = 1;
					s = p * 0.25;
				} else s = p * _Math.asin(1 / a) / _Math.TwoPI;

				if ((k *= 2) < 1) return -0.5 * (a * _Math.pow(2, 10 * (k -= 1)) * _Math.sin((k - s) * _Math.TwoPI / p));
				return a * _Math.pow(2, -10 * (k -= 1)) * _Math.sin((k - s) * _Math.TwoPI / p) * 0.5 + 1;
			},
			// BACK
			'back-in': function (k) {
				var s = 1.70158;
				return k * k * ((s + 1) * k - s);
			},
			'back-out': function (k) {
				var s = 1.70158;
				return --k * k * ((s + 1) * k + s) + 1;
			},
			'back-in-out': function (k) {
				var s = 1.70158 * 1.525;
				if ((k *= 2) < 1) return 0.5 * (k * k * ((s + 1) * k - s));
				return 0.5 * ((k -= 2) * k * ((s + 1) * k + s) + 2);
			},
			// BOUNCE
			'bounce-in': function (k) {
				return 1 - this['bounce-out'](1 - k);
			},
			'bounce-out': function (k) {
				if (k < 1 / 2.75) return 7.5625 * k * k;else if (k < 2 / 2.75) return 7.5625 * (k -= 1.5 / 2.75) * k + 0.75;else if (k < 2.5 / 2.75) return 7.5625 * (k -= 2.25 / 2.75) * k + 0.9375;else return 7.5625 * (k -= 2.625 / 2.75) * k + 0.984375;
			},
			'bounce-in-out': function (k) {
				if (k < 0.5) return this['bounce-in'](k * 2) * 0.5;
				return this['bounce-out'](k * 2 - 1) * 0.5 + 0.5;
			}
		},
		// COLOR
		hexToHtml: function (v) {
			v = v === undefined ? 0x000000 : v;
			return "#" + ("000000" + v.toString(16)).substr(-6);
		},
		numToHex: function (v) {
			if (!v) v = 0x000000;
			return "0x" + ("000000" + v.toString(16)).substr(-6);
		},
		hexFormat: function (v) {
			return v.toUpperCase().replace("#", "0x");
		},
		lerpColor: function (a, b, lerp) {
			var A = [(a >> 16 & 255) / 255, (a >> 8 & 255) / 255, (a & 255) / 255];
			var B = [(b >> 16 & 255) / 255, (b >> 8 & 255) / 255, (b & 255) / 255];
			A[0] += (B[0] - A[0]) * lerp;
			A[1] += (B[1] - A[1]) * lerp;
			A[2] += (B[2] - A[2]) * lerp;
			return A[0] * 255 << 16 ^ A[1] * 255 << 8 ^ A[2] * 255 << 0;
		},
		invertColor: function (color) {
			return 0xFFFFFF ^ color;
		},
		// SINE
		Sine: function (x, phase, frequency, amplitude) {
			return _Math.sin(frequency * x + phase * _Math.degtorad) * amplitude;
		},
		// Besier aproximation
		// https://www.particleincell.com/2012/bezier-splines/
		computeControlPoints: function (k, p) {
			//var p = 2;
			var p1 = [],
					p2 = [],
					a = [],
					b = [],
					c = [],
					r = [],
					i,
					m;
			var n = k.length - 1; // left most segment

			a[0] = 0;
			b[0] = 2;
			c[0] = 1;
			r[0] = k[0] + 2 * k[1]; // internal segments

			for (i = 1; i < n - 1; i++) {
				a[i] = 1;
				b[i] = 4;
				c[i] = 1;
				r[i] = 4 * k[i] + 2 * k[i + 1];
			} // right segment


			a[n - 1] = 2;
			b[n - 1] = 7;
			c[n - 1] = 0;
			r[n - 1] = 8 * k[n - 1] + k[n]; // solves Ax=b with the Thomas algorithm

			for (i = 1; i < n; i++) {
				m = a[i] / b[i - 1];
				b[i] -= m * c[i - 1];
				r[i] -= m * r[i - 1];
			}

			p1[n - 1] = _Math.fix(r[n - 1] / b[n - 1], p);

			for (i = n - 2; i >= 0; i--) {
				p1[i] = _Math.fix((r[i] - c[i] * p1[i + 1]) / b[i], p);
			} // we have p1, now compute p2


			for (i = 0; i < n - 1; i++) {
				p2[i] = _Math.fix(2 * k[i + 1] - p1[i + 1], p);
			}

			p2[n - 1] = _Math.fix(0.5 * (k[n] + p1[n - 1]), p);
			return [p1, p2];
		}
	};
	class Perlin {
		constructor(seed) {
			this.grad3 = new _Math.ARRAY32([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1]); // NOISE 2D

			this.F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
			this.G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
			let random = Math.random;

			if (seed) {
				let random1 = _Math.seed(seed);

				let random2 = _Math.seed(random1());

				random = _Math.seed(random2());
			}

			this.p = new _Math.ARRAY8(256);
			this.perm = new _Math.ARRAY8(512);
			this.permMod12 = new _Math.ARRAY8(512);
			let i;

			for (i = 0; i < 256; i++) {
				this.p[i] = random() * 256;
			}

			for (i = 0; i < 512; i++) {
				this.perm[i] = this.p[i & 255];
				this.permMod12[i] = this.perm[i] % 12;
			}
		}

		noise(xin, yin) {
			let permMod12 = this.permMod12,
					perm = this.perm,
					grad3 = this.grad3;
			let n0 = 0,
					n1 = 0,
					n2 = 0;
			let s = (xin + yin) * this.F2;
			let i = Math.floor(xin + s);
			let j = Math.floor(yin + s);
			let t = (i + j) * this.G2;
			let X0 = i - t;
			let Y0 = j - t;
			let x0 = xin - X0;
			let y0 = yin - Y0;
			let i1, j1;

			if (x0 > y0) {
				i1 = 1;
				j1 = 0;
			} else {
				i1 = 0;
				j1 = 1;
			}

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
			} // The result is scaled to return values in the interval [-1,1].


			return 70.0 * (n0 + n1 + n2);
		}

	}

	class Pannel {
		constructor(parent) {
			this.parent = parent;
			this.content = Utils.dom('div', Utils.basic + 'top:0; left:0; width:400px; height:20px; display:none; pointer-events:auto; overflow:visible; ');
			this.content.name = 'pannel';
			this.parent.content.appendChild(this.content);
			this.key = null;
			this.type = '';
			this.init();
		}

		init() {
			let h = 19;
			let p = {
				//title:UIL.add('string', { target:this.content, value:'yoo', size:80, h:h, simple:true, pos:{ left:'-80px', top:'0px' } }),//.onChange( this.endEditName.bind(this) );
				// color
				color: add$1('color', {
					target: this.content,
					callback: null,
					name: ' ',
					color: 'n',
					w: 100,
					pos: {
						left: '10px',
						top: '0px'
					},
					simple: true,
					side: 'down',
					ctype: 'hex',
					h: h
				}),
				// curve
				curve1: add$1('list', {
					target: this.content,
					list: ['linear', 'quad', 'cubic', 'quart', 'quint', 'sine', 'expo', 'circ', 'elastic', 'back', 'bounce'],
					w: 80,
					pos: {
						left: '10px',
						top: '0px'
					},
					simple: true,
					side: 'down',
					full: true,
					h: h,
					align: 'left'
				}),
				curve2: add$1('list', {
					target: this.content,
					list: ['-in', '-out', '-in-out'],
					w: 80,
					pos: {
						left: '92px',
						top: '0px'
					},
					simple: true,
					side: 'down',
					full: true,
					h: h,
					align: 'left'
				}),
				// lfo
				lfo1: add$1('list', {
					target: this.content,
					list: ['sine', 'noise'],
					w: 80,
					pos: {
						left: '10px',
						top: '0px'
					},
					simple: true,
					side: 'down',
					full: true,
					h: h,
					align: 'left'
				}),
				lfo2: add$1('number', {
					target: this.content,
					name: 'frequency',
					min: 0,
					max: 1,
					value: 0,
					precision: 2,
					pos: {
						left: '92px',
						top: '0px'
					},
					w: 124,
					p: 60,
					h: h
				}),
				lfo3: add$1('number', {
					target: this.content,
					name: 'amplitude',
					min: 0,
					max: 1,
					value: 0,
					precision: 2,
					pos: {
						left: '210px',
						top: '0px'
					},
					w: 124,
					p: 60,
					h: h
				}),
				lfo4: add$1('number', {
					target: this.content,
					name: 'seed',
					min: 0,
					max: 999,
					value: 0,
					precision: 0,
					pos: {
						left: '336px',
						top: '0px'
					},
					w: 100,
					p: 50,
					h: h
				}),
				lfo5: add$1('number', {
					target: this.content,
					name: 'phase',
					min: 0,
					max: 360,
					value: 0,
					precision: 0,
					pos: {
						left: '336px',
						top: '0px'
					},
					w: 100,
					p: 50,
					h: h
				})
			}; //this.pannels['lfo2'] = UIL.add( 'slide',{ target:this.content, name:'freq', min:0, max:1, value:0, precision:2, pos:{left:'92px', top:'0px'}, simple:false, size:180, p:24,	sc:30, height:18 });
			//this.pannels['lfo3'] = UIL.add( 'slide',{ target:this.content, name:'ampl', min:0, max:1, value:0, precision:2, pos:{left:'274px', top:'0px'}, simple:false, size:140, p:30,	sc:30, height:18 });
			//sound

			this.pannels = p;
			this.hideAll();
		}

		resize(left, width) {
			this.content.style.left = left + 120 + 'px';
			this.content.style.width = width - 120 + 'px';
		}

		move() {
			if (this.key === null) return;
			let y = this.key.parent.top - this.parent.box.t;
			let v = this.parent.isInView(y);
			this.display(v);
			if (v) this.content.style.top = y + 'px';
		}
		/*setTitle( target, callback ){
					let y = target.top - this.parent.box.t;
				let v = this.parent.isInView( y );
					this.hideAll();
					this.display(v);
				if(v) this.content.style.top = y +'px';
					//console.log(target.name, y)
					let p = this.pannels
				let p1 =	p['title']
				p1.setValue( target.name );
				p1.display( true )
				p1.onChange ( callback );
			}
			hideTitle(){
					p1.onChange (	function(){} );
				p1.display( false )
			}*/


		setKey(key) {
			this.key = key;
			this.type = key.parent.type;
			this.move();
			this.hideAll();
			let p = this.pannels; // retcheck zone for all UIL elements

			p.color.needZone();
			let p1, p2, p3, p4, p5;

			switch (this.type) {
				case 'color':
					p1 = p['color'];
					p1.display(true);
					p1.onChange(function (v) {
						this.key.setColor(v);
					}.bind(this));
					p1.setValue(_Math.hexToHtml(this.key.value));
					p1.close();
					break;

				case 'curve':
					this.key.getType();
					p1 = p['curve1'];
					p2 = p['curve2'];
					p1.display(true);
					p1.text(this.key.name);
					p1.onChange(function (v) {
						this.key.setType(v);
						this.testEase(v, this.key.ext);
					}.bind(this));
					p2.onChange(function (v) {
						this.key.setExt(v);
					}.bind(this));
					this.testEase(this.key.name, this.key.ext);
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
					p1.text(this.key.curve);
					p2.setValue(this.key.frequency);
					p3.setValue(this.key.amplitude);
					p4.setValue(this.key.seed);
					p5.setValue(this.key.phase);
					p1.onChange(function (v) {
						this.key.setValue(v, 'curve');
						this.testLfo(v);
					}.bind(this));
					p2.onChange(function (v) {
						this.key.setValue(v, 'frequency');
					}.bind(this));
					p3.onChange(function (v) {
						this.key.setValue(v, 'amplitude');
					}.bind(this));
					p4.onChange(function (v) {
						this.key.setValue(v, 'seed');
					}.bind(this));
					p5.onChange(function (v) {
						this.key.setValue(v, 'phase');
					}.bind(this));
					this.testLfo(this.key.curve);
					break;
			}
		}

		testLfo(name) {
			let p = this.pannels;

			if (name === 'noise') {
				p['lfo4'].display(true);
				p['lfo5'].display();
			} else {
				p['lfo4'].display();
				p['lfo5'].display(true);
			}
		}

		testEase(name, pref) {
			const p = this.pannels;
			if (name === 'linear') p['curve2'].display();else {
				p['curve2'].display(true);
				p['curve2'].text(pref);
			}
		}

		hideAll() {
			for (let p in this.pannels) {
				this.pannels[p].display();
			}
		}

		display(v) {
			if (this.key === null) v = false;
			this.content.style.display = v ? 'block' : 'none';
		}

		clear() {
			//this.visible = false;
			this.key = null;
			this.type = ''; // this.content.style.display = 'none';
		}

	}

	class Key {
		constructor(f) {
			this.parent = null;
			this.value = 1;
			this.co = Utils.keyColor;
			this.select = false;
			this.frame = f;
			this.df = 0; // decal frame

			this.first = false;
			this.cct = 'background';
			const dom = Utils.dom;
			const basic = Utils.basic;
			this.w = 1; //this.parent.parent.frameSize;

			this.content = dom('div', basic + 'width:1px; height:100%; left:0px; top:0; overflow:visible;');
			this.key = dom('div', basic + 'width:100%; height:100%; opacity:0.5; left:0; top:0; pointer-events:auto; cursor:ew-resize; background:' + this.co[0]);
			this.content.appendChild(this.key);
			this.ks = this.key.style;
			this.cs = this.content.style;
			this.key.name = 'key';
		}

		selected() {
			this.select = true;
			this.ks[this.cct] = this.co[1];
			this.parent.parent.showPannel(this);
		}

		unSelected() {
			this.select = false;
			this.ks[this.cct] = this.co[0];
		}

		getValue() {
			return this.value;
		}

		getID() {
			return this.key.id;
		}

		setID(id) {
			this.key.id = id;
		}

		over() {
			this.ks[this.cct] = this.select ? this.co[2] : this.co[1];
		}

		out() {
			this.ks[this.cct] = this.select ? this.co[2] : this.co[0];
		}

		mmove(e) {}

		down(e) {}

		up(e) {}

		clear() {
			Utils.clear(this.content);
			this.content = null;
		}

		move(f) {
			if (this.first) {
				this.first = false;
				this.df = f - this.frame;
			}

			f = f - this.df;
			f = f < 0 ? 0 : f;
			let no = this.parent.frame[f];
			if (no !== undefined && no !== this.key.id) f = this.frame;
			this.ks[this.cct] = this.co[2];
			this.frame = f; //this.reSize();
			//this.l = Math.round( this.frame * this.w );

			this.l = Math.floor(this.frame * this.w);
			this.cs.left = this.l + 'px';
		}

		reSize(w) {
			this.w = w === undefined ? this.w : w; //this.l = Math.round( this.frame * this.w );
			//this.sx = Math.round( this.w );

			this.l = Math.floor(this.frame * this.w);
			this.sx = Math.floor(this.w);
			this.sx = this.sx < 6 ? 6 : this.sx;
			this.cs.width = this.sx + 'px';
			this.cs.left = this.l + 'px';
		}

		getX() {
			return this.l + this.w * 0.5;
		}

	}

	class KeyFlag extends Key {
		constructor(f, name) {
			super(f);
			this.value = name || '';
			this.flagName = add$1('string', {
				target: this.content,
				value: this.value,
				w: 80,
				h: 18,
				simple: true,
				allway: true,
				pos: {
					left: this.w + 'px',
					top: '0px'
				}
			}).onChange(function (v) {
				this.value = v;
				this.parent.showUpdate();
			}.bind(this));
		}

		clear() {
			this.flagName.clear();
			super.clear();
		}

		reSize(w) {
			super.reSize(w);
			this.flagName.c[0].style.left = this.sx + 'px';
		}

		setPy(y) {
			this.flagName.c[0].style.top = y * 18 + 'px';
		}

	}

	class KeyColor extends Key {
		constructor(f, color) {
			super(f);
			this.value = color === undefined ? 0x0000FF : color;
			this.ks.background = 'none';
			this.ks.width = '16px';
			this.ks.marginLeft = '-8px';
			this.ks.left = '50%';
			this.ks.borderRadius = '7px';
			this.ks.boxShadow = '0 0 0 1px ' + _Math.hexToHtml(_Math.invertColor(this.value));
			this.ks.border = '4px solid ' + this.co[0];
			this.cct = 'borderColor';
		}

		setColor(color) {
			this.value = _Math.numToHex(color);
			this.ks.boxShadow = '0 0 0 1px ' + _Math.hexToHtml(_Math.invertColor(this.value));
			this.parent.sort(true);
		}

	}

	class KeyCurve extends Key {
		constructor(f, o = {}, level) {
			super(f);
			o = o || [];
			this.pos = o[0] || 0;
			this.ease = o[1] || 'linear'; //this.axe = o[2] || 'x';

			this.level = level; //this.setAxe();

			this.py = 0;
			this.ext = '';
			this.name = '';
			this.ks.width = '16px';
			this.ks.height = '16px';
			this.ks.marginLeft = '-8px';
			this.ks.marginTop = '-8px';
			this.ks.left = '50%';
			this.ks.borderRadius = '7px';
			this.ks.cursor = 'move'; //'crosshair';

			this.ks.border = '3px solid ' + this.co[0];
			this.cct = 'borderColor';
			this.ks.background = 'none';
			this.color = ['#F33', '#3F3', '#59F', '#F95'];
			this.point = Utils.dom('div', Utils.basic + 'top:50%; left:50%; margin-left:-3px; margin-top:-3px; border-radius:3px; width:6px; height:6px; background:' + this.color[this.level], null, this.key);
		}

		getValue() {
			return [this.pos, this.ease];
		}

		pcolor(c) {
			this.point.style.background = c;
		}

		clear() {
			this.key.removeChild(this.point);
			super.clear();
		}

		setY() {
			this.py = this.parent.yFromPos(this.pos);
			this.ks.top = ~~this.py + 'px';
		}

		getLastX(ff) {
			return Math.floor(ff * this.w + this.w * 0.5);
		}

		getY() {
			return this.py;
		}

		setAxe() {
			let n = 0;
			if (this.axe === 'y') n = 1;
			if (this.axe === 'z') n = 2;
			if (this.axe === 'w') n = 3;
			return n;
		}

		getType() {
			let name = this.ease;
			let n = name.length;

			if (name.substring(n - 7) === '-in-out') {
				this.name = name.substring(0, n - 7);
				this.ext = '-in-out';
			} else if (name.substring(n - 3) === '-in') {
				this.name = name.substring(0, n - 3);
				this.ext = '-in';
			} else if (name.substring(n - 4) === '-out') {
				this.name = name.substring(0, n - 4);
				this.ext = '-out';
			} else {
				this.name = name;
				this.ext = '';
			}
		}

		setType(v) {
			this.name = v;
			this.setEase();
		}

		setExt(v) {
			this.ext = v;
			this.setEase();
		}

		setEase() {
			if (this.name === 'linear') this.ease = this.name;else {
				if (this.ext === '') this.ext = '-in';
				this.ease = this.name + this.ext;
			}
			this.parent.currentLevel = this.level;
			this.parent.sort(true); //this.parent.draw();
		}

		move(f, y) {
			let dy = 0; //let dx = 0;

			if (this.first) {
				this.first = false;
				this.parent.currentLevel = this.level;
				dy = y - this.py;
				this.df = f - this.frame;
			}

			let no = this.parent.frame[this.level][f];
			if (no !== undefined && no !== this.key.id) f = this.frame;
			this.ks[this.cct] = this.co[2];
			this.frame = f - this.df;
			this.l = ~~(this.frame * this.w);
			this.content.style.left = this.l + 'px'; //NEO.Key.prototype.move.call( this, f - dx );

			this.py = y - dy;
			this.pos = this.parent.posFromY(this.py);
			this.ks.top = ~~this.py + 'px';
		}

		getID(e) {
			return this.key.id;
		}

		getLevel(e) {
			return this.key.level;
		}

		setID(id, n) {
			this.key.id = id;
			this.level = n;
			this.key.level = n;
		}

	}

	class KeySwitch extends Key {
		constructor(f, end) {
			super(f);
			this.end = end || f + 1;
			this.dragtype = 0;
			this.decal = 0;
			this.min = 0;
			this.max = 1;
			this.ks.borderLeft = '1px solid #FFF';
			this.ks.borderRight = '1px solid #FFF';
		}

		getValue() {
			return this.end;
		}

		reSize(w) {
			super.reSize(w);
			this.reSizeLength();
		}

		reSizeLength() {
			this.lng = this.end - this.frame; //var ll = Math.floor( this.w * (this.lng + 1) );

			this.ks.width = Math.floor(this.w * (this.lng + 1)) + 'px';
		}

		over() {
			let f = this.parent.parent.framePrev;
			if (Utils.inRange(f, this.frame + 2, this.end - 2)) this.ks.cursor = 'ew-resize';else this.ks.cursor = 'col-resize';
			super.over();
		}

		move(f, force) {
			let p = this.parent; ///this.max = p.parent.frameMax-1;

			if (this.first) {
				this.max = p.parent.frameMax - 1;
				if (f < this.frame + 2) this.dragtype = 0;else if (f > this.end - 2) this.dragtype = 1;else this.dragtype = 2;
				if (force) this.dragtype = force;
				this.decal = f - this.frame;
				p.reset(this.frame);
				if (p.next !== undefined) this.max = p.items[p.next].frame - 1;
				if (p.prev !== undefined) this.min = p.items[p.prev].end + 1;
				this.first = false;
			}

			this.ks[this.cct] = this.co[2];

			switch (this.dragtype) {
				case 1:
					f = f < this.frame + 1 ? this.frame + 1 : f;
					this.end = f > this.max ? this.max : f;
					this.reSizeLength();
					break;

				case 2:
					this.frame = f - this.decal;
					this.frame = this.frame < 0 ? 0 : this.frame;
					this.frame = this.frame < this.min ? this.min : this.frame;
					this.frame = this.frame + this.lng > this.max ? this.max - this.lng : this.frame;
					this.end = this.frame + this.lng; //this.l = Math.floor( this.frame * this.w );

					this.l = Math.floor(this.frame * this.w);
					this.content.style.left = this.l + 'px';
					break;

				default:
					f = f > this.end - 1 ? this.end - 1 : f;
					f = f < this.min ? this.min : f;
					Key.prototype.move.call(this, f);
					this.reSizeLength();
					break;
			}
		}

	}

	class KeyModule extends KeySwitch {
		constructor(f, o = [], level) {
			super(f);
			this.end = o[0] || f + 1;
			this.value = o[1] || level;
			this.dragtype = 0;
			this.decal = 0;
			this.min = 0;
			this.max = Utils.frameMax - 1;
			this.ks.borderLeft = '1px solid #FFF';
			this.ks.borderRight = '1px solid #FFF';
			Utils.dom('div', Utils.basic + 'top:1px; left:1px; right:1px; bottom:1px;	background:' + Utils.SlideBG_NN, null, this.key);
			this.flagName = add$1('string', {
				target: this.content,
				value: this.value,
				w: 80,
				h: 18,
				simple: true,
				allway: true,
				pos: {
					left: this.w + 'px',
					top: '0px'
				}
			}).onChange(function (v) {
				this.value = v;
			}.bind(this));
		}

		clear() {
			this.flagName.clear();
			super.clear();
		}

		getValue(w) {
			return [this.end, this.value];
		}

	}

	class KeyLfo extends Key {
		constructor(f, o = []) {
			super(f);
			this.curve = o[0] || 'sine';
			this.frequency = o[1] || 0.1; // 0 to 1

			this.amplitude = o[2] || 1.0; // 0 to 1

			this.phase = o[3] || 0; // 0 to 360

			this.seed = o[4] || 0; // 0 = random

			this.perlin = null;
			if (this.curve === 'noise') this.getPerlin();
		}

		getPerlin() {
			if (this.perlin === null) this.perlin = new Perlin(this.seed);
			return this.perlin;
		}

		getValue() {
			return [this.curve, this.frequency, this.amplitude, this.phase, this.seed];
		}

		setValue(v, type) {
			this[type] = v;
			if (type === 'noise' || type === 'seed') this.perlin = new Perlin(this.seed);
			this.parent.draw();
		}

	}

	class KeyAudio extends KeyFlag {
		constructor(f, name) {
			super(f, name);
			this.totalFrame = 0;
			this.buffer = null;
			this.source = null;
			this.key.style.borderLeft = '1px solid ' + this.co[0];
			this.key.style.borderRight = '1px solid ' + this.co[0];
			this.cct = 'borderColor';
			this.key.style.background = 'none';
			this.flagName.onChange(function (v) {
				this.value = v;
				Utils.loadSound(this.value, this);
			}.bind(this));
			if (this.value) Utils.loadSound(this.value, this);
		}

		play(f) {
			if (f >= this.frame && f < this.frame + this.totalFrame && this.source === null) this.connect(f);
		}

		stop() {
			if (this.source === null) return;
			this.source.stop(0);
			this.source = null;
		}

		connect(f) {
			if (!this.buffer) return; // if( single ) this.stop();

			this.source = Utils.Sound.createBufferSource();
			this.source.buffer = this.buffer;
			this.source.connect(Utils.Sound.destination);
			let start = this.frame * this.parent.parent.frameTime;
			let begin = (f - this.frame) * this.parent.parent.frameTime; //source.start( start, bigin, NEO.frameTime );
			//if( single ) source.start( start, begin, NEO.frameTime );
			//else 

			this.source.start(start, begin);
		}

		clear() {
			this.flagName.clear();
			super.clear();
		}

		reSize(w) {
			super.reSize(w);
			this.flagName.c[0].style.left = this.sx + 'px';
			let max = ~~(this.w * this.totalFrame);
			this.key.style.width = max + 2 + 'px';
		}

	}

	class KeyVideo extends KeyFlag {
		constructor(f, o = []) {
			super(f);
			this.name = o[0] || '';
			this.frameRate = o[1] || 24;
			this.totalFrame = 0;
			this.video = null;
			this.inPlay = false; //this.source = null;

			this.ks.borderLeft = '1px solid ' + this.co[0];
			this.ks.borderRight = '1px solid ' + this.co[0];
			this.cct = 'borderColor'; //this.ks.background = 'none';

			this.flagName = add$1('string', {
				target: this.content,
				value: this.name,
				w: 80,
				h: 18,
				simple: true,
				pos: {
					left: this.w + 'px',
					top: '0px'
				}
			}).onChange(function (v) {
				this.name = v;
				Utils.loadVideo(this.name, this);
			}.bind(this));
			if (this.name) Utils.loadVideo(this.name, this);
		}

		getValue() {
			return [this.name, this.frameRate];
		}

		seek(f) {
			if (this.video === null) return;
			if (!this.video.paused) this.video.pause();

			if (f >= this.frame && f < this.frame + this.totalFrame) {
				this.video.currentTime = (f - this.frame) * this.parent.parent.frameTime + 0.00001;
				Number(this.getFrame()); // console.log(frame)

				/*var frames = f-this.frame;
				var direction = 'backward';
					if(frames > frame) direction = 'forward';
					this.video.currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / this.frameRate) + 0.00001);
				*/

				/*if( !this.inPlay ){
						this.inPlay = true;
						this.video.play();
				}*/
				//this.connect( f );
			}
		}

		getFrame() {
			if (this.video === null) return;
			return Math.floor(this.video.currentTime.toFixed(5) * this.frameRate) * 2;
		}

		play(f) {
			if (f >= this.frame && f < this.frame + this.totalFrame) {
				if (!this.inPlay) {
					this.inPlay = true;
					this.video.play();
				} //this.connect( f );

			}
		}

		stop() {
			if (this.video === null) return;
			this.inPlay = false;
			this.video.pause(); //console.log('pause')
			//this.source = null;
		}
		/*NEO.KeyVideo.prototype.connect = function( f ){
					if( this.video === null ) return;
				if (!this.video.paused) this.video.pause();
					var frame = Number(this.getFrame());
				/** To seek forward in the video, we must add 0.00001 to the video runtime for proper interactivity */
		// this.video.currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / this.frameRate) + 0.00001);
		//this.video.currentTime =	(( f-this.frame ) * NEO.frameTime) + 0.00001;

		/*this.source = NEO.Sound.createBufferSource();
		this.source.buffer = this.buffer;
		this.source.connect( NEO.Sound.destination );
			var start = this.frame * NEO.frameTime;
		var begin = ( f-this.frame ) * NEO.frameTime;
			this.source.start( start, begin );*/
		//}


		clear() {
			this.flagName.clear();
			super.clear();
		}

		reSize(w) {
			super.reSize(w);
			this.flagName.c[0].style.left = this.sx + 'px';
			let max = ~~(this.w * this.totalFrame);
			this.ks.width = max + 2 + 'px';
		}

	}

	class Track {
		constructor(o = {}, parent) {
			this.parent = parent;
			this.autoName = o.name === undefined ? true : false;
			this.name = o.name || this.type;
			this.select = false;
			this.ready = false;
			this.w = 10; // frame size

			this.maxw = 200;
			this.fulloverkey = false;
			this.isOver = false;
			this.overid = -1;
			this.overitem = null;
			this.isNameEdit = false;
			this.acolor = Utils.color.action;
			this.drag = false; //this.dragType = '';

			this.current = null;
			this.tmpName = null;
			this.id = 0;
			this.loadframe = o.frame || {};
			this.items = [];
			this.frame = {};
			this.lng = 0;
			this.show = true;
			this.needPrev = false;
			this.needNext = false;
			this.needTop = true;
			this.needTimer = false;
			this.isMedia = false;
			this.timer = null;
			this.drawdelay = null;
			this.top = 0;
			this.tt = 20; //16;

			this.tb = 8;
			this.h = 50;
			this.oldH = 50;
			this.tmpPool = [];
			this.callback = null;
			let ty = Utils.int((this.tt - 10) * 0.5);
			this.target = o.target === undefined ? undefined : o.target; // graphics

			const c = [];
			const dom = Utils.dom;
			const basic = Utils.basic;
			Utils.txt;
			let lc1 = Utils.color.track1;
			let lc2 = Utils.color.track2;
			c[0] = dom('div', basic + 'position:relative; overflow:hidden;pointer-events:auto;');
			c[1] = dom('div', Utils.css.txtselect + 'left:20px; height:16px; top:2px; pointer-events:auto; cursor:pointer; border-color:transparent; ');
			c[2] = Utils.liner(this.tt, lc2);
			c[3] = Utils.pins(this.tt);
			c[4] = Utils.dels(ty);
			c[5] = dom('div', basic + 'top:' + this.tt + 'px; left:0; width:100px; height:60px; overflow:hidden; pointer-events:auto; cursor:pointer; ');
			c[6] = Utils.linerBottom(this.tb, lc1, lc2);
			c[7] = dom('div', basic + 'height:' + this.tt + 'px;	width:100%; overflow:hidden; border-left:1px solid #555; border-right:1px solid #555; display:none;');
			c[1].name = 'trackTitle';
			this.tmpName = null;
			this.c = c;
		}

		getFrame() {
			let data = {};
			let lng = this.items.length;

			for (let i = 0; i < lng; i++) {
				data[this.items[i].frame] = this.items[i].getValue();
			}

			return data;
		}

		init() {
			let s = []; // style cached

			s[0] = this.c[0].style;
			s[0].height = this.h + 'px';
			const frag = Utils.frag;
			let i = this.c.length;

			while (i-- && i) {
				frag.appendChild(this.c[i]);
				s[i] = this.c[i].style;
			}

			this.c[1].textContent = this.name;
			this.c[1].name = 'title';
			this.c[5].name = this.type;
			this.c[6].id = this.id; //this.c[6].name = 'resize';

			this.c[1].id = this.id;
			this.c[0].appendChild(frag);
			this.s = s;
			this.addFrame();
			this.setHeight();
			this.rightExtra();
			this.ready = true;
		}

		rightExtra() {
			switch (this.type) {
				case 'bang':
				case 'switch':
					//this.preview = UIL.add( 'bool',{ target:this.c[0], name:' ', p:0, value:false, pos:{left:'auto', right:'30px', top:'0px'}, w:50, h:19, lock:true })
					break;

				case 'color':
					this.preview = add$1('color', {
						target: this.c[0],
						name: ' ',
						pos: {
							left: 'auto',
							right: '30px',
							top: '0px'
						},
						simple: true,
						side: 'down',
						ctype: 'hex',
						w: 20,
						h: 19,
						radius: 20,
						lock: true,
						notext: true
					});
					break;
			}
		}

		draw() {}

		showHide() {
			if (this.show) this.close();else this.open();
		} //------------------------
		//			change name 
		//------------------------


		editName() {
			if (this.isNameEdit) return;
			this.parent.stopEditName();

			if (!this.tmpName) {
				this.tmpName = add$1(this, 'name', {
					type: 'string',
					target: this.c[0],
					w: 100,
					simple: true,
					allway: true,
					pos: {
						left: '20px',
						top: '0px'
					}
				});
				this.tmpName.c[0].name = 'title';
			}

			this.tmpName.display(true);
			this.s[1].display = 'none';
			this.isNameEdit = true;
		}

		endEditName() {
			if (!this.isNameEdit) return;
			this.isNameEdit = false;
			this.tmpName.display();
			this.tmpName.onChange();
			this.autoName = false;
			this.c[1].textContent = this.name;
			this.s[1].display = 'flex';
		} //------------------------
		//			Track selecte 
		//------------------------


		selected() {
			this.select = true;
			this.s[1].color = '#CC0';
			if (!this.show) this.c[3].childNodes[0].style.background = '#CC0';
			this.c[3].childNodes[0].style.borderColor = '#CC0';
			this.s[7].display = 'block';
		}

		unSelected() {
			this.select = false;
			this.s[1].color = '#CCC';
			if (!this.show) this.c[3].childNodes[0].style.background = '#CCC';
			this.c[3].childNodes[0].style.borderColor = '#CCC';
			this.s[7].display = 'none'; //this.unselectAllKey();
		} //------------------------
		//			Update 
		//------------------------


		update(f) {
			this.v = this.frame[f];

			if (this.v !== undefined) {
				if (this.needPrev) this.prev = this.v;
				if (this.needNext) this.next = this.v < this.lng - 1 ? this.v + 1 : undefined;
			}
		} // reset function to find next and prev when timeline jump to frame and not play


		reset(f) {
			let t = this.resetLevel(f, this.frame, this.lng);
			this.prev = t[0];
			this.next = t[1];
		}

		resetLevel(f, frame, lng) {
			let p,
					n,
					k,
					ar,
					v = frame[f];

			if (v !== undefined) {
				p = v > 0 ? v - 1 : undefined;
				n = v + 1 < lng ? v + 1 : undefined;
			} else {
				if (!this.needPrev && !this.needNext) return [];
				ar = Object.keys(frame); // find prev frame

				if (this.needPrev && f > ar[0]) {
					k = f;

					while (p === undefined) {
						k--;
						p = frame[k];
					}
				} // find next frame


				if (this.needNext && f < ar[lng - 1]) {
					k = f;

					while (n === undefined) {
						k++;
						n = frame[k];
					}
				}
			}

			return [p, n];
		} // HEIGHT


		setHeight(h) {
			if (h) this.h = h;
			this.oldH = this.h;
			this.s[0].height = this.h + 'px';
			this.s[5].height = this.h - this.tt - this.tb + 'px';
			this.changeHeight();
		}

		applyHeight() {
			this.s[0].height = this.h + 'px';
			this.parent.calc();
		}

		changeHeight() {}

		rename(id) {
			this.id = id;
			this.c[6].id = this.id;
			this.c[1].id = this.id;

			if (this.autoName) {
				this.name = this.type + this.id;
				this.c[1].textContent = this.name;
			}
		}

		open() {
			this.show = true;
			this.h = this.oldH;
			this.c[3].childNodes[0].style.background = 'none';
			this.s[5].display = 'block';
			this.s[6].display = 'block';
			this.s[2].display = 'block';
			this.s[6].borderTopColor = Utils.color.trackover;
			this.s[6].pointerEvents = 'auto';
			this.applyHeight();
		}

		close() {
			this.show = false;
			this.h = this.tt + 2; //this.tt+1;

			if (this.select) this.c[3].childNodes[0].style.background = '#CC0';else this.c[3].childNodes[0].style.background = '#CCC';
			this.s[5].display = 'none';
			this.s[2].display = 'none';
			this.s[6].borderTopColor = 'transparent';
			this.s[6].pointerEvents = 'none';
			this.applyHeight();
		}

		syncroTrack(x, mw) {
			this.s[5].left = -x + 'px';

			if (mw) {
				this.maxw = mw; //.toFixed(2);

				this.w = this.parent.frameSize;
				this.s[5].width = mw + 'px';
				this.setSize();
			}
		}

		setID(id) {
			this.id = id;
			this.c[6].id = this.id;
			this.c[1].id = this.id;
		} //------------------------
		//			Delete 
		//------------------------


		clear() {
			Utils.clear(this.c[0]);
			if (this.target !== undefined) this.target.removeChild(this.c[0]);
			this.parent.remove(this.id);
			this.c = null;
			this.target = undefined;
		} //------------------------
		//
		//			KEY 
		//
		//------------------------


		keyOver(id, level) {
			if (this.fulloverkey && this.overitem) this.overitem.over();
			if (this.overid === id) return;
			this.overid = id;

			if (this.overitem) {
				this.overitem.out();
				this.overitem = null;
			}

			if (id !== -1) {
				if (level !== undefined) this.overitem = this.items[level][id];else this.overitem = this.items[id];
				this.overitem.over();
			}
		}

		unselectKey() {
			//this.unselectAllKey();
			if (this.current === null) return;
			this.current.unSelected();
			this.current = null;
		}

		selectKey(id) {
			this.parent.unselectKey(); //this.unselectAllKey();			

			this.items[id].selected();
			return this.items[id];
		}

		unselectAllKey() {
			let i = this.items.length;

			while (i--) {
				this.items[i].unSelected();
			}
		}

		setSize() {
			let i = this.items.length;

			while (i--) this.items[i].reSize(this.w);

			if (this.type === 'lfo' || this.type === 'audio') this.draw();
		} // add frame key at loading


		addFrame() {
			let f,
					fr = this.loadframe;

			if (this.isAudio) {
				this.addFrameOnLoad();
			} else {
				for (f in fr) this.addItem(parseInt(f), fr[f]);

				this.sort();
			}
		} // POOL loading


		addFrameOnLoad() {
			let f,
					fr = this.loadframe;
			this.tmpPool = [];

			for (f in fr) {
				if (this.tmpPool.indexOf(fr[f]) === -1) this.tmpPool.push(fr[f]);
			}

			this.callback = function () {
				this.load_next();
			}.bind(this);

			this.load(this.tmpPool[0]);
		}

		load(url) {
			if (this.isAudio) Utils.loadSound(url, null, this.callback);
		}

		load_next() {
			this.tmpPool.shift();

			if (this.tmpPool.length === 0) {
				this.callback = null;
				let f,
						fr = this.loadframe;

				for (f in fr) this.addItem(parseInt(f), fr[f]);

				this.sort();
			} else this.load(this.tmpPool[0]);
		} // add key


		addItem(f, value, level) {
			let t = this.type[0].toUpperCase() + this.type.slice(1);
			if (t === 'Bang') t = ''; //if(t === 'Module') t = '';

			if (t === 'Curve') level = level === undefined ? this.currentLevel : level;
			if (t === 'Module') level = this.name;
			let k;

			switch (t) {
				case 'Flag':
					k = new KeyFlag(f, value, level);
					break;

				case 'Color':
					k = new KeyColor(f, value, level);
					break;

				case 'Curve':
					k = new KeyCurve(f, value, level);
					break;

				case 'Switch':
					k = new KeySwitch(f, value, level);
					break;

				case 'Module':
					k = new KeyModule(f, value, level);
					break;

				case 'Lfo':
					k = new KeyLfo(f, value, level);
					break;

				case 'Audio':
					k = new KeyAudio(f, value, level);
					break;

				case 'Video':
					k = new KeyVideo(f, value, level);
					break;

				default:
					k = new Key(f, value, level);
					break;
			}

			k.parent = this;
			k.reSize(this.parent.frameSize);
			this.c[5].appendChild(k.content);

			if (t === 'Curve') {
				if (this.nAxe === 1) k.pcolor(Utils.color.key);
				this.items[level].push(k);
			} else {
				this.items.push(k);
			}

			return k;
		} // remove key


		removeID(id, level) {
			let k = level !== undefined ? this.items[level] : this.items;
			this.c[5].removeChild(k[id].content);
			k[id].clear();
			k.splice(id, 1);
			this.sort(true);
		} //------------------------
		//
		//			SORT
		//
		//------------------------


		sort(up) {
			/*if( this.timer !== null ){
					clearTimeout( this.timer );
					this.timer = null;
			}*/
			// sort key items
			this.items.sort(function (a, b) {
				return a.frame - b.frame;
			});
			this.lng = this.items.length; // create frame referency id

			let i = this.lng,
					k,
					f = {};

			while (i--) {
				k = this.items[i];
				k.setID(i);
				f[k.frame] = i;
			}

			this.frame = f; // update this track

			this.draw(); // update main frame

			if (up) this.showUpdate();
		}

		showUpdate() {
			if (this.parent.isPlay) return;
			this.parent.goTo();
		} //----------------------------
		//
		//		 MOUSE
		//
		//----------------------------


		over(e) {
			let name = e.target.name;

			if (name !== undefined) {
				if (name.substring(0, 3) === 'key') {
					let id = e.target.id,
							lvl;
					if (this.type === 'curve') lvl = e.target.level;
					this.keyOver(id, lvl);
				} else {
					this.keyOver(-1);
				}
			}

			if (this.isOver) return;
			this.isOver = true;
			this.s[0].background = 'rgba(0,0,0,0.1)';
			if (!this.show) return;
			this.s[2].borderTopColor = Utils.color.trackover;
			this.s[6].borderTopColor = Utils.color.trackover;
			this.s[5].boxShadow = 'inset 0 0 3px rgba(0,0,0,0.5)';
		}

		out(e) {
			if (!this.isOver) return; //this.endEditName()

			this.isOver = false;
			this.s[0].background = 'none';
			if (!this.show) return;
			this.s[2].borderTopColor = Utils.color.track2;
			this.s[6].borderTopColor = Utils.color.track2;
			this.s[5].boxShadow = 'none'; //this.keyOver(-1)
		}

		up(e) {
			let name = e.target.name; //console.log(name)

			if (name === undefined || name !== 'title') this.endEditName();

			if (this.drag) {
				this.drag = false;
				this.s[5].cursor = 'pointer';
				this.sort(true);
			} //this.current = null

		}

		down(e) {
			if (!this.isOver) return;
			let button = e.which;
			let name = e.target.name;
			let f = this.parent.framePrev; //.getFrameClick( e.clientX );

			this.endEditName();
			this.parent.selected(this); // this is the track selected

			if (name === undefined) return;
			name = name.substring(0, 3) === 'key' ? 'key' : name;

			switch (name) {
				case 'pins':
					if (this.show) this.close();else this.open();
					break;

				case 'dels':
					this.clear();
					break;

				case 'title':
					this.editName();
					break;

				case 'key':
					let id = e.target.id,
							lvl;
					if (this.type === 'curve') lvl = e.target.level;

					if (button === 1) {
						this.current = this.selectKey(id, lvl);

						if (this.current !== null) {
							this.current.first = true; //this.dragType = name.substring( 3 );

							this.drag = true;
							this.move(e);
						}
					}

					if (button === 3) {
						this.removeID(id, lvl);
					}

					break;

				case this.type:
					if (button === 1) {
						// add new	key
						if (this.frame[f] !== undefined) return;
						let key = this.addItem(f);
						if (this.type === 'curve') key.py = e.clientY - (this.top + this.tt);
						this.sort(true);
						this.current = this.selectKey(key.getID());
						this.current.first = true;
						this.drag = true;
						this.move(e, 1);
					}

					break;
			}
		}

		move(e, force) {
			if (!this.drag || this.current === null) return;
			let f = this.parent.framePrev; //getFrameClick( e.clientX );

			if (this.type === 'curve') {
				this.s[5].cursor = 'all-scroll';
				let y = e.clientY - (this.top + this.tt);
				this.current.move(f, y);
			} else {
				this.s[5].cursor = 'e-resize';
				this.current.move(f, force);
			} //this.sort( true );


			if (this.needTimer) {
				clearTimeout(this.timer);
				this.timer = setTimeout(this.sort.bind(this), 0, true);
			}
		}

	}

	class Bang extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'bang';
			this.init();
		}

		update(f) {
			let value = this.frame[f] === undefined ? false : true;

			if (this.select || this.parent.fullActve) {
				this.s[5].background = value ? this.acolor : 'none'; //this.preview.setValue( value )
			}

			return value;
		}

	}

	class Flag extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'flag';
			this.needPrev = true;
			this.h = 84;
			this.hmax = Math.floor((this.h - this.tt - this.tb) / 18) - 1;
			this.init();
		}

		update(f) {
			super.update(f);
			let value = this.v === undefined ? '' : this.items[this.v].value;
			if (!value) value = this.prev === undefined ? '' : this.items[this.prev].value;

			if (this.select || this.parent.fullActve) {
				this.c[5].style.background = this.v !== undefined ? this.acolor : 'none';
			}

			return value;
		}

		draw() {
			let py = 0;
			let lng = this.items.length;

			for (let i = 0; i !== lng; i++) {
				this.items[i].setPy(py);
				if (py < this.hmax) py++;else py = 0;
			}
		}

		changeHeight() {
			this.hmax = Math.floor((this.h - this.tt - this.tb) / 18) - 1;
			this.draw();
		}

	}

	class Switch extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'switch';
			this.needPrev = true;
			this.fulloverkey = true;
			this.init();
		}

		update(f) {
			super.update(f);
			let value = this.v === undefined ? false : true;
			let prev = this.items[this.prev];
			if (prev !== undefined) value = f <= prev.end ? true : value;

			if (this.select || this.parent.fullActve) {
				this.c[5].style.background = value ? this.acolor : 'none'; //this.preview.setValue( value )
			}

			return value;
		}

	}

	class Module extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'module';
			this.needPrev = true;
			this.fulloverkey = true;
			this.h = 80;
			this.init();
		}

		update(f) {
			super.update(f);
			let value = this.v === undefined ? '' : this.items[this.v].value;
			let prev = this.items[this.prev];
			if (prev !== undefined) value = f <= prev.end ? this.items[this.prev].value : '';

			if (this.select || this.parent.fullActve) {
				this.c[5].style.background = value ? this.acolor : 'none';
			}

			return value;
		}

	}

	class Color extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'color';
			this.degradId = 'deg' + parent.DID++;
			this.degrad = [];
			this.linear = [];
			this.degNumber = 5;
			this.needTimer = true;
			this.needPrev = true;
			this.needNext = true;
			this.needTop = true; //this.h = 60;

			this.createDegrad();
			this.init();
		}

		update(f) {
			//super.update( f )
			let value = this.getColor(f);

			if (this.select || this.parent.fullActve) {
				this.preview.setValue(value);
			}

			return value;
		}

		getColor(f) {
			let v = this.frame[f],
					p,
					n;

			if (v !== undefined) {
				p = v;
				n = v < this.lng - 1 ? v + 1 : undefined;
			} else {
				let t = this.resetLevel(f, this.frame, this.lng);
				p = t[0];
				n = t[1];
			}

			let value = v === undefined ? undefined : this.items[v].value;
			let prev = p !== undefined ? this.items[p] : undefined;
			let next = n !== undefined ? this.items[n] : undefined;

			if (value === undefined) {
				if (prev === undefined && next !== undefined) value = next.value;else if (next === undefined && prev !== undefined) value = prev.value;else if (next !== undefined && prev !== undefined) value = _Math.lerpColor(prev.value, next.value, (f - prev.frame) / (next.frame - prev.frame));
			}

			return _Math.numToHex(value);
		}

		createDegrad() {
			let i, degrad, linear;
			i = this.degNumber;

			while (i--) {
				degrad = Utils.dom('defs', Utils.basic + 'position:absolute; top:0px; left:100px; width:100px; height:100%;', {});
				linear = Utils.dom('linearGradient', '', {
					id: this.degradId + i,
					x1: '0%',
					y1: '0%',
					x2: '100%',
					y2: '0%'
				}, degrad, 0);
				Utils.dom('rect', '', {
					width: '100%',
					height: '100%',
					stroke: 'none',
					x: 0,
					fill: 'url(#' + (this.degradId + i) + ')'
				}, degrad);
				this.c[5].appendChild(degrad);
				this.degrad[i] = degrad;
				this.linear[i] = linear;
			}

			this.overBox = Utils.dom('div', Utils.basic + 'position:absolute; top:0; left:0; width:100%; height:100%;');
			this.c[5].appendChild(this.overBox);
		}

		draw() {
			let max = this.parent.frameMax;
			let fbygrad = max / this.degNumber;
			let pp = 100 / this.degNumber; // clear old

			let i = this.linear.length,
					node;

			while (i--) {
				node = this.linear[i].childNodes[0];

				while (node.firstChild) {
					node.removeChild(node.firstChild);
				}
			} // start color


			i = this.linear.length;

			while (i--) {
				Utils.dom('stop', '', {
					offset: 0,
					'stop-color': Tools$1.hexToHtml(this.getColor(fbygrad * i)),
					'stop-opacity': 1
				}, this.linear[i], 0);
			} // mid color


			let lng = this.items.length,
					percent,
					gid;

			for (i = 0; i < lng; i++) {
				percent = (this.items[i].frame * 100 / max).toFixed(4);
				gid = Math.floor(percent / pp);
				Utils.dom('stop', '', {
					offset: percent / pp - gid,
					'stop-color': Tools$1.hexToHtml(this.items[i].value),
					'stop-opacity': 1
				}, this.linear[gid], 0);
			} // end color


			i = this.linear.length;

			while (i--) {
				Utils.dom('stop', '', {
					offset: 1,
					'stop-color': Tools$1.hexToHtml(this.getColor(fbygrad * (i + 1) - 1)),
					'stop-opacity': 1
				}, this.linear[i], 0);
			}
		}

		over(e) {
			this.overBox.style.boxShadow = 'inset 0 0 3px rgba(0,0,0,0.5)';
			super.over(e);
		}

		out(e) {
			this.overBox.style.boxShadow = 'none';
			super.out(e);
		}

		moveDegrad(id, f) {
			this.keys[id] = f;
			this.draw();
		}

		setSize() {
			let i = this.items.length,
					item;

			while (i--) {
				item = this.items[i];
				item.reSize(this.w);
			}

			let size = Math.floor(this.parent.frameMax / this.degNumber * this.parent.frameSize);
			i = this.degrad.length;

			while (i--) {
				this.degrad[i].style.width = size + 'px';
				this.degrad[i].style.left = size * i + 'px';
			}
		}

	}

	class Curve extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'curve';
			o.frame = o.frame === undefined ? {
				x: {}
			} : o.frame;
			this.nAxe = 0;
			this.px = -10;
			this.range = o.frame.range || [-100, 100];
			this.precision = o.frame.precision || 3;
			this.defaultTween = o.frame.def || 'linear';
			if (o.frame.x !== undefined) this.nAxe++;
			if (o.frame.y !== undefined) this.nAxe++;
			if (o.frame.z !== undefined) this.nAxe++;
			if (o.frame.w !== undefined) this.nAxe++;
			this.basePos = [0, 0, 0, 0];
			this.basey = [0, 0, 0, 0]; //

			this.items = [];
			this.frame = [];
			this.lng = [];
			this.prev = [];
			this.next = [];
			this.loadframe = [];
			this.currentLevel = 0;
			this.value = {};
			this.axis = ['x', 'y', 'z', 'w'];
			this.needTimer = true;
			this.needPrev = true;
			this.needNext = true;
			this.needTop = true;
			this.pointhide = true;
			this.origine = Utils.liner(0, this.acolor);
			this.c[5].appendChild(this.origine);
			if (this.nAxe === 1) this.color = [Utils.color.key];else this.color = ['#F33', '#3F3', '#59F', '#F95'];
			this.curves = [];
			this.points = []; //var n = this.nAxe;
			//while(n--){

			for (let n = 0; n < this.nAxe; n++) {
				this.curves[n] = Utils.dom('path', Utils.basic + 'opacity:0.75; width:100%; height:100%; left:0; top:0;', {
					width: '100%',
					height: '100%',
					'd': '',
					'stroke-width': 1,
					stroke: this.color[n],
					fill: 'none',
					'stroke-linecap': 'butt'
				});
				this.points[n] = Utils.dom('div', Utils.basic + 'left:0; margin-left:-5px; margin-top:-5px; border-radius:5px; width:10px; height:10px; border:1px solid ' + this.color[n] + '; display:none');
				this.c[5].appendChild(this.curves[n]);
				this.c[5].appendChild(this.points[n]);

				if (n === 0) {
					this.value.x = 0;
					this.loadframe[0] = o.frame.x || {};
				}

				if (n === 1) {
					this.value.y = 0;
					this.loadframe[1] = o.frame.y || {};
				}

				if (n === 2) {
					this.value.z = 0;
					this.loadframe[2] = o.frame.z || {};
				}

				if (n === 3) {
					this.value.w = 0;
					this.loadframe[3] = o.frame.w || {};
				}

				this.items.push([]);
				this.lng.push(0);
			} //this.h = o.h || 130;


			this.h = o.h || 102 + this.tt + this.tb;
			this.ofRange(this.range[0], this.range[1]);
			this.init();
		}

		getFrame() {
			let data = {};
			let v = this.value;

			if (v.x !== undefined) {
				data['x'] = {};
				this.pushValue(data.x, 0);
			}

			if (v.y !== undefined) {
				data['y'] = {};
				this.pushValue(data.y, 1);
			}

			if (v.z !== undefined) {
				data['z'] = {};
				this.pushValue(data.z, 2);
			}

			if (v.w !== undefined) {
				data['w'] = {};
				this.pushValue(data.w, 3);
			}

			data['range'] = [this.range[0], this.range[1]];
			return data;
		}

		pushValue(data, l) {
			let lng = this.items[l].length;

			for (let i = 0; i < lng; i++) {
				data[this.items[l][i].frame] = this.items[l][i].getValue();
			}
		}

		update(f) {
			let v = this.value;
			if (v.x !== undefined) v.x = this.upLevel(f, 0);
			if (v.y !== undefined) v.y = this.upLevel(f, 1);
			if (v.z !== undefined) v.z = this.upLevel(f, 2);
			if (v.w !== undefined) v.w = this.upLevel(f, 3);
			this.displayPoint(f);
			if (this.nAxe === 1) return v.x;
			return v;
		}

		upLevel(f, n) {
			let v = this.frame[n][f];
			let v1 = [0, this.basePos[n], 'linear'];
			let v2 = [this.parent.frameMax, this.basePos[n]];
			let val = 0; //var p = this.precision;

			if (v !== undefined) {
				val = this.items[n][v].pos;
				this.prev[n] = v;
				this.next[n] = v < this.lng[n] - 1 ? v + 1 : undefined;
			} else {
				let prev = this.items[n][this.prev[n]];
				let next = this.items[n][this.next[n]];
				if (prev !== undefined) v1 = [prev.frame, prev.pos, prev.ease];
				if (next !== undefined) v2 = [next.frame, next.pos];
				val = _Math.Tween(v1[1], v2[1], v1[2], f, v1[0], v2[0]);
			} //return NEO.fix( val, p );//val.toFixed( this.precision )*1;


			return val.toFixed(this.precision) * 1;
		}

		displayPoint(f) {
			let change = false;
			let up = false;
			let px = 0;

			if (this.select || this.parent.fullActve) {
				if (this.pointhide) {
					this.pointhide = false;
					change = true;
				}

				up = true;
				px = this.parent.frameTrack;
			} else {
				if (!this.pointhide) {
					this.pointhide = true;
					change = true;
				}
			}

			if (!change && !up) return;
			let n = this.nAxe;

			while (n--) {
				if (change) this.points[n].style.display = this.pointhide ? 'none' : 'block';
				this.points[n].style.top = _Math.floor(this.yFromPos(this.value[this.axis[n]])) + 'px';
				this.points[n].style.left = px + 'px';
			}
		}

		draw(full) {
			if (full) {
				let n = this.nAxe;

				while (n--) {
					this.drawLevel(n);
				}
			} else {
				this.drawLevel(this.currentLevel);
			}
		}

		drawLevel(n) {
			let path = [],
					lng,
					type,
					i;
			let first = this.items[n][0];

			if (first !== undefined) {
				this.basePos[n] = first.pos;
				this.basey[n] = first.getY();
			} else {
				this.basePos[n] = 0;
				this.basey[n] = this.midy + 0.5;
			}

			path.push('M ' + 0 + ' ' + this.basey[n]);
			lng = this.lng[n];

			for (i = 0; i !== lng; i++) {
				type = this.items[n][i].ease;
				if (type === 'linear') path.push(' L ' + this.items[n][i].getX() + ' ' + this.items[n][i].getY());else this.besierSpline(type, this.items[n][i], this.items[n][i + 1], path, n);
			}

			path.push(' L ' + this.maxw + ' ' + this.basey[n]);
			this.curves[n].childNodes[0].setAttributeNS(null, 'd', path.join('\n'));
		}

		besierSpline(type, item1, item2, path, n) {
			let p = this.precision; //2;

			let x = [],
					y = [];
			let f1 = item1.frame;
			let f2, f;
			let a, b, c, d, px, py;

			let num = _Math.Ease.getNum(type);

			x[0] = item1.getX();
			y[0] = item1.getY();

			if (item2 === undefined) {
				f2 = this.parent.frameMax;
				x[num] = item1.getLastX(f2 - 1);
				y[num] = this.basey[n];
			} else {
				f2 = item2.frame;
				x[num] = item2.getX();
				y[num] = item2.getY();
			}

			if (y[0] === y[num]) {
				path.push(' L ' + x[0] + ' ' + y[0]);
				return;
			}

			let l = (f2 - f1) / (num - 1);
			let xl = (x[num] - x[0]) / (num - 1);
			let p1 = y[0];
			let p2 = y[num];
			let i = num;

			while (i--) {
				f = f1 + l * i; //x[i] = _Math.fix( x[0] + ( xl * i ), p );
				//y[i] = _Math.fix( _Math.Tween( p1, p2, type, f, f1, f2 ), p );

				x[i] = x[0] + xl * i;
				y[i] = _Math.Tween(p1, p2, type, f, f1, f2);
			}

			px = _Math.computeControlPoints(x, p);
			py = _Math.computeControlPoints(y, p);
			a = px[0];
			b = py[0];
			c = px[1];
			d = py[1];

			for (i = 0; i < num - 1; i++) {
				path.push(' L ' + x[i] + ' ' + y[i] + ' C ' + a[i] + ' ' + b[i] + ' ' + c[i] + ' ' + d[i] + ' ' + x[i + 1] + ' ' + y[i + 1]);
			}
		}

		ofRange(a, b) {
			this.range[0] = a;
			this.range[1] = b;
			let total, decal;

			if (a < 0) {
				total = Math.abs(a) + Math.abs(b);
				decal = a;
			} else if (a > 0) {
				total = b - a;
				decal = a;
			} else {
				total = b;
				decal = 0;
			}

			let h = this.h - this.tt - this.tb;
			this.range[2] = total / h;
			this.range[3] = h / total;
			this.range[4] = decal * this.range[3];
			this.range[5] = h;
			this.midy = this.range[5] * 0.5;
			this.origine.style.top = _Math.floor(this.midy) + 'px';
		}

		changeHeight() {
			this.ofRange(this.range[0], this.range[1]); //var i = this.items.length;
			//while(i--) this.items[i].setY();

			let n = this.nAxe,
					i;

			while (n--) {
				i = this.items[n].length;

				while (i--) this.items[n][i].setY();
			}

			this.draw(true);
		}

		yFromPos(pos) {
			return this.range[5] - pos * this.range[3] + this.range[4];
		}

		posFromY(y) {
			return (this.range[5] - y) * this.range[2] + this.range[0];
		} // ---------------------------------------------------------------------


		reset(f) {
			let n = this.nAxe,
					tmp;

			while (n--) {
				tmp = this.resetLevel(f, this.frame[n], this.lng[n]);
				this.prev[n] = tmp[0];
				this.next[n] = tmp[1];
			}
		}

		sort(up) {
			/*if( this.timer !== null ){
					clearTimeout( this.timer );
					this.timer = null;
			}*/
			let n = this.nAxe,
					i;

			while (n--) {
				// sort key items
				this.items[n].sort(function (a, b) {
					return a.frame - b.frame;
				});
				this.lng[n] = this.items[n].length; // create frame referency id

				this.frame[n] = {};
				i = this.lng[n];

				while (i--) {
					this.items[n][i].setID(i, n);
					this.frame[n][this.items[n][i].frame] = i;
				}
			} // update this track


			this.draw(); // update main frame

			if (up) this.showUpdate();
		}

		setSize() {
			let n = this.nAxe,
					i;

			while (n--) {
				i = this.lng[n];

				while (i--) {
					this.items[n][i].reSize(this.w);
				}
			}

			this.draw(true);
		}

		addFrame() {
			let f,
					fr,
					n = this.nAxe;

			while (n--) {
				fr = this.loadframe[n];

				for (f in fr) this.addItem(parseInt(f), fr[f], n);
			}

			this.sort();
		}

		selectKey(id, level) {
			//this.unselectAllKey();
			this.parent.unselectKey();
			level = level === undefined ? this.currentLevel : level;
			this.items[level][id].selected();
			return this.items[level][id];
		}

		unselectAllKey() {
			let n = this.nAxe,
					i;

			while (n--) {
				i = this.lng[n];

				while (i--) {
					this.items[n][i].unSelected();
				}
			}
		}

	}

	class Lfo extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'lfo';
			this.needTimer = true;
			this.needPrev = true;
			this.needTop = true;
			this.pointhide = true;
			this.origine = Utils.liner(0, this.acolor);
			this.c[5].appendChild(this.origine);
			this.curve = Utils.dom('path', Utils.basic + 'width:100%; height:100%; left:0; top:0;', {
				width: '100%',
				height: '100%',
				'd': '',
				'stroke-width': 1,
				stroke: Utils.color.key,
				fill: 'none',
				'stroke-linecap': 'butt'
			});
			this.point = Utils.dom('div', Utils.basic + 'left:0; margin-left:-5px; margin-top:-5px; border-radius:5px; width:10px; height:10px; border:1px solid ' + Utils.color.key + '; display:none'); //this.c[5].appendChild(this.curveOrigine);

			this.c[5].appendChild(this.curve);
			this.c[5].appendChild(this.point);
			this.h = o.h || 102 + this.tt + this.tb;
			this.ofRange();
			this.init();
		}

		update(f) {
			super.update(f);
			let value = 0;
			let cc; ///let v = this.v ? this.v : ( this.prev ? this.prev : undefined );

			let v = this.v === undefined ? this.prev === undefined ? undefined : this.prev : this.v;

			if (v !== undefined) {
				cc = this.items[v];
				if (cc.curve === 'sine') value = _Math.Sine(f - cc.frame, cc.phase, cc.frequency, cc.amplitude);
				if (cc.curve === 'noise') value = cc.perlin.noise((f - cc.frame) * cc.frequency * 0.1, 0) * cc.amplitude;
			}

			if (this.select || this.parent.fullActve) {
				if (this.pointhide) {
					this.pointhide = false;
					this.point.style.display = 'block';
				}

				this.point.style.top = value * (this.midy - 10) + this.midy + 'px';
				this.point.style.left = this.parent.frameTrack + 'px';
			} else {
				if (!this.pointhide) {
					this.pointhide = true;
					this.point.style.display = 'none';
				}
			} //console.log( v )


			return value;
		}

		draw() {
			clearTimeout(this.drawdelay);
			this.drawdelay = setTimeout(this.drawCurve.bind(this), 0); //this.drawCurve()
		}

		drawCurve() {
			//let midy = (this.range[5]*0.5)+0.5;
			let fsize = this.parent.frameSize;
			let max = this.parent.frameMax; //fsize * NEO.main.nframe;

			let size;
			let path = [];
			path.push('M ' + 0 + ' ' + this.midy);
			let lng = this.lng;

			for (let i = 0; i !== lng; i++) {
				if (i < lng - 1) size = this.items[i + 1].frame - this.items[i].frame; //this.items[i+1].getX();// - (fsize*0.5);
				else size = max - this.items[i].frame;
				if (this.items[i].curve === 'sine') this.curveSine(this.items[i], size, fsize, path);
				if (this.items[i].curve === 'noise') this.curveNoise(this.items[i], size, fsize, path);
			}

			path.push(' L ' + this.maxw + ' ' + this.midy);
			this.curve.childNodes[0].setAttributeNS(null, 'd', path.join('\n'));
		}

		curveNoise(item, size, fsize, path) {
			let x = item.getX();
			let perlin = item.getPerlin(); //perlin;

			let amplitude = item.amplitude;
			let frequency = item.frequency;
			let middle = this.midy;
			let rarity = this.w;
			let m = 1; //0.25;;

			let x1, x2, y1, y2;
			let lng = size / m;

			for (let i = 1; i < lng; i += 2) {
				x1 = (i - 1) * rarity * m + x;
				y1 = perlin.noise((i - 1) * frequency * 0.1, 0) * amplitude * (middle - 10) + middle;
				x2 = i * rarity * m + x;
				y2 = perlin.noise(i * frequency * 0.1, 0) * amplitude * (middle - 10) + middle;
				x1 = x1.toFixed(2);
				x2 = x2.toFixed(2);
				y1 = y1.toFixed(2);
				y2 = y2.toFixed(2);
				path.push(' L ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2);
			}
		}

		curveSine(item, size, fsize, path) {
			let x = item.getX();
			let x1, x2, y1, y2;
			let middle = this.midy;
			let amplitude = item.amplitude;
			let frequency = item.frequency;
			let phase = item.phase;
			let rarity = this.w;
			let m = 0.5; //0.25;

			let lng = size / m;

			for (let i = 1; i < lng; i += 2) {
				x1 = (i - 1) * rarity * m + x;
				y1 = _Math.Sine((i - 1) * m, phase, frequency, amplitude) * (middle - 10) + middle;
				x2 = i * rarity * m + x;
				y2 = _Math.Sine(i * m, phase, frequency, amplitude) * (middle - 10) + middle;
				x1 = x1.toFixed(2);
				x2 = x2.toFixed(2);
				y1 = y1.toFixed(2);
				y2 = y2.toFixed(2);
				path.push(' L ' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2);
			}
		}

		ofRange() {
			//Curve.prototype.ofRange.call( this, a, b );
			let h = this.h - this.tt - this.tb;
			this.midy = h * 0.5;
			this.origine.style.top = ~~this.midy + 'px';
		}

		changeHeight() {
			this.ofRange();
			this.draw();
		}

	}

	class Audio extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'audio';
			this.range = o.range || [-100, 100];
			this.needPrev = true;
			this.isMedia = true;
			this.origine = Utils.liner(0, this.acolor);
			this.h = o.h || 102 + this.tt + this.tb;
			this.init();
		}

		update(f) {
			super.update(f);
			let v = this.v === undefined ? this.prev === undefined ? undefined : this.prev : this.v; //var value = this.v === undefined ? null : this.items[this.v];
			//if( value === null ) value = this.prev === undefined ? null : this.items[this.prev];

			if (v !== undefined) {
				if (this.parent.isPlay) this.items[v].play(f);
			}
		}

		reset(f) {
			this.stop();
			super.reset(f);
		}

		stop() {
			let i = this.items.length;

			while (i--) this.items[i].stop();
		}

	}

	class Video extends Track {
		constructor(o = {}, parent) {
			super(o, parent);
			this.type = 'video';
			this.needPrev = true;
			this.isMedia = true;
			this.h = o.h || 102 + this.tt + this.tb;
			this.init();
		}

		update(f) {
			super.update(f);
			let value = 0;
			let v = this.v === undefined ? this.prev === undefined ? undefined : this.prev : this.v;

			if (v !== undefined) {
				if (this.parent.isPlay) this.items[v].play(f);
				value = this.items[v].getFrame();
			}

			return value;
		}

		reset(f) {
			this.videoGo(f);
			super.reset(f);
		}

		stop() {
			let i = this.items.length;

			while (i--) this.items[i].stop();
		}

		videoGo(f) {
			let i = this.items.length;

			while (i--) this.items[i].seek(f);
		}

	}

	/**	 _	 _____ _	 _	 
	*		| | |_	 _| |_| |
	*		| |_ _| | |	_	|
	*		|___|_|_| |_| |_| 2022
	*		@author lo.th / https://github.com/lo-th
	*/
	class Timeline {
		constructor(o = {}) {
			this.types = ['bang', 'flag', 'switch', 'module', 'color', 'curve', 'lfo', 'audio', 'video'];
			this.fullActve = true;
			this.visible = true;
			this.isLoop = true;
			this.isPlay = false;
			this.isScroll = false;
			this.isDown = false;
			this.tmpJSON = null;
			this.DID = 0;
			this.callback = o.callback || null;
			this.layers = [];
			this.tracks = [];
			this.data = {};
			this.trackLength = 0;
			this.colorSelect = '#035fcf';
			this.frameMax = o.maxframe || 750;
			this.frameTime = 1 / 60;
			this.frameSize = 1;
			this.frameTrack = 0;
			this.frame = 0;
			this.time = 0;
			this.leftFrame = 0;
			this.zone = 50;
			this.trackSpace = [0, 0]; // TIME

			this.temp = 0;
			this.rfps = 0;
			this.count = 0;
			this.timerStep = 0;
			this.step = 0;
			this.delta = 0;
			this.then = 0;
			this.prev = 0; //

			this.fps = 60;
			this.invFS = 0;
			this.framefix = 1;
			this.maxSize = 0;
			this.maxPos = 0;
			this.overtrack = null;
			this.scy = 0;
			this.maxScy = 0;
			this.viewInvRatio = 0;
			this.currentPannel = '';
			this.currentKey = null;
			this.currentAction = '';
			this.currentResize = null;
			this.ratio = 0;
			this.invRatio = 0;
			this.minWidth = 0;
			this.maxWidth = 0;
			this.box = {
				l: 0,
				t: 0,
				r: 0,
				b: 0,
				w: 0,
				h: 0,
				d: 0,
				lr: 0,
				top: 70,
				m: 1
			};
			this.range = {
				start: 0,
				end: 1,
				lng: 1,
				decal: 0,
				mid: 0,
				midpos: 0
			};
			this.hhh = {
				total: 0,
				full: 89,
				scroll: 0
			};
			this.scalerRec = {
				l: 0,
				r: 0,
				w: 0
			};
			this.box.t = o.top || 0; //20

			this.box.b = o.bottom || 0; //20

			this.box.l = o.left || 0; //20

			this.box.r = o.right || 0; //20

			let dom = Utils.dom;
			let basic = Utils.css.basic; // CONTENT ROOT

			this.content = dom('div', basic + 'top:' + this.box.t + 'px; left:' + this.box.l + 'px; overflow:visible; pointer-events:auto; margin-left:-' + this.box.m + 'px; margin-top:-' + this.box.m + 'px; border:' + this.box.m + 'px solid #000; box-sizing:content-box; background:rgba(0,0,0,0.25);'); // TOP MENU

			this.topmenu = dom('div', basic + 'top:0; left:0; width:100%; height:30px; overflow:visible;	background:rgba(0,0,0,0.25); '); //background:rgba(255,255,255,0.075); ');

			this.textTime = dom('div', Utils.css.txt + 'top:4px; left:64px; width:150px; height:22px; font-size:15px; letter-spacing:-1px; padding:5px 5px; background:rgba(0,0,0,0.25); border-radius:4px; border:1px solid rgba(80,80,80,0.25); text-shadow:none;');
			this.textTime.textContent = '0:00:00.00 | 0';
			this.topmenu.appendChild(this.textTime); // NAV MENU

			this.navmenu = dom('div', basic + 'width:100%; top:30px; height:20px; overflow:hidden; padding:1px 5px; background:rgba(0,0,0,0.25);'); //background:rgba(255,255,255,0.05);');
			// TOP TIMEBAR 

			this.timeBar = dom('div', basic + 'width:100%; height:20px; top:' + (this.box.top - 20) + 'px; pointer-events:auto; cursor:col-resize; background:rgba(0,0,0,0.25);'); //background:rgba(255,255,255,0.025);' ); 

			let tb = dom('div', basic + 'width:100%; height:20px; top:0;', null, this.timeBar);
			let def = dom('defs', basic + 'width:100%; height:20px; bottom:0;', {});
			let p = dom('pattern', '', {
				id: 'timeBar',
				x: 0,
				y: 0,
				width: 50,
				height: 20,
				patternUnits: 'userSpaceOnUse',
				patternTransform: 'translate(-0.5)'
			}, def, 0);
			let g = dom('g', '', {
				stroke: Utils.color.timeline,
				'stroke-width': 1,
				fill: 'none',
				'stroke-linecap': "butt"
			}, p, 0);
			dom('path', '', {
				d: 'M0 0'
			}, g, 0);
			dom('rect', '', {
				width: '100%',
				height: 20,
				x: 0,
				fill: 'url(#timeBar)'
			}, def);
			this.pattern = def.childNodes[0].childNodes[0];
			tb.appendChild(def);
			tb.appendChild(Utils.liner(20, Utils.color.timeline, 1));
			this.timeBar.name = 'timeBar'; // BOTTOM TIME SCALE

			this.timescale = dom('div', basic + 'width:100%; height:20px; bottom:0; pointer-events:auto; cursor:e-resize; overflow:hidden; border-top:1px solid #888;');
			this.timescale.name = 'timescale'; // BOTTOM TIME SCALE SCROLLER

			this.scaler = dom('div', basic + 'width:200px; height:16px; top:2px; overflow:visible;', null, this.timescale);
			this.scaler.appendChild(Utils.liner(8));
			let s = 'width:16px; height:16px; top:0px; pointer-events:auto; cursor:col-resize; border:2px solid #888; border-radius:8px;';
			this.sl = dom('div', basic + s + 'left:-8px;', null, this.scaler);
			this.sr = dom('div', basic + s + 'right:-8px;', null, this.scaler);
			this.sl.name = 'scaleLeft';
			this.sr.name = 'scaleRight';
			this.scOver = false; // TRACK CONTENT

			this.innerContent = dom('div', basic + 'width:100%; top:70px; height:0px; overflow:hidden;');
			this.inner = dom('div', basic + 'width:100%; top:0px; height:0px; overflow:hidden;', null, this.innerContent); // TIME MARKER FAKE

			let mextra = 'border-right:1px solid rgba(0,0,0,0.25); background:' + Utils.color.timeprev + '; ';
			this.miniPrev = dom('div', basic + 'width:30px; height:15px; margin-left:10px; top:52px;	font-size:14px; letter-spacing:-1px; color:' + Utils.color.timeprevtext + '; ', null, this.timescale);
			this.markerPrev = dom('div', basic + 'top:52px; width:10px; height:60px; overflow:hidden;');
			dom('div', basic + mextra + 'width:100%; top:0; height:16px; border-radius:4px;', null, this.markerPrev);
			dom('div', basic + mextra + 'left:50%; margin-left:-1px; width:2px; top:18px; height:100%;', null, this.markerPrev); // TIME MARKER

			mextra = 'border-right:1px solid rgba(0,0,0,0.25); background:' + Utils.color.time + '; ';
			this.marker = dom('div', basic + 'top:52px; width:10px; height:60px; overflow:hidden;');
			dom('div', basic + mextra + 'width:100%; top:0; height:16px; border-radius:4px;', null, this.marker);
			dom('div', basic + mextra + 'left:50%; margin-left:-1px; width:2px; top:18px; height:100%;', null, this.marker); // TIME MARKER IN BOTTOM 

			this.mini = dom('div', basic + mextra + 'width:1px; height:15px; top:2px; ', null, this.timescale); // H SCROLL

			this.hscroll = dom('div', basic + 'position:absolute; width:19px; height:100px; left:auto; right:1px; top:69px; border-left:1px solid #888; border-top:1px solid #888; background:#1b1b1b; pointer-events:auto; cursor:n-resize;');
			dom('div', basic + 'position:absolute; width:10px; height:20px; left:4px; top:0px; background:#666; ', null, this.hscroll);
			this.hscroll.name = 'hscroll'; // ADD

			let frag = Utils.frag;
			frag.appendChild(this.timeBar);
			frag.appendChild(this.timescale);
			frag.appendChild(this.innerContent);
			frag.appendChild(this.markerPrev);
			frag.appendChild(this.miniPrev);
			frag.appendChild(this.marker);
			frag.appendChild(this.hscroll);
			frag.appendChild(this.navmenu);
			frag.appendChild(this.topmenu);
			this.content.appendChild(frag); // PANNEL for key options

			this.pannel = new Pannel(this);
			if (o.parent !== undefined) o.parent.appendChild(this.content);else document.body.appendChild(this.content); // 

			this.setFps(this.fps);
			this.activeEvents();
			this.initTopMenu(this.topmenu);
			this.initNavMenu(this.navmenu);
			this.miniUI();
			this.resize();
			if (o.open !== undefined) if (!o.open) this.showHide();
		}

		miniUI() {
			this.content2 = Utils.dom('div', Utils.basic + 'top:' + this.box.t + 'px; left:10px; width:50px; height:71px');
			this.openButton = add$1('button', {
				target: this.content2,
				w: 44,
				h: 44,
				pos: {
					left: '0px',
					top: '3px'
				},
				simple: true
			}).icon(Tools$1.icon('neo', '#888', 40)).onChange(this.showHide.bind(this));
			this.playButton2 = add$1('button', {
				target: this.content2,
				w: 44,
				h: 24,
				pos: {
					left: '0px',
					top: '48px'
				},
				simple: true
			}).onChange(this.play.bind(this));
			this.playButton2.icon(this.playIcon, 2);
			this.playButton2.display();
			document.body.appendChild(this.content2);
		}

		onChange(f) {
			this.callback = f || null;
			return this;
		}

		floor(x) {
			return Math.floor(x);
		}

		load(url) {
			let xhr = new XMLHttpRequest();

			xhr.onload = function (e) {
				Utils.fromJson(JSON.parse(xhr.responseText));
			};

			xhr.open('GET', url, true);
			xhr.send();
		} // ----------------------
		//	 LAYER 
		// ----------------------


		initNavMenu(dom) {
			let callbackAddLayer = function (v) {
				this.addLayer();
			}.bind(this);

			let callbackRemoveLayer = function (v) {
				this.removeLayer();
			}.bind(this);

			this.layers.push('ROOT');
			let x = 170 + 54;
			add$1('button', {
				target: this.navmenu,
				name: '+',
				pos: {
					left: x + 'px'
				},
				simple: true,
				w: 24,
				h: 18
			}).onChange(callbackAddLayer);
			x += 26;
			add$1('button', {
				target: this.navmenu,
				name: '-',
				pos: {
					left: x + 'px'
				},
				simple: true,
				w: 24,
				h: 18
			}).onChange(callbackRemoveLayer);
			x += 34;
			this.layerSelector = add$1('selector', {
				target: this.navmenu,
				simple: true,
				w: 60 * this.layers.length,
				h: 18,
				pos: {
					left: x + 'px'
				},
				bDown: '#888',
				h: 18,
				values: this.layers,
				value: 'ROOT'
			});
		}

		removeLayer() {
			if (this.layers.length < 2) return;
			this.layers = this.layers.splice(0, this.layers.length - 1);
			this.layerSelector.clear();
			this.layerSelector = add$1('selector', {
				target: this.navmenu,
				simple: true,
				w: 60 * this.layers.length,
				h: 18,
				pos: {
					left: '230px'
				},
				bDown: '#888',
				h: 18,
				values: this.layers,
				value: 'ROOT'
			});
		}

		addLayer() {
			if (this.layers.length > 8) return;
			let name = 'LAYER' + (this.layers.length - 1);
			this.layers.push(name);
			this.layerSelector.clear();
			this.layerSelector = add$1('selector', {
				target: this.navmenu,
				simple: true,
				w: 60 * this.layers.length,
				h: 18,
				pos: {
					left: '230px'
				},
				bDown: '#888',
				h: 18,
				values: this.layers,
				value: name
			});
		} // ----------------------
		//	 TOP INTERFACE
		// ----------------------


		initTopMenu(dom) {
			let callbackMemo = function (v) {
				Utils.saveJson(this);
			}.bind(this);

			let callbackBack = function (v) {
				Utils.fromJson(this, this.tmpJSON);
			}.bind(this);

			let callbackSave = function (v) {
				Utils.saveJson(this, true);
			}.bind(this);

			let callbackLoad = function (result) {
				Utils.fromJson(this, result);
			}.bind(this);

			let callbackFps = function (v) {
				this.setFps(v);
			}.bind(this);

			let callbackMax = function (v) {
				this.frameMax = v;
				this.setRange();
			}.bind(this);

			let callbackList = function (v) {
				this.add(v);
				addList.text('ADD');
			}.bind(this);

			let callbackPlay = function (v) {
				this.play();
			}.bind(this);

			let callbackPrev = function (v) {
				if (this.frame) this.goTo(this.frame - 1);
			}.bind(this);

			let callbackNext = function (v) {
				if (this.frame < this.frameMax - 1) this.goTo(this.frame + 1);
			}.bind(this);

			let callbackStart = function (v) {
				this.moveTo(0);
			}.bind(this);

			let callbackEnd = function (v) {
				this.moveTo(this.frameMax - 1);
			}.bind(this);

			let callbackRecord = function (v) {}.bind(this);

			let h = 24,
					x = 170 + 54,
					s1 = 2,
					s2 = 10;
			let startButton = add$1('button', {
				target: dom,
				w: h,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackStart);
			x += h + s1;
			let prevButton = add$1('button', {
				target: dom,
				w: h,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackPrev);
			x += h + s1;
			this.playButton = add$1('button', {
				target: dom,
				w: 40,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackPlay);
			x += 40 + s1;
			let nextButton = add$1('button', {
				target: dom,
				w: h,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackNext);
			x += h + s1;
			let endButton = add$1('button', {
				target: dom,
				w: h,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackEnd);
			x += h + s2; //290

			let addList = add$1('list', {
				target: dom,
				list: this.types,
				w: 80,
				staticTop: true,
				miniCanvas: true,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				side: 'down',
				full: true,
				h: h,
				itemBg: '#333'
			}).onChange(callbackList);
			x += 80 + s2; //324

			this.addMiniTrackImg(addList);
			add$1('button', {
				target: dom,
				name: 'memo',
				w: 40,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackMemo);
			x += 40 + s1;
			add$1('button', {
				target: dom,
				name: 'back',
				w: 40,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackBack);
			x += 40 + s1;
			add$1('button', {
				target: dom,
				name: 'save',
				w: 40,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackSave);
			x += 40 + s1;
			add$1('button', {
				target: dom,
				name: 'load',
				w: 40,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h,
				loader: true
			}).onChange(callbackLoad);
			x += 40 + s2;
			this.recordButton = add$1('button', {
				target: dom,
				w: 40,
				pos: {
					left: x + 'px',
					top: '3px'
				},
				simple: true,
				h: h
			}).onChange(callbackRecord);
			x += 40 + s1; // right

			add$1('number', {
				target: dom,
				name: 'max',
				min: 1,
				value: this.frameMax,
				step: 1,
				drag: false,
				w: 100,
				sa: 40,
				center: true,
				h: h,
				pos: {
					left: 'auto',
					right: '80px',
					top: '3px'
				}
			}).onChange(callbackMax);
			add$1('number', {
				target: dom,
				name: 'fps',
				min: 12,
				max: 144,
				value: this.fps,
				step: 1,
				drag: false,
				w: 80,
				sa: 40,
				sb: 30,
				center: true,
				h: h,
				pos: {
					left: 'auto',
					right: '0px',
					top: '3px'
				}
			}).onChange(callbackFps); // SVG

			let svg = Utils.svgns;
			this.playIcon = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='#CCC' d='M 14 8 L 5 3 4 4 4 13 5 14 14 9 14 8 Z'/></svg>";
			this.pauseIcon = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='#CCC' d='M 14 4 L 13 3 11 3 10 4 10 13 11 14 13 14 14 13 14 4 M 8 4 L 7 3 5 3 4 4 4 13 5 14 7 14 8 13 8 4 Z'/></svg>";
			let startIcon = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='#CCC' d='M 11 12 L 11 10 14 10 14 7 11 7 11 5 8 8 8 9 11 12 M 7 12 L 6 12 6 5 7 5 7 3 4 3 4 14 7 14 7 12 Z'/></svg>";
			let endIcon = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='#CCC' d='M 10 8 L 7 5 7 7 4 7 4 10 7 10 7 12 10 9 10 8 M 14 3 L 11 3 11 5 12 5 12 12 11 12 11 14 14 14 14 3 Z'/></svg>";
			let prevIcon = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='#CCC' d='M 11 12 L 11 10 14 10 14 7 11 7 11 5 8 8 8 9 11 12 Z'/></svg>";
			let nextIcon = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='#CCC' d='M 10 8 L 7 5 7 7 4 7 4 10 7 10 7 12 10 9 10 8 Z'/></svg>";
			this.recordIcon = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='none' stroke='#CCC' stroke-width='2' d='M 13 9 Q 13 10.65 11.8 11.8 10.65 13 9 13 7.35 13 6.15 11.8 5 10.65 5 9 5 7.35 6.15 6.15 7.35 5 9 5 10.65 5 11.8 6.15 13 7.35 13 9 Z'/></svg>";
			this.recordIcon2 = "<svg xmlns=" + svg + " width='18px' height='17px'><path fill='#CCC' stroke='#CCC' stroke-width='2' d='M 13 9 Q 13 10.65 11.8 11.8 10.65 13 9 13 7.35 13 6.15 11.8 5 10.65 5 9 5 7.35 6.15 6.15 7.35 5 9 5 10.65 5 11.8 6.15 13 7.35 13 9 Z'/></svg>";
			this.playButton.icon(this.playIcon, 2);
			this.recordButton.icon(this.recordIcon, 2);
			startButton.icon(startIcon, 2);
			endButton.icon(endIcon, 2);
			prevButton.icon(prevIcon, 2);
			nextButton.icon(nextIcon, 2);
		}

		addMiniTrackImg(addList) {
			addList.text('ADD');
			let img = document.createElement('img');
			img.src = Utils.TRACK;

			img.onload = function () {
				for (let i = 0; i < this.types.length; i++) {
					addList.drawImage(this.types[i], img, i * 20, 0, 20, 20);
				}
			}.bind(this);
		}

		getFrame() {
			return this.frame;
		}

		setFrame(v) {
			this.frame = v;
		} // ----------------------
		//	 Show / Hide
		// ----------------------


		showHide() {
			if (this.visible) {
				this.visible = false;
				this.content.style.visibility = 'hidden';
				this.pannel.display();
				this.selected();
				this.removeEvents();
				this.playButton2.display(true);
				this.openButton.icon(Tools$1.icon('neo', '#CCC', 40));
			} else {
				this.visible = true;
				this.content.style.visibility = 'visible';
				this.pannel.display(true);
				this.activeEvents();
				this.playButton2.display();
				this.openButton.icon(Tools$1.icon('neo', '#888', 40));
			}
		} // ----------------------
		//	 Events dispatch
		// ----------------------


		activeEvents() {
			let dom = document; //.body//Utils.Dom;

			dom.addEventListener('pointercancel', this);
			dom.addEventListener('pointerleave', this); //dom.addEventListener( 'pointerout', this )

			dom.addEventListener('pointerdown', this);
			dom.addEventListener('pointermove', this);
			dom.addEventListener('pointerup', this);
			dom.addEventListener('wheel', this, {
				passive: false
			}); // KEYBOARD

			dom.addEventListener("keydown", this);
			dom.addEventListener('contextmenu', this);
			window.addEventListener('resize', this);
		}

		removeEvents() {
			let dom = document; //.body//Utils.Dom;

			dom.removeEventListener('pointercancel', this);
			dom.removeEventListener('pointerleave', this); //dom.removeEventListener( 'pointerout', this )

			dom.removeEventListener('pointerdown', this);
			dom.removeEventListener('pointermove', this);
			dom.removeEventListener('pointerup', this);
			dom.removeEventListener('wheel', this); //dom.removeEventListener("keydown", this );

			dom.removeEventListener('contextmenu', this, false);
			window.removeEventListener('resize', this, false);
		}

		handleEvent(e) {
			switch (e.type) {
				case 'pointercancel':
				case 'pointerleave':
					this.out(e);
					break;

				case 'keydown':
					this.keydown(e);
					break;

				case 'contextmenu':
					this.mouseMenu(e);
					break;

				case 'wheel':
					this.wheel(e);
					break;

				case 'pointerdown':
					this.down(e);
					break;

				case 'pointermove':
					this.move(e);
					break;

				case 'pointerup':
					this.up(e);
					break;

				case 'resize':
					this.resize(e);
					break;
			}
		}

		keydown(e) {
			//e.preventDefault(); 
			if (Utils.getImput()) return; // console.log( e.keyCode );

			switch (e.keyCode) {
				case 84:
					this.showHide();
					break;
				// T

				case 32:
					this.play();
					break;
				// SPACE
			}
		} // ----------------------
		//	 Mouse Events
		// ----------------------


		out(e) {//this.up(e)
		}

		mouseMenu(e) {
			e.preventDefault();
		}

		wheel(e) {
			if (!this.isScroll) return;
			let delta = 0;
			if (e.wheelDeltaY) delta = -e.wheelDeltaY * 0.04;else if (e.wheelDelta) delta = -e.wheelDelta * 0.2;else if (e.detail) delta = e.detail * 4.0;
			this.scy += delta;
			this.setScrollY();
		}

		down(e) {
			this.isDown = true;
			this.tracksDown(e);

			if (e.target.name) {
				let name = e.target.name;
				if (name === 'trackTitle') this.selected(this.tracks[e.target.id]);

				if (name === 'timeBar' || name === 'timescale' || name === 'scaleRight' || name === 'scaleLeft' || name === 'scaleBar' || name === 'hscroll') {
					if (name === 'timeBar' && this.isPlay) this.pause();
					if (name === 'timescale') this.findDecal(e.clientX);
					if (name === 'scaleBar') this.currentResize = this.tracks[e.target.id];
					this.currentAction = name;
					this.move(e);
				} else this.currentAction = '';
			} else this.currentAction = '';
		}

		move(e) {
			if (this.isDown) this.tracksMove(e);else this.trackOver(e);
			this.over(e);
			let x = e.clientX - this.box.l;
			let y = e.clientY;

			if (Utils.inRange(y, this.trackSpace[0] - 20, this.trackSpace[1])) {
				this.framePrev = this.getFrameClick(e.clientX);
				let t = this.floor((this.framePrev - this.range.start) * this.frameSize);
				this.markerPrev.style.left = this.miniPrev.style.left = t + 'px';
				this.miniPrev.textContent = this.framePrev;
			}

			if (!this.currentAction) return; //x = x > (box.lr - box.l) ? (box.lr - box.l) : x;

			x = x < 0 ? 0 : x;

			switch (this.currentAction) {
				case 'timeBar':
					this.goTo(this.getFrameClick(x, true));
					break;

				case 'timescale':
					this.moveScroll(x, true);
					break;

				case 'scaleLeft':
					this.changeRange(x);
					break;

				case 'scaleRight':
					this.changeRange(x, true);
					break;

				case 'scaleBar':
					this.setTrackHeight(y);
					break;

				case 'hscroll':
					this.setScrollY(y);
					break;
			}
		}

		over(e) {
			let name = e.target.name;

			switch (name) {
				case 'scaleLeft':
					this.scalerOver(e);
					break;

				case 'scaleRight':
					this.scalerOver(e);
					break;

				default:
					this.scalerOut();
					break;
			}
		}

		up(e) {
			this.isDown = false;
			this.tracksUp(e);
			this.currentAction = '';
			this.currentResize = null;
		} // ----------------------------------


		scalerOver(e) {
			e.target.style.background = this.colorSelect;
			e.target.style.borderColor = this.colorSelect;
			this.scOver = true;
		}

		scalerOut() {
			if (!this.scOver || this.currentAction) return;
			this.sl.style.background = 'none';
			this.sl.style.borderColor = '#888';
			this.sr.style.background = 'none';
			this.sr.style.borderColor = '#888';
			this.scOver = false;
		} // BASIC FUNCTION


		pause() {
			this.isPlay = false;
			this.stopMedia();
			this.playButton.icon(this.playIcon, 2);
			this.playButton2.icon(this.playIcon, 2);
		}

		play() {
			if (this.isPlay) {
				this.pause();
			} else {
				this.isPlay = true;
				this.playButton.icon(this.pauseIcon, 2);
				this.playButton2.icon(this.pauseIcon, 2);
				this.loop();
			}
		} // ----------------------
		//
		//				 LOOP
		//
		// ----------------------


		loop(stamp) {
			if (this.isPlay) window.requestAnimationFrame(this.loop.bind(this));
			this.update(stamp);
		} // ----------------------
		//
		//				 UPDATE
		//
		// ----------------------


		update(stamp) {
			//console.log(this.isPlay)
			if (this.isPlay) {
				this.step = stamp === undefined ? performance.now() : stamp;
				this.delta = this.step - this.then;
				if (this.delta <= this.timerStep) return;
				this.then = this.step - this.delta % this.timerStep; // result fps

				if (this.step - 1000 > this.temp) {
					this.temp = this.step;
					this.rfps = this.count;
					this.count = 0;
				}

				this.count++;
			}

			this.updateTime(true);
			this.tracksUpdate();
			if (this.callback) this.callback();

			if (this.isPlay) {
				this.autoScroll();
				this.frame++;
			}

			if (this.frame >= this.frameMax) {
				if (this.isLoop) this.moveTo(0);else this.pause();
			}
		}

		updateTime(up) {
			let h,
					m,
					s,
					ps,
					pm,
					l,
					u,
					fs = this.frameSize;

			if (up) {
				this.time = this.frame / this.fps;
				h = this.floor(this.time / 60 / 60);
				m = this.floor(this.time / 60) % 60;
				s = this.time % 60;
				ps = s < 10 ? '0' : '';
				pm = m < 10 ? '0' : '';
				this.textTime.textContent = h + ':' + pm + m + ':' + ps + s.toFixed(3) + ' | ' + this.frame;
				this.frameTrack = this.floor(this.frame * fs + this.framefix * 0.5);
			}

			l = this.floor((this.frame - this.range.start) * fs);
			u = this.floor(this.frame * this.invRatio) + 1;
			this.marker.style.left = l + 'px';
			this.mini.style.left = u + 'px';
		}

		goTo(f) {
			this.frame = f === undefined ? this.frame : f;
			this.reset(this.frame);
			if (!this.isPlay) this.loop();
		}

		moveTo(f) {
			this.range.end = f - 10;
			this.goTo(f);
			this.autoScroll();
		}

		upMarker() {
			if (this.frame && !this.isPlay) {
				this.updateTime(true);
				this.tracksUpdate(); //this.goTo()
			}
		} // ----------------------
		//	 scroll
		// ----------------------


		autoScroll() {
			if (this.frame > this.range.end) this.moveScroll(Math.round(this.frame * this.invRatio));
		}

		findDecal(x) {
			let dif = x - this.box.l - this.range.midpos;
			this.range.decal = Math.abs(dif) < this.range.mid ? dif : 0;
		}

		moveScroll(x, isMouse) {
			if (isMouse) x -= this.range.mid + this.range.decal;
			x = x < 0 ? 0 : x;
			x = x > this.range.max ? this.range.max : x;
			this.moveRange(x);
		} // ----------------------
		//	 track range
		// ----------------------


		setRange() {
			this.ratio = this.frameMax / this.box.w;
			this.invRatio = this.box.w / this.frameMax;
			let framePos = this.zone * this.frameMax / 100;
			this.scalerRec.w = this.floor(framePos * this.invRatio);
			this.scalerRec.r = this.scalerRec.l + this.scalerRec.w;
			this.scaler.style.width = this.scalerRec.w + 'px';
			this.minWidth = this.floor(this.box.w / 30 / this.ratio);
			this.changeRange();
		}

		moveRange(x) {
			this.scalerRec.l = x;
			this.scalerRec.r = this.scalerRec.l + this.scalerRec.w;
			this.scaler.style.left = this.scalerRec.l + 'px';
			this.translateRange();
			let i = this.trackLength;

			while (i--) this.tracks[i].syncroTrack(this.leftFrame);
		}

		translateRange() {
			let rec = this.scalerRec;
			this.range.start = this.floor(rec.l * this.ratio);
			this.range.end = this.floor(rec.r * this.ratio) - 1;
			this.range.midpos = rec.l + this.range.mid;
			this.leftFrame = this.floor(this.frameSize * this.range.start); //console.log(this.frameSize, this.leftFrame)

			this.pattern.setAttributeNS(null, 'patternTransform', 'translate(' + (-this.leftFrame - 0.5) + ')');
			this.updateTime();
		}

		changeRange(x, isRight) {
			let rec = this.scalerRec;
			let box = this.box;
			let w;

			if (x !== undefined) {
				w = isRight ? this.floor(x - rec.l) : this.floor(rec.r - x);
				w = w < this.minWidth ? this.minWidth : w;
				w = w > box.w ? box.w : w;

				if (w !== rec.w) {
					rec.w = w;
					this.scaler.style.width = rec.w + 'px';

					if (isRight) {
						rec.r = x;
					} else {
						rec.l = x;
						this.scaler.style.left = rec.l + 'px';
					}
				}
			}

			this.range.end = this.floor(rec.r * this.ratio); // + 1;// - 1;

			this.range.lng = this.floor(rec.w * this.ratio);
			this.range.max = box.w - rec.w;
			this.range.mid = rec.w * 0.5; // new frame size

			let fs = (box.w - box.d) / (this.range.lng + 1); //let fs = (box.w - box.d) / ((rec.w * ratio2)+1);

			this.maxPos = box.w - box.d - fs;
			this.frameSize = fs;
			this.invFS = 1 / fs;
			this.framefix = fs < 6 ? 6 : this.floor(fs);
			this.maxSize = this.floor(fs * this.frameMax);
			if (x !== undefined) this.zone = this.range.lng * 100 / (this.frameMax + 1);
			this.translateRange(); // bottom mini frame

			this.floor(box.w / this.frameMax);

			this.marker.style.width = this.framefix + 'px';
			this.markerPrev.style.width = this.framefix + 'px';
			this.miniPrev.style.marginLeft = this.framefix + 5 + 'px';
			this.timePattern();
			this.syncroTracks();
			this.upMarker();
		} // top timeline pattern


		timePattern() {
			let w = this.frameSize,
					s,
					n; // timeline pattern

			let path;

			if (w < 5) {
				n = this.floor(w) || 1;

				switch (n) {
					case 1:
						s = w * this.fps;
						break;

					case 2:
						s = w * this.fps;
						break;

					case 3:
						s = w * (this.fps * 0.5);
						break;

					case 4:
						s = w * (this.fps * 0.25);
						break;
				}

				path = 'M0 10 L0 20' + ' M' + s + ' 10 L' + s + ' 20';
			} else {
				s = w * 5;
				path = 'M' + 0 + ' 10 L' + 0 + ' 20' + 'M' + w + ' 15 L' + w + ' 20' + 'M' + w * 2 + ' 15 L' + w * 2 + ' 20' + 'M' + w * 3 + ' 15 L' + w * 3 + ' 20' + 'M' + w * 4 + ' 15 L' + w * 4 + ' 20' + ' M' + s + ' 10 L' + s + ' 20';
			} //console.log(w)


			this.pattern.childNodes[0].childNodes[0].setAttributeNS(null, 'd', path);
			this.pattern.setAttributeNS(null, 'width', s);
		} // ----------------------
		//
		//				 DATA
		//
		// ----------------------


		dataToString() {
			let d = this.data,
					v;

			for (let n in d) {
				if (typeof d[n] === 'object') {
					v = JSON.stringify(d[n]);
					v = v.replace(/["']/g, "");
					v = v.replace(/:/g, " ");
					v = v.replace(/,/g, "|");
					v = v.slice(1, v.length - 1);
					d[n] = v;
				}
			}

			let str = JSON.stringify(d);
			str = str.replace(/["']/g, "");
			str = str.slice(1, str.length - 1);
			str = str.replace(/:/g, ': ');
			str = str.replace(/,/g, '<br>');
			str = str.replace(/[|]/g, ', ');
			str += '<br><br>' + this.rfps + ' fps';
			return str;
		}

		info() {
			return this.rfps + ' fps';
		}

		getFrameClick(x, dec) {
			// root click or track click
			x = dec ? x : x - this.box.l; // test if outside view

			x = x > this.maxPos ? this.maxPos : x;
			let ff = this.floor(x * this.invFS) + this.range.start; //ff = ff > range.end ? range.end : ff;
			//ff = ff > NEO.frameMax-1 ? NEO.frameMax-1 : ff;

			return ff;
		}

		setFps(v) {
			this.fps = v;
			this.frameTime = 1 / this.fps; // in second

			this.timerStep = this.frameTime * 1000; //1000 / NEO.FPS;

			this.updateTime(true);
		} // ----------------------
		//	 Add track
		// ----------------------


		add(type, o) {
			o = o || {};
			type = type[0].toUpperCase() + type.slice(1);
			let n;

			switch (type) {
				case 'Bang':
					n = new Bang(o, this);
					break;

				case 'Flag':
					n = new Flag(o, this);
					break;

				case 'Color':
					n = new Color(o, this);
					break;

				case 'Curve':
					n = new Curve(o, this);
					break;

				case 'Switch':
					n = new Switch(o, this);
					break;

				case 'Module':
					n = new Module(o, this);
					break;

				case 'Lfo':
					n = new Lfo(o, this);
					break;

				case 'Audio':
					n = new Audio(o, this);
					break;

				case 'Video':
					n = new Video(o, this);
					break;
			} //let n = new NEO[ type ]( o );


			n.rename(this.trackLength);
			this.tracks.push(n);
			this.trackLength = this.tracks.length; //tracksname.push( n.name );

			if (n.target === undefined) this.inner.appendChild(n.c[0]);
			n.syncroTrack(this.leftFrame, this.maxSize); //neo.data = {};

			clearTimeout(this.addTimer);
			this.addTimer = setTimeout(this.calc.bind(this), 0); //this.calc();

			return n;
		} // ----------------------
		//	 Remove track
		// ----------------------


		remove(id) {
			if (this.tracks[id].target === undefined) this.inner.removeChild(this.tracks[id].c[0]);
			this.tracks.splice(id, 1);
			this.trackLength = this.tracks.length;
			let i = this.trackLength;

			while (i--) this.tracks[i].setID(i); //neo.data = {};


			this.calc();
		} // ----------------------
		//	 clear all track
		// ----------------------


		clear() {
			let i = this.trackLength;

			while (i--) this.tracks[i].clear();

			this.tracks = [];
			this.trackLength = 0; //neo.data = {};
		} // ----------------------
		//	 track options
		// ----------------------


		tracksDown(e) {
			if (!this.overtrack) return;
			this.overtrack.down(e);
		}

		tracksMove(e) {
			if (!this.overtrack) return;
			this.overtrack.move(e);
		}

		trackOver(e) {
			let y = e.clientY;
			let i = this.trackLength,
					t;

			if (this.overtrack !== null) {
				this.overtrack.out();
				this.overtrack = null;
			}

			while (i--) {
				t = this.tracks[i];
				if (Utils.inRange(y, t.top, t.top + t.h)) this.overtrack = t; //else t.out()
			}

			if (!this.overtrack) return;
			this.overtrack.over(e);
		}

		tracksUp(e) {
			if (!this.overtrack) return;
			this.overtrack.up(e);
			this.overtrack = null;
		}

		tracksUpdate() {
			let i = this.trackLength,
					track;

			while (i--) {
				track = this.tracks[i];
				this.data[track.name] = track.update(this.frame);
			}
		}

		unselectKey() {
			let i = this.trackLength;

			while (i--) this.tracks[i].unselectKey();
		}

		stopEditName() {
			let i = this.trackLength;

			while (i--) this.tracks[i].endEditName();
		}

		syncroTracks() {
			let i = this.trackLength;

			while (i--) this.tracks[i].syncroTrack(this.leftFrame, this.maxSize);
		}

		stopMedia() {
			let i = this.trackLength;

			while (i--) if (this.tracks[i].isMedia) this.tracks[i].stop();
		}

		upTrackTop() {
			let i = this.trackLength;

			while (i--) if (this.tracks[i].needTop) this.tracks[i].top = this.tracks[i].c[0].getBoundingClientRect().top;
		}

		reset(f) {
			let i = this.trackLength;

			while (i--) this.tracks[i].reset(f);
		}

		selected(track) {
			let i = this.trackLength;

			while (i--) this.tracks[i].unSelected();

			if (track !== undefined) track.selected();
		} // Test track height


		calc() {
			this.hhh.total = 0;
			let i = this.trackLength;

			while (i--) this.hhh.total += this.tracks[i].h;

			this.inner.style.height = this.hhh.total + 'px';
			this.hhh.full = this.box.top + this.hhh.total + 19;
			this.resizeHeight();
		} // ----------------------
		//	 resize
		// ----------------------


		resize(e) {
			this.box.h = window.innerHeight - this.box.b - this.box.t;
			this.resizeHeight();
			this.resizeWidth();
			this.upMarker();
		}

		resizeWidth() {
			this.box.w = window.innerWidth - this.box.l - this.box.r; // - (this.box.m*2);

			this.content.style.width = this.box.w + 'px'; //this.content.style.width = (this.box.w + (this.box.m*2)) + 'px';

			this.topmenu.style.width = this.box.w + 'px';
			this.innerContent.style.width = this.box.w - this.box.d + 'px';
			this.timeBar.style.width = this.box.w - this.box.d + 'px';
			this.setRange();
			this.pannel.resize(this.box.l, this.box.w - this.box.d);
		} // ----------------------
		//	 height functions
		// ----------------------


		resizeHeight() {
			let h = 0;
			let mth = 0;
			let oldd = this.box.d;
			let box = this.box;

			if (this.hhh.full > box.h) {
				// with scroll
				h = box.h;
				mth = h - (box.top + 20);
				box.d = 20;
				this.viewInvRatio = (this.hhh.total - 1) / mth;
				this.hhh.scroll = mth * (mth / (this.hhh.total - 1));
				this.maxScy = mth - this.hhh.scroll;
				this.hscroll.style.height = mth + 1 + 'px';
				this.hscroll.childNodes[0].style.height = this.floor(this.hhh.scroll) + 'px';
				this.hscroll.style.display = 'block';
				this.isScroll = true;
			} else {
				// no scroll
				h = this.hhh.full;
				mth = h - (box.top + 20);
				box.d = 0;
				this.inner.style.top = 0 + 'px';
				this.hscroll.style.display = 'none';
				this.isScroll = false;
			}

			this.innerContent.style.height = mth + 'px';
			this.content.style.height = h + 'px';
			this.marker.style.height = mth + 18 + 'px';
			this.markerPrev.style.height = mth + 18 + 'px';
			this.trackSpace = [box.t + box.top, box.t + h - 20];
			this.upTrackTop();
			this.pannel.move();
			if (this.isScroll) this.setScrollY();
			if (oldd !== box.d) this.resizeWidth();
		} // ----------------------
		//	 scroll position y
		// ---------------------


		setScrollY(y) {
			if (y !== undefined) this.scy = y - this.box.top - this.box.t - this.hhh.scroll * 0.5;
			this.scy = this.scy < 0 ? 0 : this.scy;
			this.scy = this.scy > this.maxScy ? this.maxScy : this.scy;
			this.hscroll.childNodes[0].style.top = this.floor(this.scy) + 'px';
			this.inner.style.top = this.floor(-(this.scy * this.viewInvRatio)) + 'px';
			this.upTrackTop();
			this.pannel.move();
		} // ----------------------
		//	 rescale one track
		// ----------------------


		setTrackHeight(y) {
			let ty = y - this.currentResize.c[0].getBoundingClientRect().top + 4;
			ty = ty < 40 ? 40 : ty;
			this.currentResize.setHeight(ty);
			clearTimeout(this.addTimer);
			this.addTimer = setTimeout(this.calc.bind(this), 0);
		} // ----------------------
		//	 option pannel
		// ----------------------


		isInView(y) {
			let v = true;
			if (y < this.box.top) v = false; //+ this.box.t

			if (y > this.box.h + this.box.top - 40) v = false;
			return v;
		}

		showPannel(key) {
			this.pannel.setKey(key);
		}

	}

	class Node {
		constructor(o = {}) {
			this.id = o.id || 0;
			this.name = o.name || 'node-' + this.id;
			this.points = [];
			this.w = o.w || 80;
			this.h = o.h || 20;
			this.x = 10;
			this.y = 10;
			this.p = null;
			if (o.x) this.x = o.x - this.w * 0.5;
			if (o.y) this.y = o.y - this.h * 0.5;
			this.color = '#666';
			this.border = '#888';
			this.borderSel = '#AAA';
			this.select = false;
		}

		draw(ctx) {
			ctx.lineWidth = 1;
			ctx.strokeStyle = this.select ? this.borderSel : this.border;
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.w, this.h);
			ctx.strokeRect(this.x, this.y, this.w, this.h);
			let i = this.points.length;

			while (i--) {
				if (i === 0) this.points[i].move(this.x, this.y + this.h * 0.5);
				if (i === 1) this.points[i].move(this.x + this.w, this.y + this.h * 0.5);
				this.points[i].draw(ctx);
			} //ctx.font = "11px Lucida Console";


			ctx.font = 'normal ' + 9 + 'px Helvetica,Arial,sans-serif';
			ctx.textBaseline = 'middle';
			ctx.fillStyle = "#FFF";
			ctx.textAlign = "center";
			ctx.fillText(this.name, this.x + this.w * 0.5, this.y + this.h * 0.5);
		}

		over(x, y) {
			let i = this.points.length;
			this.p = null;

			while (i--) {
				if (this.points[i].over(x, y)) this.p = this.points[i];
			}

			if (this.p !== null) {
				this.select = true;
				return 'link' + (this.p.start ? 'Start' : 'End');
			} else {
				this.select = this.x <= x && this.x + this.w >= x && this.y <= y && this.y + this.h >= y;
				if (this.select) return 'node'; // (this.x <= x) && (this.x + this.w >= x) && (this.y <= y) && (this.y + this.h >= y);
			}

			return '';
		}

		move(x, y) {
			this.x = x;
			this.y = y;
		}

	}

	class Point {
		constructor(o = {}) {
			this.x = o.x || 0;
			this.y = o.y || 0;
			this.r = 6;
			this.color = '#0AA';
			this.colorSel = '#0FF';
			this.select = false;
			this.start = o.start || false;
			this.id = o.id || 0;

			if (this.start) {
				this.color = '#AA0';
				this.colorSel = '#FF0';
			}
		}

		draw(ctx) {
			ctx.beginPath();
			ctx.fillStyle = this.select ? this.colorSel : this.color;
			ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
		}

		over(x, y) {
			this.select = this.x - this.r <= x && this.x + this.r >= x && this.y - this.r <= y && this.y + this.r >= y;
			return this.select;
		}

		move(x, y) {
			this.x = x;
			this.y = y;
		}

	}

	class Link {
		constructor(o = {}) {
			o.n1.points[1].select = false;
			o.n2.points[0].select = false;
			this.p1 = o.n1.points[1];
			this.p2 = o.n2.points[0];
			this.r = 3;
			this.color = '#FFF';
		}

		draw(ctx, parent) {
			ctx.beginPath();
			ctx.fillStyle = "#0FF";
			ctx.arc(this.p1.x, this.p1.y, this.r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			ctx.beginPath();
			ctx.fillStyle = "#FF0";
			ctx.arc(this.p2.x, this.p2.y, this.r, 0, 2 * Math.PI);
			ctx.closePath();
			ctx.fill();
			let dx = this.p1.x;
			let dy = this.p1.y;
			let tx = this.p2.x;
			let ty = this.p2.y;
			let p = parent.findCurve(dx, dy, tx, ty, false);
			ctx.lineWidth = 2;
			let grd = ctx.createLinearGradient(dx, dy, tx, ty);
			grd.addColorStop(0, "#0FF");
			grd.addColorStop(1, "#FF0");
			ctx.strokeStyle = grd;
			ctx.beginPath();
			ctx.moveTo(dx, dy);

			if (p.length === 5) {
				ctx.lineTo(p[0], dy);
				ctx.quadraticCurveTo(p[1], dy, p[1], p[3]);
				ctx.lineTo(p[1], p[4]);
				ctx.quadraticCurveTo(p[1], ty, p[2], ty);
			} else {
				ctx.lineTo(p[0], dy);
				ctx.quadraticCurveTo(p[1], dy, p[1], p[4]);
				ctx.lineTo(p[1], p[5]);
				ctx.quadraticCurveTo(p[1], p[6], p[0], p[6]);
				ctx.lineTo(tx, p[6]);
				ctx.quadraticCurveTo(p[3], p[6], p[3], p[7]);
				ctx.lineTo(p[3], p[8]);
				ctx.quadraticCurveTo(p[3], ty, tx, ty);
			}

			ctx.lineTo(tx, ty);
			ctx.stroke();
		}

	}

	class Map {
		constructor(o = {}) {
			this.doc = document;
			this.box = {
				l: 0,
				r: 0,
				t: 0,
				b: 0,
				w: 0,
				h: 0,
				d: 0,
				m: 2
			};
			this.num = {
				ox: 50,
				oy: 50,
				dx: 0,
				dy: 0,
				tx: 0,
				ty: 0
			};
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
			let dom = Utils.dom;
			let basic = Utils.basic;
			this.content = dom('div', basic + 'top:' + this.box.t + 'px; left:' + this.box.l + 'px; pointer-events:auto; overflow:hidden; margin-left:-' + this.box.m + 'px; margin-top:-' + this.box.m + 'px; this.box-sizing:this.content-this.box; border:' + this.box.m + 'px solid #888;');
			this.contentStyle = this.content.style;
			this.m_canvas = dom('canvas');
			this.canvas = dom('canvas', 'pointer-events:auto;', null, this.content);
			this.canvas.name = 'canvas';
			this.ctx = this.m_canvas.getContext("2d");
			this.ctx_end = this.canvas.getContext("2d");
			this.doc.body.appendChild(this.content);
			this.activeEvents();
			this.resize();
		}

		activeEvents() {
			this.doc.addEventListener('dblclick', this, false);
			this.doc.addEventListener('mousedown', this, false);
			this.doc.addEventListener('mousemove', this, false);
			this.doc.addEventListener('mouseup', this, false);
			this.doc.addEventListener('mousewheel', this, false);
			this.doc.addEventListener('contextmenu', this, false);
			window.addEventListener('resize', this, false);
		}

		handleEvent(e) {
			//e.preventDefault();
			switch (e.type) {
				//case 'keydown': maps.keydown( e ); break;
				case 'contextmenu':
					this.mouseMenu(e);
					break;

				case 'mousewheel':
					this.wheel(e);
					break;

				case 'mousedown':
					this.down(e);
					break;

				case 'mousemove':
					this.move(e);
					break;

				case 'mouseup':
					this.up(e);
					break;

				case 'dblclick':
					this.double(e);
					break;

				case 'resize':
					this.resize(e);
					break;
			}
		}

		mouseMenu(e) {
			e.preventDefault();
			return false;
		}

		double(e) {
			let mouse = this.getMouse(e);
			let o = {
				x: mouse.x,
				y: mouse.y
			};
			this.add(o);
		}

		up(e) {
			//e.preventDefault();
			if ((this.action === 'linkStart' || this.action === 'linkEnd') && this.selection !== null) {
				//if(this.selection === null) break;
				let mouse = this.getMouse(e);
				let i = this.nodes.length,
						sel = '';

				while (i--) {
					sel = this.nodes[i].over(mouse.x, mouse.y);

					if (this.action === 'linkEnd' && sel === 'linkStart') {
						this.add({
							type: 'link',
							n2: this.nodes[i],
							n1: this.selection
						});
						break;
					}

					if (this.action === 'linkStart' && sel === 'linkEnd') {
						this.add({
							type: 'link',
							n1: this.nodes[i],
							n2: this.selection
						});
						break;
					}
				}

				this.linking = false;
				this.draw();
			}

			this.action = '';
			this.selection = null;
		}

		down(e) {
			this.action = '';
			let mouse = this.getMouse(e);
			let i = this.nodes.length;

			while (i--) {
				this.action = this.nodes[i].over(mouse.x, mouse.y);

				if (this.action === 'linkStart' || this.action === 'linkEnd') {
					this.selection = this.nodes[i];
					this.num.dx = this.selection.p.x;
					this.num.dy = this.selection.p.y;
					this.num.tx = mouse.x;
					this.num.ty = mouse.y;
					break;
				} else if (this.action === 'node') {
					this.selection = this.nodes[i];
					this.num.dx = mouse.x - this.selection.x;
					this.num.dy = mouse.y - this.selection.y;
					break;
				}
			}

			if (this.action === '' && e.target.name === 'canvas') {
				this.action = 'moveCanvas';
				this.num.dx = mouse.x;
				this.num.dy = mouse.y;
			}

			this.draw();
		}

		move(e) {
			if (this.action === '') return;
			let mouse = this.getMouse(e);

			switch (this.action) {
				case 'linkStart':
				case 'linkEnd':
					this.num.tx = mouse.x;
					this.num.ty = mouse.y;
					this.linking = true;
					break;

				case 'node':
					this.selection.move(mouse.x - this.num.dx, mouse.y - this.num.dy);
					break;

				case 'moveCanvas':
					this.num.ox += mouse.x - this.num.dx;
					this.num.oy += mouse.y - this.num.dy;
					this.transform();
					break;
			}

			this.draw();
		}

		getMouse(e) {
			let x = Math.floor((e.clientX - this.box.l - this.num.ox) * this.ratio);
			let y = Math.floor((e.clientY - this.box.t - this.num.oy) * this.ratio);
			return {
				x: x,
				y: y
			};
		}

		getCorner(e) {
			let x = Math.floor(e.clientX - this.box.l);
			let y = Math.floor(e.clientY - this.box.t);
			return {
				x: x,
				y: y
			};
		}

		wheel(e) {
			let old = this.zoom;
			let delta = 0;
			if (e.wheelDeltaY) delta = e.wheelDeltaY * 0.04;else if (e.wheelDelta) delta = e.wheelDelta * 0.2;else if (e.detail) delta = -e.detail * 4.0;
			this.zoom += delta * 0.05;
			this.zoom = this.zoom < 1 ? 1 : this.zoom;
			this.zoom = this.zoom > 4 ? 4 : this.zoom;
			if (old === this.zoom) return;
			let prev = this.getMouse(e);
			this.ratio = 1 / this.zoom;
			let mouse = this.getCorner(e);
			this.num.ox = mouse.x - prev.x * this.zoom;
			this.num.oy = mouse.y - prev.y * this.zoom;
			this.transform();
			this.draw();
		} // ----------------------
		//
		//	 Add
		//
		// ----------------------


		add(o) {
			o = o === undefined ? {} : o;
			let type = o.type || 'node';
			let n, p1, p2;

			switch (type) {
				case 'node':
					o.id = this.nodes.length;
					n = new Node(o);
					p1 = new Point({
						start: true
					});
					p2 = new Point({});
					n.points.push(p1);
					n.points.push(p2);
					this.nodes.push(n);
					break;

				case 'link':
					this.links.push(new Link(o));
					break;
			}

			this.draw();
		} // ----------------------
		//
		//	 Draw
		//
		// ----------------------


		transform(x, y) {
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.ctx.translate(this.num.ox, this.num.oy);
			this.ctx.scale(this.zoom, this.zoom);
		}

		draw() {
			this.ctx.save();
			this.ctx.setTransform(1, 0, 0, 1, 0, 0);
			this.ctx.clearRect(0, 0, this.box.w, this.box.h);
			this.ctx.fillStyle = 'rgba(0,0,0,0.2)';
			this.ctx.fillRect(0, 0, this.box.w, this.box.h);
			this.ctx.restore();
			this.origin();
			let i = this.links.length;

			while (i--) this.links[i].draw(this.ctx, this);

			this.drawTmpLink();
			i = this.nodes.length;

			while (i--) this.nodes[i].draw(this.ctx);

			this.render();
		}

		render() {
			this.ctx_end.clearRect(0, 0, this.box.w, this.box.h);
			this.ctx_end.drawImage(this.m_canvas, 0, 0);
		}

		distance(x1, x2, d) {
			d = d || 0.5;
			let x = x1 > x2 ? x2 + (x1 - x2) * d : x1 + (x2 - x1) * d;
			return x;
		}

		findCurve(x1, y1, x2, y2, l) {
			let p = [];
			let complex = false;
			let dif = Math.abs(x1 - x2); //if( dif < 25 ) complex = true;

			if (l && x1 < x2) complex = true;
			if (!l && x1 > x2) complex = true;
			let x = l ? x1 - x2 : x2 - x1; //x2>x1 ? x2-x1 : x1-x2;

			let y = y2 - y1; //y2>y1 ? y2-y1 : y1-y2;

			let ry = y < 0 ? true : false;
			y = y < 0 ? y * -1 : y;
			y *= 0.5;
			x = dif; //x<0 ? x*-1 : x;

			x *= 0.5;
			x = x < 10 ? 10 : x; //x = x < 25 ? 25 : x;

			x = y < x ? y : x; //x = x>40 ? 40 : x;

			let r1 = x * 0.5;
			let midx = l ? x1 - x : x1 + x;
			let xx = l ? midx - x2 : x2 - midx;
			let rx = xx < 0 ? l ? false : true : l ? true : false;
			xx = xx < 0 ? xx * -1 : xx;
			xx *= 0.5;
			xx = xx < 10 ? 10 : xx;
			xx = y < xx ? y : xx;
			let r2 = xx;
			message.textContent = complex + ' ' + dif;

			if (!complex) {
				p[0] = l ? midx + r1 : midx - r1;
				p[1] = midx;
				p[2] = rx ? midx - r2 : midx + r2; // y

				p[3] = ry ? y1 - r1 : y1 + r1;
				p[4] = ry ? y2 + r2 : y2 - r2;
			} else {
				p[0] = l ? midx + r1 : midx - r1;
				p[1] = midx;
				p[2] = rx ? midx - r2 : midx + r2;
				p[3] = rx ? x2 - r1 : x2 + r1; // y

				p[4] = ry ? y1 - r1 : y1 + r1;
				p[5] = ry ? y1 - y + r1 : y1 + y - r1; //ry ? y2 + r2 : y2 - r2;

				p[6] = ry ? y2 + y : y2 - y;
				p[7] = ry ? y2 + y - r1 : y2 - y + r1;
				p[8] = ry ? y2 + r1 : y2 - r1;
			}

			return p;
		}

		drawTmpLink() {
			if (!this.linking) return;
			let left = false;
			if (this.action === 'linkStart') left = true;
			let c = left ? ["#FF0", "#0AA"] : ["#0FF", "#AA0"];
			this.ctx.lineWidth = 2;
			let grd = this.ctx.createLinearGradient(this.num.dx, this.num.dy, this.num.tx, this.num.ty);
			grd.addColorStop(0, c[0]);
			grd.addColorStop(1, c[1]);
			let p = this.findCurve(this.num.dx, this.num.dy, this.num.tx, this.num.ty, left);
			this.ctx.strokeStyle = grd;
			this.ctx.beginPath();
			this.ctx.moveTo(this.num.dx, this.num.dy);

			if (p.length === 5) {
				this.ctx.lineTo(p[0], this.num.dy);
				this.ctx.quadraticCurveTo(p[1], this.num.dy, p[1], p[3]);
				this.ctx.lineTo(p[1], p[4]);
				this.ctx.quadraticCurveTo(p[1], this.num.ty, p[2], this.num.ty);
			} else {
				this.ctx.lineTo(p[0], this.num.dy);
				this.ctx.quadraticCurveTo(p[1], this.num.dy, p[1], p[4]);
				this.ctx.lineTo(p[1], p[5]);
				this.ctx.quadraticCurveTo(p[1], p[6], p[0], p[6]);
				this.ctx.lineTo(this.num.tx, p[6]);
				this.ctx.quadraticCurveTo(p[3], p[6], p[3], p[7]);
				this.ctx.lineTo(p[3], p[8]);
				this.ctx.quadraticCurveTo(p[3], this.num.ty, this.num.tx, this.num.ty);
			}

			this.ctx.lineTo(this.num.tx, this.num.ty);
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

		resize(e) {
			this.box.h = window.innerHeight - this.box.b - this.box.t;
			this.box.w = window.innerWidth - this.box.l - this.box.r;
			this.contentStyle.width = this.box.w + 'px';
			this.contentStyle.height = this.box.h + 'px';
			this.canvas.width = this.box.w;
			this.canvas.height = this.box.h;
			this.m_canvas.width = this.box.w;
			this.m_canvas.height = this.box.h;
			this.transform();
			this.draw(); //clearTimeout( this.drawTimer );
			//this.drawTimer = setTimeout( this.draw.bind(this), 0 );
		}

	}

	var REVISION = '0.5.0';
	const Tools = Tools$1;
	const add = add$1;

	exports.Map = Map;
	exports.Pannel = Pannel;
	exports.REVISION = REVISION;
	exports.Timeline = Timeline;
	exports.Tools = Tools;
	exports.Utils = Utils;
	exports.add = add;

	Object.defineProperty(exports, '__esModule', { value: true });

}));
