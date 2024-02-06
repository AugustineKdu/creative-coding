let player;
let platforms = [];
let rSlider, gSlider, bSlider;
let state;
let playButton;
let sprite;
let item;

let loadingScreenTimeout;


class Platform {
    constructor(x, y, width, height, moving = false) {
        this.sprite = createSprite(x, y, width, height);
        this.sprite.shapeColor = color(0, 0, 0);
        this.broken = false;
        this.moving = moving; // 플랫폼이 움직이는지 여부
        this.moveDirection = 1; // 움직임 방향 (1: 오른쪽, -1: 왼쪽)
        this.moveSpeed = 2; // 움직임 속도
    }

    update() {
        if (this.moving) {
            this.sprite.position.x += this.moveSpeed * this.moveDirection;
            // 화면 경계에서 방향 전환
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
        // this.broken = true;ㅂ
        // this.sprite.remove();
        if (!this.moving) {
            this.broken = true;
            this.sprite.remove();
        }
    }
}
class Player {
    constructor(x, y) {
        this.sprite = createSprite(x, y, 40, 40);
        this.sprite.velocity.y = 0;
        this.gravity = 0.5;
        this.lift = -12.5;
        this.prevY = y;

        this.sprite.shapeColor = color(this.r, this.g, this.b); // 기본 색상을 흰색 또는 다른 색상으로 설정
        this.onMovingPlatform = false;
    }

    applyGravity() {
        this.sprite.velocity.y += this.gravity;
        this.sprite.velocity.y = constrain(this.sprite.velocity.y, -Infinity, 10); // 점프 후의 상승을 허용하기 위해 최소값 변경
    }

