/**
 * Модуль для работы с интерактивной картой
 */

import { createCardElement } from './card.js';

// Координаты центра Токио
const TOKYO_CENTER = {
  lat: 35.652832,
  lng: 139.839478
};

// Координаты для главной метки (смещение от центра)
const MAIN_PIN_OFFSET = {
  lat: 0.005,
  lng: 0.005
};

// Настройки карты
const MAP_CONFIG = {
  zoom: 13,
  scrollWheelZoom: false
};

// Настройки главной метки
const MAIN_PIN_CONFIG = {
  iconSize: [52, 52],
  iconAnchor: [26, 52],
  popupAnchor: [0, -52]
};

// Настройки обычных меток
const PIN_CONFIG = {
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40]
};

let map = null;
let mainPinMarker = null;
let pinMarkers = [];

/**
 * Инициализация карты
 */
export function initMap() {
  // Переводим страницу в неактивное состояние
  setPageInactive();

  // Инициализируем карту
  map = L.map('map-canvas', MAP_CONFIG)
    .on('load', onMapLoad)
    .setView([TOKYO_CENTER.lat, TOKYO_CENTER.lng], MAP_CONFIG.zoom);

  // Добавляем слой карты
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // eslint-disable-next-line no-console
  console.log('Карта инициализирована');
}

/**
 * Обработчик загрузки карты
 */
function onMapLoad() {
  // Переводим страницу в активное состояние
  setPageActive();

  // Добавляем главную метку
  addMainPin();

  // eslint-disable-next-line no-console
  console.log('Карта загружена, страница активирована');
}

/**
 * Переводит страницу в неактивное состояние
 */
function setPageInactive() {
  document.body.classList.add('page--inactive');

  // Делаем поле адреса недоступным для редактирования
  const addressInput = document.querySelector('#address');
  if (addressInput) {
    addressInput.setAttribute('readonly', 'readonly');
  }
}

/**
 * Переводит страницу в активное состояние
 */
function setPageActive() {
  document.body.classList.remove('page--inactive');

  // Поле адреса остается readonly, но доступно для отправки
  const addressInput = document.querySelector('#address');
  if (addressInput) {
    addressInput.removeAttribute('readonly');
  }
}

/**
 * Создает иконку для метки
 * @param {string} iconUrl - URL иконки
 * @param {Object} config - конфигурация иконки
 * @returns {L.Icon} объект иконки Leaflet
 */
function createIcon(iconUrl, config) {
  return L.icon({
    iconUrl: iconUrl,
    iconSize: config.iconSize,
    iconAnchor: config.iconAnchor,
    popupAnchor: config.popupAnchor
  });
}

/**
 * Добавляет главную метку на карту
 */
export function addMainPin() {
  if (!map) {
    // eslint-disable-next-line no-console
    console.error('Карта не инициализирована');
    return;
  }

  const mainPinIcon = createIcon('img/main-pin.svg', MAIN_PIN_CONFIG);

  const mainPinPosition = [
    TOKYO_CENTER.lat + MAIN_PIN_OFFSET.lat,
    TOKYO_CENTER.lng + MAIN_PIN_OFFSET.lng
  ];

  mainPinMarker = L.marker(mainPinPosition, {
    icon: mainPinIcon,
    draggable: true
  }).addTo(map);

  // Обработчик перемещения главной метки
  mainPinMarker.on('moveend', onMainPinMove);

  // Устанавливаем начальный адрес
  updateAddressField(mainPinPosition);

  // eslint-disable-next-line no-console
  console.log('Главная метка добавлена');
}

/**
 * Обработчик перемещения главной метки
 * @param {Event} evt - событие перемещения
 */
function onMainPinMove(evt) {
  const position = evt.target.getLatLng();
  updateAddressField([position.lat, position.lng]);
}

/**
 * Обновляет поле адреса
 * @param {Array} coordinates - координаты [lat, lng]
 */
function updateAddressField(coordinates) {
  const addressInput = document.querySelector('#address');
  if (addressInput) {
    const [lat, lng] = coordinates;
    addressInput.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

/**
 * Добавляет метки объявлений на карту
 * @param {Array} advertisements - массив объявлений
 */
export function addAdvertisementPins(advertisements) {
  if (!map) {
    // eslint-disable-next-line no-console
    console.error('Карта не инициализирована');
    return;
  }

  // Очищаем существующие метки
  clearAdvertisementPins();

  const pinIcon = createIcon('img/pin.svg', PIN_CONFIG);

  advertisements.forEach((advertisement) => {
    const { location, offer } = advertisement;

    if (location && location.x && location.y) {
      const marker = L.marker([location.x, location.y], {
        icon: pinIcon
      }).addTo(map);

      // Создаем попап с информацией об объявлении
      const popupContent = createCardElement(advertisement);
      marker.bindPopup(popupContent, {
        maxWidth: 400,
        className: 'map__popup'
      });

      pinMarkers.push(marker);
    }
  });

  // eslint-disable-next-line no-console
  console.log(`Добавлено ${pinMarkers.length} меток объявлений`);
}

/**
 * Очищает все метки объявлений
 */
export function clearAdvertisementPins() {
  pinMarkers.forEach(marker => map.removeLayer(marker));
  pinMarkers = [];
}

/**
 * Получает координаты главной метки
 * @returns {Array|null} координаты [lat, lng] или null
 */
export function getMainPinCoordinates() {
  if (mainPinMarker) {
    const position = mainPinMarker.getLatLng();
    return [position.lat, position.lng];
  }
  return null;
}

/**
 * Устанавливает координаты главной метки
 * @param {Array} coordinates - координаты [lat, lng]
 */
export function setMainPinCoordinates(coordinates) {
  if (mainPinMarker && coordinates) {
    const [lat, lng] = coordinates;
    mainPinMarker.setLatLng([lat, lng]);
    updateAddressField(coordinates);
  }
}

/**
 * Закрывает все открытые попапы
 */
export function closeAllPopups() {
  if (map) {
    map.closePopup();
  }
}
