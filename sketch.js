// double buffering
let bufferA;
let bufferB;
let currentBuffer;

let colorPalette;

let loadedImage;

let newDrop = true;
let selectedColor;
let isTine = false;
let previousMouseX;
let previousMouseY

let marbleShader;

let inkRadius;

function toggleTine() {
    isTine = !isTine;

    if (isTine) {
        document.getElementById('tineButton').value = 'Tine';
    }
    else {
        document.getElementById('tineButton').value = 'Ink';
    }
}

function preload() {
    loadedImage = loadImage('pic.jpg');
    marbleShader = loadShader('shader.vert', 'shader.frag');
}

function setup() {
    createCanvas(windowWidth, windowHeight - 24);

    noSmooth();
    setAttributes('antialias', false);

    // scale ink size based on screen size
    inkRadius = Math.trunc(Math.sqrt(width * width + height * height) * 0.01 - 2.5); // pixels

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

    bufferA = createGraphics(width, height, WEBGL);
    bufferA.background(255);
    bufferA.image(loadedImage, -width / 2, -height / 2, width, height, 0, 0, loadedImage.width, loadedImage.height, CONTAIN);

    bufferB = createGraphics(width, height, WEBGL);

    currentBuffer = bufferA;
    currentBuffer.shader(marbleShader);

    image(currentBuffer, 0, 0);

    previousMouseX = mouseX;
    previousMouseY = mouseY;
}

function runShader(centerX, centerY) {
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

    marbleShader.setUniform('isTine', isTine); // this boolean is converted into float
    marbleShader.setUniform('previousMouse', [previousMouseX, previousMouseY]);
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

        runShader(mouseX, mouseY);
        image(currentBuffer, 0, 0);
    }

    previousMouseX = mouseX;
    previousMouseY = mouseY;
}
