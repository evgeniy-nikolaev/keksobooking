/**
 * Модуль для работы с формой объявления
 */

// Маппинг типов жилья на минимальные цены и плейсхолдеры
const HOUSING_TYPE_CONFIG = {
  'bungalow': {
    minPrice: 0,
    placeholder: '0'
  },
  'flat': {
    minPrice: 1000,
    placeholder: '1000'
  },
  'house': {
    minPrice: 5000,
    placeholder: '5000'
  },
  'palace': {
    minPrice: 10000,
    placeholder: '10000'
  }
};

// Маппинг времени заезда на время выезда
const TIME_MAPPING = {
  '12:00': '12:00',
  '13:00': '13:00',
  '14:00': '14:00'
};

/**
 * Инициализация модуля формы
 */
export function initForm() {
  const typeSelect = document.querySelector('#type');
  const priceInput = document.querySelector('#price');
  const timeinSelect = document.querySelector('#timein');
  const timeoutSelect = document.querySelector('#timeout');

  if (!typeSelect || !priceInput || !timeinSelect || !timeoutSelect) {
    console.error('Не найдены необходимые элементы формы');
    return;
  }

  // Обработчик изменения типа жилья
  typeSelect.addEventListener('change', () => {
    updatePriceField(typeSelect, priceInput);
  });

  // Обработчик изменения времени заезда
  timeinSelect.addEventListener('change', () => {
    syncTimeFields(timeinSelect, timeoutSelect);
  });

  // Обработчик изменения времени выезда
  timeoutSelect.addEventListener('change', () => {
    syncTimeFields(timeoutSelect, timeinSelect);
  });

  // Добавляем валидацию в реальном времени
  setupRealtimeValidation();

  // Инициализация полей при загрузке
  updatePriceField(typeSelect, priceInput);
  syncTimeFields(timeinSelect, timeoutSelect);

  // eslint-disable-next-line no-console
  console.log('Модуль формы инициализирован');
}

/**
 * Обновляет поле цены в зависимости от выбранного типа жилья
 * @param {HTMLSelectElement} typeSelect - элемент выбора типа жилья
 * @param {HTMLInputElement} priceInput - поле ввода цены
 */
function updatePriceField(typeSelect, priceInput) {
  const selectedType = typeSelect.value;
  const config = HOUSING_TYPE_CONFIG[selectedType];

  if (config) {
    // Устанавливаем минимальное значение
    priceInput.min = config.minPrice;

    // Устанавливаем плейсхолдер
    priceInput.placeholder = config.placeholder;

    // Если текущее значение меньше минимального, обновляем его
    const currentValue = parseInt(priceInput.value, 10);
    if (currentValue < config.minPrice) {
      priceInput.value = config.minPrice;
    }

    // eslint-disable-next-line no-console
    console.log(`Тип жилья изменен на: ${selectedType}, минимальная цена: ${config.minPrice}`);
  }
}

/**
 * Синхронизирует поля времени заезда и выезда
 * @param {HTMLSelectElement} sourceSelect - источник изменения
 * @param {HTMLSelectElement} targetSelect - целевое поле для синхронизации
 */
function syncTimeFields(sourceSelect, targetSelect) {
  const selectedValue = sourceSelect.value;
  const mappedValue = TIME_MAPPING[selectedValue];

  if (mappedValue && targetSelect.value !== mappedValue) {
    targetSelect.value = mappedValue;
    // eslint-disable-next-line no-console
    console.log(`Время синхронизировано: ${selectedValue} -> ${mappedValue}`);
  }
}

/**
 * Получает данные формы в виде FormData для отправки на сервер
 * @returns {FormData|null} FormData с данными формы
 */
export function getFormData() {
  const form = document.querySelector('.ad-form');
  if (!form) {
    return null;
  }

  return new FormData(form);
}

/**
 * Получает данные формы в виде объекта (для отладки)
 * @returns {Object} объект с данными формы
 */
