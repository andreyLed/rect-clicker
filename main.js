function game(maxRect) {
  var rectPool = [];
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
      rectPool.forEach(function (element) {
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
    rectPool = [];
    for (var i = 0; i < maxRect; i++) {
      rectPool[i] = new Rect();
      rectPool[i].propsRandomizer();
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
    rectPool.forEach(function (rect) {
      if (Date.now() > rect.startTime) {
        rect.draw(context);
      }
    })
    if (isPlay) {
      requestAnimationFrame(animate);
    }
  }

  initGame();
}

//Класс для создания квадратов
function Rect() { }

//Функция для отрисовки квадрата
Rect.prototype.draw = function (context) {
  context.fillStyle = this.color;
  context.fillRect(this.x, this.y, this.size, this.size);
  this.y += this.speed;
  if (this.y >= canvas.clientHeight) {
    this.propsRandomizer();
  }
}

//Функция для рэндомного изменения свойств квадрата
Rect.prototype.propsRandomizer = function () {
  this.x = getRandom({ type: 'position', max: (canvas.clientWidth - this.size), min: this.size });
  this.y = 0;
  this.color = getRandom({ type: 'color' });
  this.speed = getRandom({ type: 'speed', max: this.maxSpeed, min: 1 });
  this.startTime = getRandom({ type: 'time', max: this.maxWaitTime });
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
  var maxRect = 10;
  Rect.prototype.maxWaitTime = 3000;
  Rect.prototype.maxSpeed = 2;
  Rect.prototype.size = 30;
  
  //game start
  game(maxRect);
});
