'use strict';

var MIN_LIKES = 15;
var MAX_LIKES = 200;
var COUNT_PICTURES = 25;
var MAX_COUNT_COMMENTS = 2;
var MIN_COUNT_COMMENTS = 1;
var MAX_COUNT_COMMENTS_IN_PAGE = 5;


var ID_TEMPLATE_PICTURE = '#picture';

var Selectors = {
  HIDDEN: 'hidden',
  PICT_IMG: 'picture__img',
  PICT_COMMENTS: 'picture__comments',
  PICT_LIKES: 'picture__likes',
  PICTURES_LIST: 'pictures',
  PICTURE: 'picture',
  SOCIAL_CAPTION: 'social__caption',
  SOCIAL_PICTURE: 'social__picture',
  SOCIAL_TEXT: 'social__text',
  TEMPLATE_SOCIAL_COMMENT: 'social__comment',
  COMMENTS_LIST: 'social__comments',
  LIKES_COUNT: 'likes-count',
  URL_BIG_PICTURE: 'big-picture__img img',
  BIG_PICTURE: 'big-picture',
};

var commentsMocks = ['Всё отлично!', 'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var getRandomElement = function (list) {
  return list[Math.floor(Math.random() * list.length)];
};

var DESCRIPTION = 'Описание фотографии';

var getRandomLikes = function () {
  return Math.floor(Math.random() * MAX_LIKES) + MIN_LIKES;
};

var generateMockingObject = function () {
  return {
    url: '',
    comments: [],
    likes: getRandomLikes()
  };
};

var generateMocks = function () {
  var mocks = [];
  for (var i = 0; i < COUNT_PICTURES; i++) {
    mocks.push(generateMockingObject());
    mocks[i].url = 'photos/' + (i + 1) + '.jpg';
    var randomFlag = Math.floor(Math.random() * (MAX_COUNT_COMMENTS + 1 - MIN_COUNT_COMMENTS) + MIN_COUNT_COMMENTS);
    for (var j = 1; j <= randomFlag; j++) {
      mocks[i].comments.push(getRandomElement(commentsMocks));
    }
  }
  return mocks;
};

var mockingData = generateMocks();

var templateUserPicture = document.querySelector(ID_TEMPLATE_PICTURE).content.querySelector('.' + Selectors.PICTURE);

var picturesList = document.querySelector('.' + Selectors.PICTURES_LIST);

for (var i = 0; i < mockingData.length; i++) {
  var cloneTemplateUserPicture = templateUserPicture.cloneNode(true);
  picturesList.appendChild(cloneTemplateUserPicture);
  cloneTemplateUserPicture.querySelector('.' + Selectors.PICT_IMG).src = mockingData[i].url;
  cloneTemplateUserPicture.querySelector('.' + Selectors.PICT_COMMENTS).textContent = String(mockingData[i].comments.length);
  cloneTemplateUserPicture.querySelector('.' + Selectors.PICT_LIKES).textContent = mockingData[i].likes;
}

var getBigPicture = function (numberPicture) {
  var bigPicture = document.querySelector('.' + Selectors.BIG_PICTURE);
  bigPicture.classList.remove(Selectors.HIDDEN);
  bigPicture.querySelector('.' + Selectors.URL_BIG_PICTURE).src = mockingData[numberPicture].url;
  bigPicture.querySelector('.' + Selectors.LIKES_COUNT).textContent = mockingData[numberPicture].likes;
  bigPicture.querySelector('.' + Selectors.SOCIAL_CAPTION).textContent = DESCRIPTION;
  var templateComment = bigPicture.querySelector('.' + Selectors.TEMPLATE_SOCIAL_COMMENT);
  var bigPictureCommentList = bigPicture.querySelector('.' + Selectors.COMMENTS_LIST);
  bigPictureCommentList.innerHTML = '';
  var cloneTemplateComment = null;
  if (mockingData[numberPicture].comments.length > MAX_COUNT_COMMENTS_IN_PAGE) {
    for (i = 0; i < MAX_COUNT_COMMENTS_IN_PAGE; i++) {
      cloneTemplateComment = templateComment.cloneNode(true);
      bigPictureCommentList.appendChild(cloneTemplateComment);
      cloneTemplateComment.querySelector('.' + Selectors.SOCIAL_PICTURE).src = 'img/avatar-' + (Math.floor(Math.random() * 6) + 1) + '.svg';
      cloneTemplateComment.querySelector('.' + Selectors.SOCIAL_TEXT).textContent = mockingData[numberPicture].comments[i];
    }
  } else {
    for (i = 0; i < mockingData[numberPicture].comments.length; i++) {
      cloneTemplateComment = templateComment.cloneNode(true);
      bigPictureCommentList.appendChild(cloneTemplateComment);
      cloneTemplateComment.querySelector('.' + Selectors.SOCIAL_PICTURE).src = 'img/avatar-' + (Math.floor(Math.random() * 6) + 1) + '.svg';
      cloneTemplateComment.querySelector('.' + Selectors.SOCIAL_TEXT).textContent = mockingData[numberPicture].comments[i];
    }
  }
};

document.querySelector('.social__comment-count').classList.add('visually-hidden');
document.querySelector('.comments-loader').classList.add('visually-hidden');

getBigPicture(Math.floor(Math.random() * COUNT_PICTURES));
