/**
 * Главный модуль приложения Кексобукинг
 * Точка входа, которая связывает все остальные модули
 */

// Импортируем функции генерации данных
import { generateAdvertisement, generateAdvertisements, advertisements } from './data.js';

// Импортируем модуль для работы с формой
import { initForm, getFormData, resetForm, validateForm } from './form.js';

// Импортируем модуль для работы с картой
import { initMap, addAdvertisementPins, resetMap } from './map.js';

// Импортируем модуль для работы с сервером
import { loadAdvertisements, sendFormData } from './server.js';

// Импортируем модуль для уведомлений
import { showSuccessMessage, showErrorMessage, showLoadError } from './notifications.js';

// Импортируем модули для будущих функций
// import { filterModule } from './filter.js';

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
          await sendFormData(formData);

          // Успешная отправка
          showSuccessMessage();
          resetFormToInitialState();
        } catch (error) {
          // Ошибка отправки
          showErrorMessage('Ошибка при отправке формы. Попробуйте еще раз.');
          console.error('Ошибка отправки формы:', error);
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

  // Здесь можно добавить сброс фильтров
  // filterModule.reset();
}

/**
 * Загрузка данных с сервера
 */
async function loadServerData() {
  try {
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

  // Добавляем метки объявлений на карту
  addAdvertisementPins(advertisementsData);

  // Здесь будет код для инициализации фильтров
  // filterModule.init(advertisementsData);
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем основные функции для использования в других модулях
export { advertisements, generateAdvertisement, generateAdvertisements };
