import * as constants from '../data/constants';

const appName = 'Wordhub';

const getTitle = title => `${title} — ${appName}`;

const enTranslation = {
  appName,
  about: {
    title: getTitle('About'),
    whatToRead: {
      header: 'What to read and how?',
      paragraphs: {
        0: 'Just read what you find interesting. Texts that are not too hard for understanding. Where you occasionally bump into unfamiliar words. Underline them or copy to some dedicated document. This will be your basis for learning new words.',
        1: 'So this way you learn only the words that you encounter in real life, not something abstract.'
      }
    },
    dictionary: {
      header: 'What kind of dictionary to use?',
      paragraph: 'Any one that you find appropriate for your needs. It can contain translations to your mother tongue or explanations in the language you are studying. It all depends on your personal preferences and your skill level.'
    },
    everyDay: {
      header: 'Why is it best to study every day?',
      paragraphs: {
        0: 'Any training should be regular. That’s how you keep fit and motivated. If you are studying a foreign language, just like in sports, rhythm should be maintained.',
        1: 'Try to memorize a hundred unknown words in five hours. How many will you remember a month later? It’ll probably be no more than 10%.',
        2: 'Or repeat each of these words several times in the course of the month, spending the same five hours overall (that’s what Wordhub keeps you doing). The percentage is going to be much higher.'
      }
    },
    leitner: {
      header: 'How are words memorized?',
      paragraphWithLinks: 'The best way to remember any information is to repeat it in increasing intervals. This is the principle of spaced repetitions, which is the basis for the Leitner system (here are the {{link1}} and {{link2}} articles on Wikipedia).',
      link1: 'http://en.wikipedia.org/wiki/Spaced_repetition',
      link1Text: 'first',
      link2: 'http://en.wikipedia.org/wiki/Leitner_system',
      link2Text: 'second',
      paragraphs: {
        0: 'You create a flashcard, and in several days (the first interval is one to three days) Wordhub displays it to you for repetition. If you remember the meaning of the word, then next time you will repeat it in two to nine days. The third interval is up to a month.',
        1: 'Every time you don’t remember the given word, its flashcard is going to be back again in one to three days. The series of three repetitions is reset and started anew. Believe it or not, but sooner or later you’ll memorize the words you need.'
      }
    },
    howMany: {
      header: 'What is the best number of words to learn every day?',
      paragraphs: {
        0: 'Only you can tell that.',
        1: 'If you create 10 new flashcards each day, you’ll end up repeating 30 to 40 flashcards a day. It’s about half an hour a day for creating and repeating. If you create 20 flashcards, you’ll spend double the time, and so on.',
        2: 'Choose a pace you can sustain. Anyway, you’ll learn everything you need in its own time.'
      },
      paragraphWithLinks: 'That’s why it’s best to set a low limit in the {{link}}. And then increase it, but not too fast.',
      linkText: 'settings'
    },
    selfControl: {
      header: 'Self-control',
      paragraphs: {
        0: 'Other websites offer various types of quizzes and grade your progress. It may be fun, but it takes much time, especially if your studies are on a regular basis and if you are planning to memorize a lot of words (and that’s why you’re here, right?).',
        1: 'Wordhub is much simpler. We’re sure that you know at a glance if you remember the word or not. You can flip the flashcard to check if you’re correct. This won’t affect the result.',
        2: 'Wordhub compensates the lack of quizzes by helping you balance your load. You don’t need to think about what flashcards to repeat each day. The words that are easiest for you to memorize will be shown to you only three times. Those that cause mental strain at first will pop up as many times as it takes to memorize them properly.'
      }
    },
    whatElse: {
      header: 'What else can Wordhub be used for?',
      paragraphs: {
        0: 'Learn languages.',
        1: 'Learn grammar rules.',
        2: 'Learn any facts pertinent to your profession. Anything, actually.'
      }
    }
  },
  aboutWrapper: {
    heading: 'About Wordhub',
    intro: 'Intro',
    about: 'About'
  },
  createFlashcard: {
    title: getTitle('New Flashcard'),
    create: 'Create'
  },
  editFlashcard: {
    title: getTitle('Edit Flashcard'),
    save: 'Save',
    delete: 'Delete'
  },
  errors: {
    [constants.ERROR_LOGIN_INCORRECT_DATA]: 'User with such email and password is not registered.',
    [constants.ERROR_EMAIL_INVALID]: 'Email is invalid.',
    [constants.ERROR_EMAIL_TOO_LONG]: 'Email is too long.',
    [constants.ERROR_PASSWORD_TOO_SHORT]: 'Password is too short.',
    [constants.ERROR_PASSWORD_TOO_LONG]: 'Password is too long.',
    [constants.ERROR_PASSWORD_INVALID]: 'Password is invalid. Please check that it contains only alphanumeric characters.',
    [constants.ERROR_NAME_TOO_LONG]: 'Name is too long.',
    [constants.ERROR_EXISTING_USER]: 'A user with the given email is already registered.',
    [constants.ERROR_DAILY_LIMIT_INVALID]: `Daily limit should be between 1 and ${constants.MAX_DAILY_LIMIT}.`,
    [constants.ERROR_INTERFACE_LANGUAGE_ID_INVALID]: 'Invalid interface language.',
    [constants.ERROR_SYNC]: 'Unfortunately, sychronization with server failed, please try running another repetition or creating another flashcard.',
    [constants.ERROR_SERVER_GENERIC]: 'There’s been a server error. We’ll make our best effort to fix it soon.',
    [constants.ERROR_NETWORK]: 'There’s been a network error. You’re probably offline.',
    [constants.ERROR_TOKEN_EXPIRED]: 'Your token has expired. For your security, we require you to re-login from time to time. Please log out and log back in. Otherwise, your data won’t be synchronized with the server.'
  },
  flashcardInputs: {
    frontText: 'Word:',
    backText: 'Meaning:'
  },
  flashcardList: {
    title: getTitle('Flashcards'),
    search: 'Search:',
    searchingFor: 'Searching for “{{searchString}}”',
    clear: 'clear',
    deleted: 'Flashcard deleted.',
    undo: 'Undo',
    noSearchResults: 'No flashcards found.',
    noFlashcards: 'You haven’t created any flashcards.',
    create: 'Create'
  },
  footer: {
    authorName: 'Pavel Pomerantsev'
  },
  home: {
    header: 'A simple way to memorize foreign words',
    subheader: 'Just like paper flashcards, but a lot more convenient.',
    formHeader: 'Sign In',
    email: 'Email:',
    password: 'Password:',
    signIn: 'Sign in',
    signUp: 'Sign up',
    who: {
      header: 'Who needs this website',
      options: {
        0: 'If you read in a foreign language;',
        1: 'if your skills are not perfect and you encounter unfamiliar words from time to time;',
        2: 'if you’re unsure how to expand your vocabulary;'
      },
      memorize: 'then just memorize a few words a day. Wordhub is here to help.'
    },
    what: {
      header: 'How it works',
      paragraphs: {
        0: 'You create flashcards with words and their meanings.',
        1: 'Then you repeat them. Wordhub knows when a flashcard should be repeated, and the harder it is for you to memorize a particular word, the more often you see it.',
        2: 'You won’t find predefined dictionaries here, but Wordhub is easily customizable to your needs: you can create flashcards in any language; you can not only memorize words, but also facts (for example, work-related knowledge).',
        3: 'It’s best to create new flashcards and repeat old ones each day. Say, if you add 30 flashcards a day to your collection (not that many, really), you can memorize 10 thousand words in just a year. Two to three years of such training — and your vocabulary is close to that of native speakers.'
      }
    },
    why: {
      header: 'Why it’s convenient to study online',
      sameWithPaper: 'You can do the same with paper flashcards. But Wordhub has several advantages:',
      advantages: {
        0: 'It’s faster. You can copy and paste words and phrases from other websites. Or you can do a little bit of typing if you’re comfortable with it.',
        1: 'It’s accessible everywhere. Just have an Internet connection handy — and your whole flashcard collection is with you. Actually, Wordhub even works offline, while still synchronizing your flashcardы with the cloud when connection is available.',
        2: 'There’s less mental strain. You needn’t invent a system for your repetitions: the harder it is for you to memorize the word, the more often you have to repeat it. Wordhub takes care of the algorithm.',
        3: 'Wordhub is simpler than most other online learning systems — it just lets you add words to your vocabulary and repeat them at regular intervals. You might actually not need anything else than that.'
      }
    },
    learnMoreOrSignUp: 'You can {{learnMore}} or {{signUp}}.',
    infoLearnMore: 'learn more',
    infoSignUp: 'sign up'
  },
  intro: {
    title: getTitle('Intro'),
    liRead: '{{liReadLink}} and underline unfamiliar words.',
    liReadLinkText: 'Read something interesting',
    liDictionary: 'Have {{liDictionaryLink1}} handy and create flashcards. On a regular basis. {{liDictionaryLink2}}.',
    liDictionaryLink1Text: 'a dictionary',
    liDictionaryLink2Text: 'Every day',
    liRepeat: 'And then repeat them. Yes, also {{liRepeatLink}}.',
    liRepeatLinkText: 'every day',
    liAnswer: 'No quizzes. When presented with a word, just press “Remember” or “Don’t remember”. {{liAnswerLink}}.',
    liAnswerLinkText: 'Nobody but you checks your knowledge',
    liLookUp: 'You can look words up while repeating. It won’t affect your results — you’ll memorize everything anyway.',
    liIntervals: 'For a word to be properly memorized, it’s sufficient to repeat it several times at {{liIntervalsLink}}. For example, in a day, then in three days, and then again in ten days.',
    liIntervalsLinkText: 'increasing intervals',
    liThree: 'If you press “Remember” three times in a row, the word is considered learned.',
    liContext: 'To memorize a word better, write it down with its context.',
    liDay: 'You should just repeat words once a day, and then you can forget about them until the next day. {{liDayLink}}.',
    liDayLinkText: 'You’ll memorize them anyway',
    liVocab: 'You’ll be surprised how your vocabulary has grown in just a month. You should only add {{liVocabLink}}. Wordhub does the rest.',
    liVocabLinkText: 'a few new words'
  },
  menu: {
    allFlashcards: 'All Flashcards',
    about: 'About',
    create: 'Create',
    logout: 'Logout',
    repeat: 'Repeat',
    completedOfTotal: '{{completed}} of {{total}}',
    settings: 'Settings',
    stats: 'Stats'
  },
  notFound: {
    title: getTitle('404'),
    notFound: 'Page not found'
  },
  notifications: {
    offline: 'Offline',
    offlineHint: 'No network connection, but you can keep using the app. Don’t reload the page: in that case, everything you’ve done while being offline will be lost.',
    offlineDataSafe: 'Data is safe',
    offlineDataSafeHint: 'No network connection, but you can keep using the app. Data is stored locally, and when network is available again, all latest changes will be sent to the server.',
    whatsThis: 'what’s this?'
  },
  repetitions: {
    title: getTitle('Word Repetition'),
    remember: 'Remember',
    dontRemember: 'Don’t remember',
    turnOver: 'Turn over'
  },
  settings: {
    title: getTitle('Settings'),
    successMessage: 'Settings saved.',
    offlineAlert: 'You have to be online to change settings.',
    heading: 'Settings',
    dailyLimit: 'Daily limit for new flashcards:',
    dailyLimitHint: 'It’s not a hard limit, but {{dailyLimitHintLink}}.',
    dailyLimitHintLinkText: 'it’s still a good idea to keep up the pace',
    name: 'Name:',
    interfaceLanguage: 'Interface language:',
    interfaceLanguages: {
      0: 'Русский',
      1: 'English'
    },
    save: 'Save'
  },
  signup: {
    title: getTitle('Signup'),
    heading: 'Signup',
    email: 'Email:',
    notSharingEmail: 'We promise not to share it with anyone, ever.',
    password: 'Password:',
    anyCombination: 'Any digit and letter combination no shorter than six characters works. Password is case-sensitive.',
    name: 'Name:',
    howToAddress: 'What do we call you?',
    signUp: 'Sign up'
  },
  stats: {
    title: getTitle('Stats'),
    heading: 'Stats',
    general: 'General',
    flashcardsCreated: 'Flashcards created',
    flashcardsLearned: 'Flashcards learned',
    totalRepetitionsPlanned: 'Total repetitions planned',
    upcomingRepetitions: 'Upcoming repetitions',
    repetitionsPlannedUntil: 'Repetitions planned until',
    none: 'none',
    last30Days: 'Last 30 days',
    today: 'Today',
    totalRepetitions: 'Total repetitions',
    successfulRepetitions: 'Successful repetitions'
  }
};

export default enTranslation;
