import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;
let initPromise: Promise<void> | null = null;

export async function initDB() {
  if (db) return;
  
  if (initPromise) {
    await initPromise;
    return;
  }

  initPromise = (async () => {
    try {
      const SQL = await initSqlJs({
        locateFile: file => `https://sql.js.org/dist/${file}`
      });
      
      db = new SQL.Database();
      
      db.run(`
        CREATE TABLE IF NOT EXISTS samples (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          sampleNumber TEXT NOT NULL,
          fabricationDate TEXT NOT NULL,
          day7Date TEXT NOT NULL,
          day14Date TEXT NOT NULL,
          day28Date TEXT NOT NULL,
          client TEXT NOT NULL,
          site TEXT NOT NULL,
          concreteType TEXT NOT NULL,
          elementCoule TEXT NOT NULL,
          day7Result REAL,
          day14Result REAL,
          day28Result REAL,
          createdAt TEXT DEFAULT CURRENT_TIMESTAMP
        )
      `);
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to initialize database. Please refresh the page.');
    }
  })();

  await initPromise;
}

export function runQuery(query: string, params: any[] = []) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  try {
    const stmt = db.prepare(query);
    return stmt.run(params);
  } catch (error) {
    console.error('Error running query:', error);
    throw error;
  }
}

export function getAllRows(query: string) {
  if (!db) {
    throw new Error('Database not initialized. Call initDB() first.');
  }
  try {
    const result = db.exec(query);
    if (!result.length) return [];
    
    const columns = result[0].columns;
    return result[0].values.map(row => {
      const obj: any = {};
      columns.forEach((col, i) => {
        obj[col] = row[i];
      });
      return obj;
    });
  } catch (error) {
    console.error('Error getting rows:', error);
    throw error;
  }
}