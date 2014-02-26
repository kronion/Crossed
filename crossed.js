var test = [['h','e','-','l','o'],['w','o','r','l','d']];
var solution = [];
var x;
var y;
var minutes;
var seconds;
var interval;
var redraw;

/* Handle arrow keys */
window.onkeydown = function (e) {
  if (e.which == 37 && __legalSpace(y, x-1)) {
    __unhighlight();
    x -= 1;
    __highlight();
  }
  else if (e.which == 38 && __legalSpace(y-1, x)) {
    __unhighlight();
    y -= 1;
    __highlight();
  }
  else if (e.which == 39 && __legalSpace(y, x+1)) {
    __unhighlight();
    x += 1;
    __highlight();
  }
  else if (e.which == 40 && __legalSpace(y+1, x)) {
    __unhighlight();
    y += 1;
    __highlight();
  }
  else if (64 < e.which && e.which < 91 || e.which == 32) {
    __unhighlight();
    __insertChar(String.fromCharCode(e.which));
    __highlight();
  }

}

/* Creates a new game board (should only be called once) */
function start () {
  for (var i = 0; i < test.length; i++) {
    var tr = "<tr>";
    for (var j = 0; j < test[i].length; j++) {
      tr += '<td id="td' + i + j + '"><p id="' + i + j + '"></p></td>'; 
    }
    tr += '</tr>';
    $('#table').append(tr);
    solution.push([]);
  }
  for (var i = 0; i < test.length; i++) {
    for (var j = 0; j < test[i].length; j++) {
      if (test[i][j] === '-') {
        $('#td' + i + j).css({ 'background-color': '#000' });
        solution[i][j] = '-';
      }
    }
  }
  x = 0;
  y = 0;
  minutes = 0;
  seconds = 0;
  
  $('#time').text(minutes + ':' + ('0' + seconds).slice(-2));
  interval = setInterval(__updateTime, 1000);

  __highlight();
  $('#start').hide();
  $('form[name="character"]').show();
  $('#hint').show();
  $('#restart').show();
}

/* Clears all cells of the game board */
function restart() {
  for (var i = 0; i < test.length; i++) {
    for (var j = 0; j < test[i].length; j++) {
      $('#' + i + j).text($('#' + i + j).text().replace(/./g, ''));
      if (solution[i][j] !== '-') {
        solution[i][j] = '';
      }
    }
  }
  __unhighlight();
  x = 0;
  y = 0;
  __highlight();

  clearInterval(interval);
  minutes = 0;
  seconds = 0;
  $('#time').text(minutes + ':' + ('0' + seconds).slice(-2));
  interval = setInterval(__updateTime, 1000);

  $('input').each(function () {
    $(this).removeAttr('disabled');
  });
}

function checkComplete() {
  if (solution.length !== test.length) {
    return false;
  }
  for (var i = 0; i < solution.length; i++) {
    if (solution[i].length !== test[i].length) {
      return false;
    }
    for (var j = 0; j < solution[i].length; j++) {
      if (!__checkSpace(i, j)) {
        return false;
      }
    }
  }  
  return true;
}

function hint() {
  clearTimeout(redraw);
  for (var i = 0; i < solution.length; i++) {
    for (var j = 0; j < solution[i].length; j++) {
      if (__legalSpace(i,j) && !__checkSpace(i,j)) {
        $('#td' + i + j).css({ "background-color" : "#f48d8d" });
      }
      else if (__legalSpace(i,j) && __checkSpace(i,j)) {
        $('#td' + i + j).css({ "background-color" : "#fff" });
      }
    }
    if (solution[i].length < test[i].length) {
      for (var j = solution[i].length; j < test[i].length; j++) {
        if (__legalSpace(i,j)) {
          $('#td' + i + j).css({ "background-color" : "#f48d8d" });
        }
      }
    }
  }
  if (solution.length < test.length) {
    for (var i = solution.length; i < test.length; i++) {
      for (var j = 0; j < test[i].length; j++) {
        if (__legalSpace(i,j)) {
          $('#td' + i + j).css({ "background-color" : "#f48d8d" });
        }
      }
    }
  }
  redraw = setTimeout(function () {
    for (var i = 0; i < test.length; i++) {
      for (var j = 0; j < test[i].length; j++) {
        if (__legalSpace(i,j)) {
          $('#td' + i + j).css({ "background-color" : "#fff" });
        }
      }
    }
    __highlight();
  }, 3000);
}

function __insertChar(character) {
  if (character == undefined) {
    character = $('#characterInput').val();
  }
  if (character === " " || isNaN(character)) {
    $('#' + y + x).text($('#' + y + x).text().replace(/./g, ''));
    $('#' + y + x).append(character);
    $('#characterInput').val('');
    solution[y][x] = character;
    if (checkComplete()) {
      clearInterval(interval);
      $('input').each(function () {
        $(this).attr('disabled', 'true');
      });
    }
  }
  return false;
}

function __unhighlight() {
  clearTimeout(redraw);
  for (var i = 0; i < test.length; i++) {
    for (var j = 0; j < test[i].length; j++) {
      if (__legalSpace(i,j)) {
        $("#td" + i + j).css({ "background-color": "#fff" });
      }
    }
  }
}

function __highlight() {
  $("#td" + y + x).css({ "background-color": "#e6e6e6" });
}

function __legalSpace(i,j) {
  if (i < 0 || i >= test.length) {
    return false;
  }
  if (j < 0 || j >= test[i].length) {
    return false;
  }
  if (test[i][j] === '-') {
    return false;
  }
  return true;
}

function __updateTime() {
  seconds = seconds + 1;
  if (seconds == 60) {
    minutes += 1;
    seconds = 0;
  }
  $('#time').text(minutes + ':' + ('0' + seconds).slice(-2));
}

function __checkSpace(i, j) {
  if (solution[i][j] && test[i][j].toUpperCase() === solution[i][j].toUpperCase()) {
    return true;
  }
  return false;
}
