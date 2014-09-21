@App ||= {}
class @App.CanvasHandler
  context: undefined
  constructor: (canvas) ->
    @context = canvas.getContext("2d")
    @prepareCanvas()

  prepareCanvas: ->
    @context.fillStyle = "#EEEEEE"
    @context.fillRect(0,0,400,400)

  render: ->
    console.log "rendering"
    return
