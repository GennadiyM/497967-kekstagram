'use strict';
(function () {

  var MAX_HASHTAGS_COUNT = 5;
  var COMMENT_MAX_LENGTH = 140;
  var HASHTAG_MAX_LENGTH = 21;
  var HASHTAG_MIN_LENGTH = 1;
  var HASHTAG_FIRST_SYMBOL = '#';

  var errorMessageListMap = {
    START_ERROR: 'Хэш-тег должен начинаться с символа # (решётка)!',
    CONTENT_ERROR: 'Хеш-тег не может состоять только из одной решётки!',
    QUANTITY_ERROR: 'Количество хэш-тегов не может превышать ' + MAX_HASHTAGS_COUNT + '!',
    REPETITION_ERROR: 'Хеш-теги не могут быть одинаковым!',
    LENGTH_ERROR: 'Длин хэш-тега не может превышать ' + HASHTAG_MAX_LENGTH + ' символов!',
    COMMENT_ERROR: 'Длина комментария не может превышать ' + COMMENT_MAX_LENGTH + ' символов!',
    NO_ERROR: ''
  };

  var checkHashtags = function (hashtagsToArray) {
    if (hashtagsToArray.length > 0) {
      if (!hashtagsToArray[hashtagsToArray.length - 1]) {
        hashtagsToArray.pop();
      }
      if (hashtagsToArray.length > MAX_HASHTAGS_COUNT) {
        return errorMessageListMap.QUANTITY_ERROR;
      }
      for (var i = 0; i < hashtagsToArray.length; i++) {
        var hashtag = hashtagsToArray[i];
        for (var j = i + 1; j < hashtagsToArray.length; j++) {
          if (!hashtag.startsWith(HASHTAG_FIRST_SYMBOL)) {
            return errorMessageListMap.START_ERROR;
          }
          if (hashtag === hashtagsToArray[j]) {
            return errorMessageListMap.REPETITION_ERROR;
          }
        }
        if (!hashtag.startsWith(HASHTAG_FIRST_SYMBOL)) {
          return errorMessageListMap.START_ERROR;
        }
        if (hashtag.length === HASHTAG_MIN_LENGTH && hashtag === HASHTAG_FIRST_SYMBOL) {
          return errorMessageListMap.CONTENT_ERROR;
        }
        if (hashtag.length > HASHTAG_MAX_LENGTH) {
          return errorMessageListMap.LENGTH_ERROR;
        }
      }
      return errorMessageListMap.NO_ERROR;
    }
    return errorMessageListMap.NO_ERROR;
  };

  window.validation = {
    onHashtagValidation: function (evt) {
      evt.preventDefault();
      window.uploadImg.inputHashtags.setCustomValidity(errorMessageListMap.NO_ERROR);
      var hashtagsToArray = evt.target.value.toLowerCase().split(/\s+/);
      window.uploadImg.inputHashtags.setCustomValidity(checkHashtags(hashtagsToArray));
    },
    onCommentValidation: function (evt) {
      evt.preventDefault();
      if (window.uploadImg.inputComments.value.length > COMMENT_MAX_LENGTH) {
        window.uploadImg.inputComments.setCustomValidity(errorMessageListMap.COMMENT_ERROR);
      } else {
        window.uploadImg.inputComments.setCustomValidity('');
      }
    }
  };
})();
