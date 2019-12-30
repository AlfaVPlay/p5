function setup(){
    createCanvas(windowWidth, windowHeight)
    noiseImage = getImageFromNoise(createNoise(100, 100, 0.1), 2)
}
function mousePressed(){
    noiseImage = getImageFromNoise(createNoise(100, 100, 0.1), 2, color(255))
}

function draw(){
    background(0)
    showFps(false, 255, width/2, 20)
    image(noiseImage, width/2 - noiseImage.width/2, height/2 - noiseImage.height/2)
}
var noiseImage
function getImageFromNoise(noiseArr, s=1, col){
    if(!col) col = color(255)
    var img = createImage(noiseArr.length, noiseArr[0].length)
    img.loadPixels()
    for(var i=0;i<noiseArr.length;i++){
        for(var j=0;j<noiseArr[i].length;j++){
            var v = noiseArr[i][j]
            img.set(i, j, color(red(col) * v, green(col) * v, blue(col) * v))
        }
    }
    img.updatePixels()
    img.width*=s
    img.height*=s
    return img
}
function createNoise(width, height, sharpness){
    if(sharpness < 0 || sharpness > 1)
        sharpness = 0.1
    var noiseValues = []
    for(var i=0;i<width;i++){
        noiseValues[i] = []
    }
    noiseValues[0][0] = random(0, 1)
    for(var i=1;i<width;i++){
        noiseValues[i][0] = min(max(0, noiseValues[i-1][0]) + random(-sharpness, sharpness), 1)
    }
    for(var i=1;i<height;i++){
        noiseValues[0][i] = min(max(0, noiseValues[0][i-1]) + random(-sharpness, sharpness), 1)
    }
    for(var i=1;i<width;i++){
        for(var j=1;j<height;j++){
            noiseValues[i][j] = min(max(0, (noiseValues[i-1][j-1] + noiseValues[i-1][j] + noiseValues[i][j-1])/3 + random(-sharpness, sharpness)), 1)
        }
    }
    console.log(noiseValues)
    return noiseValues;
}

var _fpsArray = []
function showFps(advancedDebug, backgroundColor, x = width*3/8, y = 20, w = width/8, h=width/20){
    push()
    noStroke()
    fill(backgroundColor)
    if(advancedDebug){
        rect(x, y, w, h)
        beginShape(LINES)
        for(var i = 0; i<_fpsArray.length;i++){
            gc = map(_fpsArray[i], 0, 60, 0, 255)
            stroke(255 - gc, gc, 0)
            vertex(x + w - i -1, h)
            vertex(x + w - i -1, h - norm(gc, 0, 255)*h/1.5)
        }
        noFill()
        endShape()
        if(_fpsArray.length > w){
            _fpsArray.splice(w, 1)
        }
        _fpsArray.unshift(frameRate().toFixed(0))
    }else{
        textSize(20)
        text(frameRate().toFixed(0), x, y)
        pop()
    }
}
