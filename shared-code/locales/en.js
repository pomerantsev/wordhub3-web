import * as constants from '../data/constants';

const appName = 'Wordhub';

const getTitle = title => `${title} — ${appName}`;

const enTranslation = {
  appName,
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
    sync: {
      0: 'Unfortunately, sychronization with server failed, please try running another repetition or creating another flashcard.'
    },
    login: {
      [constants.LOGIN_NETWORK_ERROR]: 'There’s been a network error. You’re probably offline.',
      [constants.LOGIN_SERVER_ERROR]: 'There’s been a server error. We’ll make our best effort to fix it soon.',
      [constants.LOGIN_INCORRECT_DATA]: 'User with such email and password is not registered.'
    },
    signup: {
      [constants.SIGNUP_NETWORK_ERROR]: 'There’s been a network error. You’re probably offline.',
      [constants.SIGNUP_SERVER_ERROR]: 'There’s been a server error. We’ll make our best effort to fix it soon.',
      [constants.SIGNUP_EMAIL_INVALID]: 'Email is invalid.',
      [constants.SIGNUP_EMAIL_TOO_LONG]: 'Email is too long.',
      [constants.SIGNUP_PASSWORD_TOO_SHORT]: 'Password is too short.',
      [constants.SIGNUP_PASSWORD_TOO_LONG]: 'Password is too long.',
      [constants.SIGNUP_PASSWORD_INVALID]: 'Password is invalid. Please check that it contains only alphanumeric characters.',
      [constants.SIGNUP_NAME_TOO_LONG]: 'Name is too long.',
      [constants.SIGNUP_EXISTING_USER]: 'A user with the given email is already registered.'
    },
    tokenExpired: 'Your token has expired. For your security, we require you to re-login from time to time. Please log out and log back in. Otherwise, your data won’t be synchronized with the server.'
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
  menu: {
    allFlashcards: 'All Flashcards',
    create: 'Create',
    logout: 'Logout',
    repeat: 'Repeat',
    completedOfTotal: '{{completed}} of {{total}}',
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
