export const levels = {
   beginner: {
      name: 'beginner',
      amountOfParticles: 10,
      amountOfSmileys: 2,
      radius: 40,
      velocity: {
         min: 1,
         max: 1.3,
      },
      time: {
         preparation: 2500,
         game: 9000,
      },
   },
   intermediate: {
      name: 'intermediate',
      amountOfParticles: 13,
      amountOfSmileys: 3,
      radius: 40,
      velocity: {
         min: 1.1,
         max: 1.5,
      },
      time: {
         preparation: 2500,
         game: 10000,
      },
   },
   advanced: {
      name: 'advanced',
      amountOfParticles: 14,
      amountOfSmileys: 4,
      radius: 38,
      velocity: {
         min: 1.2,
         max: 1.7,
      },
      time: {
         preparation: 2500,
         game: 10000,
      },
   },
   expert: {
      name: 'expert',
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
      name: 'insane',
      amountOfParticles: 17,
      amountOfSmileys: 5,
      radius: 35,
      velocity: {
         min: 1.5,
         max: 2.2,
      },
      time: {
         preparation: 1800,
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
   wrong: '#f63c5e',
   choose: '#33fffc'
};
