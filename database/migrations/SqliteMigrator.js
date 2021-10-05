/** 
 * this class decides what migrations to run and runs them
 */
 export default class SqliteMigrator {
    constructor(db) {
      this._db = db;
  
      this.initialize();
      this._migrationsMap = {};
      this._versions = [];
      this._cursor = 0;
    }
  
    _next(e) {
      if (this._versions[this._cursor]) {
        const next = this._versions[this._cursor];
        this._migrationsMap[next].execute(this._db, () => {
          this._cursor++;
          this._next();
        });
      } else {
        // done!
        this._cursor = 0;
        // update version stored in the database to current version
        this._db.transaction(txn => {
          txn.executeSql("UPDATE version SET version = :version", [this._db.version]);
        });
      }
    }
  
    initialize() {
      this._db.transaction(txn => {
        txn.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name=:name", ['version'], (tx, result) => {
          if (!result.rows.length) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS version (version INTEGER)');
            tx.executeSql('CREATE INDEX IF NOT EXISTS version_idx ON version (version);');
            tx.executeSql('INSERT INTO version (version) VALUES (:version)', [0]);
            tx.executeSql('CREATE TABLE IF NOT EXISTS executed_migrations (migration INTEGER)');
            tx.executeSql('CREATE INDEX IF NOT EXISTS migration_idx ON executed_migrations (migration);')
            this.currentVersion = 0;
          } else {
            tx.executeSql('SELECT version FROM version LIMIT 1', [], (tx, result) => {
              this.currentVersion = result.rows.item(0).version;
            });
          }
        });
      }, error => console.error(error), this.migrate.bind(this));
    }
  
    migrate() {
      if (typeof this.currentVersion === 'undefined') return; // haven't initialized yet
  
      if (this._cursor === 0 && this.currentVersion < this._db.version) {
        let found = false;
        for (let i = 0; i < this._versions.length && !found; i++) {
          if (this.currentVersion >= this._versions[i]) {
            this._cursor = i + 1;
          } else {
            found = true;
          }
        }
  
        // call migrations
        this._next();
      }
    }
  
    up(migration) {
      if (this._migrationsMap[migration.version]) throw new Error('Migration with that version number already exists');
      this._migrationsMap[migration.version] = migration;
  
      this._versions.push(migration.version);
      this._versions.sort((a, b) => a - b);
    }
    
  }
  