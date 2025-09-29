/**
 * Модуль для показа уведомлений пользователю
 * Содержит функции для отображения сообщений об успехе и ошибках
 */

/**
 * Показывает сообщение об успешной отправке формы
 */
function showSuccessMessage() {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {
    console.error('Шаблон успешного сообщения не найден');
    return;
  }

  const successElement = successTemplate.content.cloneNode(true);
  document.body.appendChild(successElement);

  const successMessage = document.querySelector('.success');
  if (successMessage) {
    // Обработчики для закрытия сообщения
    const closeMessage = () => {
      successMessage.remove();
    };

    // Закрытие по клику на произвольную область
    successMessage.addEventListener('click', closeMessage);

    // Закрытие по нажатию Escape
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    });
  }
}

/**
 * Показывает сообщение об ошибке
 * @param {string} message - Текст сообщения об ошибке
 */
function showErrorMessage(message = 'Произошла ошибка при отправке данных') {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {
    console.error('Шаблон сообщения об ошибке не найден');
    return;
  }

  const errorElement = errorTemplate.content.cloneNode(true);
  document.body.appendChild(errorElement);

  const errorMessage = document.querySelector('.error');
  if (errorMessage) {
    // Обновляем текст сообщения
    const errorText = errorMessage.querySelector('.error__message');
    if (errorText) {
      errorText.textContent = message;
    }

    // Обработчики для закрытия сообщения
    const closeMessage = () => {
      errorMessage.remove();
    };

    // Закрытие по клику на кнопку
    const closeButton = errorMessage.querySelector('.error__button');
    if (closeButton) {
      closeButton.addEventListener('click', closeMessage);
    }

    // Закрытие по клику на произвольную область
    errorMessage.addEventListener('click', closeMessage);

    // Закрытие по нажатию Escape
    document.addEventListener('keydown', (evt) => {
      if (evt.key === 'Escape') {
        closeMessage();
      }
    });
  }
}

/**
 * Показывает сообщение об ошибке загрузки данных
 * @param {string} message - Текст сообщения об ошибке
 */
function showLoadError(message = 'Ошибка загрузки данных с сервера') {
  // Создаем простое уведомление для ошибки загрузки
  const errorDiv = document.createElement('div');
  errorDiv.className = 'load-error';
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #ff6b6b;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 10000;
    font-family: Arial, sans-serif;
    font-size: 14px;
    max-width: 400px;
    text-align: center;
  `;
  errorDiv.textContent = message;

  document.body.appendChild(errorDiv);

  // Автоматически скрываем через 5 секунд
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.remove();
    }
  }, 5000);
}

export { showSuccessMessage, showErrorMessage, showLoadError };
