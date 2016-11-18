
var rectPool = [];
var maxRect = 5;
Rect.prototype.maxWaitTime = 3000;
Rect.prototype.maxSpeed = 2;
Rect.prototype.size = 30;
var isPlay = false;

function initGame() {
  var canvas = document.getElementById('canvas');
  var counter = document.getElementById('score');
  var elemLeft = canvas.offsetLeft;
  var elemTop = canvas.offsetTop;
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

  for (var i = 0; i < maxRect; i++) {
    rectPool[i] = new Rect();
    rectPool[i].propsRandomizer();
  }

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
}

function resetGame() {
  var counter = document.getElementById('score');
  counter.textContent = ' 0';
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
}

function start() {
  resetGame();
  isPlay = true;
  animate();
}

function stop() {
  isPlay = false;
  
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
  this.color = 'red';
  this.speed = getRandom({ type: 'speed', max: this.maxSpeed, min: 1 });
  this.startTime = getRandom({ type: 'time', max: this.maxWaitTime });
}

function animate() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  rectPool.forEach(function (rect) {
    if (Date.now() > rect.startTime) {
      rect.draw(context);
    }
  })
  if(isPlay) {
  requestAnimationFrame(animate);
  }
}

function getRandom(randomObject) {
  switch (randomObject.type) {
    case 'color':
      return;
    case 'time':
      return Date.now() + Math.round(Math.random() * randomObject.max);
    case 'position':
    case 'speed':
      return Math.random() * (randomObject.max - randomObject.min) + randomObject.min;
    default:
      return;
  }
}



document.body.onload = function () {
  document.getElementsByClassName('start-button')[0].addEventListener('click', start);

  document.getElementsByClassName('stop-button')[0].addEventListener('click', stop);
  initGame();

};
