var totalScale = 20

class ImageBuilder{
    generateImage(arrayMap, colorArray, name="Some picture"){
        var img = createImage(arrayMap[0].length, arrayMap.length)
        img.loadPixels()
        for(var i=0;i<img.height;i++){
            for(var j=0;j<img.width; j++){
                img.set(j, i, colorArray[arrayMap[i][j]])
            }
        }
        img.updatePixels()
        return new GeneratedImage(img, name)
    }
    generateAnimationFromImages(imageArray, speed=1){
        return new GeneratedAnimation(imageArray, speed)
    }
    generateAnimationFromArray(colorMaps, colorArray, speed=1){
        var im = []
        for(var i=0;i<colorMaps.length;i++){
            im.push(generateImage(colorMaps[i], colorArray, speed))
        }
        return generateAnimationFromImages(im, speed)
    }
}var imageBuilder
class GeneratedImage{
    constructor(img, name){
        this.img = img
        this.width = img.width
        this.height = img.height
        this.name = name
    }
    showOn(x, y, s=1, centered=false){
        push()
        scale(s)
        if(centered)
            translate((x - (this.width*s)/2)/s, (y - (this.height*s)/2)/s)
        else
            translate(x/s, y/s)
        image(this.img, 0, 0)
        pop()
    }
    setPixel(x, y, col){
        this.img.loadPixels()
        this.img.set(x, y, color(col))
        this.img.updatePixels()
    }
}
class GeneratedAnimation{
    constructor(imgArr, speed=1){
        this.frames = imgArr
        this.width = imgArr[0].width
        this.height = imgArr[0].height
        this.speed = speed/10
        this.showedFrames = 0
    }
    showOn(x, y, s=1, centered=false){
        this.frames[floor((this.showedFrames++*this.speed))%this.frames.length].showOn(x, y, s, centered)
    }
    setPixel(imgIndex, x, y, col){
        this.frames[imgIndex].setPixel(x,y,col)
    }
}
function setup(){
    createCanvas(windowWidth, windowHeight)
    imageBuilder = new ImageBuilder()
    var imgArr = []
    var colors = [color(255, 230, 0), color(0, 150, 0), color(150, 150, 255), color(255)]
    var colorMap = [
        [2, 2, 2, 2, 2, 3, 3, 3, 0],
        [2, 2, 2, 2, 3, 3, 3, 2, 0],
        [2, 2, 2, 3, 3, 3, 3, 3, 2],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture"))
    colorMap = [
        [3, 2, 2, 2, 2, 2, 2, 3, 3],
        [2, 2, 2, 2, 2, 2, 3, 3, 3],
        [3, 2, 2, 2, 2, 3, 3, 3, 3],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture"))
    colorMap = [
        [2, 3, 3, 3, 2, 2, 2, 0, 0],
        [3, 3, 3, 2, 2, 2, 2, 2, 0],
        [3, 3, 3, 3, 2, 2, 2, 2, 3],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture"))
    gif = imageBuilder.generateAnimationFromImages(imgArr, 1)
}

var gif

function draw(){
    background(0)
    gif.showOn(width/2, height/2, totalScale, true)
    for(var i=0;i<gif.frames.length;i++){
        gif.frames[i].showOn(0, gif.height * i * totalScale, totalScale, false)
        text("image " + (i+1), gif.width*totalScale, (gif.height * i + gif.height/2) * totalScale)
    }
    noStroke()
    fill(255)
    textSize(20)
    text(floor(frameRate()), width/2, 20)
}
