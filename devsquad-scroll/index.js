const {PixelKit} = require('../PixelKitGFX')
const rawFrames = require('./frames.json').frames

var streamingInterval = null
var stopStreaming = function(){
    clearInterval(streamingInterval)
}

var kit = new PixelKit()
kit.onConnect(rpk => {
    var frameNumber = 0
    streamingInterval = setInterval(() => {
        rpk.streamFrame(rawFrames[frameNumber]).catch((error) => {});
        frameNumber = frameNumber === rawFrames.length-1 ? 0 : frameNumber+1
    }, 83);
})


module.exports = { "stopStreaming": stopStreaming }	
