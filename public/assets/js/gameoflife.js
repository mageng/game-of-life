window.js_buildtime='2014-09-24 20:58:10';
this.App || (this.App = {});

this.App.CanvasHandler = (function() {
  CanvasHandler.prototype.context = void 0;

  CanvasHandler.prototype.canvasElement = void 0;

  CanvasHandler.prototype.width = 0;

  CanvasHandler.prototype.height = 0;

  CanvasHandler.rows = 0;

  CanvasHandler.columns = 0;

  function CanvasHandler(canvasElement, gridLength) {
    this.canvasElement = canvasElement != null ? canvasElement : {};
    if (gridLength == null) {
      gridLength = 10;
    }
    if (!this.canvasElement.getContext) {
      this.canvasElement = void 0;
    } else {
      this.rows = this.columns = gridLength;
      this.context = this.canvasElement.getContext("2d");
      this.prepareCanvas();
    }
  }

  CanvasHandler.prototype.prepareCanvas = function() {
    if (this.canvasElement != null) {
      this.width || (this.width = jQuery(this.canvasElement).width());
      this.height || (this.height = jQuery(this.canvasElement).height());
      this.cellWidth || (this.cellWidth = this.width / this.columns);
      this.cellHeight || (this.cellHeight = this.height / this.rows);
      return this.context.clearRect(0, 0, this.width, this.height);
    }
  };

  CanvasHandler.prototype.renderCell = function(cell) {
    var x, y;
    if (this.canvasElement != null) {
      x = cell.currentState.x;
      y = cell.currentState.y;
      if (cell.draw === false) {
        this.context.clearRect(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight);
      }
      if (cell.draw === true) {
        this.context.fillStyle = cell.currentState.color;
        this.roundRect(this.context, (x * this.cellWidth) + 1, (y * this.cellHeight) + 1, this.cellWidth - 2, this.cellHeight - 2, 2);
      }
    }
  };

  CanvasHandler.prototype.roundRect = function(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  return CanvasHandler;

})();

this.App.Cell = (function() {
  Cell.prototype.defaultState = {
    alive: false,
    x: 0,
    y: 0,
    color: "#EEEEEE"
  };

  Cell.prototype.nextState = {};

  Cell.prototype.currentState = {};

  Cell.prototype.draw = false;

  Cell.prototype.changed = false;

  function Cell(options) {
    var key, value, _ref, _ref1;
    if (options == null) {
      options = {};
    }
    _ref = this.defaultState;
    for (key in _ref) {
      value = _ref[key];
      this.currentState[key] = value;
    }
    for (key in options) {
      value = options[key];
      this.currentState[key] = value;
    }
    _ref1 = this.currentState;
    for (key in _ref1) {
      value = _ref1[key];
      this.setNextState(key, value);
    }
    this.setDrawStatus();
    return;
  }

  Cell.prototype.setDrawStatus = function() {
    if (this.currentState.alive === true) {
      this.draw = true;
      this.currentState.color = "#F2B4A8";
    }
  };

  Cell.prototype.age = function() {
    var key, value, _ref;
    this.draw = false;
    _ref = this.nextState;
    for (key in _ref) {
      value = _ref[key];
      if (this.currentState[key] !== this.nextState[key]) {
        this.changed = true;
      }
      this.currentState[key] = value;
    }
    if (this.currentState.alive === true) {
      return this.setDrawStatus();
    }
  };

  Cell.prototype.setNextState = function(key, value) {
    if (value == null) {
      value = void 0;
    }
    this.nextState[key] = value;
  };

  return Cell;

})();

this.App.cellFactory = {
  newCell: function(options, random) {
    if (options == null) {
      options = {};
    }
    if (random == null) {
      random = false;
    }
    if (random) {
      options.alive = Math.floor(Math.random() * 5) === 1;
    }
    return jQuery.extend(true, {}, new App.Cell(options));
  }
};

this.App || (this.App = {});

this.App.GameRunner = {
  defaultOptions: {
    generationLength: 0.7,
    generation: 0,
    active: false,
    gridLength: 10,
    randomBoard: false
  },
  cells: [],
  currentOptions: {},
  active: false,
  canvasHandler: void 0,
  cellFactory: void 0,
  init: function(canvasHandler, cellFactory, options) {
    var key, value, _ref;
    this.canvasHandler = canvasHandler;
    this.cellFactory = cellFactory;
    if (options == null) {
      options = {};
    }
    _ref = this.defaultOptions;
    for (key in _ref) {
      value = _ref[key];
      this.setOption(key, value);
    }
    for (key in options) {
      value = options[key];
      this.setOption(key, value);
    }
    this.createCells();
    this.setupControlls();
    this.cycle();
  },
  reset: function() {
    var key, value, _ref;
    _ref = this.defaultOptions;
    for (key in _ref) {
      value = _ref[key];
      this.setOption(key, value);
    }
    this.cells = [];
  },
  setOption: function(key, value) {
    if (value == null) {
      value = void 0;
    }
    this.currentOptions[key] = value;
  },
  setupControlls: function(canvasElement) {
    this.setupPlayPauseButton();
    this.setupClearButton();
    return this.setupAddCellByClicking();
  },
  setupPlayPauseButton: function() {
    var _this = this;
    return jQuery("#play_pause").click(function(e) {
      if (!_this.currentOptions.active) {
        _this.currentOptions.active = true;
        jQuery(e.target).html("Pause");
        _this.play();
        return;
      }
      _this.currentOptions.active = false;
      jQuery(e.target).html("Run");
    });
  },
  setupClearButton: function() {
    var _this = this;
    return jQuery("#clear").click(function(e) {
      var cell, _i, _len, _ref;
      _ref = _this.cellList();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cell = _ref[_i];
        cell.nextState.alive = false;
        cell.age();
      }
      _this.cycle();
    });
  },
  setupAddCellByClicking: function() {
    var _this = this;
    return jQuery(this.canvasHandler.canvasElement).click(function(e) {
      var canvasElement, cellHeight, cellWidth, clickX, clickY, parentOffset, x, y;
      canvasElement = e.target;
      parentOffset = jQuery(canvasElement).offset();
      cellWidth = jQuery(canvasElement).width() / _this.currentOptions.gridLength;
      cellHeight = jQuery(canvasElement).height() / _this.currentOptions.gridLength;
      clickX = e.pageX;
      clickY = e.pageY;
      x = Math.floor((clickX - parentOffset.left) / cellWidth);
      y = Math.floor((clickY - parentOffset.top) / cellHeight);
      _this.createAndToggleCell(x, y);
    });
  },
  createAndToggleCell: function(x, y) {
    var cell;
    cell = this.cells[y][x];
    if (!cell.currentState.alive) {
      cell.nextState.alive = true;
    } else {
      cell.nextState.alive = false;
    }
    cell.age();
    if (this.canvasHandler != null) {
      this.canvasHandler.renderCell(cell);
    }
  },
  createCells: function() {
    var cell, cells_row, x_pos, y_pos, _results;
    if (this.cellFactory != null) {
      _results = [];
      while (this.cells.length < this.currentOptions.gridLength) {
        cells_row = [];
        while (cells_row.length < this.currentOptions.gridLength) {
          y_pos = this.cells.length;
          x_pos = cells_row.length;
          cell = this.cellFactory.newCell({
            x: x_pos,
            y: y_pos
          }, this.currentOptions.randomBoard);
          cells_row[cells_row.length] = cell;
        }
        _results.push(this.cells.push(cells_row));
      }
      return _results;
    }
  },
  cellList: function() {
    return jQuery.map(this.cells, function(i) {
      return i;
    });
  },
  play: function() {
    var _this = this;
    _this = App.GameRunner;
    if (_this.currentOptions.active) {
      setTimeout((function() {
        window.requestAnimFrame(_this.play);
      }), _this.currentOptions.generationLength * 1000);
      _this.cycle();
    }
  },
  cycle: function() {
    var cell, neighbors, _i, _j, _len, _len1, _ref, _ref1;
    this.canvasHandler.prepareCanvas();
    _ref = this.cellList();
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      cell = _ref[_i];
      if (cell.draw === true) {
        this.canvasHandler.renderCell(cell);
      }
      neighbors = this.getAllNeighbors(cell.currentState.x, cell.currentState.y);
      if (neighbors === 2 && cell.currentState.alive === true) {
        cell.setNextState('alive', true);
      }
      if (neighbors >= 4 || neighbors < 2) {
        cell.setNextState('alive', false);
      }
      if (neighbors === 3) {
        cell.setNextState('alive', true);
      }
    }
    _ref1 = this.cellList();
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      cell = _ref1[_j];
      cell.age();
    }
    this.currentOptions.generation++;
  },
  getAllNeighbors: function(x, y) {
    return this.getPerpendicularNeighbors(x, y) + this.getDiagonalNeighbors(x, y);
  },
  getPerpendicularNeighbors: function(x, y, i) {
    if (i == null) {
      i = 0;
    }
    if ((this.cells[y - 1] != null) && this.cells[y - 1][x].currentState.alive === true) {
      i++;
    }
    if ((this.cells[y + 1] != null) && this.cells[y + 1][x].currentState.alive === true) {
      i++;
    }
    if ((this.cells[y][x - 1] != null) && this.cells[y][x - 1].currentState.alive === true) {
      i++;
    }
    if ((this.cells[y][x + 1] != null) && this.cells[y][x + 1].currentState.alive === true) {
      i++;
    }
    return i;
  },
  getDiagonalNeighbors: function(x, y, i) {
    if (i == null) {
      i = 0;
    }
    if (this.cells[y + 1] && (this.cells[y + 1][x + 1] != null) && this.cells[y + 1][x + 1].currentState.alive === true) {
      i++;
    }
    if (this.cells[y + 1] && (this.cells[y + 1][x - 1] != null) && this.cells[y + 1][x - 1].currentState.alive === true) {
      i++;
    }
    if (this.cells[y - 1] && (this.cells[y - 1][x + 1] != null) && this.cells[y - 1][x + 1].currentState.alive === true) {
      i++;
    }
    if (this.cells[y - 1] && (this.cells[y - 1][x - 1] != null) && this.cells[y - 1][x - 1].currentState.alive === true) {
      i++;
    }
    return i;
  }
};

console.log(window.js_buildtime);

window.App = this.App || (this.App = {});

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();
