import { removeAllChildNodes } from './utils.js';

export const backToMenu = () => {
   const ol = document.querySelector('#overlay');
   const menu = document.querySelector('#menu');
   const game = document.querySelector('#game');
   removeAllChildNodes(game);
   game.classList.remove('game--active');
   menu.classList.remove('menu--inactive');
   removeAllChildNodes(ol);
};

const createBackButton = () => {
   const ol = document.querySelector('#overlay');
   const button = document.createElement('button');
   const label = document.createTextNode('back');
   button.appendChild(label);
   button.classList.add('menu__button');
   button.addEventListener('click', backToMenu);
   ol.appendChild(button);
};

// const create

const overlay = (props) => {
   createBackButton();
};

export default overlay;
