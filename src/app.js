/**
 * The Main Application
 */

import { APP_TITLE } from './consts.js';

const app = () =>
{
  // set the app title
  document.title = APP_TITLE;

  // TODO: create your application

  const textContainer = document.createElement('div');
  textContainer.className = "text-container";
  textContainer.innerHTML = "A Basic JavaScript Starter Template"

  // add to the app container
  const appContainer = document.getElementById('app');
  appContainer.append(textContainer);
};

// start the app
app();