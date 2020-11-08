import overlay, { backToMenu } from './overlay.js';
import {
   randomIntFromRange,
   randomVelocity,
   randomColor,
   distance,
   removeAllChildNodes,
} from './utils.js';
import * as settings from './settings.js';

const MOT = (level) => {
   let { amountOfParticles, amountOfSmileys } = level;
   const game = document.querySelector('#game');
   game.classList.add('game--active');
   const canvas = document.createElement('canvas');
   game.appendChild(canvas);

   const c = canvas.getContext('2d');

   canvas.width = document.querySelector('#game').clientWidth;
   canvas.height = document.querySelector('#game').clientHeight;

   const mouse = {
      x: 0,
      y: 0,
   };

   // GAME VARIABLES
   let guesses = 0;
   let correctGuesses = 0;
   let isGameRunning = false;
   let revealSmileys = false;
   let currentStage = null;
   let particles = null;
   let currentTimeout = null;

   // GAME FUNCTIONS
   const resetGame = (forced = false) => {
      if (!forced) {
         new Audio('./static/audio/choose.ogg').play();
      }
      const stats = document.querySelector('.overlay__stats');
      const result = document.createTextNode(`${amountOfSmileys}\xa0smileys`);
      removeAllChildNodes(stats);
      stats.classList.remove('overlay__stats--win');
      stats.classList.remove('overlay__stats--lose');
      stats.appendChild(result);

      guesses = 0;
      correctGuesses = 0;
      isGameRunning = false;
      revealSmileys = false;
      currentStage = null;
      particles = null;
      init();
   };

   const gameOver = () => {
      const stats = document.querySelector('.overlay__stats');
      if (correctGuesses >= amountOfSmileys) {
         new Audio('./static/audio/win.ogg').play();
         const result = document.createTextNode(
            `Good job! ${correctGuesses}/${amountOfSmileys}\xa0smileys`
         );
         removeAllChildNodes(stats);
         stats.classList.add('overlay__stats--win');
         stats.appendChild(result);
      } else {
         new Audio('./static/audio/lose.ogg').play();
         const result = document.createTextNode(
            `You failed! ${correctGuesses}/${amountOfSmileys}\xa0smileys`
         );
         removeAllChildNodes(stats);
         stats.classList.add('overlay__stats--lose');
         stats.appendChild(result);
      }
   };

   const nextStage = (stage) => {
      switch (stage) {
         case settings.stage.PREPARE: {
            currentStage = settings.stage.PREPARE;
            isGameRunning = false;
            revealSmileys = true;
            if (currentTimeout) clearTimeout(currentTimeout);
            currentTimeout = setTimeout(
               () => nextStage(settings.stage.START),
               level.time.preparation
            );
            break;
         }
         case settings.stage.START: {
            currentStage = settings.stage.START;
            isGameRunning = true;
            revealSmileys = false;
            if (currentTimeout) clearTimeout(currentTimeout);
            currentTimeout = setTimeout(() => nextStage(settings.stage.GUESS), level.time.game);
            break;
         }
         case settings.stage.GUESS: {
            currentStage = settings.stage.GUESS;
            isGameRunning = false;
            revealSmileys = false;
            break;
         }
         case settings.stage.OVER: {
            currentStage = settings.stage.OVER;
            isGameRunning = false;
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
               particle.color = settings.colors.wrong;
            }
         });
         nextStage(settings.stage.OVER);
      }
   };

   // Handler functions
   const onChose = (event) => {
      if (guesses < amountOfSmileys && currentStage === settings.stage.GUESS) {
         for (let i = particles.length - 1; i >= 0; i--) {
            if (
               distance(mouse.x, mouse.y, particles[i].x, particles[i].y) <= particles[i].radius &&
               !particles[i].isChosen
            ) {
               particles[i].isChosen = true;
               particles[i].color = settings.colors.choose;
               onGuess();
               break;
            }
         }
      }
   };

   // Event Listeners
   canvas.addEventListener('mousemove', (e) => {
      const cRect = canvas.getBoundingClientRect(); // Gets CSS pos, and width/height
      mouse.x = Math.round(e.clientX - cRect.left); // Subtract the 'left' of the canvas
      mouse.y = Math.round(e.clientY - cRect.top); // from the X/Y positions to make (0,0) the top left of the canvas

      if (currentStage === settings.stage.GUESS) {
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
      }
   });

   canvas.addEventListener('click', onChose);

   addEventListener('resize', () => {
      canvas.width = document.querySelector('#game').clientWidth;
      canvas.height = document.querySelector('#game').clientHeight;
      resetGame(true);
   });

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
         // body
         c.beginPath();
         c.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
         c.globalAlpha = this.opacity;
         c.fillStyle = this.color;
         c.fill();
         c.globalAlpha = 1;
         c.strokeStyle = '#1b1b1b';
         c.stroke();
         c.closePath();
         if (
            (this.isChosen || this.isSmiley) &&
            (currentStage === settings.stage.OVER || currentStage === settings.stage.PREPARE)
         ) {
            // eyes
            c.fillStyle = 'white';
            c.beginPath();
            c.arc(
               this.x - this.radius / 3,
               this.y - this.radius / 4,
               this.radius / 4,
               0,
               Math.PI * 2
            );
            c.fill();
            c.closePath();
            c.beginPath();
            c.arc(
               this.x + this.radius / 3,
               this.y - this.radius / 4,
               this.radius / 4,
               0,
               Math.PI * 2
            );
            c.fill();
            c.closePath();
            // pupils
            c.fillStyle = '#1b1b1b';
            c.beginPath();
            c.arc(
               this.x - this.radius / 3,
               this.y - this.radius / 5,
               this.radius / 8,
               0,
               Math.PI * 2
            );
            c.fill();
            c.closePath();
            c.beginPath();
            c.arc(
               this.x + this.radius / 3,
               this.y - this.radius / 5,
               this.radius / 8,
               0,
               Math.PI * 2
            );
            c.fill();
            c.closePath();
         }
         // mouth
         if (
            (this.isChosen && this.isSmiley && currentStage === settings.stage.OVER) ||
            (this.isSmiley && currentStage === settings.stage.PREPARE)
         ) {
            c.beginPath();
            c.fillStyle = '#2b2b2b';
            c.arc(this.x, this.y + this.radius / 6, this.radius / 1.5, 0, Math.PI);
            c.fill();
            c.closePath();
            c.beginPath();
            c.fillStyle = 'red';
            c.arc(this.x, this.y + this.radius / 1.5, this.radius / 4, -0.1, Math.PI + 0.1, true);
            c.fill();
            c.closePath();
         } else if (
            (currentStage === settings.stage.OVER || currentStage === settings.stage.PREPARE) &&
            ((this.isChosen && !this.isSmiley) || (!this.isChosen && this.isSmiley))
         ) {
            c.beginPath();
            c.lineWidth = 2;
            c.arc(this.x, this.y + this.radius / 1.5, this.radius / 1.8, -0.3, Math.PI + 0.3, true);
            c.stroke();
            c.lineWidth = 1;
            c.closePath();
         }
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
         if (distance(mouse.x, mouse.y, this.x, this.y) < 150 && this.opacity > 0.86) {
            this.opacity -= 0.01;
         } else if (this.opacity < 1) {
            this.opacity += 0.01;
         }

         if (this.mouseOver && !this.isChosen) {
            this.color = settings.colors.choose;
         } else if (!this.isChosen) {
            this.color = this.baseColor;
         }

         if (revealSmileys && this.isSmiley) this.color = settings.colors.smiley;

         // change coordinates by velocity
         if (isGameRunning) {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
         }
      }
   }

   // Initialization
   function init() {
      const { velocity, radius } = level;
      particles = [];

      for (let i = 0; i < amountOfParticles; i++) {
         let infiniteLoopDetector = 0;
         let x = randomIntFromRange(radius, canvas.width - radius);
         let y = randomIntFromRange(radius, canvas.height - radius);
         const isSmiley = i < amountOfSmileys;
         let color = randomColor(settings.colors.basics);

         if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
               if (distance(x, y, particles[j].x, particles[j].y) < radius + particles[j].radius) {
                  x = randomIntFromRange(radius, canvas.width - radius);
                  y = randomIntFromRange(radius, canvas.height - radius);

                  j = -1;
                  infiniteLoopDetector++;

                  if (infiniteLoopDetector > 7777) {
                     amountOfParticles--;
                     backToMenu();
                     console.log('Too many particles for current screen size! Resize your screen!');
                     infiniteLoopDetector = 0;
                     init();
                  }
               }
            }
         }

         particles.push(new Particle(x, y, radius, velocity, isSmiley, color));
      }
      nextStage(settings.stage.PREPARE);
   }

   // Animation Loop
   function animate() {
      requestAnimationFrame(animate);
      c.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
         particle.update(particles);
      });
   }

   overlay(level, resetGame);
   init();
   animate();
};

export default MOT;
