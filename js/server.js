/**
 * Модуль для работы с сервером
 * Содержит функции для получения и отправки данных
 */

const SERVER_URL = 'https://23.javascript.htmlacademy.pro/keksobooking';

/**
 * Загружает данные объявлений с сервера
 * @returns {Promise<Array>} Массив объявлений
 */
async function loadAdvertisements() {
  try {
    const response = await fetch(`${SERVER_URL}/data`);

    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Ошибка при загрузке объявлений:', error);
    throw error;
  }
}

/**
 * Отправляет данные формы на сервер
 * @param {FormData} formData - Данные формы
 * @returns {Promise<Response>} Ответ сервера
 */
async function sendFormData(formData) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Ошибка отправки данных: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    throw error;
  }
}

export { loadAdvertisements, sendFormData };