export function getFormDataAsObject() {
  const form = document.querySelector('.ad-form');
  if (!form) {
    return null;
  }

  const formData = new FormData(form);
  const data = {};

  // Собираем данные из всех полей формы
  for (const [key, value] of formData.entries()) {
    if (data[key]) {
      // Если поле уже существует (например, features), создаем массив
      if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    } else {
      data[key] = value;
    }
  }

  return data;
}

/**
 * Сбрасывает форму к начальному состоянию
 */
export function resetForm() {
  const form = document.querySelector('.ad-form');
  if (form) {
    form.reset();

    // Очищаем ошибки валидации
    clearValidationErrors();

    // Принудительно обновляем поля после сброса
    const typeSelect = document.querySelector('#type');
    const priceInput = document.querySelector('#price');
    const timeinSelect = document.querySelector('#timein');
    const timeoutSelect = document.querySelector('#timeout');

    if (typeSelect && priceInput) {
      updatePriceField(typeSelect, priceInput);
    }
    if (timeinSelect && timeoutSelect) {
      syncTimeFields(timeinSelect, timeoutSelect);
    }

    // eslint-disable-next-line no-console
    console.log('Форма сброшена');
  }
}

/**
 * Валидирует форму
 * @returns {boolean} true если форма валидна
 */
export function validateForm() {
  const typeSelect = document.querySelector('#type');
  const priceInput = document.querySelector('#price');
  const titleInput = document.querySelector('#title');
  const addressInput = document.querySelector('#address');
  const roomsSelect = document.querySelector('#room_number');
  const capacitySelect = document.querySelector('#capacity');

  let isValid = true;
  const errors = [];

  // Очищаем предыдущие ошибки валидации
  clearValidationErrors();

  // Проверяем заголовок
  if (!titleInput.value.trim()) {
    setFieldError(titleInput, 'Заголовок объявления обязателен');
    isValid = false;
  } else if (titleInput.value.length < 30) {
    setFieldError(titleInput, 'Заголовок должен содержать минимум 30 символов');
    isValid = false;
  } else if (titleInput.value.length > 100) {
    setFieldError(titleInput, 'Заголовок не должен превышать 100 символов');
    isValid = false;
  }

  // Проверяем адрес
  if (!addressInput.value.trim()) {
    setFieldError(addressInput, 'Адрес обязателен');
    isValid = false;
  }

  // Проверяем цену
  if (!priceInput.value) {
    setFieldError(priceInput, 'Цена обязательна');
    isValid = false;
  } else {
    const price = parseInt(priceInput.value, 10);
    const minPrice = parseInt(priceInput.min, 10);
    const maxPrice = parseInt(priceInput.max, 10);

    if (price < minPrice) {
      setFieldError(priceInput, `Цена должна быть не менее ${minPrice} руб.`);
      isValid = false;
    } else if (price > maxPrice) {
      setFieldError(priceInput, `Цена не должна превышать ${maxPrice} руб.`);
      isValid = false;
    }
  }

  // Проверяем соответствие комнат и гостей
  if (roomsSelect.value && capacitySelect.value) {
    const rooms = parseInt(roomsSelect.value, 10);
    const capacity = parseInt(capacitySelect.value, 10);

    if (!validateRoomsAndCapacity(rooms, capacity)) {
      setFieldError(capacitySelect, 'Количество гостей не соответствует количеству комнат');
      isValid = false;
    }
  }

  if (!isValid) {
    // eslint-disable-next-line no-console
    console.warn('Ошибки валидации формы');
  }

  return isValid;
}

/**
 * Валидирует соответствие количества комнат и гостей
 * @param {number} rooms - количество комнат
 * @param {number} capacity - количество гостей
 * @returns {boolean} true если соответствие корректно
 */
function validateRoomsAndCapacity(rooms, capacity) {
  // Правила соответствия:
  // 1 комната: 1 гость
  // 2 комнаты: 1-2 гостя
  // 3 комнаты: 1-3 гостя
  // 100 комнат: 1-100 гостей

  if (rooms === 1 && capacity !== 1) {
    return false;
  }
  if (rooms === 2 && (capacity < 1 || capacity > 2)) {
    return false;
  }
  if (rooms === 3 && (capacity < 1 || capacity > 3)) {
    return false;
  }
  if (rooms === 100 && (capacity < 1 || capacity > 100)) {
    return false;
  }

  return true;
}

