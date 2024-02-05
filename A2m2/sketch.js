let player;
let platforms = [];
let rSlider, gSlider, bSlider;
let state;
let playButton;
let sprite;
let item;

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

        this.sprite.shapeColor = color(this.r, this.g, this.b); // 기본 색상을 흰색 또는 다른 색상으로 설정
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

    // 최초로 메인 메뉴로 상태 전환
    changeState('main');
}

function draw() {
    background(220);

    switch (state) {
        case 'main':
            drawMainMenu();
            break;
        case 'level1':
            drawLevel1();
            break;
        case 'level2':
            drawLevel2();
            break;
        // 여기에 더 많은 상태 및 그에 해당하는 그리기 로직을 추가할 수 있습니다.
    }
}

function mousePressed() {
    // 메인 메뉴에서 레벨 선택을 처리하는 로직
    if (state === 'main') {
        changeState('level2');
    }
    // 레벨 내에서의 상호작용은 각 drawLevel 함수 내에서 처리할 수 있습니다.
}

function changeState(newState) {
    state = newState;
    switch (state) {
        case 'level1':
            initializeLevel1();
            break;
        case 'level2':
            initializeLevel2();
            break;
        // 추가적인 레벨 초기화를 여기에 구현할 수 있습니다.
    }
}

function initializeLevel1() {
    platforms = []; // 기존 플랫폼 초기화
    createPlatforms(15, 200); // 레벨 1을 위한 플랫폼 생성
    createItem(height - (15 * 150 + 225)); // 레벨 1의 아이템 생성
}

function initializeLevel2() {
    platforms = []; // 기존 플랫폼 초기화
    createPlatforms(3, 400); // 레벨 2를 위한 플랫폼 생성
    createItem(height - (3 * 150 + 225)); // 레벨 2의 아이템 생성
}

function createPlatforms(totalFloors, platformSpacing) {
    const platformWidth = 50;
    const platformHeight = 20;
    const numBrickPerRow = width / platformWidth;
    // const platformSpacing = 150;

    for (let i = 1; i < totalFloors; i++) {
        for (let j = 0; j < numBrickPerRow; j++) {
            let x = j * platformWidth + platformWidth / 2;
            let y = height - 50 - i * platformSpacing;
            platforms.push(new Platform(x, y, platformWidth - 2, platformHeight));
        }
    }

    // 벽 생성
    let wallHeight = totalFloors * platformSpacing + 50; // 플랫폼 위에 조금 더 올라갈 수 있게
    platforms.push(new Platform(25, height - wallHeight / 2, 50, wallHeight)); // 왼쪽 벽
    platforms.push(new Platform(width - 25, height - wallHeight / 2, 50, wallHeight)); // 오른쪽 벽
    platforms.push(new Platform(width / 2, height - 5, width, 20)); // 아래쪽 벽
}

function createItem(topPlatformY) {
    item = createSprite(width / 2, topPlatformY, 20, 20);
    item.shapeColor = color(255, 204, 0);
}

function drawLevel1() {
    // 레벨 1 그리기 로직
    handleLevelDraw();
}

function drawLevel2() {
    // 레벨 2 그리기 로직
    handleLevelDraw();
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

    for (let platform of platforms) {
        platform.show();
    }

    // 아이템과의 충돌 검사
    if (player.sprite.overlap(item)) {
        console.log("Item collected! Level Complete.");
        noLoop(); // 또는 다음 레벨로 전환
    }

    drawSprites();
}

function drawMainMenu() {
    textSize(32);
    textAlign(CENTER);
    text('Main Menu: Click to Start', width / 2, height / 2);
    rSlider.show();
    gSlider.show();
    bSlider.show();
}