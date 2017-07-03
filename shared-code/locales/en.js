import * as constants from '../data/constants';

const appName = 'Wordhub';

const getTitle = title => `${title} — ${appName}`;

const enTranslation = {
  appName,
  about: {
    title: getTitle('About'),
    whatToRead: {
      header: 'What should I read?',
      paragraphs: {
        0: 'Just read what you find interesting. Choose texts that are not too easy but also not too challenging. When you occasionally bump into unfamiliar words, underline them or copy and paste them into a separate document.',
        1: 'This way, you learn the words that you encounter in real life, not a list of abstract words you may never see again.'
      }
    },
    dictionary: {
      header: 'What kind of dictionary should I use?',
      paragraph: 'Choose one that you find appropriate for your needs. It may contain translations to your mother tongue or explanations in the language you are studying. It all depends on your personal preferences and your skill level.'
    },
    everyDay: {
      header: 'Why is it best to study every day?',
      paragraphs: {
        0: 'Any training should be regular. That’s how you keep fit and motivated. Whether you are playing a sport or studying a foreign language, rhythm should be maintained.',
        1: 'Suppose we asked you to memorize 100 unknown words in five hours. How many will you remember a month later? It’d probably be no more than 10%.',
        2: 'But what if you repeat each of these words several times in the course of the month, spending the same five hours overall? Your recall percentage is going to be much higher. And that’s why Wordhub works.'
      }
    },
    leitner: {
      header: 'How will I memorize the words?',
      paragraphWithLinks: 'The best way to remember any information is to repeat it in intervals. This principle of spaced repetitions is the basis for the Leitner system (see {{link1}} and {{link2}} for more information).',
      link1: 'http://en.wikipedia.org/wiki/Spaced_repetition',
      link1Text: 'http://en.wikipedia.org/wiki/Spaced_repetition',
      link2: 'http://en.wikipedia.org/wiki/Leitner_system',
      link2Text: 'http://en.wikipedia.org/wiki/Leitner_system',
      paragraphs: {
        0: 'You will create an electronic flashcard for a word, and several days later, Wordhub will ask you if you remember the meaning of the word. If you do, you will see it again in two to nine days. The third interval ranges from four to 27 days.',
        1: 'If you don’t remember the given word, the series of three repetitions starts over. So, the flashcard will be shown again in one to three days. Via this process, over time you’ll memorize—and retain—the words you need.'
      }
    },
    howMany: {
      header: 'What is the ideal number of words to learn every day?',
      paragraphs: {
        0: 'Only you can determine that.',
        1: 'If you create 10 new flashcards each day, you’ll end up repeating 30 to 40 flashcards a day. It takes about half an hour a day to create 10 flashcards and be quizzed on existing ones. If you create 20 flashcards, you’ll spend double that time, and so on.',
        2: 'Choose a pace you can sustain. You’ll learn everything you need over time.'
      },
      paragraphWithLinks: 'That’s why it’s best to set a low limit in the {{link}}. You can increase it later, but not too quickly.',
      linkText: 'settings'
    },
    selfControl: {
      header: 'You control your learning',
      paragraphs: {
        0: 'Other websites offer various types of quizzes and grade your progress. That may be fun, but it takes a lot of time, especially if you are a busy student and you are planning to memorize a lot of words (and that’s why you’re here, right?).',
        1: 'Wordhub is much simpler. We’re sure that you know at a glance if you remember the word or not. You can flip the flashcard to check if you’re correct. Doing so won’t affect the result.',
        2: 'Wordhub helps you balance your load. You don’t need to think about what flashcards to repeat each day. The words that were easy for you to memorize will be shown to you only three times. Those that cause mental strain will pop up as many times as it takes to memorize them properly.'
      }
    },
    whatElse: {
      header: 'What else can Wordhub be used for?',
      paragraph: 'It can help you',
      listItems: {
        0: 'learn languages',
        1: 'learn grammar rules',
        2: 'learn any facts pertinent to your profession.'
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
    [constants.ERROR_LOGIN_INCORRECT_DATA]: 'User with this email and password is not registered.',
    [constants.ERROR_EMAIL_INVALID]: 'Email is invalid.',
    [constants.ERROR_EMAIL_TOO_LONG]: 'Email is too long.',
    [constants.ERROR_PASSWORD_TOO_SHORT]: 'Password is too short.',
    [constants.ERROR_PASSWORD_TOO_LONG]: 'Password is too long.',
    [constants.ERROR_PASSWORD_INVALID]: 'Password is invalid. Please check that it contains only alphanumeric characters.',
    [constants.ERROR_NAME_TOO_LONG]: 'Name is too long.',
    [constants.ERROR_EXISTING_USER]: 'A user with the given email is already registered.',
    [constants.ERROR_DAILY_LIMIT_INVALID]: `Daily limit should be between 1 and ${constants.MAX_DAILY_LIMIT}.`,
    [constants.ERROR_INTERFACE_LANGUAGE_ID_INVALID]: 'Invalid interface language.',
    [constants.ERROR_SYNC]: 'Unfortunately, synchronization with the server failed. Please try running another repetition or creating another flashcard.',
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
      header: 'Who needs this website?',
      options: {
        0: 'If you read in a foreign language,',
        1: 'if your skills are not perfect and you encounter unfamiliar words from time to time, or',
        2: 'if you’re unsure how to expand your vocabulary,'
      },
      memorize: 'then just memorize a few words a day. Wordhub is here to help.'
    },
    what: {
      header: 'How it works',
      paragraphs: {
        0: 'You create flashcards with words and their meanings.',
        1: 'Then you repeat them. Wordhub knows when a flashcard should be repeated, and the harder it is for you to memorize a particular word, the more often you will see it.',
        2: 'You won’t find predefined dictionaries here, but Wordhub is easily customizable to your needs. You can create flashcards in any language, and you can memorize not only words but also facts (such as work-related knowledge).',
        3: 'It’s best to create new flashcards and repeat old ones each day. If you add 30 flashcards a day to your collection (not that many, really), you can memorize 10,000 words in just a year. Stick with such training for two or three years, and the size of your vocabulary will be close to that of native speakers.'
      }
    },
    why: {
      header: 'Why it’s convenient to study online',
      sameWithPaper: 'Sure, you can increase your vocabulary using paper flashcards. But Wordhub has several advantages:',
      advantages: {
        0: 'It’s faster. You can copy and paste words and phrases from other websites. Or you can do a little bit of typing if you’re comfortable with it.',
        1: 'It’s accessible everywhere. Just find an Internet connection and your whole flashcard collection is with you. Actually, Wordhub even works offline, synchronizing your flashcards with the cloud when a connection is available.',
        2: 'There’s less mental strain. You needn’t invent a system for your repetitions. Wordhub takes care of the algorithm. The harder it is for you to memorize the word, the more often you have to repeat it.',
        3: 'Wordhub is simpler than most other online learning systems—it lets you add words to your vocabulary and repeat them at regular intervals. You might actually not need anything else than that.'
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
    liLookUp: 'You can look words up while repeating. It won’t affect your results—you’ll memorize everything anyway.',
    liIntervals: 'For a word to be properly memorized, it’s sufficient to repeat it several times at {{liIntervalsLink}}. For example, you might repeat it in one day, then in three days, and then again in ten days.',
    liIntervalsLinkText: 'increasingly spaced intervals',
    liThree: 'If you press “Remember” three times in a row, the word is considered learned.',
    liContext: 'To memorize a word better, write it down with its context.',
    liDay: 'You should just repeat words once a day, and then you can forget about them until the next day. {{liDayLink}}.',
    liDayLinkText: 'You’ll memorize them anyway',
    liVocab: 'You’ll be surprised how your vocabulary grows in just a month. You should add {{liVocabLink}}. Wordhub does the rest.',
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
    offlineHint: 'There is no network connection, but you can keep using the app. Just don’t reload the page or everything you’ve done while offline will be lost.',
    offlineDataSafe: 'Data is safe',
    offlineDataSafeHint: 'There is no network connection, but you can keep using the app. Data is stored locally, and when the network is available again, all changes will be sent to the server.',
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
    dailyLimitHint: 'You don’t have to adhere to this limit, but {{dailyLimitHintLink}}.',
    dailyLimitHintLinkText: 'we recommend keeping up the pace',
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
    anyCombination: 'Use any digit and letter combination of at least six characters. Password is case-sensitive.',
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
