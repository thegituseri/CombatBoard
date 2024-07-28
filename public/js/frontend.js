/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const socket = io();
let board = null;
let lastClick = [-1,-1];
let number = 0;
const scoreEl = document.querySelector('#scoreEl');
const linesX = 9;
const linesY = 9;
const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = innerWidth * devicePixelRatio;
canvas.height = innerHeight * devicePixelRatio;
let mainReal;
ctx.font = '20px Arial';

// senin sırandayken karakterlerinin arkası belli renk olsun

const BOX_IMG_1 = new Image();
BOX_IMG_1.src = "BOX_1.jpeg";
const SNIPER_IMG_1 = new Image();
SNIPER_IMG_1.src = "SNPER_1.jpeg";
const SLIME_IMG_1 = new Image();
SLIME_IMG_1.src = "SLME_1.jpeg";
const DRAGON_IMG_1 = new Image();
DRAGON_IMG_1.src = "DRAGON_1.jpeg"
const SLIME_IMG_2 = new Image();
SLIME_IMG_2.src = "SLME_2.jpeg";
const BOX_IMG_2 = new Image();
BOX_IMG_2.src = "BOX_2.jpeg";
const SNIPER_IMG_2 = new Image();
SNIPER_IMG_2.src = "SNPER_2.jpeg";
const DRAGON_IMG_2 = new Image();
DRAGON_IMG_2.src = "DRAGON_2.jpeg";

socket.on("uWin", () => {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("YOU WİN THE GAME", canvas.width / 2 - 155, canvas.height / 2.2);
  setTimeout(() => { window.location.href = "/"}, 2000);
  ctx.font = "20px Arial";
});
socket.on("uLost", () => {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("YOU LOST THE GAME", canvas.width / 2 - 155, canvas.height / 2.2);
  setTimeout(() => { window.location.href = "/"}, 2000);
  ctx.font = "20px Arial";
});
socket.on("FullServer", () => {
  ctx.fillStyle = "black";
  ctx.font = "30px Arial";
  ctx.fillText("SERVER IS FULL", canvas.width / 2 - 125, canvas.height / 2.2);
  setTimeout(() => { window.location.href = "/"}, 2000);
  ctx.font = "20px Arial";
});
socket.on("lastSeconds", () => {
  ctx.font = "35px Arial";
  ctx.fillText("last 10 seconds", canvas.width / 2 - 125, canvas.height / 2.1);
  ctx.font = '20px Arial';
});
socket.on("UrTurn", () => {
  ctx.font = "35px Arial";
  ctx.fillText("Your turn to play", canvas.width / 2 - 135, canvas.height / 2.5);
  ctx.font = '20px Arial';
})

socket.on("winMessageD", () => {
  ctx.font = "30px Arial";
  ctx.fillStyle = "black";
  ctx.fillText("YOU WİN, ENEMY DISCONNECTED", canvas.width / 2 - 250, canvas.height / 2.2);
  setTimeout(() => { window.location.href = "/"}, 2000);
});

function drawLines(){
  ctx.beginPath();
  for(let x = 1; x < 9; x++){
    ctx.moveTo(x * canvas.width / linesX, 0);
    ctx.lineTo(x * canvas.width / linesX, canvas.height);
  }

  for(let y = 1; y < 9; y++){
    ctx.moveTo(0, y * canvas.height / linesY);
    ctx.lineTo(canvas.width, y * canvas.height / linesY);
  }
  ctx.stroke();
}

