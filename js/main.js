/**
 * Главный модуль приложения Кексобукинг
 * Точка входа, которая связывает все остальные модули
 */

// Импортируем функции генерации данных
import { generateAdvertisement, generateAdvertisements, advertisements } from './data.js';

// Импортируем модуль для работы с формой
import { initForm, getFormData, resetForm, validateForm } from './form.js';

// Импортируем модуль для работы с картой
import { initMap, addAdvertisementPins, resetMap, clearAdvertisementPins } from './map.js';

// Импортируем модуль для работы с сервером
import { loadAdvertisements, sendFormData, testServerConnection } from './server.js';

// Импортируем модуль для уведомлений
import { showSuccessMessage, showErrorMessage, showLoadError } from './notifications.js';

// Импортируем модуль фильтрации
import { initFilter, deactivateFilters } from './filter.js';

/**
 * Настройка обработчиков формы
 */
function setupFormHandlers() {
  const form = document.querySelector('.ad-form');
  const resetButton = document.querySelector('.ad-form__reset');

  if (form) {
    // Обработчик отправки формы
    form.addEventListener('submit', async (evt) => {
      evt.preventDefault();

      if (validateForm()) {
        try {
          const formData = getFormData();

          // Отладочная информация
          console.log('Отправляем данные формы:');
          for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
          }

          await sendFormData(formData);

          // Успешная отправка
          showSuccessMessage();
          resetFormToInitialState();
        } catch (error) {
          // Ошибка отправки
          console.error('Детали ошибки отправки:', error);
          showErrorMessage(`Ошибка при отправке формы: ${error.message}`);
        }
      } else {
        showErrorMessage('Пожалуйста, исправьте ошибки в форме');
      }
    });
  }

  if (resetButton) {
    // Обработчик сброса формы
    resetButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      resetFormToInitialState();
    });
  }

  // eslint-disable-next-line no-console
  console.log('Обработчики формы настроены');
}

/**
 * Сброс формы в исходное состояние
 */
function resetFormToInitialState() {
  // Сбрасываем форму
  resetForm();

  // Сбрасываем карту в исходное положение
  resetMap();

  // Деактивируем фильтры
  deactivateFilters();
}

/**
 * Загрузка данных с сервера
 */
async function loadServerData() {
  try {
    // Сначала проверяем доступность сервера
    const serverAvailable = await testServerConnection();
    if (!serverAvailable) {
      throw new Error('Сервер недоступен');
    }

    const serverAdvertisements = await loadAdvertisements();
    console.log('Данные загружены с сервера:', serverAdvertisements.length, 'объявлений');
    return serverAdvertisements;
  } catch (error) {
    console.error('Ошибка загрузки данных с сервера:', error);
    showLoadError('Не удалось загрузить данные с сервера. Используются локальные данные.');
    return advertisements; // Используем локальные данные как fallback
  }
}

/**
 * Обновляет метки на карте
 * @param {Array} advertisements - Массив объявлений для отображения
 */
function updateMapPins(advertisements) {
  // Очищаем существующие метки
  clearAdvertisementPins();

  // Добавляем новые метки
  addAdvertisementPins(advertisements);
}

/**
 * Инициализация приложения
 */
async function initApp() {
  // eslint-disable-next-line no-console
  console.log('Приложение Кексобукинг инициализировано');

  // Инициализируем карту
  initMap();

  // Инициализируем модуль формы
  initForm();

  // Добавляем обработчики для кнопок формы
  setupFormHandlers();

  // Загружаем данные с сервера
  const advertisementsData = await loadServerData();

  // Инициализируем фильтры с callback для обновления меток
  initFilter(advertisementsData, updateMapPins);

  // Добавляем первые метки объявлений на карту (до 10 штук)
  addAdvertisementPins(advertisementsData.slice(0, 10));
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем основные функции для использования в других модулях
export { advertisements, generateAdvertisement, generateAdvertisements };
