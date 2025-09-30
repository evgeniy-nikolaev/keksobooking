/**
 * Модуль для фильтрации объявлений
 */

// Максимальное количество отображаемых меток
const MAX_PINS_COUNT = 10;

// Текущие отфильтрованные объявления
let filteredAdvertisements = [];

/**
 * Инициализация модуля фильтрации
 * @param {Array} advertisements - Массив объявлений
 * @param {Function} onFilterChange - Callback для обновления меток на карте
 */
export function initFilter(advertisements, onFilterChange) {
  filteredAdvertisements = advertisements.slice(0, MAX_PINS_COUNT);

  // Находим форму фильтров
  const filterForm = document.querySelector('.map__filters');
  if (!filterForm) {
    console.error('Форма фильтров не найдена');
    return;
  }

  // Активируем форму фильтров
  activateFilterForm();

  // Добавляем обработчики событий
  filterForm.addEventListener('change', () => {
    applyFilters(advertisements, onFilterChange);
  });

  // Добавляем обработчик сброса
  const resetButton = document.querySelector('.ad-form__reset');
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      resetFilters(advertisements, onFilterChange);
    });
  }

  console.log('Модуль фильтрации инициализирован');
}

/**
 * Активирует форму фильтров
 */
function activateFilterForm() {
  const filterForm = document.querySelector('.map__filters');
  if (filterForm) {
    filterForm.classList.remove('map__filters--disabled');

    // Активируем все поля фильтров
    const filterFields = filterForm.querySelectorAll('select, input');
    filterFields.forEach(field => {
      field.disabled = false;
    });
  }
}

/**
 * Деактивирует форму фильтров
 */
function deactivateFilterForm() {
  const filterForm = document.querySelector('.map__filters');
  if (filterForm) {
    filterForm.classList.add('map__filters--disabled');

    // Деактивируем все поля фильтров
    const filterFields = filterForm.querySelectorAll('select, input');
    filterFields.forEach(field => {
      field.disabled = true;
    });
  }
}

/**
 * Применяет фильтры к объявлениям
 * @param {Array} advertisements - Исходный массив объявлений
 * @param {Function} onFilterChange - Callback для обновления меток
 */
function applyFilters(advertisements, onFilterChange) {
  // Закрываем все открытые попапы
  closeAllPopups();

  // Получаем значения фильтров
  const filters = getFilterValues();

  // Фильтруем объявления
  const filtered = advertisements.filter(advertisement => {
    return matchesFilters(advertisement, filters);
  });

  // Ограничиваем количество до MAX_PINS_COUNT
  filteredAdvertisements = filtered.slice(0, MAX_PINS_COUNT);

  // Обновляем метки на карте
  if (onFilterChange) {
    onFilterChange(filteredAdvertisements);
  }

  console.log(`Отфильтровано: ${filtered.length} объявлений, показано: ${filteredAdvertisements.length}`);
}

/**
 * Получает значения всех фильтров
 * @returns {Object} Объект с значениями фильтров
 */
function getFilterValues() {
  const filterForm = document.querySelector('.map__filters');
  if (!filterForm) {
    return {};
  }

  return {
    housingType: filterForm.querySelector('#housing-type')?.value || 'any',
    housingPrice: filterForm.querySelector('#housing-price')?.value || 'any',
    housingRooms: filterForm.querySelector('#housing-rooms')?.value || 'any',
    housingGuests: filterForm.querySelector('#housing-guests')?.value || 'any',
    features: Array.from(filterForm.querySelectorAll('input[name="features"]:checked')).map(input => input.value)
  };
}

/**
 * Проверяет, соответствует ли объявление фильтрам
 * @param {Object} advertisement - Объявление для проверки
 * @param {Object} filters - Значения фильтров
 * @returns {boolean} true если объявление соответствует фильтрам
 */
function matchesFilters(advertisement, filters) {
  const offer = advertisement.offer;
  if (!offer) {
    return false;
  }

  // Фильтр по типу жилья
  if (filters.housingType !== 'any' && offer.type !== filters.housingType) {
    return false;
  }

  // Фильтр по цене
  if (filters.housingPrice !== 'any') {
    if (!matchesPriceFilter(offer.price, filters.housingPrice)) {
      return false;
    }
  }

  // Фильтр по количеству комнат
  if (filters.housingRooms !== 'any') {
    const rooms = parseInt(filters.housingRooms);
    if (offer.rooms !== rooms) {
      return false;
    }
  }

  // Фильтр по количеству гостей
  if (filters.housingGuests !== 'any') {
    const guests = parseInt(filters.housingGuests);
    if (offer.guests !== guests) {
      return false;
    }
  }

  // Фильтр по удобствам
  if (filters.features.length > 0) {
    if (!offer.features || !filters.features.every(feature => offer.features.includes(feature))) {
      return false;
    }
  }

  return true;
}

/**
 * Проверяет соответствие цены фильтру
 * @param {number} price - Цена объявления
 * @param {string} priceFilter - Значение фильтра цены
 * @returns {boolean} true если цена соответствует фильтру
 */
function matchesPriceFilter(price, priceFilter) {
  switch (priceFilter) {
    case 'low':
      return price < 10000;
    case 'middle':
      return price >= 10000 && price < 50000;
    case 'high':
      return price >= 50000;
    default:
      return true;
  }
}

/**
 * Сбрасывает все фильтры
 * @param {Array} advertisements - Исходный массив объявлений
 * @param {Function} onFilterChange - Callback для обновления меток
 */
function resetFilters(advertisements, onFilterChange) {
  const filterForm = document.querySelector('.map__filters');
  if (filterForm) {
    // Сбрасываем все поля фильтров
    filterForm.reset();
  }

  // Показываем первые MAX_PINS_COUNT объявлений
  filteredAdvertisements = advertisements.slice(0, MAX_PINS_COUNT);

  // Обновляем метки на карте
  if (onFilterChange) {
    onFilterChange(filteredAdvertisements);
  }

  console.log('Фильтры сброшены');
}

/**
 * Закрывает все открытые попапы
 */
function closeAllPopups() {
  // Находим и закрываем все открытые попапы
  const openPopups = document.querySelectorAll('.leaflet-popup');
  openPopups.forEach(popup => {
    if (popup.parentNode) {
      popup.parentNode.removeChild(popup);
    }
  });
}

/**
 * Получает текущие отфильтрованные объявления
 * @returns {Array} Массив отфильтрованных объявлений
 */
export function getFilteredAdvertisements() {
  return filteredAdvertisements;
}

/**
 * Деактивирует фильтры (вызывается при сбросе формы)
 */
export function deactivateFilters() {
  deactivateFilterForm();
}
