// Kleine IndexedDB-Hülle. Alle Daten bleiben auf dem Gerät.
const DB_NAME = 'lernapp';
const VERSION = 1;
export const STORES = ['profiles', 'areas', 'units', 'items', 'notes', 'ideas'];
let dbp = null;

function open() {
  if (dbp) return dbp;
  dbp = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const s of STORES) {
        if (!db.objectStoreNames.contains(s)) {
          const os = db.createObjectStore(s, { keyPath: 'id' });
          if (s !== 'profiles') os.createIndex('profileId', 'profileId');
        }
      }
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbp;
}

function tx(store, mode, fn) {
  return open().then((db) => new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const os = t.objectStore(store);
    let result;
    Promise.resolve(fn(os)).then((r) => { result = r; });
    t.oncomplete = () => resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error || new Error('abort'));
  }));
}
const reqP = (r) => new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });

export const getAll = (store) => tx(store, 'readonly', (os) => reqP(os.getAll()));
export const byProfile = (store, pid) => tx(store, 'readonly', (os) => reqP(os.index('profileId').getAll(pid)));
export const get = (store, id) => tx(store, 'readonly', (os) => reqP(os.get(id)));
export const put = (store, obj) => tx(store, 'readwrite', (os) => { os.put(obj); return obj; });
export const putMany = (store, arr) => tx(store, 'readwrite', (os) => { arr.forEach((o) => os.put(o)); return arr.length; });
export const del = (store, id) => tx(store, 'readwrite', (os) => { os.delete(id); });
export const delMany = (store, ids) => tx(store, 'readwrite', (os) => { ids.forEach((id) => os.delete(id)); });

export async function deleteProfileData(pid) {
  for (const s of STORES.filter((x) => x !== 'profiles')) {
    const rows = await byProfile(s, pid);
    await delMany(s, rows.map((r) => r.id));
  }
  await del('profiles', pid);
}

export const getMeta = (key) => tx('meta', 'readonly', (os) => reqP(os.get(key))).then((r) => (r ? r.value : undefined));
export const setMeta = (key, value) => tx('meta', 'readwrite', (os) => { os.put({ key, value }); });
