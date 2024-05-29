// double buffering
let bufferA;
let bufferB;
let currentBuffer;

let colorPalette;

let loadedImage;

let newDrop = true;
let selectedColor;

let marbleShader;

let inkRadius;

function preload() {
    loadedImage = loadImage('pic.jpg');
    marbleShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    setAttributes('antialias', false);
    createCanvas(windowWidth, windowHeight);

    // scale ink size based on screen size
    inkRadius = Math.trunc(Math.sqrt(windowWidth * windowWidth + windowHeight * windowHeight) * 0.01 - 2.5);

    colorPalette = [
        [11, 106, 136],
        [45, 197, 244],
        [112, 50, 126],
        [146, 83, 161],
        [164, 41, 99],
        [236, 1, 90],
        [240, 99, 164],
        [241, 97, 100],
        [248, 158, 79],
        [252, 238, 33]
    ];

    for (let i = 0; i < colorPalette.length; i++) {
        let selectedColor = colorPalette[i];

        for (let j = 0; j < selectedColor.length; j++) {
            selectedColor[j] /= 255;
        }
    }

    selectedColor = random(colorPalette);

    bufferA = createGraphics(windowWidth, windowHeight, WEBGL);
    bufferA.background(255);
    bufferA.image(loadedImage, -width / 2, -height / 2, width, height, 0, 0, loadedImage.width, loadedImage.height, CONTAIN);

    bufferB = createGraphics(windowWidth, windowHeight, WEBGL);

    currentBuffer = bufferA;
    currentBuffer.shader(marbleShader);

    image(currentBuffer, 0, 0);
}

function dropInk(centerX, centerY, inkRadius) {
    if (centerX < 0 || centerX > width || centerY < 0 || centerY > height) {
        return;
    }

    let otherBuffer;
    if (currentBuffer === bufferA) {
        otherBuffer = bufferB;
    }
    else {
        otherBuffer = bufferA;
    }

    const shaderCopy = marbleShader.copyToContext(otherBuffer);
    marbleShader = shaderCopy;
    otherBuffer.shader(marbleShader);

    marbleShader.setUniform('color', selectedColor);
    marbleShader.setUniform('resolution', [width, height]);
    marbleShader.setUniform('ink', [centerX, centerY, inkRadius]);
    marbleShader.setUniform('uTexture', currentBuffer);

    otherBuffer.rect(-width / 2, -height / 2, width, height);

    currentBuffer = otherBuffer;
}

function mouseReleased() {
    newDrop = true;
}

function draw() {
    if (mouseIsPressed) {
        if (newDrop) {
            // randomly pick a color from the palette
            selectedColor = random(colorPalette);
            newDrop = false;
        }

        dropInk(mouseX, mouseY, inkRadius);
        image(currentBuffer, 0, 0);
    }
}
