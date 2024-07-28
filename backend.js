const { time, clear } = require('console');
const { resolveSoa } = require('dns');
const express = require('express');
const http = require('http');
const { connect } = require('http2');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server, { pingInterval: 2000, pingTimeout: 5000 });
const port = 3000;

// Serve start.html for the root path
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/start.html');
});

// Serve index.html for the /game path
app.get('/game', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Serve static files from the public directory
app.use(express.static('public'));


class Nothin{
  constructor(){
    this.side = 0;
  }
  getSide(){
    return this.side;
  }
}
class Slime{
  constructor(Side){
    this.health = 100;
    this.damage = 25;
    this.side = Side;
    this.went = false;
  }
  updateHealth(gotDamage){
    this.health -= gotDamage;
  }
  getSide(){
    return this.side;
  }
}
class Sniper{
  constructor(Side){
    this.health = 55;
    this.damage = 30;
    this.side = Side;
    this.went = false;
  }
  updateHealth(gotDamage){
    this.health -= gotDamage;
  }
  getSide(){
    return this.side;
  }
}
class Fighter{
  constructor(Side){
    this.health = 70;
    this.damage = 35;
    this.side = Side;
    this.went = false;
  }
  updateHealth(gotDamage){
    this.health -= gotDamage;
  }
  getSide(){
    return this.side;
  }
}
class queen{
  constructor(Side){
    this.health = 75;
    this.damage = 40;
    this.side = Side;
    this.went = false;
  }
  updateHealth(gotDamage){
    this.health -= gotDamage;
  }
  getSide(){
    return this.side;
  }
}

let gameBoard0 = [[0,3,2,0,4,0,2,3,0],[0,1,1,1,0,1,1,1,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,6,6,6,0,6,6,6,0],[0,8,7,0,9,0,7,8,0]];
const gameBoardD = [[0,3,2,0,4,0,2,3,0],[0,1,1,1,0,1,1,1,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,6,6,6,0,6,6,6,0],[0,8,7,0,9,0,7,8,0]];

const realBoard0 = [];

let whosTurn = [];
let temp = [];
let values = [];
const connectArr = [];
const connections = {

};

let playerConnected = 0;
io.on('connection', (socket) => {
  if(playerConnected < 1000){
    playerConnected++;
    let intervalConditions = 0;
    let intervall;
    for(let i = 0; i<100; i++){
      for(let j = 0; j < 2; j++){
        if(connectArr.length > i){
          if(connectArr[i][j] == 0){
            connectArr[i][j] = socket.id;
            connections[socket.id] = {
              idI:i,
              idJ:j
            }
            i = 1000;
            break;
          }
        }
        else{
          connectArr.push([socket.id,0]);
          connections[socket.id] = {
            idI:i,
            idJ:j
          }
          i = 1000;
          break;
        }
      }
    }
    let firstClick = [-1, -1];
    let secondClick = [-1, -1];
    if(connectArr.length > connections[socket.id]?.idI && connectArr[connections[socket.id].idI][1 - connections[socket.id].idJ] != 0){
      gameBoard0 = [[0,3,2,0,4,0,2,3,0],[0,1,1,1,0,1,1,1,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,6,6,6,0,6,6,6,0],[0,8,7,0,9,0,7,8,0]];
      RBoard(realBoard0);
      io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: gameBoard0, cID: connectArr[connections[socket.id].idI], frontReal: realBoard0});
      io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: gameBoard0, cID: connectArr[connections[socket.id].idI], frontReal: realBoard0});
      let oardssa = [[0,3,2,0,4,0,2,3,0],[0,1,1,1,0,1,1,1,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,0,0,0,0,0,0,0,0],[0,6,6,6,0,6,6,6,0],[0,8,7,0,9,0,7,8,0]];
      let oundssa = 0;
      let lickCountssa = 0;
      let ealoardssa = [];
      whosTurn.push([0,0]);
      let intervalCondition = 0;
      let movesWithoutAttack = 0;
      RBoard(ealoardssa);
      // board, round, clickcount, realboard, intervalcondition, moveswithoutattack
      let ar = [oardssa, oundssa, lickCountssa, ealoardssa, intervalCondition, movesWithoutAttack];
      values.push(ar);
      RestOfTheCode();
    }
    else{
      io.to(socket.id).emit('waitCommand');
      waitForArrayChange().then(() => {
        RestOfTheCode();
    });
    }
    function waitForArrayChange() {
      return new Promise((resolve) => {
          intervalConditions = setInterval(() => {
            if(connections[socket.id]?.idI || connections[socket.id]?.idI == 0){  
              if (connectArr[connections[socket.id].idI][1 - connections[socket.id].idJ] !== 0) {
                  clearInterval(intervalConditions);
                  resolve();
              }
            }
          }, 1000);
      });
    }

    function canShot(firstCl, secondCl, characte, place, newBoard){
      if(place / 2 == 0){
        if(newBoard[secondCl[1]][secondCl[0]] > 0 && newBoard[secondCl[1]][secondCl[0]] < 5){
          if(characte == 1 || characte == 6 || characte == 3 || characte == 8 || characte == 4 || characte == 9){
            return canMove1Block(firstCl[0], firstCl[1], secondCl[0], secondCl[1]);
          }
          if(characte == 2 || characte == 7){
            return canMove2Block(firstCl[0], firstCl[1], secondCl[0], secondCl[1]);
          }
        }
      }
      else if(place / 2 == 1){
        if(newBoard[secondCl[1]][secondCl[0]] > 5){
          if(characte == 1 || characte == 6 || characte == 3 || characte == 8 || characte == 4 || characte == 9){
            return canMove1Block(firstCl[0], firstCl[1], secondCl[0], secondCl[1]);
          }
          if(characte == 2 || characte == 7){
            return canMove2Block(firstCl[0], firstCl[1], secondCl[0], secondCl[1]);
          }
        }
      }
      return false;
    }

    function canMove1Block(firstX, firstY, secondX, secondY){
      // for 1, 2, 6, 7
      let a = Math.abs(firstX - secondX);
      let b = Math.abs(firstY - secondY);
      if(a + b == 1){
        return true;
      }
      return false;
    }
    function canMove2Block(firstX, firstY, secondX, secondY){
      let a = Math.abs(firstX - secondX);
      let b = Math.abs(firstY - secondY);
      if(a + b > 0 && a + b < 3){
        return true;
      }
      return false;
    }
    function RestOfTheCode(){
      let realCondition = false;
      io.to(connectArr[connections[socket.id].idI][0]).emit("UrTurn");
      let lastCharacterPositionX;
      let lastCharacterPositionY;
      intervall = setInterval(() => {
        if(values.length > connections[socket.id]?.idI){
          if(values[connections[socket.id]?.idI][4] == 0 && connectArr[connections[socket.id]?.idI][connections[socket.id]?.idJ] == socket.id){
            clearTimeout(whosTurn[connections[socket.id].idI][0]);
            whosTurn[connections[socket.id].idI][0] = setTimeout(() => {
              if(connections[socket.id]){
                io.to(connectArr[connections[socket.id].idI][0]).emit("lastSeconds");
                clearTimeout(whosTurn[connections[socket.id].idI][0]);
                if(values.length > connections[socket.id]?.idI){
                  whosTurn[connections[socket.id].idI][0] = setTimeout(() => {
                    values[connections[socket.id].idI][1] += 1;
                    values[connections[socket.id].idI][2] = 0;
                    firstClick[0][0] = 0;
                    firstClick[0][1] = 0;
                    secondClick[0][0] = 0;
                    secondClick[0][1] = 0;
                    io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                    io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                    io.to(connectArr[connections[socket.id].idI][1]).emit('UrTurn');
                    values[connections[socket.id].idI][4] = 1;
                  }, 10000);
                }
              }
            },20000);
            values[connections[socket.id].idI][4] = 3;
          }
          if(values[connections[socket.id]?.idI][4] == 1 && connectArr[connections[socket.id]?.idI][connections[socket.id]?.idJ] == socket.id){
            clearTimeout(whosTurn[connections[socket.id].idI][1]);
            whosTurn[connections[socket.id].idI][1] = setTimeout(() => {
              if(connections[socket.id]){
                io.to(connectArr[connections[socket.id].idI][1]).emit("lastSeconds");
                clearTimeout(whosTurn[connections[socket.id].idI][1]);
                if(values.length > connections[socket.id]?.idI && connections[socket.id]){
                  whosTurn[connections[socket.id].idI][1] = setTimeout(() => {
                  values[connections[socket.id].idI][1] += 1;
                  values[connections[socket.id].idI][2] = 0;
                  firstClick[0][0] = 0;
                  firstClick[0][1] = 0;
                  secondClick[0][0] = 0;
                  secondClick[0][1] = 0;
                  values[connections[socket.id].idI][4] = 0;
                  io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                  io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                  io.to(connectArr[connections[socket.id].idI][0]).emit('UrTurn');
                  }, 10000);
                  
                }
              }
              
            },20000);
            values[connections[socket.id].idI][4] = 2;
          }
        }
      }, 850);
      let destroyCount = 0;
      socket.on('clickEvent', ({clickX, clickY, id}) => {
        if(connections[socket.id]?.idI >= 0){
          if(connectArr[connections[socket.id]?.idI][values[connections[socket.id]?.idI][1] % 2].includes(id)){
            if(values[connections[socket.id].idI][1] % 2 == 1){
              clickX = 8-clickX;
              clickY = 8-clickY;
            }
            if(values[connections[socket.id].idI][2] % 2 == 0){
              if(values[connections[socket.id].idI][0][clickY][clickX] != 0){
                firstClick[0] = clickX;
                firstClick[1] = clickY;
                values[connections[socket.id].idI][2]++;
              }
            }
            else if(values[connections[socket.id].idI][2] % 2 == 1){
              secondClick[0] = clickX;
              secondClick[1] = clickY;
              if(firstClick[0] == secondClick[0] && firstClick[1] == secondClick[1]){
                values[connections[socket.id].idI][2] = 0;
              }
              else{
                let moveable = false;
                let shootingCondition = 10;
                if(firstClick[1] != -1 && firstClick[0] != -1){
                  let character = values[connections[socket.id].idI][0][firstClick[1]][firstClick[0]];
                  let shootAfterMove = false;
                  if(values[connections[socket.id].idI][1] % 2 == 0 && character >  5){
                    if(character == 6 || character == 7){
                      moveable = canMove1Block(firstClick[0], firstClick[1], secondClick[0], secondClick[1]);
                      shootingCondition = 0;
                    }
                    else if(character == 8 || character == 9){
                      moveable = canMove2Block(firstClick[0], firstClick[1], secondClick[0], secondClick[1]);
                      shootingCondition = 0;
                    }
                  }
                  else if(values[connections[socket.id].idI][1] % 2 == 1 && character > 0 && character < 5){
                    if(character == 1 || character == 2){
                      moveable = canMove1Block(firstClick[0], firstClick[1], secondClick[0], secondClick[1]);
                      shootingCondition = 2;
                    }
                    else if(character == 3 || character == 4){
                      moveable = canMove2Block(firstClick[0], firstClick[1], secondClick[0], secondClick[1]);
                      shootingCondition = 2;
                    }
                  }
                  if(moveable == true && values[connections[socket.id].idI][0][secondClick[1]][secondClick[0]] == 0 && !realCondition){
                    values[connections[socket.id].idI][5]++;
                    values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]] = values[connections[socket.id].idI][3][firstClick[1]][firstClick[0]];
                    values[connections[socket.id].idI][3][firstClick[1]][firstClick[0]] = new Nothin();
                    values[connections[socket.id].idI][0][firstClick[1]][firstClick[0]] = 0;
                    values[connections[socket.id].idI][0][secondClick[1]][secondClick[0]] = character;
                    shootAfterMove = haveSpaceToShoot(character, secondClick);
                    io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                    io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                    values[connections[socket.id].idI][2] = 0;
                    clearTimeout(whosTurn[connections[socket.id].idI][connections[socket.id].idJ]);
                    lastCharacterPositionX = secondClick[0];
                    lastCharacterPositionY = secondClick[1];
                    if(secondClick[1] == 0 && character > 5 && values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].went == false){
                      values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].went = true;
                      values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].health += 20;
                      values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].damage += 10;
                      io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                      io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                      
                    }
                    else if(secondClick[1] == 8 && character < 5 && character > 0 && values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].went == false){
                      values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].went = true;
                      values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].health += 20;
                      values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].damage += 10;
                      io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                      io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                    }
                    if(shootAfterMove == false){
                      values[connections[socket.id].idI][1]++;
                      realCondition = false;
                      io.to(connectArr[connections[socket.id].idI][1 - connections[socket.id].idJ]).emit('UrTurn');
                      values[connections[socket.id].idI][4] = Math.abs(values[connections[socket.id].idI][4] - 2);
                    }
                    else{
                      io.to(connectArr[connections[socket.id].idI][connections[socket.id].idJ]).emit('UrTurn');
                    }
                  }
                  if(shootAfterMove == true){
                    realCondition = true;
                    whosTurn[connections[socket.id].idI][connections[socket.id].idJ] = setTimeout(() => {
                      if(values.length > connections[socket.id]?.idI){
                        realCondition = false;
                        values[connections[socket.id].idI][1] += 1;
                        values[connections[socket.id].idI][2] = 0;
                        values[connections[socket.id].idI][4] = 0;
                        io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                        io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                        io.to(connectArr[connections[socket.id].idI][1 - connections[socket.id].idJ]).emit('UrTurn');
                      }
                    },8000);
                  }
                  if(canShot(firstClick, secondClick, character, shootingCondition, values[connections[socket.id].idI][0])){
                    let permission = false;
                    if(realCondition){
                      if(lastCharacterPositionX == firstClick[0] && lastCharacterPositionY == firstClick[1]){
                        permission = true;
                      }
                    }
                    else{
                      permission = true;
                    }
                    if(permission){
                      values[connections[socket.id].idI][5] = 0;
                      realCondition = false;
                      values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].updateHealth(values[connections[socket.id].idI][3][firstClick[1]][firstClick[0]].damage);
                      if(values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]].health <= 0){
                        values[connections[socket.id].idI][3][secondClick[1]][secondClick[0]] = new Nothin();
                        values[connections[socket.id].idI][0][secondClick[1]][secondClick[0]] = 0;
                        destroyCount++;
                        
                      }
                      io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                      io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                      io.to(connectArr[connections[socket.id].idI][1 - connections[socket.id].idJ]).emit('UrTurn');
                      values[connections[socket.id].idI][1]++;
                      values[connections[socket.id].idI][2] = 0;
                      clearTimeout(whosTurn[connections[socket.id].idI][connections[socket.id].idJ]);
                    }
                  }
                  if(values[connections[socket.id].idI][5] >= 50){
                    io.to(connectArr[connections[socket.id].idI][0]).emit('GameEndedMoves');
                    io.to(connectArr[connections[socket.id].idI][1]).emit('GameEndedMoves');
                  }
                  if(destroyCount >= 11){
                    io.to(connectArr[connections[socket.id].idI][0]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                    io.to(connectArr[connections[socket.id].idI][1]).emit('updateBoard', {frontendBoard: values[connections[socket.id].idI][0], cID: connectArr[connections[socket.id].idI], frontReal: values[connections[socket.id].idI][3]});
                    io.to(connectArr[connections[socket.id].idI][connections[socket.id].idJ]).emit("uWin");
                    io.to(connectArr[connections[socket.id].idI][1- connections[socket.id].idJ]).emit("uLost");
                  }

                  
                  firstClick[0] = secondClick[0];
                  firstClick[1] = secondClick[1];

                }
              }
            }
          }

        }
      });
    }
  
    function haveSpaceToShoot(character, scl){
      let actualY = scl[1];
      let actualX = scl[0];
      if(!(character == 2 || character == 7)){
        if(character > 5){
          if(values[connections[socket.id]?.idI][0].length > actualY + 1 && values[connections[socket.id].idI][3][actualY + 1][actualX].getSide() < 5 && values[connections[socket.id].idI][3][actualY + 1][actualX].getSide() > 0){
            return true;
          }
          if( 0 <= actualY - 1 && values[connections[socket.id].idI][3][actualY - 1][actualX].getSide() < 5 && values[connections[socket.id].idI][3][actualY - 1][actualX].getSide() > 0){
            return true;
          }
          if(values[connections[socket.id]?.idI][0][0].length > actualX + 1 && values[connections[socket.id].idI][3][actualY][actualX + 1].getSide() < 5 && values[connections[socket.id].idI][3][actualY][actualX + 1].getSide() > 0){
            return true;
          }
          if(0 <= actualX - 1 && values[connections[socket.id].idI][3][actualY][actualX - 1].getSide() < 5 && values[connections[socket.id].idI][3][actualY][actualX - 1].getSide() > 0){
            return true;
          }
        }
        else if(character != 0){
          if(values[connections[socket.id]?.idI][0].length > actualY + 1 && values[connections[socket.id].idI][3][actualY + 1][actualX].getSide() > 5){
            return true;
          }
          if( 0 <= actualY - 1 && values[connections[socket.id].idI][3][actualY - 1][actualX].getSide() > 5){
            return true;
          }
          if( 0 <= actualX - 1 && values[connections[socket.id].idI][3][actualY][actualX - 1].getSide() > 5){
            return true;
          }
          if(values[connections[socket.id]?.idI][0].length > actualX + 1 && values[connections[socket.id].idI][3][actualY][actualX + 1].getSide() > 5){
            return true;
          }
        }
      }
      else{
        //burayı düzelt
        if(character == 7){
          let count = 0;
          let ay = scl[1] -1;
          while(count < 3){
            let ax = scl[0] - 1;
            let secondCount = -1;
            while(secondCount < 2){
              if(!(count == 1 && secondCount == 0)){
                if(values[connections[socket.id]?.idI][0].length > ay && values[connections[socket.id]?.idI][0][0].length > ax && ax >= 0 && ay >= 0){
                  if(values[connections[socket.id].idI][3][ay][ax].getSide() < 5 && values[connections[socket.id].idI][3][ay][ax].getSide() > 0){
                    return true;
                  }
                }
              } 
              ax++;
              secondCount++;
            }
            ay++;
            count++;
          }
          if(values[connections[socket.id]?.idI][0].length > actualY + 2 && values[connections[socket.id].idI][3][actualY + 2][actualX].getSide() < 5 && values[connections[socket.id].idI][3][actualY + 2][actualX].getSide() > 0){
            return true;
          }
          if( 0 <= actualY - 2 && values[connections[socket.id].idI][3][actualY - 2][actualX].getSide() < 5 && values[connections[socket.id].idI][3][actualY - 2][actualX].getSide() > 0){
            return true;
          }
          if(values[connections[socket.id]?.idI][0][0].length > actualX + 2 && values[connections[socket.id].idI][3][actualY][actualX + 2].getSide() < 5 && values[connections[socket.id].idI][3][actualY][actualX + 2].getSide() > 0){
            return true;
          }
          if(0 <= actualX - 2 && values[connections[socket.id].idI][3][actualY][actualX - 2].getSide() < 5 && values[connections[socket.id].idI][3][actualY][actualX - 2].getSide() > 0){
            return true;
          }
        }
        else if(character == 2){
          let count = 0;
          let ay = scl[1] -1;
          while(count < 3){
            let ax = scl[0] -1;
            let secondCount = -1;
            while(secondCount < 2){
              if(!(count == 1 && secondCount == 0)){
                if(values[connections[socket.id]?.idI][0].length > ay && values[connections[socket.id]?.idI][0][0].length > ax && ax >=0 && ay >= 0){
                  if(values[connections[socket.id].idI][3][ay][ax].getSide() > 5){
                    return true;
                  }
                }
              }
              ax++;
              secondCount++;
            }
            ay++;
            count++;
          }
          if(values[connections[socket.id]?.idI][0].length > actualY + 2 && values[connections[socket.id].idI][3][actualY + 2][actualX].getSide() > 5){
            return true;
          }
          if( 0 <= actualY - 2 && values[connections[socket.id].idI][3][actualY - 2][actualX].getSide() > 5){
            return true;
          }
          if( 0 <= actualX - 2 && values[connections[socket.id].idI][3][actualY][actualX - 2].getSide() > 5){
            return true;
          }
          if(values[connections[socket.id]?.idI][0].length > actualX + 2 && values[connections[socket.id].idI][3][actualY][actualX + 2].getSide() > 5){
            return true;
          }
        }
        
        //sniper 2 li kouşulu eklemedin

    }
    return false;
  }

    function RBoard(boards){
      for(let i = 0; i < gameBoardD.length; i++){
        for(let j = 0; j < gameBoardD[0].length; j++){
          if(gameBoardD[i][j] == 0){
            temp.push(new Nothin());
          }
          else if(gameBoardD[i][j] == 1 || gameBoardD[i][j] == 6){
            temp.push(new Slime(gameBoardD[i][j]));
          }
          else if(gameBoardD[i][j] == 2 || gameBoardD[i][j] == 7){
            temp.push(new Sniper(gameBoardD[i][j]));
          }
          else if(gameBoardD[i][j] == 3 || gameBoardD[i][j] == 8){
            temp.push(new Fighter(gameBoardD[i][j]));
          }
          else{
            temp.push(new queen(gameBoardD[i][j]));
          }
        }
        boards[i] = temp;
        temp = [];
      }
    }
    socket.on('disconnect', (reason) => {
      playerConnected--;
      clearInterval(intervall);
      clearInterval(intervalConditions);
      if(connections[socket.id]){
        if(whosTurn[connections[socket.id].idI] > 0){
          clearTimeout(whosTurn[connections[socket.id].idI][0]);
          clearTimeout(whosTurn[connections[socket.id].idI][1]);
        }
        let numberr = connections[socket.id].idI;
        if(connectArr[connections[socket.id].idI][1-connections[socket.id].idI] != 0){

          io.to(connectArr[connections[socket.id].idI][1-connections[socket.id].idJ]).emit("winMessageD");

          delete connections[connectArr[connections[socket.id].idI][1-connections[socket.id].idJ]];
        }

        values.splice(numberr, 1);
        connectArr.splice(numberr,1);

        delete connections[socket.id];

        for(let i in connections){
          if(connections[i]?.idI > numberr){

            connections[i].idI -= 1;
          }
        }
      }
    });
  }
  else{
    io.to(socket.id).emit("FullServer");
  }
  
});


server.listen(port, () => {
  console.log('running');
});