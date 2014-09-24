console.log window.js_buildtime

window.App = @App ||= {}

# Game cycles will go through window.requestAnimFrame() for smooth animations
window.requestAnimFrame = (->
  window.requestAnimationFrame or window.webkitRequestAnimationFrame or window.mozRequestAnimationFrame or (callback) ->
    window.setTimeout callback, 1000 / 60
    return
)()
