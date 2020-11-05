export const levels = {
   beginner: {
      amountOfParticles: 10,
      amountOfSmileys: 2,
      particleRadius: 40,
      velocity: {
         min: 1,
         max: 1,
      },
   },
   intermediate: {
      amountOfParticles: 15,
      amountOfSmileys: 3,
      particleRadius: 40,
      velocity: {
         min: 1,
         max: 1.5,
      },
   },
   advanced: {
      amountOfParticles: 20,
      amountOfSmileys: 4,
      particleRadius: 38,
      velocity: {
         min: 1,
         max: 2,
      },
   },
   expert: {
      amountOfParticles: 20,
      amountOfSmileys: 5,
      particleRadius: 37,
      velocity: {
         min: 1.5,
         max: 2,
      },
   },
   insane: {
      amountOfParticles: 25,
      amountOfSmileys: 7,
      particleRadius: 36,
      velocity: {
         min: 1.5,
         max: 2.5,
      },
   },
};

export const stage = {
   PREPARE: 'PREPARE',
   START: 'START',
   GUESS: 'GUESS',
   OVER: 'OVER',
};

export const colors = {
   basics: ['#1fdff4', '#10daf1', '#18dadc'],
   smiley: '#46e751',
   wrong: '#dc285e',
};
