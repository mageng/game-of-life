describe('Game runner', function(){
  var canvasHandler = new App.CanvasHandler();
  var gameRunner = App.GameRunner;
  beforeEach(function(){
    gameRunner.reset();
  })
  describe('after initialize', function(){
    it('default options populates current options', function(){
      gameRunner.init(canvasHandler, App.cellFactory);
      assert.equal(gameRunner.defaultOptions.gridLength, 10);
      assert.equal(gameRunner.currentOptions.gridLength, 10);
    })
    it('grid length sets cell collection size', function(){
      gameRunner.init(canvasHandler, App.cellFactory, { gridLength: 5 });
      assert.equal(gameRunner.cells.length, 5);
    })
    it('returns a cell list of size: gridLength^2', function(){
      var size = 5;
      gameRunner.init(canvasHandler, App.cellFactory, { gridLength: size });
      assert.equal(gameRunner.cellList().length, size*size);
    })
  })
  describe('on cycle', function(){
    it('changes generation', function(){
      gameRunner.init(canvasHandler, App.cellFactory);
      assert.equal(gameRunner.currentOptions.generation, 1);
      gameRunner.cycle();
      assert.equal(gameRunner.currentOptions.generation, 2);
    })
  })
});
