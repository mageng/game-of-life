@App.cellFactory =
  newCell: (options={}, random=false) ->
    # random aliveness is not cell logic
    options.alive = Math.floor((Math.random() * 5)) == 1 if random
    return jQuery.extend(true, {}, new App.Cell(options))
