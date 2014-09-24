describe('Game logic', function(){
  var canvasHandler = new App.CanvasHandler();
  var gameRunner = App.GameRunner;
  describe('on manual cell creation', function(){
    beforeEach(function(){
      gameRunner.init(canvasHandler, App.cellFactory, { gridLength: 5 });
    })
    afterEach(function(){
      gameRunner.reset();
    })
    it('changes cell status', function(){
      assert.equal(gameRunner.cells[1][1].currentState.alive, false);
      gameRunner.createAndToggleCell(1,1);
      assert.equal(gameRunner.cells[1][1].currentState.alive, true);
    })
    it('changes draw state', function(){
      assert.equal(gameRunner.cells[1][1].draw, false);
      gameRunner.createAndToggleCell(1,1);
      assert.equal(gameRunner.cells[1][1].draw, true);
    })
  })
  describe('on generation change', function(){
    beforeEach(function(){
      gameRunner.init(canvasHandler, App.cellFactory, { gridLength: 5 });
    })
    afterEach(function(){
      gameRunner.reset();
    })
    it('removes lonely cells', function(){
      gameRunner.createAndToggleCell(1,1);
      assert.equal(gameRunner.cells[1][1].currentState.alive, true);
      gameRunner.cycle();
      assert.equal(gameRunner.cells[1][1].currentState.alive, false);
    })
    it('creates cells when three neighbors are present', function(){
      gameRunner.createAndToggleCell(0,0);
      gameRunner.createAndToggleCell(1,0);
      gameRunner.createAndToggleCell(2,0);
      gameRunner.cycle();
      assert.equal(gameRunner.cells[0][1].currentState.alive, true);
    })
    it('removes cells when four neighbors are present', function(){
      gameRunner.createAndToggleCell(0,0);
      gameRunner.createAndToggleCell(1,0);
      gameRunner.createAndToggleCell(2,0);
      gameRunner.createAndToggleCell(0,1);
      gameRunner.createAndToggleCell(1,1);
      gameRunner.createAndToggleCell(2,1);
      gameRunner.cycle();
      assert.equal(gameRunner.cells[1][1].currentState.alive, false);
    })
    it('regenerates cells by a predictable pattern', function(){
      gameRunner.createAndToggleCell(0,1);
      gameRunner.createAndToggleCell(1,1);
      gameRunner.createAndToggleCell(2,1);
      gameRunner.cycle();
      gameRunner.cycle();
      assert.equal(gameRunner.cells[1][0].currentState.alive, true);
      assert.equal(gameRunner.cells[1][0].currentState.alive, true);
    })
  })
});
