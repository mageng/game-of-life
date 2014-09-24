describe('Cell', function(){
  var cell =  null;
  describe('when create new', function(){
    it('should create a cell with default state', function(){
      cell = App.cellFactory.newCell();
      assert.equal(cell.currentState.alive, false);
      assert.equal(cell.currentState.color, "#EEEEEE");
      assert.equal(cell.draw, false);
      delete cell;
    })
    it('should create a live cell if param alive = true', function(){
      cell = App.cellFactory.newCell({alive: true});
      assert.equal(cell.currentState.alive, true);
      delete cell;
    })
  })
  describe('when aging', function(){
    beforeEach(function(){
      cell = App.cellFactory.newCell();
    })
    it('should change state', function(){
      cell = App.cellFactory.newCell({alive:false});
      assert.equal(cell.currentState.alive, false);
      assert.equal(cell.draw, false);
      cell.setNextState('alive', true)
      cell.age()
      assert.equal(cell.currentState.alive, true);
      assert.equal(cell.draw, true);
      delete cell;
    })
  })
});

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