function drawLightBackground(x,y){
  ctx.fillStyle = 'rgba(130, 150, 170, 0.18)';
  ctx.fillRect(x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
}

function drawCharacter(x, y, condition){
  let draw = true;
  if(number == 0){
    switch(condition){
      case 0:
        ctx.fillStyle = 'white';
        ctx.fillRect((x) * (canvas.width / linesX), (y) * (canvas.height / linesY), canvas.width / linesX, canvas.height / linesY);
        draw = false;
        break;
      case 1:
        ctx.drawImage(SLIME_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      case 2:
        ctx.drawImage(SNIPER_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      case 3:
        ctx.drawImage(BOX_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      case 4:
        ctx.drawImage(DRAGON_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      case 6:
        ctx.drawImage(SLIME_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      case 7:
        ctx.drawImage(SNIPER_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      case 8:
        ctx.drawImage(BOX_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      case 9:
        ctx.drawImage(DRAGON_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      default:
        draw = false;
        break;
    }
  }
  else{
    switch(condition){
      case 0:
        ctx.fillStyle = 'white';
        //ctx.fillRect((x) * (canvas.width / linesX), (y) * (canvas.height / linesY), canvas.width / linesX, canvas.height / linesY);
        draw = false;
        break;
      case 1:
        ctx.drawImage(SLIME_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      case 2:
        ctx.drawImage(SNIPER_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      case 3:
        ctx.drawImage(BOX_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      case 4:
        ctx.drawImage(DRAGON_IMG_1, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        drawLightBackground(x,y);
        break;
      case 6:
        ctx.drawImage(SLIME_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      case 7:
        ctx.drawImage(SNIPER_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      case 8:
        ctx.drawImage(BOX_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      case 9:
        ctx.drawImage(DRAGON_IMG_2, x * canvas.width / linesX, y * canvas.height / linesX, canvas.width/9, canvas.height/9);
        break;
      default:
        draw = false;
        break;
    }
  }

  if(draw){
    //ctx.fillRect(x * canvas.width / linesX + canvas.width / (linesX * 2) - 25, y * canvas.height / linesX + canvas.height/(linesX * 2) - 25, 50, 50);
    

    if(number == 1 && mainReal){
      ctx.fillStyle = "black";
      const damage = mainReal[8-y][8-x]?.damage ?? 'N/A'; // Use 'N/A' if damage is undefined
      const health = mainReal[8-y][8-x]?.health ?? 'N/A'; // Use 'N/A' if health is undefined
      ctx.fillText(`D: ${damage} H: ${health}`, x * canvas.width / linesX, y * canvas.height / linesX + 20);
    }
    else if(mainReal){

      ctx.fillStyle = "black";
      const damage = mainReal[y][x]?.damage ?? 'N/A'; // Use 'N/A' if damage is undefined
      const health = mainReal[y][x]?.health ?? 'N/A'; // Use 'N/A' if health is undefined
      ctx.fillText(`D: ${damage} H: ${health}`, x * canvas.width / linesX, y * canvas.height / linesX + 20);
    }
  }
}

socket.on('waitCommand', () => {
  ctx.font = '30px Arial';
  ctx.fillText('Waiting For other player to join', canvas.width/2 - 220, canvas.height / 2 - 100, 400);
  ctx.font = "20px Arial";
});

socket.on('GameEndedMoves', () => {
 
  ctx.font = "30px Arial";
  ctx.fillText("GAME ENDED, 50 MOVES WERE PLAYED WİTHOUT ATTACKİNG", canvas.width / 2 - 450, canvas.height / 2.2);
  setTimeout(() => { window.location.href = "/"}, 2000);
})


socket.on('updateBoard', ({ frontendBoard, cID , frontReal}) => {
  mainReal = frontReal;
  lastClick = [-1, -1];
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  board = frontendBoard;

  if(cID[0].includes(socket.id)){
    number = 0;
    for (let y = 0; y < frontendBoard.length; y++) {
      for (let x = 0; x < frontendBoard[0].length; x++) {
        if (frontendBoard[y][x] !== 0) {
          drawCharacter(x, y, frontendBoard[y][x]);
        }
      }
    }
  }
  else{
    number = 1;
    for (let y = 0; y < frontendBoard.length; y++) {
      for (let x = 0; x < frontendBoard[0].length; x++) {
        if (frontendBoard[y][x] !== 0) {
          drawCharacter(8-x, 8-y,frontendBoard[y][x]);
        }
      }
    }
  }
  drawLines();

});

canvas.addEventListener('click', (e) =>{
  try{
    let xPosition = Math.floor(e.clientX / (canvas.width / linesX));
    let yPosition = Math.floor(e.clientY / (canvas.height / linesY));
    ctx.fillStyle = 'rgba(148, 163, 184, 0.3)';
    socket.emit('clickEvent', {clickX: xPosition, clickY: yPosition,  id: socket.id});
    if(number == 0){
      ctx.fillRect(xPosition * (canvas.width / linesX), yPosition * (canvas.height / linesY), canvas.width / linesX, canvas.height / linesY);
      if(lastClick[0] !== -1){
        ctx.fillStyle = 'white';
        ctx.fillRect(lastClick[0] * (canvas.width / linesX), lastClick[1] * (canvas.height / linesY), canvas.width / linesX, canvas.height / linesY);
        drawCharacter(lastClick[0], lastClick[1], board[lastClick[1]][lastClick[0]]);
      }
      //drawCharacter(xPosition, yPosition, board[yPosition][xPosition]);
      drawLines();
    }
    else{
      ctx.fillRect((xPosition) * (canvas.width / linesX), (yPosition) * (canvas.height / linesY), canvas.width / linesX, canvas.height / linesY);
      if(lastClick[0] !== -1){
        ctx.fillStyle = 'white';
        ctx.fillRect(lastClick[0] * (canvas.width / linesX), lastClick[1] * (canvas.height / linesY), canvas.width / linesX, canvas.height / linesY);
        drawCharacter(lastClick[0], lastClick[1], board[linesY - lastClick[1] -1][linesX - lastClick[0] - 1]);
      }
      //drawCharacter(xPosition, yPosition, board[linesY-yPosition-1][linesX - xPosition - 1]);
      drawLines();  
    }
    lastClick = [xPosition, yPosition];
    
  }
  catch(error){
    
  }
});
