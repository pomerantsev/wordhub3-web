const appName = 'Вордхаб';

const getTitle = title => `${title} — ${appName}`;

const ruTranslation = {
  appName,
  createFlashcard: {
    title: getTitle('Новая карточка'),
    create: 'Создать'
  },
  editFlashcard: {
    title: getTitle('Редактирование карточки'),
    save: 'Сохранить',
    delete: 'Удалить'
  },
  errors: {
    sync: {
      0: 'Ошибка синхронизации с сервером. Постараемся это исправить. А пока попробуйте создать новую карточку или сделать ещё один повтор.'
    },
    tokenExpired: 'Ваша сессия истекла. Для безопасности аккаунта мы ограничиваем сессии по времени. Пожалуйста, выйдите и войдите снова. Иначе данные не будут синхронизироваться с сервером.'
  },
  flashcardList: {
    title: getTitle('Карточки'),
    searchingFor: 'Отфильтровано по «{{searchString}}»',
    clear: 'показать все'
  },
  footer: {
    authorName: 'Павел Померанцев'
  },
  home: {
    login: 'Войти',
    signUp: 'Зарегистрироваться'
  },
  menu: {
    allFlashcards: 'Все карточки',
    create: 'Создать',
    logout: 'Выйти',
    repeat: 'Повторить',
    completedOfTotal: '{{completed}} из {{total}}',
    stats: 'Статистика'
  },
  notFound: {
    title: getTitle('404'),
    notFound: 'Страница не найдена'
  },
  notifications: {
    offline: 'Оффлайн',
    offlineHint: 'Нет связи с сетью, но вы можете продолжать пользоваться приложением. Не перезагружайте страницу: все действия, что вы совершили в оффлайн-режиме, в этом случае не будут сохранены.',
    offlineDataSafe: 'Данные в сохранности',
    offlineDataSafeHint: 'Нет связи с сетью, но вы можете продолжать пользоваться приложением. Данные сохраняются локально, и когда сеть будет доступна, они будут отправлены на сервер.',
    whatsThis: 'что это?'
  },
  repetitions: {
    title: getTitle('Повтор слов'),
    remember: 'Помню',
    dontRemember: 'Не помню',
    turnOver: 'Перевернуть'
  },
  signup: {
    title: getTitle('Регистрация'),
    signUp: 'Зарегистрироваться'
  },
  stats: {
    title: getTitle('Статистика'),
    heading: 'Статистика',
    general: 'Общая',
    flashcardsCreated: 'Создано карточек',
    flashcardsLearned: 'Выучено карточек',
    totalRepetitionsPlanned: 'Всего запланировано повторов',
    upcomingRepetitions: 'Следующие повторы',
    repetitionsPlannedUntil: 'Запланировано повторов до',
    none: '—',
    last30Days: 'За последние 30 дней',
    today: 'Сегодня',
    totalRepetitions: 'Всего повторов',
    successfulRepetitions: 'Из них успешных'
  }
};

export default ruTranslation;
