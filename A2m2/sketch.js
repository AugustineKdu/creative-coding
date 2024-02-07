let player;
let platforms = [];
let rSlider, gSlider, bSlider;
let state;
let playButton;
let sprite;
let item;
let video;
let button1;
let button2;

let canvas;


let loadingScreenTimeout;

let sound1, sound2, sound3;

function preload() {
    sound1 = loadSound('assert/sound1brake.mp3');
    sound2 = loadSound('assert/sound2jump.mp3');
    sound3 = loadSound('assert/sound3win.mp3');
    img = loadImage('assert/loadingimg.png');
    img2 = loadImage('assert/img2.jpeg');

    video1 = createVideo('assert/video.mp4');
}

class Platform {
    constructor(x, y, width, height, moving = false) {
        this.sprite = createSprite(x, y, width, height);
        this.sprite.shapeColor = color(219, 241, 253);
        this.broken = false;
        this.moving = moving;
        this.moveDirection = 1;
        this.moveSpeed = 2;
    }

    update() {
        if (this.moving) {
            this.sprite.position.x += this.moveSpeed * this.moveDirection;
            if (this.sprite.position.x > width - this.sprite.width / 2 || this.sprite.position.x < this.sprite.width / 2) {
                this.moveDirection *= -1;
            }
        }
    }

    show() {
        if (!this.broken) {
            drawSprite(this.sprite);
        }
    }

    break() {
        if (!this.moving) {
            this.broken = true;
            this.sprite.remove();
            sound1.play();
        }
    }
}

class Player {
    constructor(x, y) {
        this.sprite = createSprite(x, y, 40, 40);
        this.sprite.velocity.y = 0;
        this.gravity = 0.5;
        this.lift = -20.5;
        this.prevY = y;

        this.sprite.shapeColor = color(this.r, this.g, this.b);
        this.onMovingPlatform = false;
    }

    applyGravity() {
        this.sprite.velocity.y += this.gravity;
        this.sprite.velocity.y = constrain(this.sprite.velocity.y, -Infinity, 10);
    }

    move() {
        if (keyIsDown(LEFT_ARROW)) {
            this.sprite.velocity.x = -7;
            this.sprite.velocity.y = 5;
        } else if (keyIsDown(RIGHT_ARROW)) {
            this.sprite.velocity.x = 7;
            this.sprite.velocity.y = 5;
        } else {
            if (this.onMovingPlatform) {
                this.sprite.velocity.x *= 0.1;
            } else {
                this.sprite.velocity.x = 0;
            }
        }
    }

    jump() {
        if (keyWentDown(UP_ARROW)) {
            this.sprite.velocity.y = this.lift;
            sound2.play();
        }
    }

    collide(platforms) {
        for (let platform of platforms) {
            if (this.sprite.collide(platform.sprite)) {
                if (this.sprite.velocity.y < 0 && this.prevY > platform.sprite.position.y) {
                    platform.break();
                }
            }
        }
        this.prevY = this.sprite.position.y;
    }

    show() {
        fill(this.r, this.g, this.b);
        drawSprite(this.sprite);
    }

    checkOnMovingPlatform(platforms) {
        this.onMovingPlatform = false;
        platforms.forEach(platform => {
            if (platform.moving && this.sprite.collide(platform.sprite)) {
                this.onMovingPlatform = true;
            }
        });
    }

    update() {
        this.applyGravity();
        this.move();
        this.jump();
    }
}

function setup() {

    canvas = createCanvas(700, 900);
    let canvasX = (windowWidth - width) / 2;
    let canvasY = (windowHeight - height) / 2;
    canvas.position(canvasX, canvasY);

    state = 'loading';
    player = new Player(350, height - 50);
    rSlider = createSlider(0, 255, 255, 5);
    gSlider = createSlider(0, 255, 255, 5);
    bSlider = createSlider(0, 255, 255, 5);
    rSlider.position(700, 740);
    gSlider.position(700, 770);
    bSlider.position(700, 800);

    button1 = createButton('Level 1');

    button1.mousePressed(() => startGame(1));
    button1.style('font-size', '18px');
    button1.style('padding', '10px 20px');
    button1.style('border-radius', '5px');

    button2 = createButton('Level 2');

    button2.mousePressed(() => startGame(2));
    button2.style('font-size', '18px');
    button2.style('padding', '10px 20px');
    button2.style('border-radius', '5px');
    // 버튼 위치 조정
    button1.position(canvasX + 200, canvasY + 200);
    button2.position(canvasX + 400, canvasY + 200);

    // image(video1, 700, 900, canvasX + 400, canvasY + 200);
    video1 = createVideo(['assert/video.mp4']);
    video1.position(canvasX + 900, canvasY + 100);
    video1.size(400, 300);
    video1.hide();

    changeState('main');
}

