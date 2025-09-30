/**
 * Модуль для загрузки файлов (аватарка и фотографии жилья)
 */

// Поддерживаемые типы файлов
const SUPPORTED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

// Максимальный размер файла (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Инициализация модуля загрузки файлов
 */
export function initFileUpload() {
  initAvatarUpload();
  initPhotoUpload();
  console.log('Модуль загрузки файлов инициализирован');
}

/**
 * Инициализация загрузки аватарки
 */
function initAvatarUpload() {
  const avatarInput = document.querySelector('#avatar');
  const avatarPreview = document.querySelector('.ad-form-header__preview img');

  if (!avatarInput || !avatarPreview) {
    console.error('Элементы для загрузки аватарки не найдены');
    return;
  }

  avatarInput.addEventListener('change', (evt) => {
    const file = evt.target.files[0];
    if (file) {
      handleAvatarUpload(file, avatarPreview);
    }
  });

  // Добавляем drag & drop для аватарки
  const dropZone = document.querySelector('.ad-form-header__drop-zone');
  if (dropZone) {
    addDragAndDrop(dropZone, avatarInput, (file) => {
      handleAvatarUpload(file, avatarPreview);
    });
  }
}

/**
 * Инициализация загрузки фотографии жилья
 */
function initPhotoUpload() {
  const photoInput = document.querySelector('#images');
  const photoContainer = document.querySelector('.ad-form__photo');

  if (!photoInput || !photoContainer) {
    console.error('Элементы для загрузки фотографии жилья не найдены');
    return;
  }

  photoInput.addEventListener('change', (evt) => {
    const file = evt.target.files[0];
    if (file) {
      handlePhotoUpload(file, photoContainer);
    }
  });

  // Добавляем drag & drop для фотографии жилья
  const dropZone = document.querySelector('.ad-form__drop-zone');
  if (dropZone) {
    addDragAndDrop(dropZone, photoInput, (file) => {
      handlePhotoUpload(file, photoContainer);
    });
  }
}

/**
 * Обрабатывает загрузку аватарки
 * @param {File} file - Загружаемый файл
 * @param {HTMLElement} preview - Элемент для предварительного просмотра
 */
function handleAvatarUpload(file, preview) {
  if (!validateFile(file)) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    preview.src = evt.target.result;
    preview.alt = 'Аватар пользователя';

    // Добавляем кнопку удаления
    addRemoveButton(preview.parentElement, () => {
      resetAvatarPreview(preview);
    });
  };

  reader.readAsDataURL(file);
  console.log('Аватарка загружена:', file.name);
}

/**
 * Обрабатывает загрузку фотографии жилья
 * @param {File} file - Загружаемый файл
 * @param {HTMLElement} container - Контейнер для фотографии
 */
function handlePhotoUpload(file, container) {
  if (!validateFile(file)) {
    return;
  }

  const reader = new FileReader();
  reader.onload = (evt) => {
    // Очищаем контейнер от предыдущих фотографий
    container.innerHTML = '';

    // Создаем элемент изображения
    const img = document.createElement('img');
    img.src = evt.target.result;
    img.alt = 'Фотография жилья';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';

    container.appendChild(img);

    // Добавляем кнопку удаления
    addRemoveButton(container, () => {
      resetPhotoPreview(container);
    });
  };

  reader.readAsDataURL(file);
  console.log('Фотография жилья загружена:', file.name);
}

/**
 * Валидирует загружаемый файл
 * @param {File} file - Файл для валидации
 * @returns {boolean} true если файл валиден
 */
function validateFile(file) {
  if (!file) {
    return false;
  }

  // Проверяем тип файла
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    showErrorMessage('Поддерживаются только файлы изображений (JPEG, PNG, GIF, WebP)');
    return false;
  }

  // Проверяем размер файла
  if (file.size > MAX_FILE_SIZE) {
    showErrorMessage('Размер файла не должен превышать 5MB');
    return false;
  }

  return true;
}

/**
 * Добавляет drag & drop функциональность
 * @param {HTMLElement} dropZone - Зона для перетаскивания
 * @param {HTMLElement} input - Input элемент
 * @param {Function} onFileDrop - Callback при загрузке файла
 */
function addDragAndDrop(dropZone, input, onFileDrop) {
  dropZone.addEventListener('dragover', (evt) => {
    evt.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (evt) => {
    evt.preventDefault();
    dropZone.classList.remove('drag-over');

    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      onFileDrop(files[0]);
    }
  });
}

/**
 * Добавляет кнопку удаления к элементу
 * @param {HTMLElement} container - Контейнер элемента
 * @param {Function} onRemove - Callback при удалении
 */
function addRemoveButton(container, onRemove) {
  // Удаляем существующую кнопку, если есть
  const existingButton = container.querySelector('.remove-button');
  if (existingButton) {
    existingButton.remove();
  }

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'remove-button';
  removeButton.innerHTML = '×';
  removeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 5px;
    width: 25px;
    height: 25px;
    border: none;
    border-radius: 50%;
    background-color: rgba(255, 0, 0, 0.8);
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    z-index: 10;
  `;

  removeButton.addEventListener('click', (evt) => {
    evt.stopPropagation();
    onRemove();
  });

  // Делаем контейнер относительно позиционированным
  container.style.position = 'relative';
  container.appendChild(removeButton);
}

/**
 * Сбрасывает предварительный просмотр аватарки
 * @param {HTMLElement} preview - Элемент предварительного просмотра
 */
function resetAvatarPreview(preview) {
  preview.src = 'img/muffin-grey.svg';
  preview.alt = 'Аватар пользователя';

  // Очищаем input
  const avatarInput = document.querySelector('#avatar');
  if (avatarInput) {
    avatarInput.value = '';
  }

  // Удаляем кнопку удаления
  const removeButton = preview.parentElement.querySelector('.remove-button');
  if (removeButton) {
    removeButton.remove();
  }
}

/**
 * Сбрасывает предварительный просмотр фотографии жилья
 * @param {HTMLElement} container - Контейнер фотографии
 */
function resetPhotoPreview(container) {
  container.innerHTML = '';

  // Очищаем input
  const photoInput = document.querySelector('#images');
  if (photoInput) {
    photoInput.value = '';
  }
}

/**
 * Сбрасывает все загруженные файлы
 */
export function resetFileUploads() {
  const avatarPreview = document.querySelector('.ad-form-header__preview img');
  if (avatarPreview) {
    resetAvatarPreview(avatarPreview);
  }

  const photoContainer = document.querySelector('.ad-form__photo');
  if (photoContainer) {
    resetPhotoPreview(photoContainer);
  }

  console.log('Все загруженные файлы сброшены');
}

// Импортируем функцию показа ошибок
import { showErrorMessage } from './notifications.js';
