// Translatify
// Author: Bryan Jennings
// Dependencies: Bootstrap, jQuery

// Add the styling dynamically so that the user can import just a single script tag.
$(`<style>
  .translatify-mouseout {
    background-color: white;
  }
  .translatify-mouseover {
    background-color: cyan;
  }
  .translatify-click {
    background-color: #004dff;
  }
</style>`).appendTo($('head'));

function translatify(dictionaries) {

  function initTooltip(dictionaries, text) {
    var wordTranslations = [];

    if (!Array.isArray(dictionaries)) {
      dictionaries = [dictionaries];
    }

    for (var start = 0; start < text.length; start++) {
      for (var wordLength = Math.min(10, text.length - start); wordLength >= 1; wordLength--) {
        var word = text.slice(start, start + wordLength);

        // Cycle through dictionaries and get the first translation.
        var translation;
        for (var i = 0; i < dictionaries.length; i++) {
          var dictionary = dictionaries[i];
          translation = dictionary[word];
          if (translation) {
            break;
          }
        }

        // If there's a translation, wrap it in a tooltip span tag and go to the next word.
        if (translation) {
          var wordTranslation =
            $('<span class="translatified-span" data-toggle="tooltip" title="' + word + ' [' +
                translation.pronunciation + '] ' +
                translation.translation +
              '">' + word + '</span>');
          wordTranslations.push(wordTranslation);
          start += wordLength - 1; // Skip over the translated word.
          break;
        }
      }
    }

    return wordTranslations;
  }



  function clearClasses($element) {
    // I probably shouldn't hardcode these...
    return $element
      .removeClass('translatify-mouseout')
      .removeClass('translatify-mouseover')
      .removeClass('translatify-click');
  }

  function setClass($element, addedClass) {
    return clearClasses($element).addClass(addedClass);
  }

  $('.translatify').each(function(index, element) {
    var $element = $(element);
    el = $(element);
    var tooltippedArray = initTooltip(dictionaries, $element.text());
    $element.html('');
    tooltippedArray.forEach(function($tooltippedElement) {
      $element
        .append($tooltippedElement.tooltip()
          .on('mouseover', function() {
            setClass($(this), 'translatify-mouseover');
          }).on('mouseout', function() {
            setClass($(this), 'translatify-mouseout');
          }).on('click', function() {
            setClass($(this), 'translatify-click');
          })
        );
    });
  });
}
