export const levels = {
   beginner: {
      amountOfParticles: 10,
      amountOfSmileys: 2,
      radius: 40,
      velocity: {
         min: 1,
         max: 1.2,
      },
      time: {
         preparation: 2500,
         game: 9000,
      },
   },
   intermediate: {
      amountOfParticles: 12,
      amountOfSmileys: 3,
      radius: 40,
      velocity: {
         min: 1,
         max: 1.5,
      },
      time: {
         preparation: 2500,
         game: 10000,
      },
   },
   advanced: {
      amountOfParticles: 13,
      amountOfSmileys: 4,
      radius: 38,
      velocity: {
         min: 1,
         max: 1.7,
      },
      time: {
         preparation: 2500,
         game: 10000,
      },
   },
   expert: {
      amountOfParticles: 15,
      amountOfSmileys: 4,
      radius: 36,
      velocity: {
         min: 1.3,
         max: 2,
      },
      time: {
         preparation: 2000,
         game: 10000,
      },
   },
   insane: {
      amountOfParticles: 17,
      amountOfSmileys: 5,
      radius: 35,
      velocity: {
         min: 1.5,
         max: 2.2,
      },
      time: {
         preparation: 1500,
         game: 10000,
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
   basics: ['#efdcdc', '#e9efdc', '#dce8ef', '#e9dcef'],
   smiley: '#46e751',
   wrong: '#dc285e',
};