    move() {
        if (keyIsDown(LEFT_ARROW)) {
            this.sprite.velocity.x = -7;
            this.sprite.velocity.y = 5;

        } else if (keyIsDown(RIGHT_ARROW)) {
            this.sprite.velocity.x = 7;
            this.sprite.velocity.y = 5;
        } else {
            // 마찰이 적용되는 부분
            if (this.onMovingPlatform) {
                this.sprite.velocity.x *= 0.1; // 마찰 계수 적용
            } else {
                this.sprite.velocity.x = 0;
            }
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
    checkOnMovingPlatform(platforms) {
        this.onMovingPlatform = false; // 기본적으로 false로 설정
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
        // 필요한 경우 여기에 다른 업데이트 로직 추가
    }

}

function setup() {
    createCanvas(700, 900);
    state = 'loading'; // 초기 상태 설정
    player = new Player(350, height - 50); // 플레이어 초기화



    // RGB 슬라이더 초기화 및 위치 설정
    rSlider = createSlider(0, 255, 255, 5);
    gSlider = createSlider(0, 255, 255, 5);
    bSlider = createSlider(0, 255, 255, 5);
    rSlider.position(10, 40);
    gSlider.position(10, 70);
    bSlider.position(10, 100);
    rSlider.hide();
    gSlider.hide();
    bSlider.hide();

    // 버튼 1 생성
    button1 = createButton('Game 1');
    button1.position(width / 2 - 100, height / 2 + 20);
    button1.mousePressed(() => startGame(1));
    button1.hide();

    // 버튼 2 생성
    button2 = createButton('Game 2');
    button2.position(width / 2 + 50, height / 2 + 20);
    button2.mousePressed(() => startGame(2));
    button2.hide();

    // 최초로 메인 메뉴로 상태 전환
    changeState('main');
}

function draw() {
    background(220);


    switch (state) {
        case 'main':
            drawMainMenu();
            break;
        case 'loadingPage':
            drawLoadingScreen();
            rSlider.hide();
            gSlider.hide();
            bSlider.hide();
            button1.hide();
            button2.hide();
            break;
        case 'level1':
            drawLevel1();
            rSlider.hide();
            gSlider.hide();
            bSlider.hide();
            button1.hide();
            button2.hide();
            break;
        case 'level2':
            drawLevel2();
            rSlider.hide();
            gSlider.hide();
            bSlider.hide();
            button1.hide();
            button2.hide();
            break;
        // 여기에 더 많은 상태 및 그에 해당하는 그리기 로직을 추가할 수 있습니다.
    }
}



function changeState(newState) {
    state = newState;
    switch (state) {
        case 'main':
            // 메인 메뉴 관련 UI 표시
            button1.show();
            button2.show();
            break;
        case 'loadingPage':
            // 로딩 화면 준비, UI 숨기기
            rSlider.hide();
            gSlider.hide();
            bSlider.hide();
            button1.hide();
            button2.hide();
            break;
        case 'level1':
            initializeLevel1();
            break;
        case 'level2':
            initializeLevel2();
            break;
        // 추가 상태 처리
    }
}
function drawLoadingScreen() {
    background(100);
    textSize(32);
    fill(255);
    textAlign(CENTER, CENTER);
    text('Loading...', width / 2, height / 2 - 20);
    textSize(20);
    text("Gameplay Instructions: Use ARROWS to move, SPACE for action", width / 2, height / 2 + 20);



}

function drawMainMenu() {
    textSize(50);
    textAlign(CENTER);
    text('Main Menu: Click to Start', width / 2, height / 2 + 200);
    rSlider.show();
    gSlider.show();
    bSlider.show();
    button1.show();
    button2.show();
}
function startGame(gameNumber) {
    // 버튼 숨기기
    button1.hide();
    button2.hide();
    // 로딩 화면으로 상태 변경
    changeState('loadingPage');
    // 로딩 화면 후, 선택된 게임 레벨로 전환
    clearTimeout(loadingScreenTimeout); // 이전에 설정된 타이머가 있다면 취소
    loadingScreenTimeout = setTimeout(() => {
        if (gameNumber === 1) {
            changeState('level1');
        } else if (gameNumber === 2) {
            changeState('level2');
        }
    }, 5000); // 5초 후
}



function initializeLevel1() {
    platforms = []; // 기존 플랫폼 초기화
    createPlatforms(15, 200); // 레벨 1을 위한 플랫폼 생성
    createItem(height - (15 * 200 + 225)); // 레벨 1의 아이템 생성
}

function initializeLevel2() {
    platforms = []; // 기존 플랫폼 초기화
    createPlatforms(3, 400); // 레벨 2를 위한 플랫폼 생성
    createItem(height - (3 * 400 + 225)); // 레벨 2의 아이템 생성
}

function createPlatforms(totalFloors, platformSpacing) {
    const platformWidth = 50;
    const platformHeight = 20;
    // 화면에 플랫폼이 몇 개 들어갈 수 있는지 계산합니다.
    const numBrickPerRow = width / platformWidth;
    // 홀수 층의 움직이는 플랫폼을 중앙에 위치시키기 위한 계산
    const movingPlatformPosition = Math.floor(numBrickPerRow / 2) - 1; // 중앙 기준으로 왼쪽에 위치


    for (let i = 1; i <= totalFloors; i++) {
        // 홀수 층에만 움직이는 플랫폼을 생성합니다.
        if (i % 2 === 1) {
            // 중앙에 움직이는 큰 플랫폼 하나를 생성합니다.
            let x = movingPlatformPosition * platformWidth + platformWidth * 1.5;
            let y = height - 50 - i * platformSpacing;
            platforms.push(new Platform(x, y, platformWidth * 3 - 2, platformHeight, true)); // 움직이는 플랫폼
        } else {
            // 짝수 층에는 정적인 플랫폼을 생성합니다.
            for (let j = 0; j < numBrickPerRow; j++) {
                let x = j * platformWidth + platformWidth / 2;
                let y = height - 50 - i * platformSpacing;
                platforms.push(new Platform(x, y, platformWidth - 2, platformHeight, false));
            }
        }
    }
    // 벽 생성
    let wallHeight = totalFloors * platformSpacing + 50; // 플랫폼 위에 조금 더 올라갈 수 있게
    platforms.push(new Platform(25, height - wallHeight / 2, 50, wallHeight)); // 왼쪽 벽
    platforms.push(new Platform(width - 25, height - wallHeight / 2, 50, wallHeight)); // 오른쪽 벽


    platforms.push(new Platform(width / 2, height - 25, width, 50)); // 아래쪽 벽


    // platforms.push(new Platform(width / 2, height + 350, width, 50)); // 아래쪽 벽

}

function createItem(topPlatformY) {
    item = createSprite(width / 2, topPlatformY, 20, 20);
    item.shapeColor = color(255, 204, 0);
}

function drawLevel1() {
    // 레벨 1 그리기 로직
    handleLevelDraw();
    // 텍스트 설정
    fill(0); // 텍스트 색상: 검정
    textSize(50); // 텍스트 크기
    textAlign(CENTER, CENTER); // 텍스트 정렬: 가운데


}

function drawLevel2() {
    // 레벨 2 그리기 로직
    handleLevelDraw();
    platforms.forEach(platform => {
        platform.update();
        platform.show();
    });
}

function handleLevelDraw() {
    let yOffset = height / 2 - player.sprite.position.y;
    translate(0, yOffset); // 화면 스크롤



    // 플레이어와 플랫폼 업데이트 및 표시
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

    // 아이템과의 충돌 검사
    if (player.sprite.overlap(item)) {

        //testing method
        console.log("Item collected! Level Complete.");
        noLoop(); // 또는 다음 레벨로 전환
    }

    drawSprites();
}


function update() {
    player.checkOnMovingPlatform(platforms);
    player.update();

}
