/**
 * Главный модуль приложения Кексобукинг
 * Точка входа, которая связывает все остальные модули
 */

// Импортируем функции генерации данных
import { generateAdvertisement, generateAdvertisements, advertisements } from './data.js';

// Импортируем модуль для работы с формой
import { initForm, getFormData, resetForm, validateForm } from './form.js';

// Импортируем модуль для работы с картой
import { initMap, addAdvertisementPins } from './map.js';

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
    form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      if (validateForm()) {
        const formData = getFormData();
        // Здесь будет логика отправки данных
        // eslint-disable-next-line no-console
        console.log('Данные формы:', formData);
        // eslint-disable-next-line no-alert
        alert('Форма отправлена! (Данные в консоли)');
      } else {
        // eslint-disable-next-line no-alert
        alert('Пожалуйста, исправьте ошибки в форме');
      }
    });
  }

  if (resetButton) {
    // Обработчик сброса формы
    resetButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      resetForm();
    });
  }

  // eslint-disable-next-line no-console
  console.log('Обработчики формы настроены');
}

/**
 * Инициализация приложения
 */
function initApp() {
  // eslint-disable-next-line no-console
  console.log('Приложение Кексобукинг инициализировано');
  // eslint-disable-next-line no-console
  console.log('Доступные объявления:', advertisements.length);

  // Инициализируем карту
  initMap();

  // Инициализируем модуль формы
  initForm();

  // Добавляем обработчики для кнопок формы
  setupFormHandlers();

  // Добавляем метки объявлений на карту
  addAdvertisementPins(advertisements);

  // Здесь будет код для инициализации карты и фильтров
  // mapModule.init(advertisements);
  // filterModule.init();
}

// Запускаем приложение после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);

// Экспортируем основные функции для использования в других модулях
export { advertisements, generateAdvertisement, generateAdvertisements };
