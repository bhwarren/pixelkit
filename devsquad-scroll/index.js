/**
This example will stream a series of single color "frames" to Pixel Kit.
*/
const DeviceManager = require('../node_modules/community-sdk/communitysdk.js').DeviceManager;
const PixelKit = require('../node_modules/community-sdk/communitysdk.js').RetailPixelKit;
const frames = require('./frames.json').frames

var stopStreaming = null

DeviceManager.listConnectedDevices()
.then((devices) => {
    // Filter devices to find a Motion Sensor Kit
    let rpk = devices.find((device) => {
        return device instanceof PixelKit;
    });
    if(!rpk) {
        console.log('No Pixel Kit was found :(');
    } else {
        var frameNumber = 0
        stopStreaming = setInterval(() => {
		try{
                    rpk.streamFrame(frames[frameNumber])
                        .catch((error) => {
                            console.log('Problem streaming frame', error);
                        });
        		frameNumber = frameNumber === frames.length-1 ? 0 : frameNumber+1
		}catch(e) { console.log(e) }
        }, 100);
    }
});

module.export = { "stopStreaming": stopStreaming }	
