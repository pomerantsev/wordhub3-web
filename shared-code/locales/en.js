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
    save: 'Save'
  },
  errors: {
    sync: {
      0: 'Unfortunately, sychronization with server failed, please try running another repetition or creating another flashcard.'
    },
    tokenExpired: 'Your token has expired. For your security, we require you to re-login from time to time. Please log out and log back in. Otherwise, your data won’t be synchronized with the server.'
  },
  flashcardList: {
    title: getTitle('Flashcards'),
    searchingFor: 'Searching for “{{searchString}}”',
    clear: 'clear'
  },
  home: {
    login: 'Login'
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
    offline: 'Offline!'
  },
  repetitions: {
    title: getTitle('Word Repetition'),
    remember: 'Remember',
    dontRemember: 'Don’t remember',
    turnOver: 'Turn over'
  },
  signup: {
    title: getTitle('Signup'),
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
