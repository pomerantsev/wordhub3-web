const dbName = 'wordhub';

const indexedDB = typeof window !== 'undefined' && window.indexedDB;

const dbReady = indexedDB ?
  new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.addEventListener('upgradeneeded', event => {
      console.log('Upgrading the database');
      const db = event.target.result;
      if (event.newVersion >= 1) {
        db.createObjectStore('flashcards', {keyPath: 'uuid'});
        db.createObjectStore('repetitions', {keyPath: 'uuid'});
        db.createObjectStore('assortedValues', {keyPath: 'key'});
      }
    });

    request.addEventListener('success', () => {
      console.log('Dababase successfully opened');
      resolve();
    });

    request.addEventListener('error', error => {
      console.log('IndexedDB error:', error);
      // TODO: Display in the UI that IndexedDB is not working.
      reject();
    });
  }) :
  Promise.reject();

export function writeData (flashcards, repetitions) {
  dbReady.then(() => {
    console.log(flashcards, repetitions);
  });
}
