import { randomIntFromRange, randomVelocity, randomColor, distance } from './utils.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = document.querySelector('#game').clientWidth;
canvas.height = document.querySelector('#game').clientHeight;

const mouse = {
   x: 0,
   y: 0,
};

let amountOfParticles = 20;
let maxRadius = 50;
let minRadius = 50;
const colors = ['#1fdff4', '#10daf1', '#18dadc'];

// Handler functions
const onChose = (event) => {
   for (let i = particles.length - 1; i >= 0; i--) {
      if (distance(mouse.x, mouse.y, particles[i].x, particles[i].y) <= particles[i].radius) {
         particles[i].color = 'red';
         particles[i].isChosen = true;
         break;
      }
   }
};

// Event Listeners
addEventListener('mousemove', (e) => {
   const cRect = canvas.getBoundingClientRect(); // Gets CSS pos, and width/height
   const canvasX = Math.round(e.clientX - cRect.left); // Subtract the 'left' of the canvas
   const canvasY = Math.round(e.clientY - cRect.top); // from the X/Y positions to make (0,0) the top left of the canvas
   c.fillText('X: ' + canvasX + ', Y: ' + canvasY, 10, 20);
   mouse.x = canvasX;
   mouse.y = canvasY;

   let particleChosen = false;
   for (let i = particles.length - 1; i >= 0; i--) {
      if (
         distance(mouse.x, mouse.y, particles[i].x, particles[i].y) <= particles[i].radius &&
         !particleChosen
      ) {
         particleChosen = true;
         particles[i].color = 'red';
      } else if (!particles[i].isChosen) {
         particles[i].color = particles[i].baseColor;
      }
   }
});

addEventListener('resize', () => {
   canvas.width = document.querySelector('#game').clientWidth;
   canvas.height = document.querySelector('#game').clientHeight;

   init();
});

// addEventListener('contextmenu', (event) => {
//    event.preventDefault();
//    for (let i = 0; i < particles.length; i++) {
//       if (distance(mouse.x, mouse.y, particles[i].x, particles[i].y) <= particles[i].radius) {
//          particles[i].velocity.x = (particles[i].x - mouse.x) * 0.7;
//          particles[i].velocity.y = (particles[i].y - mouse.y) * 0.7;
//       }
//    }
// });

addEventListener('click', onChose);

// Objects
class Particle {
   constructor(x, y, radius, color) {
      this.x = x;
      this.y = y;
      this.velocity = {
          x: randomVelocity(1.5, 2),
          y: randomVelocity(1.5, 2),
        //  x: 0,
        //  y: 0,
      };
      this.radius = radius;
      this.color = color;
      this.baseColor = color;
      this.opacity = 1;
      this.isCorrect;
      this.isChosen = false;
   }

   draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.globalAlpha = this.opacity;
      c.fillStyle = this.color;
      c.fill();
      c.globalAlpha = 1;
      c.strokeStyle = 'black';
      c.stroke();
      c.closePath();
   }

   update() {
      this.draw();
      // walls collision detection
      if (
         this.x - this.radius + this.velocity.x < 0 ||
         this.x + this.radius + this.velocity.x > canvas.width
      ) {
         this.hold = false;
         this.velocity.x = -this.velocity.x;
      }
      if (
         this.y - this.radius + this.velocity.y < 0 ||
         this.y + this.radius + this.velocity.y > canvas.height
      ) {
         this.hold = false;
         this.velocity.y = -this.velocity.y;
      }

      //   mouse near particles
      if (distance(mouse.x, mouse.y, this.x, this.y) < 150 && this.opacity > 0.85) {
         this.opacity -= 0.01;
      } else if (this.opacity < 1) {
         this.opacity += 0.01;
      }

      if (!(distance(mouse.x, mouse.y, this.x, this.y) <= this.radius)) {
         this.mouseOver = false;
      }

      //   if (this.mouseOver) this.color = 'red';
      //   else this.color = this.baseColor;

      // check stagnancy
      //   if (this.velocity.x === 0 && this.velocity.y === 0) {
      //      this.color = 'red';
      //   } else {
      //      this.color = this.baseColor;
      //   }

      // change coordinates by velocity
      this.x += this.velocity.x;
      this.y += this.velocity.y;
   }
}

// Implementation
let particles;

function init() {
   particles = [];

   for (let i = 0; i < amountOfParticles; i++) {
      const radius = randomIntFromRange(minRadius, maxRadius);
      let x = randomIntFromRange(radius, canvas.width - radius);
      let y = randomIntFromRange(radius, canvas.height - radius);
      const color = randomColor(colors);

      particles.push(new Particle(x, y, radius, color));
   }
}

// Animation Loop
function animate() {
   requestAnimationFrame(animate);
   c.clearRect(0, 0, canvas.width, canvas.height);

   particles.forEach((particle) => {
      particle.update(particles);
   });
}

init();
animate();
