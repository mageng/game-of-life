class @App.Cell
  defaultState:
    alive: false
    x: 0
    y: 0
    color: "#EEEEEE"
  nextState: {}
  currentState: {}
  draw: false
  changed: false

  constructor: (options={}) ->
    # hopefully avoiding unwanted cloning between states, using recursive data setting
    @currentState[key]=value  for key, value of @defaultState
    @currentState[key]=value  for key, value of options
    @setNextState(key, value) for key, value of @currentState
    @setDrawStatus()
    return

  setDrawStatus: ->
    if @currentState.alive == true
      @draw = true
      @currentState.color = "#F2B4A8"
    return

  age: ->
    @draw = false
    for key, value of @nextState
      @changed = true if @currentState[key] != @nextState[key]
      @currentState[key] = value
    @setDrawStatus() if @currentState.alive == true

  setNextState: (key,value=undefined) ->
    @nextState[key] = value
    return
