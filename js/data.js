/**
 * Генерация данных для объявлений
 * Источник: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/from
 */

import { getRandomInteger, getRandomFloat, getRandomArrayElement, getRandomArraySubset } from './util.js';

// Фиксированные данные для генерации объявлений
const HOUSING_TYPES = ['palace', 'flat', 'house', 'hotel', 'bungalow'];
const CHECK_TIMES = ['12:00', '13:00', '14:00'];
const FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
const PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

const TITLES = [
  'Уютная квартира в центре',
  'Современный дом с садом',
  'Роскошный дворец для особых случаев',
  'Компактное бунгало у моря',
  'Элегантный отель с видом на город',
  'Просторная квартира для семьи',
  'Уютный дом в тихом районе',
  'Стильный отель в деловом центре',
  'Уютное бунгало в лесу',
  'Просторный дворец с бассейном'
];

const DESCRIPTIONS = [
  'Прекрасное место для отдыха и работы. Все удобства под рукой.',
  'Современный дизайн и комфорт. Идеально для семейного отдыха.',
  'Роскошные апартаменты с панорамным видом на город.',
  'Уютное жилье в тихом районе. Отличное место для релакса.',
  'Стильные интерьеры и все необходимое для комфортного проживания.',
  'Просторные комнаты и современная техника. Идеально для большой семьи.',
  'Уютный дом с садом. Отличное место для отдыха на природе.',
  'Элегантный отель с первоклассным сервисом и удобствами.',
  'Уютное бунгало в окружении природы. Идеально для уединения.',
  'Роскошный дворец с множеством удобств и развлечений.'
];

/**
 * Функция для генерации одного объекта объявления
 * @returns {Object} объект объявления
 */
export function generateAdvertisement() {
  const authorId = getRandomInteger(1, 10);
  const avatarId = authorId.toString().padStart(2, '0');

  const location = {
    x: getRandomFloat(35.65000, 35.70000, 5),
    y: getRandomFloat(139.70000, 139.80000, 5)
  };

  return {
    author: {
      avatar: `img/avatars/user${avatarId}.png`
    },
    offer: {
      title: getRandomArrayElement(TITLES),
      address: `${location.x}, ${location.y}`,
      price: getRandomInteger(1000, 100000),
      type: getRandomArrayElement(HOUSING_TYPES),
      rooms: getRandomInteger(1, 10),
      guests: getRandomInteger(1, 20),
      checkin: getRandomArrayElement(CHECK_TIMES),
      checkout: getRandomArrayElement(CHECK_TIMES),
      features: getRandomArraySubset(FEATURES, FEATURES.length),
      description: getRandomArrayElement(DESCRIPTIONS),
      photos: getRandomArraySubset(PHOTOS, PHOTOS.length)
    },
    location: location
  };
}

/**
 * Функция для генерации массива объявлений
 * @param {number} count - количество объявлений
 * @returns {Array} массив объявлений
 */
export function generateAdvertisements(count = 10) {
  return Array.from({ length: count }, generateAdvertisement);
}

// Генерируем массив из 10 объявлений
export const advertisements = generateAdvertisements(10);
