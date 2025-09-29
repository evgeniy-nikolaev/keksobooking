/**
 * Модуль для генерации разметки карточек объявлений
 */

// Маппинг типов жилья на русские названия
const HOUSING_TYPE_MAP = {
  'flat': 'Квартира',
  'bungalow': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец',
  'hotel': 'Отель'
};

/**
 * Создает DOM-элемент карточки объявления на основе данных
 * @param {Object} advertisement - объект объявления
 * @returns {HTMLElement} DOM-элемент карточки
 */
export function createCardElement(advertisement) {
  const template = document.querySelector('#card');
  const cardElement = template.content.cloneNode(true);

  const { author, offer } = advertisement;

  // Заполняем заголовок
  const titleElement = cardElement.querySelector('.popup__title');
  if (offer.title) {
    titleElement.textContent = offer.title;
  } else {
    titleElement.parentElement.style.display = 'none';
  }

  // Заполняем адрес
  const addressElement = cardElement.querySelector('.popup__text--address');
  if (offer.address) {
    addressElement.textContent = offer.address;
  } else {
    addressElement.parentElement.style.display = 'none';
  }

  // Заполняем цену
  const priceElement = cardElement.querySelector('.popup__text--price');
  if (offer.price) {
    priceElement.textContent = `${offer.price} ₽/ночь`;
  } else {
    priceElement.parentElement.style.display = 'none';
  }

  // Заполняем тип жилья
  const typeElement = cardElement.querySelector('.popup__type');
  if (offer.type && HOUSING_TYPE_MAP[offer.type]) {
    typeElement.textContent = HOUSING_TYPE_MAP[offer.type];
  } else {
    typeElement.style.display = 'none';
  }

  // Заполняем количество комнат и гостей
  const capacityElement = cardElement.querySelector('.popup__text--capacity');
  if (offer.rooms && offer.guests) {
    capacityElement.textContent = `${offer.rooms} комнаты для ${offer.guests} гостей`;
  } else {
    capacityElement.parentElement.style.display = 'none';
  }

  // Заполняем время заезда и выезда
  const timeElement = cardElement.querySelector('.popup__text--time');
  if (offer.checkin && offer.checkout) {
    timeElement.textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;
  } else {
    timeElement.parentElement.style.display = 'none';
  }

  // Заполняем удобства
  const featuresList = cardElement.querySelector('.popup__features');
  if (offer.features && offer.features.length > 0) {
    // Очищаем список удобств
    featuresList.innerHTML = '';

    // Добавляем доступные удобства
    offer.features.forEach(feature => {
      const featureElement = document.createElement('li');
      featureElement.className = `popup__feature popup__feature--${feature}`;
      featuresList.appendChild(featureElement);
    });
  } else {
    featuresList.style.display = 'none';
  }

  // Заполняем описание
  const descriptionElement = cardElement.querySelector('.popup__description');
  if (offer.description) {
    descriptionElement.textContent = offer.description;
  } else {
    descriptionElement.style.display = 'none';
  }

  // Заполняем фотографии
  const photosContainer = cardElement.querySelector('.popup__photos');
  if (offer.photos && offer.photos.length > 0) {
    // Очищаем контейнер фотографий
    photosContainer.innerHTML = '';

    // Добавляем фотографии
    offer.photos.forEach(photoUrl => {
      const photoElement = document.createElement('img');
      photoElement.src = photoUrl;
      photoElement.className = 'popup__photo';
      photoElement.width = 45;
      photoElement.height = 40;
      photoElement.alt = 'Фотография жилья';
      photosContainer.appendChild(photoElement);
    });
  } else {
    photosContainer.style.display = 'none';
  }

  // Заполняем аватар пользователя
  const avatarElement = cardElement.querySelector('.popup__avatar');
  if (author && author.avatar) {
    avatarElement.src = author.avatar;
  } else {
    avatarElement.style.display = 'none';
  }

  return cardElement;
}

/**
 * Создает массив DOM-элементов карточек для всех объявлений
 * @param {Array} advertisements - массив объявлений
 * @returns {Array} массив DOM-элементов карточек
 */
export function createCardElements(advertisements) {
  return advertisements.map(advertisement => createCardElement(advertisement));
}

/**
 * Отрисовывает карточку объявления в указанном контейнере
 * @param {HTMLElement} container - контейнер для отображения
 * @param {Object} advertisement - объект объявления
 */
export function renderCard(container, advertisement) {
  const cardElement = createCardElement(advertisement);
  container.appendChild(cardElement);
}

/**
 * Отрисовывает все карточки объявлений в указанном контейнере
 * @param {HTMLElement} container - контейнер для отображения
 * @param {Array} advertisements - массив объявлений
 */
export function renderAllCards(container, advertisements) {
  // Очищаем контейнер
  container.innerHTML = '';

  // Отрисовываем все карточки
  advertisements.forEach(advertisement => {
    renderCard(container, advertisement);
  });
}
