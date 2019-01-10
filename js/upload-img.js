'use strict';

(function () {
  window.uploadImg = {
    Filters: {
      CHROME: {
        className: 'effects__preview--chrome',
        minValueFilter: 0,
        maxValueFilter: 1,
        cssFilter: function (valueSliderPin) {
          var valueCssFilter = (this.maxValueFilter - this.minValueFilter) / PROPORTION_FACTOR * valueSliderPin + this.minValueFilter;
          return 'grayscale(' + valueCssFilter + ')';
        }
      },
      SEPIA: {
        className: 'effects__preview--sepia',
        minValueFilter: 0,
        maxValueFilter: 1,
        cssFilter: function (valueSliderPin) {
          var valueCssFilter = (this.maxValueFilter - this.minValueFilter) / PROPORTION_FACTOR * valueSliderPin + this.minValueFilter;
          return 'sepia(' + valueCssFilter + ')';
        }
      },
      MARVIN: {
        className: 'effects__preview--marvin',
        minValueFilter: 0,
        maxValueFilter: 100,
        cssFilter: function (valueSliderPin) {
          if (valueSliderPin === 0) {
            return 'invert(' + valueSliderPin + ')';
          }
          var valueCssFilter = (this.maxValueFilter - this.minValueFilter) / PROPORTION_FACTOR * valueSliderPin + this.minValueFilter;
          return 'invert(' + valueCssFilter + '%)';
        }
      },
      PHOBOS: {
        className: 'effects__preview--phobos',
        minValueFilter: 0,
        maxValueFilter: 3,
        cssFilter: function (valueSliderPin) {
          if (valueSliderPin === 0) {
            return 'invert(' + valueSliderPin + ')';
          }
          var valueCssFilter = (this.maxValueFilter - this.minValueFilter) / PROPORTION_FACTOR * valueSliderPin + this.minValueFilter;
          return 'blur(' + valueCssFilter + 'px)';
        }
      },
      HEAT: {
        className: 'effects__preview--heat',
        minValueFilter: 1,
        maxValueFilter: 3,
        cssFilter: function (valueSliderPin) {
          var valueCssFilter = (this.maxValueFilter - this.minValueFilter) / PROPORTION_FACTOR * valueSliderPin + this.minValueFilter;
          return 'brightness(' + valueCssFilter + ')';
        }
      },
      SCALE: {
        minValueFilter: 25,
        maxValueFilter: 100,
        cssFilter: function (valueScale) {
          return 'scale(' + valueScale / PROPORTION_FACTOR + ')';
        }
      },
      NONE: {
        hideSlider: true
      }
    },
  };

  var SCALE_VALUE_DEFAULT = 100;
  var PROPORTION_FACTOR = 100;
  var TAG_NAME_FOR_DELEGATION_FILTER = 'SPAN';
  var NAME_DEFAULT_FILTER = 'CHROME';
  var VALUE_DEFAULT_SLIDER = 20;
  var MAX_VALUE_SLIDER = 100;
  var MIN_VALUE_SLIDER = 0;

  var Identifiers = {
    FORM_UPLOAD_FILE: '#upload-file',
    COMMENTS: 'comments',
    HASHTAGS: 'hashtags',
  };

  var Selectors = {
    SCALE_BIGGER: '.scale__control--bigger',
    SCALE_SMALLER: '.scale__control--smaller',
    FILTER_LIST: '.effects__list',
    IMG_UPLOAD_EXIT: '.img-upload__cancel',
    IMG_UPLOAD_OVERLAY: '.img-upload__overlay',
    INPUT_HASHTAGS: '.text__hashtags',
    INPUT_COMMENTS: '.text__description',
    UPLOAD_IMG: '.img-upload__preview img',
    SLIDER_LINE: '.effect-level__line',
    SLIDER: '.img-upload__effect-level',
    SLIDER_DEPTH_IDENTIFIER: '.effect-level__depth',
    SLIDER_PIN: '.effect-level__pin',
    EFFECT_LEVEL_VALUE: '.effect-level__value',
  };

  var formUploadFile = document.querySelector(Identifiers.FORM_UPLOAD_FILE);
  var formChangeUploadFileExit = document.querySelector(Selectors.IMG_UPLOAD_EXIT);
  var filterList = document.querySelector(Selectors.FILTER_LIST);
  var scaleControlSmaller = document.querySelector(Selectors.SCALE_SMALLER);
  var scaleControlBigger = document.querySelector(Selectors.SCALE_BIGGER);
  var formChangeUploadFile = document.querySelector(Selectors.IMG_UPLOAD_OVERLAY);
  var filterSliderBar = formChangeUploadFile.querySelector(Selectors.SLIDER_LINE);
  var slider = formChangeUploadFile.querySelector(Selectors.SLIDER);
  var pinSlider = formChangeUploadFile.querySelector(Selectors.SLIDER_PIN);
  var filterSliderDepthIdentifier = formChangeUploadFile.querySelector(Selectors.SLIDER_DEPTH_IDENTIFIER);
  var filterInputLevelValue = formChangeUploadFile.querySelector(Selectors.EFFECT_LEVEL_VALUE);
  window.uploadImg.uploadImgPreview = formChangeUploadFile.querySelector(Selectors.UPLOAD_IMG);
  window.uploadImg.inputHashtags = formChangeUploadFile.querySelector(Selectors.INPUT_HASHTAGS);
  window.uploadImg.inputComments = formChangeUploadFile.querySelector(Selectors.INPUT_COMMENTS);

  var removeClassHidden = function () {
    if (slider.classList.contains(window.utils.CLASS_HIDDEN)) {
      slider.classList.remove(window.utils.CLASS_HIDDEN);
    }
  };

  var currentFilter = NAME_DEFAULT_FILTER;

  var onChangeFilter = function (evt) {
    if (evt.target.tagName === TAG_NAME_FOR_DELEGATION_FILTER) {
      sliderCharacteristics = {};
      filterInputLevelValue.value = VALUE_DEFAULT_SLIDER;
      filterSliderDepthIdentifier.style.width = VALUE_DEFAULT_SLIDER + '%';
      pinSlider.style.left = VALUE_DEFAULT_SLIDER + '%';
      currentFilter = evt.target.id.toUpperCase();
      if (window.uploadImg.Filters[currentFilter].hideSlider) {
        slider.classList.add(window.utils.CLASS_HIDDEN);
        window.uploadImg.uploadImgPreview.style.filter = '';
        return window.uploadImg.uploadImgPreview;
      }
      removeClassHidden();
      filterInputLevelValue.value = MAX_VALUE_SLIDER;
      renderSlider(MAX_VALUE_SLIDER);
      sliderCharacteristics.changeValue = parseInt(filterInputLevelValue.value, 10);
      return window.uploadImg.uploadImgPreview;
    }
    return window.uploadImg.uploadImgPreview;
  };

  var renderSlider = function (value) {
    filterSliderDepthIdentifier.style.width = value + '%';
    pinSlider.style.left = value + '%';
    window.uploadImg.uploadImgPreview.style.filter = window.uploadImg.Filters[currentFilter].cssFilter(value);
  };

  var onChangeFilterPressEnter = function (evt) {
    if (evt.keyCode === window.utils.Keydown.ENTER) {
      onChangeFilter(evt);
    }
  };

  var sliderCharacteristics = {};
  var onSliderMouseDown = function (pinMouseDownEvt) {
    pinMouseDownEvt.preventDefault();
    if (pinMouseDownEvt.which !== 1) {
      return;
    }
    sliderCharacteristics.widthSliderBar = filterSliderBar.clientWidth;
    sliderCharacteristics.pinStartCoordinates = pinSlider.getBoundingClientRect().x;
    sliderCharacteristics.pinClickCoordinate = pinMouseDownEvt.offsetX;
    sliderCharacteristics.value = VALUE_DEFAULT_SLIDER;
    if (sliderCharacteristics.changeValue) {
      sliderCharacteristics.value = sliderCharacteristics.changeValue;
    }
    if (pinMouseDownEvt.target.closest(Selectors.SLIDER_PIN)) {
      var onSliderMouseMove = function (sliderMouseMoveEvt) {
        sliderMouseMoveEvt.preventDefault();
        var mouseStartPos = sliderCharacteristics.pinStartCoordinates + sliderCharacteristics.pinClickCoordinate;
        sliderCharacteristics.pinShift = sliderMouseMoveEvt.clientX - mouseStartPos;
        filterInputLevelValue.value = Math.round(sliderCharacteristics.pinShift * PROPORTION_FACTOR / sliderCharacteristics.widthSliderBar) + sliderCharacteristics.value;
        if (filterInputLevelValue.value < MIN_VALUE_SLIDER) {
          filterInputLevelValue.value = MIN_VALUE_SLIDER;
        }
        if (filterInputLevelValue.value > MAX_VALUE_SLIDER) {
          filterInputLevelValue.value = MAX_VALUE_SLIDER;
        }
        renderSlider(filterInputLevelValue.value);
      };

      var onPinSliderMouseup = function (pinMouseUpEvt) {
        pinMouseUpEvt.preventDefault();
        sliderCharacteristics.changeValue = parseInt(filterInputLevelValue.value, 10);
        document.removeEventListener('mousemove', onSliderMouseMove);
        document.removeEventListener('mouseup', onPinSliderMouseup);
      };
      document.addEventListener('mouseup', onPinSliderMouseup);
      document.addEventListener('mousemove', onSliderMouseMove);
      return;
    }
    if (pinMouseDownEvt.target.closest(Selectors.SLIDER_LINE)) {
      filterInputLevelValue.value = Math.round(pinMouseDownEvt.offsetX * PROPORTION_FACTOR / sliderCharacteristics.widthSliderBar);
      sliderCharacteristics.changeValue = parseInt(filterInputLevelValue.value, 10);
      renderSlider(filterInputLevelValue.value);
    }
    return;
  };

  var onCloseFormUploadFilePressEsc = function (evt) {
    if (evt.keyCode === window.utils.Keydown.ESC && document.activeElement.id !== Identifiers.COMMENTS && document.activeElement.id !== Identifiers.HASHTAGS) {
      onCloseFormUploadFile();
    }
  };

  var onCloseFormUploadFilePressEnter = function (evt) {
    if (evt.keyCode === window.utils.Keydown.ENTER) {
      onCloseFormUploadFile();
    }
  };

  var onOpenFormUploadFile = function () {
    sliderCharacteristics = {};
    formChangeUploadFile.classList.remove(window.utils.CLASS_HIDDEN);
    renderSlider(VALUE_DEFAULT_SLIDER);
    formChangeUploadFileExit.addEventListener('click', onCloseFormUploadFile);
    formChangeUploadFileExit.addEventListener('keydown', onCloseFormUploadFilePressEnter);
    document.addEventListener('keydown', onCloseFormUploadFilePressEsc);
    filterSliderBar.addEventListener('mousedown', onSliderMouseDown);
    filterList.addEventListener('click', onChangeFilter);
    filterList.addEventListener('keydown', onChangeFilterPressEnter);
    scaleControlBigger.addEventListener('click', window.scaleImg.onChangeScaleBigger);
    scaleControlSmaller.addEventListener('click', window.scaleImg.onChangeScaleSmaller);
    window.uploadImg.inputHashtags.addEventListener('input', window.validation.onHashtagValidation);
    window.uploadImg.inputComments.addEventListener('input', window.validation.onCommentValidation);
  };

  var onCloseFormUploadFile = function () {
    formChangeUploadFile.classList.add(window.utils.CLASS_HIDDEN);
    formUploadFile.value = null;
    filterInputLevelValue.value = VALUE_DEFAULT_SLIDER;
    currentFilter = NAME_DEFAULT_FILTER;
    window.scaleImg.scaleControlValue.value = SCALE_VALUE_DEFAULT + '%';
    window.uploadImg.uploadImgPreview.style = '';
    filterInputLevelValue.value = VALUE_DEFAULT_SLIDER;
    formChangeUploadFileExit.removeEventListener('click', onCloseFormUploadFile);
    formChangeUploadFileExit.removeEventListener('keydown', onCloseFormUploadFilePressEnter);
    document.removeEventListener('keydown', onCloseFormUploadFilePressEsc);
    filterList.removeEventListener('click', onChangeFilter);
    filterList.removeEventListener('keydown', onChangeFilterPressEnter);
    scaleControlBigger.removeEventListener('click', window.scaleImg.onChangeScaleBigger);
    scaleControlSmaller.removeEventListener('click', window.scaleImg.onChangeScaleSmaller);
    window.uploadImg.inputHashtags.removeEventListener('input', window.validation.onHashtagValidation);
    window.uploadImg.inputComments.removeEventListener('input', window.validation.onCommentValidation);
  };

  formUploadFile.addEventListener('change', onOpenFormUploadFile);
})();