import { removeAllChildNodes } from './utils.js';

const ol = document.querySelector('#overlay');
const menu = document.querySelector('#menu');
const game = document.querySelector('#game');

export const backToMenu = () => {
   removeAllChildNodes(game);
   game.classList.remove('game--active');
   ol.classList.remove('overlay--active');
   menu.classList.remove('menu--inactive');
   removeAllChildNodes(ol);
};

const createBackButton = () => {
   const button = document.createElement('button');
   const label = document.createTextNode('back');
   button.appendChild(label);
   button.classList.add('btn');
   button.classList.add('btn--overlay');
   button.addEventListener('click', backToMenu);
   button.addEventListener('pointerover', () => {
      new Audio('./static/audio/hover.mp3').play();
   });
   ol.appendChild(button);
};

const createRestartButton = (resetGame) => {
   const button = document.createElement('button');
   const label = document.createTextNode('restart');
   button.appendChild(label);
   button.classList.add('btn');
   button.classList.add('btn--overlay');
   button.addEventListener('click', resetGame);
   button.addEventListener('pointerover', () => {
      new Audio('./static/audio/hover.mp3').play();
   });
   ol.appendChild(button);
};

const createGameInfo = (level) => {
   const container = document.createElement('div');
   container.classList.add('overlay__info');
   const ol_level = document.createElement('div');
   ol_level.classList.add('overlay__level');
   const ol_stats = document.createElement('div');
   ol_stats.classList.add('overlay__stats');
   const result = document.createTextNode(`${level.amountOfSmileys}\xa0smileys`);
   ol_stats.appendChild(result);
   const levelLabel = document.createTextNode(level.name);
   ol_level.appendChild(levelLabel);
   container.appendChild(ol_level);
   container.appendChild(ol_stats);
   ol.appendChild(container);
};

const overlay = (level, resetGame) => {
   ol.classList.add('overlay--active');
   createRestartButton(resetGame);
   createGameInfo(level);
   createBackButton();
};

export default overlay;
