/* 
 * SVG curve example
 *
 * By Craig Buckler,		http://twitter.com/craigbuckler
 * of OptimalWorks.net		http://optimalworks.net/
 * for SitePoint.com		http://sitepoint.com/
 * 
 * Refer to:
 * http://www.sitepoint.com/html5-svg-quadratic-curves/
 * http://www.sitepoint.com/html5-svg-cubic-curves/
 *
 * This code can be used without restrictions.
 */

(function() {

	var container, svg, cType, code, point = {}, line = {}, fill = false, drag = null, dPoint, maxX, maxY;

	// define initial points
	function Init() {

		var c = svg.getElementsByTagName("circle");
		for (var i = 0; i < c.length; i++) {
			point[c[i].getAttributeNS(null,"id")] = {
				x: parseInt(c[i].getAttributeNS(null,"cx"),10),
				y: parseInt(c[i].getAttributeNS(null,"cy"),10)
			};
		}
		
		// lines
		line.l1 = svg.getElementById("l1");
		line.l2 = svg.getElementById("l2");
		line.curve = svg.getElementById("curve");
		
		// code
		code = document.getElementById("code");
	
		// event handlers
		svg.onmousedown = svg.onmousemove = svg.onmouseup = Drag;
		svg.ontouchstart = svg.ontouchmove = svg.ontouchend = Drag;
		
		DrawSVG();
	}
	
	
	// draw curve
	function DrawSVG() {
	
		// control line 1
		line.l1.setAttributeNS(null, "x1", point.p1.x);
		line.l1.setAttributeNS(null, "y1", point.p1.y);
		line.l1.setAttributeNS(null, "x2", point.c1.x);
		line.l1.setAttributeNS(null, "y2", point.c1.y);
		
		// control line 2
		var c2 = (point.c2 ? "c2" : "c1");
		line.l2.setAttributeNS(null, "x1", point.p2.x);
		line.l2.setAttributeNS(null, "y1", point.p2.y);
		line.l2.setAttributeNS(null, "x2", point[c2].x);
		line.l2.setAttributeNS(null, "y2", point[c2].y);
		
		// curve
		var d = 
			"M"+point.p1.x+","+point.p1.y+" "+cType+
			point.c1.x+","+point.c1.y+" "+
			(point.c2 ? point.c2.x+","+point.c2.y+" " : "")+
			point.p2.x+","+point.p2.y+
			(fill ? " Z" : "");
		line.curve.setAttributeNS(null, "d", d);
		
		// show code
		if (code) {
			code.textContent = '<path d="'+d+'" />';
		}
	}
	
	
	// drag event handler
	function Drag(e) {
		
		e.stopPropagation();
		var t = e.target, id = t.id, et = e.type, m = MousePos(e);
	
		// toggle fill class
		if (!drag && et == "mousedown" && id == "curve") {
			fill = !fill;
			t.setAttributeNS(null, "class", (fill ? "fill" : ""));
			DrawSVG();
		}
	
		// start drag
		if (!drag && typeof(point[id]) != "undefined" && (et == "mousedown" || et == "touchstart")) {
			drag = t;
			dPoint = m;
		}
		
		// drag
		if (drag && (et == "mousemove" || et == "touchmove")) {
			id = drag.id;
			point[id].x += m.x - dPoint.x;
			point[id].y += m.y - dPoint.y;
			dPoint = m;
			drag.setAttributeNS(null, "cx", point[id].x);
			drag.setAttributeNS(null, "cy", point[id].y);
			DrawSVG();
		}
		
		// stop drag
		if (drag && (et == "mouseup" || et == "touchend")) {
			drag = null;
		}
	
	}

	
	// mouse position
	function MousePos(event) {
		return {
			x: Math.max(0, Math.min(maxX, event.pageX)),
			y: Math.max(0, Math.min(maxY, event.pageY))
		}
	}
	
	
	// start
	window.onload = function() {
		container = document.getElementById("svg");
		if (container) {
			cType = container.className;
			maxX = container.offsetWidth-1;
			maxY = container.offsetHeight-1;
			svg = container.contentDocument;
			Init();
		}
	}
	
})();

 



