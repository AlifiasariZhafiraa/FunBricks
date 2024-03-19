var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var ballRadius = 10; //besar bola

var paddleHeight = 10; //lebar balok
var paddleWidth = 100; //panjang balok
var paddleX = (canvas.width - paddleWidth) / 2;

var rightPressed = false;
var leftPressed = false;

var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

var brickRowCount = 3; //baris bricks
var brickColumnCount = 5; //kolom bricks
var brickWidth = 75; //panjang bricks
var brickHeight = 20; //lebar bricks
var brickPadding = 10; //jarak antar bricks
var brickOffsetTop = 95; //margin-top
var brickOffsetLeft = 30; //margin-left

var score = 0; //skor awal
var lives = 3; //darah awal

var bricks = [];
for (c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

//Bola
function drawball() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.closePath();
}

//Balok
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#FFE500";
  ctx.fill();
  ctx.closePath();
}

//Bricks
function drawBricks() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        var brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        var brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#FFE500";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

//Game
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawball();
  drawPaddle();
  drawScore();
  alto();
  drawLives();
  collisionDetection();
  x += dx;
  y += dy;
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (!lives) {
        alert("GAME OVER");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }
  requestAnimationFrame(draw);
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = true;
  } else if (e.keyCode == 37) {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode == 39) {
    rightPressed = false;
  } else if (e.keyCode == 37) {
    leftPressed = false;
  }
}

document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddleX = relativeX - paddleWidth / 2;
  }
}

//Menang
function collisionDetection() {
  for (c = 0; c < brickColumnCount; c++) {
    for (r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status == 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == brickRowCount * brickColumnCount) {
            alert("SELAMAT ANDA MENANG!");
            document.location.reload();
          }
        }
      }
    }
  }
}

//Score
function drawScore() {
  var centerY = 35; //margin-top
  var paddingX = 5; //margin-left cara manggilnya ditambah
  ctx.font = " bold 15px Poppins";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Score: " + score, 8 + paddingX, 20 + centerY);
}

//Darah
function drawLives() {
  var centerY = 35; //margin-top
  var paddingX = 12; //margin-right cara manggilnya dikurang
  ctx.font = " bold 15px Poppins";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Darah: " + lives, canvas.width - 65 - paddingX, 20 + centerY);
}

//Judul
function alto() {
  var text = "Game Pemrograman Web Week 5";
  var textWidth = ctx.measureText(text).width;
  var centerX = 100; //margin-left
  var centerY = 20; //margin-top
  ctx.font = "16px Poppins";
  ctx.fillStyle = "#FFE500";
  ctx.fillText(text, centerX, centerY);
}

draw();
