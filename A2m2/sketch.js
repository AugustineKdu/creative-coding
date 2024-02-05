let player;
let platforms = [];
let rSlider, gSlider, bSlider;
let state;
let playButton;
let sprite;

class Platform {
    constructor(x, y, width, height) {
        this.sprite = createSprite(x, y, width, height);
        this.sprite.shapeColor = color(0, 0, 0);
        this.broken = false;
    }

    show() {
        if (!this.broken) {
            drawSprite(this.sprite);
        }

    }
    break() {
        this.broken = true;
        this.sprite.remove();
    }
}
class Player {
    constructor(x, y) {
        this.sprite = createSprite(x, y, 40, 40);
        this.sprite.velocity.y = 0;
        this.gravity = 0.5;
        this.lift = -12.5; // -80은 매우 높은 점프 값이므로, 실제 게임 플레이에 적합한 값으로 조정할 필요가 있습니다.
        this.prevY = y;
        // this.r, this.g, this.b 변수 및 생성자 내 색상 설정 코드를 제거
        this.sprite.shapeColor = color(255); // 기본 색상을 흰색 또는 다른 색상으로 설정
    }

    applyGravity() {
        this.sprite.velocity.y += this.gravity;
        this.sprite.velocity.y = constrain(this.sprite.velocity.y, -Infinity, 10); // 점프 후의 상승을 허용하기 위해 최소값 변경
    }

    move() {
        if (keyIsDown(LEFT_ARROW)) {
            this.sprite.velocity.x = -7;
            this.sprite.velocity.y = 5;
            sprite.rotation = 90;
        } else if (keyIsDown(RIGHT_ARROW)) {
            this.sprite.velocity.x = 7;
            this.sprite.velocity.y = 5;
        } else {
            this.sprite.velocity.x = 0;
        }
    }

    jump() {
        if (keyWentDown(UP_ARROW)) {
            this.sprite.velocity.y = this.lift;
        }
    }

    collide(platforms) {
        for (let platform of platforms) {
            if (this.sprite.collide(platform.sprite)) {
                // 아래에서 위로 점프하는 충돌 감지
                if (this.sprite.velocity.y < 0 && this.prevY > platform.sprite.position.y) {
                    platform.break();
                }
            }
        }
        this.prevY = this.sprite.position.y; // 현재 프레임의 위치를 이전 위치로 업데이트
    }

    show() {

        fill(this.r, this.g, this.b);
        drawSprite(this.sprite);
    }
}




function preload() {

    // shelters = loadJSON('leaderboard.json');
    img = loadImage('loadingimg.png');
}
function setup() {
    createCanvas(700, 900);
    state = 'loading';
    player = new Player(350, 890);

    //create the rgd slider 
    rSlider = createSlider(0, 255, 255, 5);
    gSlider = createSlider(0, 255, 255, 5);
    bSlider = createSlider(0, 255, 255, 5);

    rSlider.position(10, 40);
    gSlider.position(10, 70);
    bSlider.position(10, 100);

    rSlider.hide();
    gSlider.hide();
    bSlider.hide();

    const platformWidth = 50;
    const platformHeight = 20;
    const numRows = 7;
    const numBrickPerRow = width / platformWidth;

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numBrickPerRow; j++) {
            let platform = new Platform(j * platformWidth + platformWidth / 2, i * (platformHeight + 100) + platformHeight / 2, platformWidth - 2, platformHeight);
            platforms.push(platform);
        }
    }


    // 좌우 벽 생성
    platforms.push(new Platform(5, height / 2, 20, height)); // 왼쪽 벽
    platforms.push(new Platform(width - 5, height / 2, 20, height)); // 오른쪽 벽

    // 아래쪽 벽 생성
    platforms.push(new Platform(width / 2, height - 5, width, 20)); // 아래쪽 벽
}

function drawLevel1() {
    background(220);
    text('Ice Game Level 1', width / 2, height / 2 - 20);

    // 플레이어와 플랫폼 업데이트 및 표시
    player.applyGravity();
    player.move();
    player.jump();
    player.collide(platforms);
    player.show();

    for (let platform of platforms) {
        platform.show();
    }
}

function draw() {
    background(220);

    switch (state) {
        case 'loading':
            drawLoadingScreen();
            break;
        case 'main':
            drawMainMenu();
            break;
        case 'level1':
            rSlider.hide();
            gSlider.hide();
            bSlider.hide();
            drawLevel1();
            break;
        case 'level2':
            drawLevel2();
            break;
        case 'leaderboard':
            drawboard();
    }

}

function drawLoadingScreen() {
    // 로딩 화면을 그리는 코드
    image(img, 0, 0, width, height);
    textSize(42);
    textAlign(CENTER);
    text('Loading...', width / 2, height / 2);
}

function drawMainMenu() {
    // 메인 메뉴 화면을 그리는 코드
    textSize(32);
    textAlign(CENTER);
    text('Main Menu', width / 2, height / 2 - 50);
    text('Ice Climber Game', width / 2, height / 2 - 20);

    rSlider.show();
    gSlider.show();
    bSlider.show();
}

function drawLevel2() {
    // 레벨 2을 그리는 코드
    text('Ice Climber Game level 2', width / 2, height / 2 - 20);
}

function drawboard() {
    text('Ice  Game board ', width / 2, height / 2 - 20);
}

function mousePressed() {
    // 마우스 클릭으로 상태 변경 (예시)
    if (state === 'loading') {
        state = 'main';
    }
    else if (state === 'main') {
        state = 'level1'; // 혹은 'level2'
    }
    // else if (state === 'level1') {
    //     state = 'level2'; // 혹은 'level2'
    // }
    // else if (state === 'level2') {
    //     state = 'leaderboard';
    // }
}
function startGame() {
    player.r = rSlider.value();
    player.g = gSlider.value();
    player.b = bSlider.value();
    state = 'level1';
}
