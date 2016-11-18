function game(maxAlian) {
  var alianPool = [];
  var space = new Space();
  var isPlay = false;
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  var counter = document.getElementById('score');
  var elemLeft = canvas.offsetLeft;
  var elemTop = canvas.offsetTop;
  var startBtn = document.getElementsByClassName('start-button')[0];
  var stopBtn = document.getElementsByClassName('stop-button')[0];

  function initGame() {
    reset();

    canvas.addEventListener('click', function (event) {
      var x = event.pageX - elemLeft;
      var y = event.pageY - elemTop;
      alianPool.forEach(function (element) {
        if (x > element.x && x < element.x + element.size && y > element.y && y < element.y + element.size) {
          counter.textContent = ' ' + (Number(counter.textContent) + 1) + ' ';
          element.propsRandomizer();
        }
      });
    }, false);

    startBtn.addEventListener('click', start);
    stopBtn.addEventListener('click', stop);
  }

  function reset() {
    
    alianPool = [];
    for (var i = 0; i < maxAlian; i++) {
      alianPool[i] = new Alian();
      alianPool[i].propsRandomizer();
    }
    counter.textContent = ' 0';
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  }

  function start() {
    reset();
    isPlay = true;
    animate();
    startBtn.removeEventListener('click', start);
  }

  function stop() {
    reset();
    isPlay = false;
    startBtn.addEventListener('click', start);
  }

  function animate() {
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    
    space.draw(context);
    alianPool.forEach(function (alian) {
      if (Date.now() > alian.startTime) {
        alian.draw(context);
      }
    })
    if (isPlay) {
      requestAnimationFrame(animate);
    }
  }

  initGame();
}

var images = new function () {
  this.enemy = new Image();
  this.space = new Image();
  this.station = new Image();
  this.aim = new Image();

  this.enemy.src = './assets/image/enemy.png';
  this.space.src = './assets/image/bg.png';
  this.station.src = './assets/image/ship.png';
  this.aim.src = './assets/image/aim.png';
}

//Класс для создания инопланетян
function Alian() { }

//Функция для отрисовки инопланетян
Alian.prototype.draw = function (context) {
  context.drawImage(images.enemy, this.x, this.y, this.size, this.size);  
  this.y += this.speed;
  if (this.y >= canvas.clientHeight) {
    this.propsRandomizer();
  }
}

//Функция для рэндомного изменения свойств квадрата
Alian.prototype.propsRandomizer = function () {
  this.x = getRandom({ type: 'position', max: (canvas.clientWidth - this.size), min: this.size });
  this.y = 0;
  this.color = getRandom({ type: 'color' });
  this.speed = getRandom({ type: 'speed', max: this.maxSpeed, min: 1 });
  this.startTime = getRandom({ type: 'time', max: this.maxWaitTime });
}

//Класс для создания космоса(фон)
function Space() { 
}

Space.prototype.draw = function (context) {
  
  context.drawImage(images.space, 0, 0, canvas.clientWidth, canvas.clientHeight);  
}

//Класс для создания прицела
function Aim() { 
}

Aim.prototype.draw = function (context) {
  context.drawImage(images.aim, 0, 0, canvas.clientWidth, canvas.clientHeight);  
}


function getRandom(randomObject) {
  switch (randomObject.type) {
    case 'color':
      return 'rgb(' + randomRGBChanelValue() + ',' + randomRGBChanelValue() + ',' + randomRGBChanelValue() + ')';
    case 'time':
      return Date.now() + Math.round(Math.random() * randomObject.max);
    case 'position':
    case 'speed':
      return Math.random() * (randomObject.max - randomObject.min) + randomObject.min;
    default:
      return;
  }
}

function randomRGBChanelValue() {
  return Math.floor(Math.random() * 255);
}

document.addEventListener("DOMContentLoaded", function () {
  //Default value
  var maxAlian = 10;
  Alian.prototype.maxWaitTime = 3000;
  Alian.prototype.maxSpeed = 2;
  Alian.prototype.size = 30;
  
  //game start
  game(maxAlian);
});
