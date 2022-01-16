const snd = []
const callback = null
const pool = []

export class Sound {

    static load ( name ) {

        let audio = document.createElement('audio')
        audio.style.display = "none"
        audio.src = './sounds/'+ name +'.mp3'
        audio.autoplay = false

        audio.addEventListener('loadeddata', function(){

            snd[name] = audio

        }, false);
     
    }

    static play ( name ) {

        if( snd[ name ] ){

            let id = pool.length;
            pool.push( snd[ name ].cloneNode() )
            pool[id].play();
            pool[id].onended = function(){ pool.splice( pool.indexOf( this ), 1 ); delete this; }

        }

    }

}