/**
 * Устанавливает ошибку для поля
 * @param {HTMLElement} field - поле ввода
 * @param {string} message - сообщение об ошибке
 */
function setFieldError(field, message) {
  field.setCustomValidity(message);
  field.classList.add('ad-form__element--error');

  // Создаем элемент с сообщением об ошибке
  let errorElement = field.parentElement.querySelector('.ad-form__error');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'ad-form__error';
    field.parentElement.appendChild(errorElement);
  }
  errorElement.textContent = message;
}

/**
 * Очищает ошибки валидации
 */
function clearValidationErrors() {
  const errorElements = document.querySelectorAll('.ad-form__error');
  errorElements.forEach(element => element.remove());

  const errorFields = document.querySelectorAll('.ad-form__element--error');
  errorFields.forEach(field => {
    field.classList.remove('ad-form__element--error');
    field.setCustomValidity('');
  });
}

/**
 * Настраивает валидацию в реальном времени
 */
function setupRealtimeValidation() {
  const titleInput = document.querySelector('#title');
  const priceInput = document.querySelector('#price');
  const roomsSelect = document.querySelector('#room_number');
  const capacitySelect = document.querySelector('#capacity');

  // Валидация заголовка при вводе
  if (titleInput) {
    titleInput.addEventListener('input', () => {
      validateTitleField(titleInput);
    });
  }

  // Валидация цены при вводе
  if (priceInput) {
    priceInput.addEventListener('input', () => {
      validatePriceField(priceInput);
    });
  }

  // Валидация соответствия комнат и гостей при изменении
  if (roomsSelect && capacitySelect) {
    roomsSelect.addEventListener('change', () => {
      validateRoomsCapacityFields(roomsSelect, capacitySelect);
    });

    capacitySelect.addEventListener('change', () => {
      validateRoomsCapacityFields(roomsSelect, capacitySelect);
    });
  }
}

/**
 * Валидирует поле заголовка
 * @param {HTMLInputElement} field - поле заголовка
 */
function validateTitleField(field) {
  const value = field.value.trim();

  if (value.length > 0 && value.length < 30) {
    setFieldError(field, 'Заголовок должен содержать минимум 30 символов');
  } else if (value.length > 100) {
    setFieldError(field, 'Заголовок не должен превышать 100 символов');
  } else {
    clearFieldError(field);
  }
}

/**
 * Валидирует поле цены
 * @param {HTMLInputElement} field - поле цены
 */
function validatePriceField(field) {
  const value = parseInt(field.value, 10);
  const minPrice = parseInt(field.min, 10);
  const maxPrice = parseInt(field.max, 10);

  if (field.value && (value < minPrice || value > maxPrice)) {
    if (value < minPrice) {
      setFieldError(field, `Цена должна быть не менее ${minPrice} руб.`);
    } else {
      setFieldError(field, `Цена не должна превышать ${maxPrice} руб.`);
    }
  } else {
    clearFieldError(field);
  }
}

/**
 * Валидирует соответствие комнат и гостей
 * @param {HTMLSelectElement} roomsField - поле количества комнат
 * @param {HTMLSelectElement} capacityField - поле количества гостей
 */
function validateRoomsCapacityFields(roomsField, capacityField) {
  const rooms = parseInt(roomsField.value, 10);
  const capacity = parseInt(capacityField.value, 10);

  if (rooms && capacity && !validateRoomsAndCapacity(rooms, capacity)) {
    setFieldError(capacityField, 'Количество гостей не соответствует количеству комнат');
  } else {
    clearFieldError(capacityField);
  }
}

/**
 * Очищает ошибку для конкретного поля
 * @param {HTMLElement} field - поле ввода
 */
function clearFieldError(field) {
  field.classList.remove('ad-form__element--error');
  field.setCustomValidity('');

  const errorElement = field.parentElement.querySelector('.ad-form__error');
  if (errorElement) {
    errorElement.remove();
  }
}
