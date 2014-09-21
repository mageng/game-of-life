@App ||= {}
@App.GameRunner =
  defaultOptions:
    tickLength:  1 # in seconds
    totaTicks:  0
    active: false
  currentOptions: {}
  active: true
  canvasHandler: undefined

  init: (@canvasHandler, options={}) ->
    @currentOptions = @defaultOptions
    @setOption(key,value) for key, value of options
    console.log @currentOptions
    return

  setOption: (key,value=undefined) ->
    @currentOptions[key] = value
    return


  play: ->
    _this = App.GameRunner
    if _this.currentOptions.active
      interval = _this.currentOptions.tickLength * 1000
      setTimeout (=>
        window.requestAnimFrame(_this.play)
        return
      ), interval
      _this.cycle()
    return

  cycle: ->
    @canvasHandler.render()
    return

  nextTick: ->
    @increaseTicksCount()
    return

  increaseTickCount: ->
    @totaTicks++
    return
