console.log window.js_buildtime
window.App = @App ||= {}

window.requestAnimFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or (callback) ->
    window.setTimeout callback, 1000 / 60
    return
)()

jQuery ->
  App = window.App
  currentCanvas = jQuery('#game_canvas')[0]
  canvas_handler = new App.CanvasHandler(currentCanvas)
  App.GameRunner.init(canvas_handler)
  return
