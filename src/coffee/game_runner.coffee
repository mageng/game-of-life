@App ||= {}
@App.GameRunner =
  defaultOptions:
    generationLength: 0.7 # seconds
    generation:   0
    active:       false
    gridLength:   10
    randomBoard:  false
  cells: []
  currentOptions: {}
  active: false
  canvasHandler: undefined
  cellFactory:   undefined

  init: (@canvasHandler, @cellFactory, options={}) ->
    @setOption(key,value) for key, value of @defaultOptions
    @setOption(key,value) for key, value of options
    @createCells()
    @setupControlls()
    @cycle()
    return

  reset: ->
    @setOption(key,value) for key, value of @defaultOptions
    @cells = []
    return

  setOption: (key,value=undefined) ->
    @currentOptions[key] = value
    return

  setupControlls: (canvasElement) ->
    @setupPlayPauseButton()
    @setupClearButton()
    @setupAddCellByClicking()

  setupPlayPauseButton: ->
    jQuery("#play_pause").click (e) =>
      if !@currentOptions.active
        @currentOptions.active = true
        jQuery(e.target).html("Pause")
        @play()
        return
      @currentOptions.active = false
      jQuery(e.target).html("Run")
      return

  setupClearButton: ->
    # clear is not "reset", as clear keeps current options in place and 'kills' all cells
    jQuery("#clear").click (e) =>
      for cell in @cellList()
        cell.nextState.alive = false
        cell.age()
      @cycle()
      return

  setupAddCellByClicking: ->
    jQuery(@canvasHandler.canvasElement).click (e) =>
      canvasElement = e.target
      parentOffset = jQuery(canvasElement).offset()
      cellWidth      = jQuery(canvasElement).width() / @currentOptions.gridLength
      cellHeight     = jQuery(canvasElement).height() / @currentOptions.gridLength
      clickX = e.pageX
      clickY = e.pageY
      x = Math.floor((clickX - parentOffset.left) / cellWidth)
      y = Math.floor((clickY - parentOffset.top) / cellHeight)
      @createAndToggleCell(x, y)
      return

  createAndToggleCell: (x,y) ->
    # two dimensional array switches normal x-y order for later graphical representation ( see CreateCells() )
    cell = @cells[y][x]
    if !cell.currentState.alive
      cell.nextState.alive = true
    else
      cell.nextState.alive = false
    cell.age()
    @canvasHandler.renderCell(cell) if @canvasHandler?
    return

  createCells: ->
    if @cellFactory?
      while @cells.length < @currentOptions.gridLength
        cells_row = []
        while cells_row.length < @currentOptions.gridLength
          y_pos = @cells.length
          x_pos = cells_row.length
          cell = @cellFactory.newCell({x: x_pos, y: y_pos}, @currentOptions.randomBoard)
          cells_row[cells_row.length] = cell
        @cells.push cells_row

  cellList: ->
    # Return flattened list for more effective array loop
    jQuery.map @cells, (i) ->
      return i

  play: ->
    _this = App.GameRunner
    if _this.currentOptions.active
      # Using timeout for desired interval and then calling requestAnimFrame for doing the cycle
      setTimeout (=>
        window.requestAnimFrame(_this.play)
        return
      ), _this.currentOptions.generationLength * 1000
      _this.cycle()
    return

  cycle: ->
    @canvasHandler.prepareCanvas()
    for cell in @cellList()
      @canvasHandler.renderCell(cell) if cell.draw == true
      neighbors = @getAllNeighbors(cell.currentState.x, cell.currentState.y)
      cell.setNextState('alive', true) if neighbors == 2 && cell.currentState.alive == true
      cell.setNextState('alive', false) if neighbors >= 4 || neighbors < 2
      cell.setNextState('alive', true) if neighbors == 3
    cell.age() for cell in @cellList()
    @currentOptions.generation++
    return

  getAllNeighbors: (x,y) ->
    # count all neighbors for cell with coordinates x/y
    return @getPerpendicularNeighbors(x,y) + @getDiagonalNeighbors(x,y)

  getPerpendicularNeighbors: (x,y,i=0) ->
    i++ if @cells[y-1]?     && @cells[y-1][x].currentState.alive == true
    i++ if @cells[y+1]?     && @cells[y+1][x].currentState.alive == true
    i++ if @cells[y][x-1]?  && @cells[y][x-1].currentState.alive == true
    i++ if @cells[y][x+1]?  && @cells[y][x+1].currentState.alive == true
    return i

  getDiagonalNeighbors: (x,y,i=0) ->
    i++ if @cells[y+1] && @cells[y+1][x+1]? && @cells[y+1][x+1].currentState.alive == true
    i++ if @cells[y+1] && @cells[y+1][x-1]? && @cells[y+1][x-1].currentState.alive == true
    i++ if @cells[y-1] && @cells[y-1][x+1]? && @cells[y-1][x+1].currentState.alive == true
    i++ if @cells[y-1] && @cells[y-1][x-1]? && @cells[y-1][x-1].currentState.alive == true
    return i
