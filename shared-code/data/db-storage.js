const dbNamePrefix = 'wordhub_';

const indexedDB = typeof window !== 'undefined' && window.indexedDB;

function putRecord (transaction, store, record) {
  return new Promise((resolve, reject) => {
    console.log('Putting value:', record);
    const request = transaction.objectStore(store).put(record);
    request.addEventListener('success', resolve);
    request.addEventListener('error', event => {
      console.log('Request errored:', event);
      reject(event.target.errorCode);
    });
  });
}

export function openDb (email) {
  return indexedDB ?
    new Promise((resolve, reject) => {
      const request = indexedDB.open(dbNamePrefix + email, 1);

      let db;

      request.addEventListener('upgradeneeded', event => {
        console.log('Upgrading the database');
        db = event.target.result;
        if (event.newVersion >= 1) {
          db.createObjectStore('flashcards', {keyPath: 'uuid'});
          db.createObjectStore('repetitions', {keyPath: 'uuid'});
          db.createObjectStore('assortedValues', {keyPath: 'key'});
        }
      });

      request.addEventListener('success', event => {
        console.log('Dababase successfully opened');
        db = event.target.result;
        resolve(db);
      });

      request.addEventListener('error', event => {
        console.log('IndexedDB error:', event);
        // TODO: Display in the UI that IndexedDB is not working.
        reject();
      });
    }) :
    Promise.reject();
}

export function writeData (openDbPromise, {flashcards, repetitions}) {
  console.log('Flashcards to write to DB:', flashcards);
  if (!openDbPromise) {
    return Promise.reject();
  }
  openDbPromise.then(db => {
    const startTime = Date.now();
    const transaction = db.transaction(['flashcards', 'repetitions'], 'readwrite');

    return new Promise((resolve, reject) => {
      let requestPromise = Promise.resolve();
      console.log('Before forEach');
      for (const flashcard of flashcards) {
        requestPromise = requestPromise.then(() => putRecord(transaction, 'flashcards', flashcard));
      }
      for (const repetition of repetitions) {
        requestPromise = requestPromise.then(() => putRecord(transaction, 'repetitions', repetition));
      }

      transaction.addEventListener('complete', () => {
        console.log('Write transaction completed successfully, it took', (Date.now() - startTime), 'ms');
        resolve();
      });

      transaction.addEventListener('error', event => {
        console.log('Error in transaction:', event);
        reject(event.target.errorCode);
      });
    });
  });
}