function draw() {
    background(0);

    switch (state) {
        case 'main':
            drawMainMenu();
            break;
        case 'loadingPage':
            drawLoadingScreen();
            break;
        case 'level1':
            drawLevel1();
            break;
        case 'level2':
            drawLevel2();
            break;
        case 'board':
            drawboardscreen();
    }
}

function changeState(newState) {
    state = newState;
    switch (state) {
        case 'main':
            drawMainMenu();
            break;
        case 'loadingPage':
            hideUI();
            break;
        case 'level1':
            initializeLevel1();
            hideUI();
            break;
        case 'level2':
            initializeLevel2();
            hideUI();
            break;
    }
}

function drawLoadingScreen() {
    image(img, 0, 0, width, height);
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text('Loading...', width / 2, height / 2 - 20);
    textSize(20);
    text("Game play Instructions: Use <= =>ARROWS to move, Up Arrows for Jump", width / 2, height / 2 + 400);

}

function hideUI() {
    rSlider.hide();
    gSlider.hide();
    bSlider.hide();
    button1.hide();
    button2.hide();
    video1.hide();
    video1.stop();
}

function drawMainMenu() {
    image(img2, 0, 0, width, height);
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text('Welcome to Ice Crime Game', width / 2, 130);
    text('Main Menu: Click to Start', width / 2, 180);

    // image(video1, 700, 900, width / 2, height / 2);
    video1.play();
    video1.loop();
}

function startGame(gameNumber) {
    hideUI();
    changeState('loadingPage');
    clearTimeout(loadingScreenTimeout);
    loadingScreenTimeout = setTimeout(() => {
        if (gameNumber === 1) {
            changeState('level1');
        } else if (gameNumber === 2) {
            changeState('level2');
        }
    }, 5000);
}

function initializeLevel1() {
    background(255);
    platforms = [];
    createPlatforms(10, 170);
    createItem(height - (10 * 170 + 225));
}

function initializeLevel2() {
    background(255);
    platforms = [];
    createPlatforms(15, 200);
    createItem(height - (15 * 200 + 225));
}

function createPlatforms(totalFloors, platformSpacing) {
    const platformWidth = 50;
    const platformHeight = 20;
    const numBrickPerRow = width / platformWidth;
    const movingPlatformPosition = Math.floor(numBrickPerRow / 2) - 1;

    for (let i = 1; i <= totalFloors; i++) {
        if (i % 2 === 1) {
            let x = movingPlatformPosition * platformWidth + platformWidth * 1.5;
            let y = height - 50 - i * platformSpacing;
            platforms.push(new Platform(x, y, platformWidth * 3 - 2, platformHeight, true));
        } else {
            for (let j = 0; j < numBrickPerRow; j++) {
                let x = j * platformWidth + platformWidth / 2;
                let y = height - 50 - i * platformSpacing;
                platforms.push(new Platform(x, y, platformWidth - 2, platformHeight, false));
            }
        }
    }

    let wallHeight = totalFloors * platformSpacing + 50;
    platforms.push(new Platform(25, height - wallHeight / 2, 50, wallHeight));
    platforms.push(new Platform(width - 25, height - wallHeight / 2, 50, wallHeight));
    platforms.push(new Platform(width / 2, height - 25, width, 50));
}

function createItem(topPlatformY) {
    item = createSprite(width / 2, topPlatformY, 20, 20);
    item.shapeColor = color(255, 204, 0);
}

function drawLevel1() {
    handleLevelDraw();
}

function drawLevel2() {
    handleLevelDraw();
}

function handleLevelDraw() {
    let yOffset = height / 2 - player.sprite.position.y;
    translate(0, yOffset);

    player.applyGravity();
    player.move();
    player.jump();
    player.collide(platforms);
    player.show();
    player.update();

    for (let platform of platforms) {
        platform.update();
        platform.show();
    }

    if (player.sprite.overlap(item)) {
        console.log("Item collected! Level Complete.");
        sound3.play();
        noLoop();
        drawLoadingScreen();
    }

    drawSprites();
}

function drawboardscreen() {

}
