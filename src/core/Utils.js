/**   _   _____ _   _   
*    | | |_   _| |_| |
*    | |_ _| | |  _  |
*    |___|_|_| |_| |_| 2017
*    @author lo.th / https://github.com/lo-th
*/
import { saveAs } from '../saveAs.js';
import * as UIL from '../../build/uil.module.js';

export const Utils = {

    doc: document,
    Dom: document.body,
    frag: document.createDocumentFragment(),

    icon:UIL.Tools.icon,

    // css

    getImput: UIL.Tools.getImput,

    css: UIL.Tools.css,

    basic: UIL.Tools.css.basic,
    txt: UIL.Tools.css.txt,
    svgns: "http://www.w3.org/2000/svg",
    htmls: "http://www.w3.org/1999/xhtml",

    // function 

    dom: UIL.Tools.dom,
    clear: UIL.Tools.clear,
    setSvg: UIL.Tools.setSvg,
    hexToHtml: UIL.Tools.hexToHtml,

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
    frameTime: 1/60,
    frameSize: 1,
    frameMax: 1,
    frameTrack: 0,

    color : {
        track1: 'rgba(128,128,128,1)',// green
        track2: 'rgba(128,128,128,0.5)',// green
        trackover: 'rgba(160,220,55,0.5)',
        time: 'rgba(189,65,40,0.75)',//red,
        timeprev: 'rgba(128,128,128,0.75)',//grey,
        timeprevtext: 'rgba(180,180,180,1)',//grey,
        timeline: 'rgba(128,128,128,1)',//'rgba(189,171,40,0.75)',//yellow
        // blue
        select: '#035fcf',
        key:'rgba(86,175,178,1)',
        action:'rgba(86,175,178,0.1)',
        
    },

    keyColor:[ '#6BB', '#BB6', '#F66' ],

    soundLibs: {},

    inRange: function( v, min, max, exclud ) {
        
        if( exclud ) return v>min && v<max 
        else return v>=min && v<=max

    },

    int: function ( n ){
       
        return Math.floor( n );
    
    }, 

    liner: function( t, color, s ){

        color = color === undefined ? 'rgba(128,128,128,0.5)' : color;
        s = s || 1
        return Utils.dom( 'div', Utils.basic+'width:100%; height:1px; border-top:'+s+'px solid '+color+'; top:'+(t-s)+'px;'); 
       
    },

    vliner: function( css, color ){

        if(color === undefined) color = '#888';
        return Utils.dom( 'div', Utils.basic+'width:1px; height:100%; background:'+color+';' + css );

    },

    linerBottom: function( t, color, color2 ){

        if(color === undefined) color = '#888';
        if(color2 === undefined) color2 = '#rgba(128,128,128,0.5)';

        let scaleBar = Utils.dom( 'div', Utils.basic+'width:100%; height:'+t+'px; bottom:0; background:none; pointer-events:auto; cursor:row-resize; border-top:1px solid '+color2+'; border-bottom:1px solid '+color+';');
        //let scaleBar = Utils.dom( 'div', Utils.basic+'width:100%; height:'+(t+1)+'px; bottom:0; background:none; pointer-events:auto; cursor:n-resize; border-top:1px solid '+color2+'; border-bottom:1px solid '+color+';');
        //Utils.dom( 'div', Utils.basic+'width:100%; height:3px; top:2px; background:' + Utils.SlideBG, null, scaleBar  );
        Utils.dom( 'div', Utils.basic+'width:100%; height:4px; top:1px; background:' + Utils.SlideBG, null, scaleBar  );
        scaleBar.name = 'scaleBar';
        return scaleBar;

    },

    pins: function(t){

        let ty = ~~ ((t-10)*0.5);
        let p = Utils.dom( 'div', Utils.basic+ 'width:20px; height:'+t+'px; pointer-events:auto; cursor:pointer;'  );
        Utils.dom( 'div', Utils.basic+ 'width:10px; height:10px; border-radius:5px; border:2px solid #ccc; top:'+ty+'px; left:5px;', null, p  );
        p.name = 'pins';
        return p;

    },

    dels: function(t){

        let p = Utils.dom( 'div', Utils.basic+'width:10px; height:10px; right:5px; top:'+(t||5)+'px; pointer-events:auto; cursor:pointer; background:'+ Utils.X0 +';' );
        p.name = 'dels'
        return p;

    },

    saveJson: function( o, toFile ){

        let data = {
            frameMax:o.frameMax,
            "track": {}
        };

        // save tracks
        let lng = o.tracks.length, t;
        for( let i=0; i<lng; i++ ){
            t = o.tracks[i];
            data.track[t.name] = { type:t.type, 'frame':t.getFrame() };
        }

        let output = JSON.stringify( data, null );
        output = output.replace('"frameMax"', '\n"frameMax"');
        output = output.replace('"track":{', '\n"track":{\n    ');
        output = output.replace(/}},/g, '}},\n    ');
        output = output.replace('}}}}', '}}\n    }\n}');

        if( toFile ){
            let blob = new Blob( [ output ], { type: 'text/plain;charset=utf-8' } );
            saveAs(blob, "neo.json");
        } else {
            o.tmpJSON = output;
            console.log( 'timeline in memory' );
        }

        /*

        // test value
        let objectURL = window.URL.createObjectURL( blob );
        window.open( objectURL, '_blank' );
        window.focus();

        */

    },

    fromJson: function( o, result ){

        if( result === undefined ) return;

        o.clear();

        let data = JSON.parse( result );

        // add track
        let t;
        for ( let name in data.track ) {
            t = data.track[name];
            o.add(t.type, { name:name, frame:t.frame });
        }


    },


    // VIDEO

    loadVideo: function( url, k ){
     
        let video = document.createElement('VIDEO');

        let source = document.createElement("source"); 
        source.setAttribute("src", './assets/video/' + url);
        source.setAttribute("type", "video/mp4");
        video.appendChild(source);

        video.load();

        video.addEventListener('loadeddata', function(){

            video.autoplay = false;
            //let maxi = Math.floor(video.duration.toFixed(0) * k.framerate )*2;
            let maxi = Math.floor(video.duration.toFixed(0) * k.frameRate * 2 );

            k.totalFrame = Math.floor( video.duration.toFixed(0) * Utils.FPS );//* k.framerate );
            //trying to get 45 Hz ( = 60 / 2 + 60 / 4), the nearest from 48 = 2*24
            k.reSize();

            k.video = video;

            console.log( k.totalFrame, maxi );

            let w = video.videoWidth
            let h = video.videoHeight

            // preview
            document.body.insertBefore( video, document.body.firstChild);
            video.style.cssText = 'pointer-events:none; position:absolute; left:50%; top:50%; width:'+w+'px; height:'+h+'px; margin:'+(-h*0.5)+'px '+(-w*0.5)+'px';

        } , false);

    },

    // Sound

    Sound: null,

    loadSound: function( url, k, callback ){

        if( !Utils.Sound ) Utils.Sound = new (window.AudioContext || window.webkitAudioContext || window.MozAudioContext || window.oAudioContext || window.msAudioContext)()

        let name = url.substring( url.lastIndexOf('/'), url.lastIndexOf('.') );

        // if already loaded
        if( Utils.soundLibs[ name ] !== undefined ){
            if( k !== null ) Utils.makeSoundKey( name, k );
            if( callback !== undefined ) callback();
            return;
        }



        //let context = new (window.AudioContext || window.webkitAudioContext || window.MozAudioContext || window.oAudioContext || window.msAudioContext)();

        let xhr = new XMLHttpRequest();
        xhr.open( 'GET', './assets/sound/'+ url , true );
        xhr.responseType = 'arraybuffer';
        xhr.onload = function(e){

            Utils.Sound.decodeAudioData( xhr.response, function( buffer ) {

                Utils.soundLibs[ name ] = {
                    imgs: Utils.soundToImg( Utils.soundPeaks( buffer, true ) ),
                    totalFrame: Math.round( buffer.duration * 60 ),
                    buffer: buffer
                }

                console.log( 'loading sound: ' + name );

                if( k !== null ) Utils.makeSoundKey( name, k );
                if( callback !== undefined ) callback();

            });

        }
        xhr.onerror = function(e){
            console.log(e)
        }
        xhr.send();

    },

    makeSoundKey: function ( name, k ) {

        Utils.clear( k.key );

        let s = Utils.soundLibs[ name ];
        for( let i = 0; i < s.imgs.length; i++) k.key.appendChild(s.imgs[i].cloneNode());
        k.totalFrame = s.totalFrame;
        k.buffer = s.buffer;
        k.reSize();

    },

    soundPeaks: function ( buffer, split ) {

        let lng = Math.round( buffer.duration * 60 );//NEO.FPS
        let sampleSize = buffer.length / lng;
        let sampleStep =  Math.floor(sampleSize * 0.1) || 1;//~~(sampleSize / 10) || 1;
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
                        max = value;
                    // faster than Math.abs
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

    soundToImg: function( p, target ){

            let imgs = [];

            let c1 = p[0];
            let c2 = p[1];

            let mono = c2 === undefined ? true : false;

            let w = c1.length;
            let num = Math.floor(w/500);
            let last = w - (num*500);
            let invw = 1 / w;
            let pp = (500 * 100) * invw;
            let pp2 = (last * 100) * invw;

            let canvas = document.createElement("canvas");
            canvas.height = 100;
            canvas.width = 500;

            let canvasEnd = document.createElement("canvas");
            canvasEnd.height = 100;
            canvasEnd.width = last;

            let colors = ['rgba(86,175,178,0.3)', 'rgba(86,175,178,0.75)']


            let ctx = canvas.getContext("2d");
            let ctx2 = canvasEnd.getContext("2d");


            //ctx.lineWidth = 2;

            let n = 0, i, j, k, img;
            let midy = mono ? 50 : 25;
            let a, b;

            for( i = 0; i <= num; i++ ){

                
                k = 500;

                if( i === num ){ 
                    k = last; 
                    pp = pp2;
                    canvas = canvasEnd;
                    ctx = ctx2;
                }

                ctx.clearRect(0, 0, 500, 100);

                ctx.beginPath();

                for(j = 0; j < k; j++){

                    a = Math.round(c1[j+n] * midy);// || 0.5;
                    ctx.fillStyle = colors[0];
                    ctx.fillRect( j, midy-a, 1, a * 2 );
                    ctx.fillStyle = colors[1];
                    ctx.fillRect( j, midy-a, 1, 1);
                    ctx.fillRect( j, midy+a, 1, 1);

                    //ctx.lineTo(j+0.5, midy-a);

                    if( !mono ){ 
                        b = Math.round(c2[j+n] * midy);// || 0.5;
                        ctx.fillStyle = colors[0];
                        ctx.fillRect( j, 75-b, 1, b*2 );
                        ctx.fillStyle = colors[1];
                        ctx.fillRect( j, 75-b, 1, 1);
                        ctx.fillRect( j, 75+b, 1, 1);
                    }

                }

                //ctx.stroke();

                //ctx.fill();
                n += 500;

                img = document.createElement("img");
                img.src = canvas.toDataURL();
                img.style.cssText = 'image-rendering:pixelated; pointer-events:none; position:relative; width:'+pp+'%; height:100%; display:inline-block; ';
                //-webkit-filter: invert(100%); filter: invert(100%);
                imgs.push( img );

            }

            ctx = null;
            canvas = null;

            return imgs;

    }

}