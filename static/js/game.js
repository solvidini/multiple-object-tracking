import overlay, { backToMenu } from './overlay.js';
import { randomIntFromRange, randomVelocity, randomColor, distance } from './utils.js';
import * as settings from './settings.js';

const MOT = (props) => {
   overlay();
   let {
      level,
      level: { amountOfParticles, amountOfSmileys },
   } = props;
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

   // GAME SETTINGS
   let guesses = 0;
   let correctGuesses = 0;

   // OTHER
   let isGameRunning = false;
   let revealSmileys = false;
   let currentStage = null;

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
            currentStage = settings.stage.PREPARE;
            isGameRunning = false;
            revealSmileys = true;
            setTimeout(() => nextStage(settings.stage.START), level.time.preparation);
            break;
         }
         case settings.stage.START: {
            currentStage = settings.stage.START;
            isGameRunning = true;
            revealSmileys = false;
            setTimeout(() => nextStage(settings.stage.GUESS), level.time.game);
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
               particle.color = 'red';
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
               particles[i].color = 'yellow';
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
      init();
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
         if (
            (this.isChosen && this.isSmiley && currentStage === settings.stage.OVER) ||
            (this.isSmiley && currentStage === settings.stage.PREPARE)
         ) {
            // mouth
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
         if (distance(mouse.x, mouse.y, this.x, this.y) < 150 && this.opacity > 0.8) {
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
         if (isGameRunning) {
            this.x += this.velocity.x;
            this.y += this.velocity.y;
         }
      }
   }

   // Implementation
   let particles;

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
};

export default MOT;
