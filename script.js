var bod= document.body;
var areaMain= document.createElement('div');
var player= document.createElement('div');
var playerPos ={
    x:0,
    y:0
};
var playerSpeed= 4;
var key= {
    left: false,
    right: false,
    down: false,
    up: false
}
var plWidth= player.offsetWidth;
var plHeight= player.offsetHeight;
var lasers=[];
var laserSpeed= 4;
var max_lasers= 5;
var enemies = [];
var enemySpeed = 2;
var enemyTotal = 4;
var enemyPos = {
    x: 150,
    y: -50
};

bod.appendChild(areaMain);
areaMain.setAttribute('class','areaMain');
areaMain.appendChild(player);
player.setAttribute('class','player');
playerPos.x= (areaMain.offsetWidth/2)-(player.offsetWidth/2);
playerPos.y=(areaMain.offsetHeight )-(player.offsetHeight*2);

areaMain.leftBoundary = 0;
areaMain.rightBoundary = areaMain.offsetWidth  - player.offsetWidth -20;
areaMain.topBoundary = 0;
areaMain.bottomBoundary =  areaMain.offsetHeight  - player.offsetHeight -20;

for (var i = 0; i < enemyTotal; i++) {
    var enemy = Enemy();
    enemies.push([enemy, enemyPos.y]);
    areaMain.appendChild(enemies[i][0]);
    enemies[i][0].classList.add('enemy');
    enemies[i][0].style.top = enemies[i][1] + 'px';
    enemies[i][0].style.left = enemyPos.x + 'px';
    enemyPos.x += 150;
}

function Enemy() {
    return document.createElement('div');
}

function Laser() {
    return document.createElement('div');
}

function KeyDown(e){
    if(e.keyCode === 39){
        key.right = true;
    }
    else if(e.keyCode === 37){
        key.left = true;
    }
    if(e.keyCode === 38){
        key.up = true;
    }
    else if(e.keyCode === 40){
        key.down = true;
    }
    if(e.keyCode === 88){
        if(lasers.length< max_lasers){
            var laser = Laser();
            lasers.push([laser, playerPos.y]);
            areaMain.appendChild(lasers[lasers.length-1][0]);
            lasers[lasers.length-1][0].classList.add('laser');
            lasers[lasers.length - 1][0].style.top = lasers[lasers.length - 1][1] + 'px';
            lasers[lasers.length - 1][0].style.left = playerPos.x + 25 + 'px';
        }
    }
}

function KeyUp(e){
    if(e.keyCode === 39){
        key.right = false;
    }
    else if(e.keyCode === 37){
        key.left = false;
    }
    if(e.keyCode === 38){
        key.up = false;
    }
    else if(e.keyCode === 40){
        key.down = false;
    }
}

function moveShip() {
    if (key.right === true) {
        playerPos.x += playerSpeed;
    } else if (key.left === true) {
        playerPos.x -= playerSpeed;
    }
    if (key.up === true) {
        playerPos.y -= playerSpeed;
    } else if (key.down === true) {
        playerPos.y += playerSpeed;
    }
    if (playerPos.x < areaMain.leftBoundary) {
        playerPos.x = areaMain.leftBoundary;
    }
    if (playerPos.x > areaMain.rightBoundary) {
        playerPos.x = areaMain.rightBoundary;
    }
    if (playerPos.y < areaMain.topBoundary) {
        playerPos.y = areaMain.topBoundary;
    }
    if (playerPos.y > areaMain.bottomBoundary) {
        playerPos.y = areaMain.bottomBoundary;
    }
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
}

function moveEnemies() {
    if (enemies.length < enemyTotal) {
        var enemy = Enemy();
        enemies.push([enemy, enemyPos.y]);
        areaMain.appendChild(enemies[enemies.length - 1][0]);
        enemies[enemies.length - 1][0].classList.add('enemy');
        enemies[enemies.length - 1][0].style.top = enemies[enemies.length - 1][1] + 'px';
        enemies[enemies.length - 1][0].style.left = Math.floor(Math.random() * 500) + 'px';
    }
    for (var i = 0; i < enemies.length; i++) {
        enemies[i][1] += enemySpeed;
        enemies[i][0].style.top = enemies[i][1] + 'px';
        if (parseInt(enemies[i][0].style.top) > (areaMain.bottomBoundary + enemies[i][0].style.height)) {
            enemies[i][1] = enemyPos.y;
            enemies[i][0].style.top = enemies[i][1] + 'px';
        }
    }
}

function checkHit(l) {
    var lx = parseInt(lasers[l][0].style.left),
          ly = parseInt(lasers[l][0].style.top);
    for (var i = 0; i < enemies.length; i++) {
        var ex = parseInt(enemies[i][0].style.left),
              ey = parseInt(enemies[i][0].style.top),
              ew = enemies[i][0].offsetWidth,
              eh = enemies[i][0].offsetHeight;
            if (lx > ex && lx < ex + ew && ly > ey && ly < ey + eh) {
                areaMain.removeChild(lasers[l][0]);
                areaMain.removeChild(enemies[i][0]);
                lasers.splice(l, 1);
                enemies.splice(i, 1);
            }
      }
}

function moveLasers() {
    for (var i = 0; i < lasers.length; i++) {
        if (parseInt(lasers[i][0].style.top) > areaMain.topBoundary) {
            lasers[i][1] -= laserSpeed;
            lasers[i][0].style.top = lasers[i][1] + 'px';
            checkHit(i);
        } else {
            areaMain.removeChild(lasers[i][0]);
            lasers.splice(i, 1);
        }
    }
}
document.addEventListener('keydown', KeyDown, false);
document.addEventListener('keyup', KeyUp, false);

function loop() {
    moveEnemies();
    moveShip();
    moveLasers();
    setTimeout(loop, 1000 / 60);
}

loop();
