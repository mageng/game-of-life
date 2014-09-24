@App ||= {}
class @App.CanvasHandler
  context: undefined
  canvasElement: undefined
  width: 0
  height: 0
  @rows: 0
  @columns: 0
  constructor: (@canvasElement={}, gridLength=10) ->
    unless @canvasElement.getContext
      # Obviously not a canvas element
      @canvasElement = undefined
    else
      @rows = @columns = gridLength
      @context = @canvasElement.getContext("2d")
      @prepareCanvas()

  prepareCanvas: ->
    if @canvasElement?
      @width      ||= jQuery(@canvasElement).width()
      @height     ||= jQuery(@canvasElement).height()
      @cellWidth  ||= @width / @columns
      @cellHeight ||= @height / @rows
      @context.clearRect(0,0,@width,@height)

  renderCell: (cell) ->
    if @canvasElement?
      x = cell.currentState.x
      y = cell.currentState.y
      # remove cell from canvas if draw = false
      @context.clearRect(x*@cellWidth,y*@cellHeight,@cellWidth,@cellHeight) if cell.draw == false
      if cell.draw == true
        @context.fillStyle = cell.currentState.color
        @roundRect(@context, (x*@cellWidth)+1, (y*@cellHeight)+1, @cellWidth-2, @cellHeight-2, 2)
      return


  # as found on stackoverflow
  roundRect: (ctx, x, y, width, height, radius) ->
    ctx.beginPath()
    ctx.moveTo x + radius, y
    ctx.lineTo x + width - radius, y
    ctx.quadraticCurveTo x + width, y, x + width, y + radius
    ctx.lineTo x + width, y + height - radius
    ctx.quadraticCurveTo x + width, y + height, x + width - radius, y + height
    ctx.lineTo x + radius, y + height
    ctx.quadraticCurveTo x, y + height, x, y + height - radius
    ctx.lineTo x, y + radius
    ctx.quadraticCurveTo x, y, x + radius, y
    ctx.closePath()
    # ctx.strokeStyle = '#F4B36C'
    # ctx.stroke()
    ctx.fill()
    return
