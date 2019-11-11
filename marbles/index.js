const {Pixel, Frame, PixelKit} = require('../PixelKitGFX')


class Marble extends Pixel {
    constructor(x=7, y=-1, color="#00FF00"){
        super(x, y, color)
        this.inertia = 1
        this.yDirection = 1

        this.bouncesLeft = Math.round(Math.random()*4+1)

        this.hasBounced = false
        this.xDirection = Math.random() > .5 ? -1 : 1
    }
}

class MarblesAnimator {
    constructor(){
        this.main()
    }

    async main(){
        this.rpk = new PixelKit(12)
        this.marbles = [] 
        for(let i=0; i<1; i++){
            this.marbles.push(new Marble(7, -1, "#00FF00"))
        }
        this.dropMarbles()

        
    }

    dropMarbles(){
        // go frame by frame
        var frame  = new Frame()
        for(let i=0; i< this.marbles.length; i++){
            var marble = this.marbles[i] // this is the marble we are dropping right now
            
            //while the marble still has inertia, keep moving it
            while(marble.inertia !== 0){

                // if the marble is currently going up from a bounc, reduce its inertia and 
                // if necessary set it back to 1 for "gravity" to take back over
                if(marble.yDirection === -1){ 
                    marble.inertia-- 
                    if(marble.inertia <= 0){
                        marble.inertia = 1 
                        marble.yDirection = 1
                    }
                }
    
                
                // if there is going to be a collision, then set the variables to "bounce" the marble, 
                // being sure to move it in the x direction as well
                if((marble.y == 7 || this.marbleExists(marble.x, marble.y + marble.yDirection*marble.inertia)) ){
                    marble.x += marble.xDirection
                    marble.bouncesLeft--
                    marble.inertia = marble.bouncesLeft
                    if(marble.yDirection === 1)
                        marble.yDirection = -1

                    marble.hasBounced = true
                    
                }


                // if there will be an x position collision after the bounce, undo the x change (used for 'wells')
                if(this.marbleExists(marble.x, marble.y +  marble.yDirection*marble.inertia)){
                    marble.x -= marble.xDirection
                }
                
                // update the y position
                marble.y = marble.y + marble.yDirection*marble.inertia
                
                // create the new frame, and add in the previously dropped marble's positions in addition the current one
                frame = new Frame()
                for(let j=0; j<i; j++){
                    frame.setPixel(this.marbles[j])
                }
                frame.setPixel(marble)
                this.rpk.queueFrame(frame)
            }
        }

        this.rpk.queueFrame(frame)
        this.rpk.onFinished( () => {
            this.rpk.stopDrawing();
        })
    }

    marbleExists(x, y){
        return this.marbles.filter( marble => {
            return marble.x == x && marble.y == y
        }).length !== 0
    }
}

module.export = new MarblesAnimator()
