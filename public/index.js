translatify([dictionary]);

var $wordTable = $('#word-table');
var $wordList = $('#word-list');


function styleWord(word) {
  return $('<tr><td>' + word.text + '</td><td>' + 
    word.pronunciation + '</td><td>' +
    word.translation + '</td><td class="remove-button"><button>&times;</button></td></tr>');
}

function formatText(text) {
  var word = {
    text: text,
    pronunciation: dictionary[text].pronunciation,
    translation: dictionary[text].translation
  };
  return word;
}

function addWord(text) {
  var word = formatText(text);

  $.post('/api/user/' + state.userId + '/words', {word: text})
  .done(function() {
    $wordTable.show();
    $wordList.append(styleWord(word));
  })
  .fail(function(err) {
    console.log(err);
  });
}

function init() {
  var state = {
    userId: null
  };

  $('.translatify > span').on('click', function() {
    addWord($(this).text());
  });

  $('#word-table').on('click', '.remove-button', function() {
    console.log('removing...')
    var $tr = $($(this).closest('tr'));
    var index = $tr.index();
    $.ajax({
      method: 'delete',
      url: '/api/user/' + state.userId + '/words/' + index,
      success: function() {
        $tr.remove();
      },
      error: function(err) {
        console.log(err);
      }
    });
  });

  $.get('/api/user')
  .done(function(users) {
    if (users.length > 0) {
      state.userId = users[0]._id;
      $.get('/api/user/' + state.userId + '/words')
      .done(function(words) {
        if (words.length > 0) {
          $wordTable.show();
          words.forEach(function(word) {
            $wordList.append(styleWord(formatText(word)));
          });
        }
      })
      .fail(function(err) {
        console.log(err);
      });
    }
  })
  .fail(function(err) {
    console.log(err);
  });

  $wordTable.hide();
  return state;
}

var state = init();