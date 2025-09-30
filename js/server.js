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
    console.log('Отправляем запрос на сервер:', SERVER_URL);

    const response = await fetch(SERVER_URL, {
      method: 'POST',
      body: formData,
      mode: 'cors'
    });

    console.log('Ответ сервера:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Текст ошибки сервера:', errorText);
      throw new Error(`Ошибка отправки данных: ${response.status} ${response.statusText}. ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    throw error;
  }
}

/**
 * Тестирует доступность сервера
 * @returns {Promise<boolean>} true если сервер доступен
 */
async function testServerConnection() {
  try {
    const response = await fetch(`${SERVER_URL}/data`, {
      method: 'GET',
      mode: 'cors'
    });
    return response.ok;
  } catch (error) {
    console.error('Сервер недоступен:', error);
    return false;
  }
}

export { loadAdvertisements, sendFormData, testServerConnection };
