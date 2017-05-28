import log from 'loglevel';

const dbNamePrefix = 'wordhub_';

function putRecord (transaction, store, record) {
  return new Promise((resolve, reject) => {
    const request = transaction.objectStore(store).put(record);
    request.addEventListener('success', resolve);
    request.addEventListener('error', event => {
      log.error('Request errored:', event);
      reject(event.target.errorCode);
    });
  });
}

function deleteRecord (transaction, store, key) {
  return new Promise((resolve, reject) => {
    const request = transaction.objectStore(store).delete(key);
    request.addEventListener('success', resolve);
    request.addEventListener('error', event => {
      log.error('Request errored:', event);
      reject(event.target.errorCode);
    });
  });
}

export function openDb (indexedDB, email) {
  return indexedDB ?
    new Promise((resolve, reject) => {
      const request = indexedDB.open(dbNamePrefix + email, 2);

      let db;

      request.addEventListener('upgradeneeded', event => {
        log.debug('Upgrading the database');
        db = event.target.result;
        if (event.newVersion >= 1 && event.oldVersion < 1) {
          db.createObjectStore('flashcards', {keyPath: 'uuid'});
          db.createObjectStore('repetitions', {keyPath: 'uuid'});
          db.createObjectStore('assortedValues', {keyPath: 'key'});
        }
        if (event.newVersion >= 2 && event.oldVersion < 2) {
          db.createObjectStore('userSettings', {keyPath: 'key'});
        }
      });

      request.addEventListener('success', event => {
        log.debug('Dababase successfully opened');
        db = event.target.result;
        resolve(db);
      });

      request.addEventListener('error', event => {
        log.warn('IndexedDB error:', event);
        reject();
      });
    }) :
    Promise.reject();
}

export function writeData (openDbPromise, {flashcards, repetitionUuidsToDelete, newRepetitions, assortedValues}) {
  log.debug('To delete:', repetitionUuidsToDelete);
  log.debug('To create:', newRepetitions);
  if (!openDbPromise) {
    return Promise.reject();
  }
  openDbPromise.then(db => {
    const startTime = Date.now();
    const transaction = db.transaction(['flashcards', 'repetitions', 'assortedValues'], 'readwrite');

    return new Promise((resolve, reject) => {
      let requestPromise = Promise.resolve();
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
        log.debug('Write transaction completed successfully, it took', (Date.now() - startTime), 'ms');
        resolve();
      });

      transaction.addEventListener('error', event => {
        log.error('Error in transaction:', event);
        reject(event.target.errorCode);
      });
    });
  }, () => {
    // Fail silently - IndexedDB is not supported
  });
}

export function writeUserSettings (openDbPromise, userSettings) {
  if (!openDbPromise) {
    return Promise.reject();
  }
  openDbPromise.then(db => {
    const transaction = db.transaction(['userSettings'], 'readwrite');

    return new Promise((resolve, reject) => {
      let requestPromise = Promise.resolve();
      for (const key in userSettings) {
        requestPromise = requestPromise.then(() => putRecord(transaction, 'userSettings', {key, value: userSettings[key]}));
      }

      transaction.addEventListener('complete', resolve);

      transaction.addEventListener('error', event => {
        log.error('Error in transaction:', event);
        reject(event.target.errorCode);
      });
    });
  });
}

function getRecord (db, store, key) {
  return new Promise((resolve, reject) => {
    const request = db.transaction(store).objectStore(store).get(key);

    request.addEventListener('success', event => {
      resolve(event.target.result && event.target.result.value);
    });

    request.addEventListener('error', event => {
      log.error('Read request error', event);
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
      log.error('Read request error', event);
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
      getRecord(db, 'assortedValues', 'lastSyncServerTime'),
      getAllRecords(db, 'userSettings')
    ]).then(([flashcards, repetitions, lastSyncClientTime, lastSyncServerTime, userSettingsAsArray]) => {
      log.debug('Read transaction completed successfully, it took', (Date.now() - startTime), 'ms');
      return {
        flashcards,
        repetitions,
        lastSyncClientTime,
        lastSyncServerTime,
        userSettings: Object.assign({}, ...userSettingsAsArray.map(setting => ({[setting.key]: setting.value})))
      };
    });
  }, () => ({
    flashcards: [],
    repetitions: []
  }));
}
