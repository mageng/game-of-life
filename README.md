# Game of life

A version of Conway's Game of Life in JavaScript, using a object oriented design.

Online at http://game-of-life-coffee.herokuapp.com/

## What is Game of Life?

  Conway's Game of Life is a single player game with cell patterns growing to a few specific rules (cellular automaton).

  Read more: http://en.wikipedia.org/wiki/Conways_Game_of_Life

## Getting started

### Requirements

  * Bower (http://bower.io)

### Run the game

Open public/index.html or use the online version at http://game-of-life-coffee.herokuapp.com/ to get going.

Besides a dependency of jQuery, the minimum setup to run the game (with a random board) in the browser looks like this:

```html
  <script src="assets/js/gameoflife.js" type="text/javascript"></script>
  <script>
    jQuery(function() {
      var canvasHandler, currentCanvas;
      currentCanvas = jQuery('#game_canvas')[0];
      canvasHandler = new App.CanvasHandler(currentCanvas);
      App.GameRunner.init(canvasHandler, App.cellFactory, { randomBoard: true});
    });
  </script>
  <canvas width="320" height="320" id="game_canvas"></canvas>
  <div class="controls">
    <button id="play_pause">Run</button>
    <button id="clear">Clear</button>
  </div>
```

## Build

JavaScript compiles and minifies from src/coffee

### Requirements

  * Node.js >= v0.11.13
  * NPM

### Setup

    npm install

    bower install

### Build once

    grunt build

### Build on file changes

    grunt serve

## Tests

Test are built from 'src/test' using the build commands, and runs in the browser using public/test.html
