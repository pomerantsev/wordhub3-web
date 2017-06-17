import * as constants from '../data/constants';

const appName = 'Вордхаб';

const getTitle = title => `${title} — ${appName}`;

const ruTranslation = {
  appName,
  about: {
    title: getTitle('О сайте подробно'),
    whatToRead: {
      header: 'Что и как читать?',
      paragraphs: {
        0: 'Читайте то, что интересно. То, что получается. Где смысл понятен, но встречаются отдельные незнакомые слова и фразы. Подчёркивайте их или копируйте в специально для этого выделенный документ. Это базис для выучивания новых слов.',
        1: 'При таком подходе получается, что вы учите те и только те слова, которые встречаются вам при чтении. Иначе зачем это всё нужно?'
      }
    },
    dictionary: {
      header: 'Каким словарём пользоваться?',
      paragraph: 'Тем, который вам удобен. Например, ABBYY Lingvo. Во-первых, в нём есть как англо-русский, так и английский толковый словари. В толковом определения могут быть более точными, а в русском быстрее можно уловить суть. Во-вторых, электронный словарь намного быстрее, чем бумажный, позволяет найти нужное определение.'
    },
    everyDay: {
      header: 'Почему лучше заниматься каждый день?',
      paragraphs: {
        0: 'Тренировки, чтобы не потерять форму и чтобы сохранялся стимул, должны быть ежедневными. Если хотите учить иностранный язык (в этом случае, его лексику) — нужно поддерживать ритм, как в спорте.',
        1: 'Попробуйте за пять часов хорошо запомнить сто незнакомых слов. Сколько из них вы вспомните через месяц? Хорошо, если десятую часть.',
        2: 'Попробуйте каждое из этих ста слов повторить три-четыре-пять раз в течение месяца (то, что сайт и предлагает), потратив на них в сумме те же пять часов. Процентов 80 будете помнить уверенно.'
      }
    },
    leitner: {
      header: 'Как слова запоминаются?',
      paragraphWithLinks: 'Мозг устроен так, что любая информация лучше всего усваивается, если повторять её через увеличивающиеся интервалы времени. Это принцип интервальных повторений, на котором основана система Лейтнера (вот {{link1}} и {{link2}} статьи на Википедии).',
      link1: 'http://ru.wikipedia.org/wiki/%D0%98%D0%BD%D1%82%D0%B5%D1%80%D0%B2%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5_%D0%BF%D0%BE%D0%B2%D1%82%D0%BE%D1%80%D0%B5%D0%BD%D0%B8%D1%8F',
      link1Text: 'первая',
      link2: 'http://ru.wikipedia.org/wiki/%D0%A1%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%D0%9B%D0%B5%D0%B9%D1%82%D0%BD%D0%B5%D1%80%D0%B0',
      link2Text: 'вторая',
      paragraphs: {
        0: 'Вы создаёте карточку, и через несколько дней (в первый раз — от 1 до 3 дней) сайт предлагает её повторить. Если вы помните значение слова, то в следующий раз вы будете повторять его через 5–10 дней. Потом будет и третий раз, интервал до него — до месяца.',
        1: 'Каждый раз, если вы не угадали слово, оно снова будет выведено через 1–3 дня. Серия из трёх повторов начнётся сначала. Можете поверить: рано или поздно вы будете уверенно помнить всё, что вам нужно.'
      }
    },
    howMany: {
      header: 'Сколько слов учить в день?',
      paragraphs: {
        0: 'Столько, на сколько хватает сил и времени.',
        1: 'Если будете создавать по 10 карточек в день, то повторять придётся по 30–40 в день (когда их наберётся достаточное количество). Это в сумме около получаса. Если по 20 карточек — умножайте время на два. И так далее.',
        2: 'Выбирайте такой темп, который сможете выдерживать. Всё равно всё выучите.'
      },
      paragraphWithLinks: 'Поэтому сначала выставьте в {{link}} лимит поменьше. И потом наращивайте, покуда справляетесь.',
      linkText: 'настройках'
    },
    selfControl: {
      header: 'Самоконтроль',
      paragraphs: {
        0: 'Другие сайты предлагают разные системы тестирования и выставляют оценки. Такой метод отнимает довольно много времени, особенно если вы занимаетесь регулярно и планируете запомнить много слов.',
        1: 'Здесь всё проще: мы уверены, что вы сами можете при виде слова определить, помните вы его или нет. Можно даже подсматривать оборотную сторону карточки, чтобы убедиться, насколько хорошо вы её выучили. Это никак не повлияет на результат.',
        2: 'Отсутствие тестов система компенсирует, помогая балансировать нагрузку. Вам не нужно каждый день думать о том, какие слова учить. Те, что даются вам легко, вы увидите только три раза. А проблемные придётся повторять столько раз, сколько потребуется для запоминания.'
      }
    },
    whatElse: {
      header: 'Для чего ещё можно применять систему?',
      paragraphs: {
        0: 'Учите языки. Английский, немецкий, французский, китайский, арабский.',
        1: 'Учите грамматические правила.',
        2: 'Учите любые системы и факты в своей профессии. Всё, что можно записать текстом.'
      }
    }
  },
  aboutWrapper: {
    heading: 'О сайте',
    intro: 'Коротко',
    about: 'Подробно'
  },
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
    [constants.ERROR_LOGIN_INCORRECT_DATA]: 'Неверный логин / пароль.',
    [constants.ERROR_EMAIL_INVALID]: 'Электронная почта неверного формата.',
    [constants.ERROR_EMAIL_TOO_LONG]: 'Электронная почта слишком длинная.',
    [constants.ERROR_PASSWORD_TOO_SHORT]: 'Пароль слишком короткий.',
    [constants.ERROR_PASSWORD_TOO_LONG]: 'Пароль слишком длинный.',
    [constants.ERROR_PASSWORD_INVALID]: 'Пароль не соответствует формату. Проверьте, чтобы в нём были только латинские буквы и цифры.',
    [constants.ERROR_NAME_TOO_LONG]: 'Имя слишком длинное.',
    [constants.ERROR_EXISTING_USER]: 'Пользователь с такой электронной почтой уже зарегистрирован.',
    [constants.ERROR_DAILY_LIMIT_INVALID]: `Дневной лимит должен быть не меньше 1 и не больше ${constants.MAX_DAILY_LIMIT}.`,
    [constants.ERROR_INTERFACE_LANGUAGE_ID_INVALID]: 'Выбран несуществующий язык интерфейса.',
    [constants.ERROR_SYNC]: 'Ошибка синхронизации с сервером. Постараемся это исправить. А пока попробуйте создать новую карточку или сделать ещё один повтор.',
    [constants.ERROR_SERVER_GENERIC]: 'Ошибка на сервере. Постараемся исправить её как можно скорее.',
    [constants.ERROR_NETWORK]: 'Ошибка соединения. Вероятно, нет связи с сетью.',
    [constants.ERROR_TOKEN_EXPIRED]: 'Ваша сессия истекла. Для безопасности аккаунта мы ограничиваем сессии по времени. Пожалуйста, выйдите и войдите снова. Иначе данные не будут синхронизироваться с сервером.'
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
  intro: {
    title: getTitle('О сайте коротко'),
    liRead: '{{liReadLink}} и подчёркивайте слова, в переводе которых не уверены.',
    liReadLinkText: 'Читайте интересные тексты',
    liDictionary: 'Вооружитесь {{liDictionaryLink1}} — и записывайте слова на карточки. Регулярно. {{liDictionaryLink2}}.',
    liDictionaryLink1Text: 'словарём',
    liDictionaryLink2Text: 'Каждый день',
    liRepeat: 'И повторяйте. Тоже {{liRepeatLink}}.',
    liRepeatLinkText: 'каждый день',
    liAnswer: 'Никаких тестов. Видите слово — просто отвечайте «Помню» или «Не помню». {{liAnswerLink}}.',
    liAnswerLinkText: 'Вы сами контролируете свои знания',
    liLookUp: 'Можно подсматривать. На результате это не скажется. Всё равно выучите.',
    liIntervals: 'Чтобы слово запомнилось, достаточно повторить его несколько раз через {{liIntervalsLink}}. Например, через день, через три дня и через десять.',
    liIntervalsLinkText: 'увеличивающиеся промежутки времени',
    liThree: 'Три раза подряд отвечаете, что помните слово — и оно считается выученным. Это не сразу, а {{liThreeLink}} :).',
    liThreeLinkText: 'на протяжении месяца',
    liContext: 'Чтобы лучше запоминалось, записывайте слово вместе с контекстом.',
    liDay: 'Один раз в день повторили старые слова — и до следующего дня об этом можно забыть. {{liDayLink}}.',
    liDayLinkText: 'Всё равно всё запомните',
    liVocab: 'Через месяц увидите, как вырос ваш словарный запас. Достаточно каждый день вписывать на карточки {{liVocabLink}}. Остальное — дело техники.',
    liVocabLinkText: 'несколько новых слов'
  },
  menu: {
    allFlashcards: 'Все карточки',
    about: 'О сайте',
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
