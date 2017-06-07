import * as constants from '../data/constants';

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
    login: {
      0: 'Ошибка на сервере. Постараемся исправить её как можно скорее.',
      [constants.LOGIN_INCORRECT_DATA]: 'Неверный логин / пароль.'
    },
    signup: {
      0: 'Ошибка на сервере. Постараемся исправить её как можно скорее.',
      [constants.SIGNUP_EMAIL_INVALID]: 'Электронная почта неверного формата.',
      [constants.SIGNUP_EMAIL_TOO_LONG]: 'Электронная почта слишком длинная.',
      [constants.SIGNUP_PASSWORD_TOO_SHORT]: 'Пароль слишком короткий.',
      [constants.SIGNUP_PASSWORD_TOO_LONG]: 'Пароль слишком длинный.',
      [constants.SIGNUP_PASSWORD_INVALID]: 'Пароль не соответствует формату. Проверьте, чтобы в нём были только латинские буквы и цифры.',
      [constants.SIGNUP_NAME_TOO_LONG]: 'Имя слишком длинное.',
      [constants.SIGNUP_EXISTING_USER]: 'Пользователь с такой электронной почтой уже зарегистрирован.'
    },
    tokenExpired: 'Ваша сессия истекла. Для безопасности аккаунта мы ограничиваем сессии по времени. Пожалуйста, выйдите и войдите снова. Иначе данные не будут синхронизироваться с сервером.'
  },
  flashcardInputs: {
    frontText: 'Слово:',
    backText: 'Значение:'
  },
  flashcardList: {
    title: getTitle('Карточки'),
    search: 'Найти:',
    searchingFor: 'Отфильтровано по «{{searchString}}»',
    clear: 'показать все',
    deleted: 'Карточка удалена.',
    undo: 'Восстановить',
    noSearchResults: 'Ничего не найдено.',
    noFlashcards: 'У вас пока нет ни одной карточки.',
    create: 'Создать'
  },
  footer: {
    authorName: 'Павел Померанцев'
  },
  home: {
    header: 'Простой способ учить иностранные слова',
    subheader: 'Как бумажные карточки, только удобнее.',
    formHeader: 'Войти',
    email: 'Электронная почта:',
    password: 'Пароль:',
    signIn: 'Войти',
    signUp: 'Зарегистрироваться',
    who: {
      header: 'Кому нужен этот сайт',
      options: {
        0: 'Если вы читаете на английском (или любом другом иностранном) языке;',
        1: 'если вы знаете язык неидеально и понимаете не 100% текста;',
        2: 'и если не знаете, как расширить свой словарный запас;'
      },
      memorize: 'тогда просто выучивайте несколько новых слов в день. Вордхаб вам в этом поможет.'
    },
    what: {
      header: 'Что здесь происходит',
      paragraphs: {
        0: 'Вы просто создаёте карточки: слово и его перевод.',
        1: 'И потом повторяете их. Сайт выдаёт нужные карточки для повторения, делая упор на словах, которые вы хуже запоминаете.',
        2: 'На сайте нет встроенных словарей, зато его легко использовать так, как вам удобно: создавать карточки на любых языках или учить не слова, а важные для вас факты (например, по учёбе или работе).',
        3: 'Лучший эффект достигается, если заниматься регулярно: каждый день создавать новые карточки и каждый день повторять. Например, если создавать по 30 новых карточек в день (не так много), за год можно запомнить около 10 тысяч новых слов (а 30 тысяч — это уже близко к уровню носителей языка).'
      }
    },
    why: {
      header: 'Почему удобно заниматься онлайн',
      sameWithPaper: 'То же самое можно делать с бумажными карточками. Но у Вордхаба несколько преимуществ:',
      advantages: {
        0: 'Это быстрее. Можно копировать слова и выражения из других текстов. А тем, кто быстро набирает — совсем легко.',
        1: 'Ваши карточки с вами везде, где есть интернет. Хотя пользоваться приложением можно и в оффлайне. А когда доступ к сети появится, карточки будут синхронизированы с облаком.',
        2: 'Вам не нужно придумывать систему повторов — приложение делает так, что вы чаще видите те слова, что труднее вам даются.',
        3: 'Вордхаб проще, чем другие системы по изучению слов. Вы просто добавляете слова и повторяете их. А больше вам, возможно, ничего и не нужно.'
      }
    },
    learnMoreOrSignUp: 'Вы можете {{learnMore}} или {{signUp}}.',
    infoLearnMore: 'узнать о сайте больше',
    infoSignUp: 'зарегистрироваться'
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
    heading: 'Регистрация',
    email: 'Электронная почта:',
    notSharingEmail: 'Мы ни с кем не будем делиться вашим адресом.',
    password: 'Пароль:',
    anyCombination: 'Любая комбинация цифр и латинских букв без пробелов, не короче 6 символов. Заглавные и строчные буквы считаются разными символами.',
    name: 'Имя:',
    howToAddress: 'Как к вам обращаться?',
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
