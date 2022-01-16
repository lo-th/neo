NEO.Throttle = function(){
    var originalFct = requestAnimationFrame;
    var _this   = this;
    this.preFunction    = null;
    this.postFunction   = null;
    this.fps        = -1;  // -1 is no throttle, > 0 is number of frame per second

    requestAnimationFrame = function(callback){
        if( _this.fps === -1 ) originalFct(function(timestamp){ onAnimationFrame(callback, timestamp) });        
        else if( _this.fps > 0 ) setTimeout(function(){ onAnimationFrame(callback, performance.now()) }, 1000 / _this.fps);
        else console.assert(false);
    }
    
    //restore the original requestAnimationFrame function
    this.restore = function(){ requestAnimationFrame = originalFct }
    
    return

    function onAnimationFrame(callback, timestamp) {
        if( _this.preFunction !== null )_this.preFunction(timestamp);
        callback(timestamp);
        if( _this.postFunction !== null ) _this.postFunction(timestamp);
    }
}