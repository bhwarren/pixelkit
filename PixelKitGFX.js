const DeviceManager = require('./node_modules/community-sdk/communitysdk.js').DeviceManager;
const RetailPixelKit = require('./node_modules/community-sdk/communitysdk.js').RetailPixelKit;

class Pixel {
    constructor(x=0, y=0, color="#00FF00"){
        this.x = x
        this.y = y
        this.color = color
    }
}

class Frame {
    constructor(){
        this.rawFrame = this.newBlankFrame()
    }

    newBlankFrame = (color="#000000") => { 
        var frame = []; 
        for(let i=0; i<128; i++){ frame.push(color) } 
        return frame
    }

    getPixelIndex(x, y){
        if(x < 0 || x > 15 || y < 0 || y > 7) { return null }
        return 16*y + x 
    }

    setPixel(pixel=null){
        if(!pixel || ! pixel instanceof Pixel) { return }
        var index = this.getPixelIndex(pixel.x, pixel.y)
        if(index === null) { return }
        this.rawFrame[index] = pixel.color
    }
}

class PixelKit {
    constructor(refreshRate=30){
        this.frames = [new Frame()]
        this._rpk = null
        this.findDevice().then( rpk => {
            if(this._onConnectedCB)
                this._onConnectedCB(rpk)
            this._drawingInterval = setInterval(this.drawFrame.bind(this), 1000/refreshRate)
        })

    }

    onConnect(callback){
        if(this._rpk)
            callback(this._rpk)
        this._onConnectedCB = callback
    }

    stopDrawing(){
        if(this._drawingInterval){
            clearInterval(this._drawingInterval)
            this._rpk.port.close()
        }
    }

    onFinished(callback){
        this._onFinishedCB = callback
    }

    drawFrame(){
        if(this.frames.length === 0){
            if(typeof this._onFinishedCB == "function"){
                this._onFinishedCB()
            }
        }
        if(this.frames.length === 0 || !this._rpk){ return }
        var frame = this.frames.shift()
        this._rpk.streamFrame(frame.rawFrame).catch((error) => {
            if(error.message != 512)
                console.log('Problem streaming frame', error);
        });
    }

    queueFrame(frame){
        this.frames.push(frame)
    }


    findDevice(){
        var _this = this;
        return new Promise( (resolve, reject) => {
            DeviceManager.listConnectedDevices().then((devices) => {
                let rpk = devices.find((device) => {
                    return device instanceof RetailPixelKit
                })
                if(!rpk) {
                    reject('No Pixel Kit was found :(')
                } else {
                    _this._rpk = rpk
                    resolve(rpk)
                }
            });
        })
        
    }
}

module.exports = { Frame: Frame, PixelKit: PixelKit, Pixel: Pixel}
