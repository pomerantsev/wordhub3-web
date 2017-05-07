const dbNamePrefix = 'wordhub_';

// Only enable indexedDB in Chrome for now - performance in Safari and Firefox
// seems to be too low.
const indexedDB = typeof window !== 'undefined' &&
  /Chrome/.test(navigator.userAgent) &&
  window.indexedDB;

function putRecord (transaction, store, record) {
  return new Promise((resolve, reject) => {
    const request = transaction.objectStore(store).put(record);
    request.addEventListener('success', resolve);
    request.addEventListener('error', event => {
      console.log('Request errored:', event);
      reject(event.target.errorCode);
    });
  });
}

function deleteRecord (transaction, store, key) {
  return new Promise((resolve, reject) => {
    const request = transaction.objectStore(store).delete(key);
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
        if (event.newVersion >= 1 && event.oldVersion < 1) {
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

export function writeData (openDbPromise, {flashcards, repetitionUuidsToDelete, newRepetitions, assortedValues}) {
  console.log('To delete:', repetitionUuidsToDelete);
  console.log('To create:', newRepetitions);
  if (!openDbPromise) {
    return Promise.reject();
  }
  openDbPromise.then(db => {
    const startTime = Date.now();
    const transaction = db.transaction(['flashcards', 'repetitions', 'assortedValues'], 'readwrite');

    return new Promise((resolve, reject) => {
      let requestPromise = Promise.resolve();
      console.log('Before forEach');
      for (const flashcard of flashcards) {
        requestPromise = requestPromise.then(() => putRecord(transaction, 'flashcards', flashcard));
      }
      for (const uuid of repetitionUuidsToDelete) {
        requestPromise = requestPromise.then(() => deleteRecord(transaction, 'repetitions', uuid));
      }
      for (const repetition of newRepetitions) {
        requestPromise = requestPromise.then(() => putRecord(transaction, 'repetitions', repetition));
      }
      for (const key in assortedValues) {
        requestPromise = requestPromise.then(() => putRecord(transaction, 'assortedValues', {key, value: assortedValues[key]}));
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
  }, () => {
    // Fail silently - IndexedDB is not supported
  });
}

function getRecord (db, store, key) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(store).objectStore(store).get(key);

    request.addEventListener('success', event => {
      resolve(event.target.result && event.target.result.value);
    });

    request.addEventListener('error', event => {
      console.log('Read request error', event);
      reject();
    });
  });
}

function getAllRecords (db, store) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(store).objectStore(store).openCursor();
    const result = [];

    request.addEventListener('success', event => {
      const cursor = event.target.result;
      if (cursor) {
        result.push(cursor.value);
        cursor.continue();
      } else {
        resolve(result);
      }
    });

    request.addEventListener('error', event => {
      console.log('Read request error', event);
      reject();
    });
  });
}

export function getData (openDbPromise) {
  const startTime = Date.now();
  return openDbPromise.then(db => {
    return Promise.all([
      getAllRecords(db, 'flashcards'),
      getAllRecords(db, 'repetitions'),
      getRecord(db, 'assortedValues', 'lastSyncClientTime'),
      getRecord(db, 'assortedValues', 'lastSyncServerTime')
    ]).then(([flashcards, repetitions, lastSyncClientTime, lastSyncServerTime]) => {
      console.log('Read transaction completed successfully, it took', (Date.now() - startTime), 'ms');
      return {
        flashcards,
        repetitions,
        lastSyncClientTime,
        lastSyncServerTime
      };
    });
  }, () => ({
    flashcards: [],
    repetitions: []
  }));
}
