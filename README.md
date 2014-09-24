# Game of life

## Use

### Requirements

  * Bower (http://bower.io)

### Getting started

Open public/index.html in a webkit browser to get going.

Besides a dependency of jQuery, the minimum setup to run the game (with a random board) in the browser looks like this:

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

Test are built from 'src/test' and runs in the browser using public/test.html