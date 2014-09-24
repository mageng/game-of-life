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
