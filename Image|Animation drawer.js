var totalScale = 3
var gifWidth = 50, gifHeight = 50
var transitionPercent=0.7

class ImageBuilder{
    generateImage(arrayMap, colorArray, name="Some picture", width, height){
        if(!width || width < 1)
            width = arrayMap[0].length
        if(!height || height < 1)
            height = arrayMap.length
        var widthMultiplier = arrayMap[0].length/width, heightMultiplier = arrayMap.length/height
        var img = createImage(arrayMap[0].length / widthMultiplier, arrayMap.length / heightMultiplier)
        img.loadPixels()
        for(var i=0;i<img.height;i++){
            for(var j=0;j<img.width; j++){
                img.set(j, i, colorArray[arrayMap[floor(i*heightMultiplier)][floor(j*widthMultiplier)]])
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
    genAvgBtwn(image1, image2){
        image1 = image1.img
        image2 = image2.img
        if(image1.width === image2.width && image1.height === image2.height){
            var img = createImage(image1.width, image1.height)
            img.loadPixels()
            for(var i=0;i<img.width;i++){
                for(var j=0;j<img.height;j++){
                    var c1 = image1.get(i, j), c2 = image2.get(i, j)
                    img.set(i, j, color((red(c1) + red(c2))/2, (green(c1) + green(c2))/2, (blue(c1) + blue(c2))/2))
                }
            }
            img.updatePixels()
            return new GeneratedImage(img, "avg image")
        }else {
            console.log("Images must have equal size")
            return null
        }
    }
    genAvgBtwnGif(gif1, gif2, speed){
        if(gif1.frameCount == gif2.frameCount){
            var imgArr = []
            if(!speed)
                speed = (gif1.speed+gif2.speed)/2
            for(var i=0;i<gif1.frames.length;i++){
                imgArr.push(this.genAvgBtwn(gif1.frames[i], gif2.frames[i]))
            }
            return this.generateAnimationFromImages(imgArr, speed)
        }else{
            console.log("Animations have different frame count")
            return null
        }
    }
    genReversedGif(orig){
        var imgArr = orig.frames.slice().reverse()
        return this.generateAnimationFromImages(imgArr)
    }
    genTransitionBetween(i1, i2, percent=0.5){
        if(i1.width == i2.width && i1.height == i2.height){
            var img = createImage(i1.width, i1.height)
            img.loadPixels()
            for(var i=0;i<i1.width;i++){
                for(var j=0;j<i1.height;j++){
                    var c1 = i1.img.get(i, j), c2 = i2.img.get(i, j)
                    var col = color(lerp(red(c1), red(c2), percent), lerp(green(c1), green(c2), percent), lerp(blue(c1), blue(c2), percent))
                    img.set(i, j, col)
                }
            }
            img.updatePixels()
            return new GeneratedImage(img, "transited image")
        }else{
            console.log("Images must have equal size")
            return null
        }
    }
    genTransitionBetweenGif(g1, g2, percent=0.5, speed){
        if(g1.frameCount == g2.frameCount){
            var imgArr = []
            if(!speed)
                speed = (g1.speed+g2.speed)/2
            for(var i=0;i<g1.frames.length;i++){
                imgArr.push(this.genTransitionBetween(g1.frames[i], g2.frames[i], percent))
            }
            return this.generateAnimationFromImages(imgArr, speed)
        }else{
            console.log("Animations have different frame count")
            return null
        }
    }
}var imageBuilder
class GeneratedImage{
    constructor(img, name){
        this.img = img
        this.width = img.width
        this.height = img.height
        this.name = name
        this.lastScale = 1
        this.lastX = null
        this.lastY = null
    }
    showOn(x, y, s=1, centered=false){
        this.lastScale = s
        this.lastX = x
        this.lastY = y
        push()
        scale(this.lastScale)
        if(centered)
            translate((x - (this.width*this.lastScale)/2)/this.lastScale, (y - (this.height*this.lastScale)/2)/this.lastScale)
        else
            translate(x/this.lastScale, y/this.lastScale)
        image(this.img, 0, 0)
        pop()
    }
    setPixel(x, y, col){
        this.img.loadPixels()
        this.img.set(x, y, color(col))
        this.img.updatePixels()
    }
    inverse(){
        this.img.loadPixels()
        for(var i=0;i<this.height;i++){
            for(var j=0;j<this.width; j++){
                this.img.set(j, i, color(255 - red(this.img.get(j, i)), 255 - green(this.img.get(j, i)), 255 - blue(this.img.get(j, i))))
            }
        }
        this.img.updatePixels()
    }
}
class GeneratedAnimation{
    constructor(imgArr, speed=1){
        this.frames = imgArr
        this.frameCount = imgArr.length
        this.width = imgArr[0].width
        this.height = imgArr[0].height
        this.speed = speed/10
        this.showedFrames = 0
        this.scale = 1
        this.lastX = null
        this.lastY = null
    }
    showOn(x, y, s=1, centered=false){
        this.scale = s
        this.lastX = x
        this.lastY = y
        this.frames[floor((this.showedFrames++*this.speed))%this.frames.length].showOn(x, y, this.scale, centered)
    }
    setPixel(imgIndex, x, y, col){
        this.frames[imgIndex].setPixel(x,y,col)
    }
    inverse(){
        for(var i=0;i<this.frames.length;i++){
            this.frames[i].inverse()
        }
    }
}
function setup(){
    createCanvas(windowWidth, windowHeight)
    imageBuilder = new ImageBuilder()
    var imgArr = []
    var inverseArr = []
    var inversedImage
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
    inversedImage = imageBuilder.generateImage(colorMap, colors, "inversed image", gifWidth, gifHeight)
    inverseArr.push(inversedImage)
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture", gifWidth, gifHeight))
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
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture", gifWidth, gifHeight))
    inversedImage = imageBuilder.generateImage(colorMap, colors, "inversed image", gifWidth, gifHeight)
    inverseArr.push(inversedImage)
    colorMap = [
        [3, 3, 2, 2, 2, 2, 2, 0, 3],
        [3, 2, 2, 2, 2, 2, 2, 3, 3],
        [3, 3, 2, 2, 2, 2, 3, 3, 3],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture", gifWidth, gifHeight))
    inversedImage = imageBuilder.generateImage(colorMap, colors, "inversed image", gifWidth, gifHeight)
    inverseArr.push(inversedImage)
    colorMap = [
        [3, 3, 3, 2, 2, 2, 2, 0, 0],
        [3, 3, 2, 2, 2, 2, 2, 2, 3],
        [3, 3, 3, 2, 2, 2, 2, 3, 3],
        [2, 2, 2, 2, 2, 2, 2, 2, 2],
        [1, 1, 1, 2, 2, 2, 2, 1, 1],
        [1, 1, 1, 1, 1, 2, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture", gifWidth, gifHeight))
    inversedImage = imageBuilder.generateImage(colorMap, colors, "inversed image", gifWidth, gifHeight)
    inverseArr.push(inversedImage)
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
    imgArr.push(imageBuilder.generateImage(colorMap, colors, "My picture", gifWidth, gifHeight))
    inversedImage = imageBuilder.generateImage(colorMap, colors, "inverse picture", gifWidth, gifHeight)
    inverseArr.push(inversedImage)
    inversedGif = imageBuilder.generateAnimationFromImages(inverseArr, 1)
    inversedGif.inverse()
    gif = imageBuilder.generateAnimationFromImages(imgArr, 1)
    reversedGif = imageBuilder.genReversedGif(gif)
    avgGif = imageBuilder.genAvgBtwnGif(gif, reversedGif, 1)
    transitedGif = imageBuilder.genTransitionBetweenGif(gif, inversedGif, transitionPercent, 1)
}

var gif, inversedGif, avgGif, reversedGif, transitedGif

function draw(){
    background(0)
    reversedGif.showOn(width/2, height/4, totalScale, true)
    gif.showOn(reversedGif.lastX, reversedGif.lastY + reversedGif.height * totalScale, totalScale, true)
    inversedGif.showOn(gif.lastX, gif.lastY + gif.height*totalScale, totalScale, true)
    avgGif.showOn(reversedGif.lastX + reversedGif.width * totalScale, reversedGif.lastY + reversedGif.height/2*totalScale, totalScale, true)
    transitedGif.showOn(avgGif.lastX, avgGif.lastY + avgGif.height*totalScale, totalScale, true)
    for(var i=0;i<gif.frameCount;i++){
        gif.frames[i].showOn(0, gif.height * i * totalScale, totalScale, false)
        text("image " + (i+1), gif.width*totalScale, (gif.height * i + gif.height/2) * totalScale)
    }
    noStroke()
    fill(255)
    textSize(20)
    text(floor(frameRate()), width/2, 20)
}
