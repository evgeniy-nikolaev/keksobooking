/**
 * Утилитарные функции для проекта Кексобукинг
 * Источник: https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/random
 */

/**
 * Функция, возвращающая случайное целое число из переданного диапазона включительно
 * @param {number} min - минимальное значение диапазона
 * @param {number} max - максимальное значение диапазона
 * @returns {number} случайное целое число из диапазона
 */
export function getRandomInteger(min, max) {
  // Проверяем, что переданные значения являются числами
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Аргументы должны быть числами');
  }

  // Проверяем, что диапазон положительный
  if (min < 0 || max < 0) {
    throw new Error('Диапазон должен быть положительным');
  }

  // Если min больше max, меняем их местами
  if (min > max) {
    [min, max] = [max, min];
  }

  // Если min равен max, возвращаем это значение
  if (min === max) {
    return min;
  }

  // Генерируем случайное число из диапазона включительно
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Функция для проверки максимальной длины строки
 * @param {string} string - проверяемая строка
 * @param {number} maxLength - максимальная длина
 * @returns {boolean} true, если строка проходит по длине, false - если не проходит
 */
export function checkStringLength(string, maxLength) {
  // Проверяем, что строка является строкой
  if (typeof string !== 'string') {
    throw new Error('Первый аргумент должен быть строкой');
  }

  // Проверяем, что maxLength является числом
  if (typeof maxLength !== 'number') {
    throw new Error('Второй аргумент должен быть числом');
  }

  // Проверяем, что maxLength положительное число
  if (maxLength < 0) {
    throw new Error('Максимальная длина должна быть положительным числом');
  }

  return string.length <= maxLength;
}

/**
 * Функция, возвращающая случайное число с плавающей точкой из переданного диапазона включительно
 * @param {number} min - минимальное значение диапазона
 * @param {number} max - максимальное значение диапазона
 * @param {number} decimals - количество знаков после запятой
 * @returns {number} случайное число с плавающей точкой из диапазона
 */
export function getRandomFloat(min, max, decimals) {
  // Проверяем, что переданные значения являются числами
  if (typeof min !== 'number' || typeof max !== 'number' || typeof decimals !== 'number') {
    throw new Error('Все аргументы должны быть числами');
  }

  // Проверяем, что диапазон положительный
  if (min < 0 || max < 0) {
    throw new Error('Диапазон должен быть положительным');
  }

  // Проверяем, что количество знаков после запятой неотрицательное
  if (decimals < 0) {
    throw new Error('Количество знаков после запятой должно быть неотрицательным');
  }

  // Если min больше max, меняем их местами
  if (min > max) {
    [min, max] = [max, min];
  }

  // Если min равен max, возвращаем это значение с нужным количеством знаков
  if (min === max) {
    return parseFloat(min.toFixed(decimals));
  }

  // Генерируем случайное число из диапазона включительно
  const randomNumber = Math.random() * (max - min) + min;

  // Округляем до указанного количества знаков после запятой
  return parseFloat(randomNumber.toFixed(decimals));
}

/**
 * Функция для получения случайного элемента из массива
 * @param {Array} array - массив элементов
 * @returns {*} случайный элемент массива
 */
export function getRandomArrayElement(array) {
  return array[getRandomInteger(0, array.length - 1)];
}

/**
 * Функция для получения случайного подмассива из массива
 * @param {Array} array - исходный массив
 * @param {number} maxLength - максимальная длина подмассива
 * @returns {Array} случайный подмассив
 */
export function getRandomArraySubset(array, maxLength) {
  const length = getRandomInteger(1, Math.min(maxLength, array.length));
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, length);
}
