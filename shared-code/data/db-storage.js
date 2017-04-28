const dbName = 'wordhub';

const indexedDB = typeof window !== 'undefined' && window.indexedDB;

let db;

const dbReady = indexedDB ?
  new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

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
      resolve();
    });

    request.addEventListener('error', error => {
      console.log('IndexedDB error:', error);
      // TODO: Display in the UI that IndexedDB is not working.
      reject();
    });
  }) :
  Promise.reject();

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

// TODO: Differentiate by user! Probably have one database per user.
export function writeData ({flashcards, repetitions}) {
  console.log('Flashcards to write to DB:', flashcards);
  console.log('dbReady promise:', dbReady);
  const startTime = Date.now();
  dbReady.then(() => {
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
