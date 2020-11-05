import { randomIntFromRange, randomVelocity, randomColor, distance } from './utils.js';
import * as settings from './settings.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = document.querySelector('#game').clientWidth;
canvas.height = document.querySelector('#game').clientHeight;

const mouse = {
   x: 0,
   y: 0,
};

const level = settings.levels['insane'];

// GAME SETTINGS
const amountOfParticles = level.amountOfParticles;
const amountOfSmileys = level.amountOfSmileys;
let guesses = 0;
let correctGuesses = 0;
const radius = level.particleRadius;
const velocity = level.velocity;
const colors = ['#1fdff4', '#10daf1', '#18dadc'];

// OTHER
let timeStop = false;
let revealSmileys = false;

const gameOver = () => {
   if (correctGuesses >= amountOfSmileys) {
      console.log(`Congratulations! You guessed all the ${correctGuesses} smileys!`);
   } else {
      console.log(`You failed! You guessed ${correctGuesses} of ${amountOfSmileys} smileys.`);
   }
};

const nextStage = (stage) => {
   switch (stage) {
      case settings.stage.PREPARE: {
         timeStop = true;
         revealSmileys = true;
         setTimeout(() => nextStage(settings.stage.START), 3000);
         break;
      }
      case settings.stage.START: {
         timeStop = false;
         revealSmileys = false;
         setTimeout(() => nextStage(settings.stage.GUESS), 5000);
         break;
      }
      case settings.stage.GUESS: {
         timeStop = true;
         revealSmileys = false;
         break;
      }
      case settings.stage.OVER: {
         timeStop = true;
         revealSmileys = true;
         gameOver();
         break;
      }
   }
};

const onGuess = () => {
   guesses++;
   if (guesses >= amountOfSmileys) {
      particles.forEach((particle) => {
         if (particle.isChosen && particle.isSmiley) {
            correctGuesses++;
         }
         if (particle.isChosen && !particle.isSmiley) {
            particle.color = 'red';
         }
      });
      nextStage(settings.stage.OVER);
   }
};

// Handler functions
const onChose = (event) => {
   if (guesses < amountOfSmileys) {
      for (let i = particles.length - 1; i >= 0; i--) {
         if (distance(mouse.x, mouse.y, particles[i].x, particles[i].y) <= particles[i].radius) {
            particles[i].isChosen = true;
            particles[i].color = 'yellow';
            onGuess();
            break;
         }
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
         particles[i].mouseOver = true;
      } else if (!particles[i].isChosen) {
         particles[i].mouseOver = false;
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
//    timeStop = !timeStop;
// });

addEventListener('click', onChose);

// Objects
class Particle {
   constructor(x, y, radius, velocity, isSmiley, color) {
      this.x = x;
      this.y = y;
      this.velocity = {
         x: randomVelocity(velocity.min, velocity.max),
         y: randomVelocity(velocity.min, velocity.max),
      };
      this.radius = radius;
      this.baseColor = color;
      this.color = color;
      this.opacity = 1;
      this.isSmiley = isSmiley;
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

      // mouse near particles
      if (distance(mouse.x, mouse.y, this.x, this.y) < 150 && this.opacity > 0.85) {
         this.opacity -= 0.01;
      } else if (this.opacity < 1) {
         this.opacity += 0.01;
      }

      if (this.mouseOver && !this.isChosen) {
         this.color = 'yellow';
      } else if (!this.isChosen) {
         this.color = this.baseColor;
      }

      if (revealSmileys && this.isSmiley) this.color = settings.colors.smiley;

      // change coordinates by velocity
      if (!timeStop) {
         this.x += this.velocity.x;
         this.y += this.velocity.y;
      }
   }
}

// Implementation
let particles;

function init() {
   particles = [];

   for (let i = 0; i < amountOfParticles; i++) {
      let infiniteLoopDetector = 0;
      let x = randomIntFromRange(radius, canvas.width - radius);
      let y = randomIntFromRange(radius, canvas.height - radius);
      const isSmiley = i < amountOfSmileys;
      let color = randomColor(colors);

      if (i !== 0) {
         for (let j = 0; j < particles.length; j++) {
            if (distance(x, y, particles[j].x, particles[j].y) < radius + particles[j].radius) {
               x = randomIntFromRange(radius, canvas.width - radius);
               y = randomIntFromRange(radius, canvas.height - radius);

               j = -1;
               infiniteLoopDetector++;

               if (infiniteLoopDetector > 100000) {
                  amountOfParticles = 2; // tu do zmiany na np 'nowa gra'
                  infiniteLoopDetector = 0;
                  alert('Too many particles for current screen size! Decrease the amount!');
                  init();
               }
            }
         }
      }

      particles.push(new Particle(x, y, radius, velocity, isSmiley, color));
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
nextStage(settings.stage.PREPARE);
