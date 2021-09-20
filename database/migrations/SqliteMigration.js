
export default class SqliteMigration {
    constructor(version, sql) {
      this.version = version;
      this.sql = sql;
    }
  
    execute = (db, next) => {
      function exec(tx, sql) {
        console.log(sql);
        tx.executeSql(sql);
      }
  
      db.transaction(txn => {
        txn.executeSql("SELECT migration FROM executed_migrations WHERE migration=:migration", [this.version], (tx, result) => {
          console.log(this.version);
          if (!result.rows.length) {
            if (Array.isArray(this.sql)) {
              this.sql.forEach(s => exec(tx, s));
            } else {
              exec(tx, this.sql);
            }
            tx.executeSql('INSERT INTO executed_migrations (migration) VALUES (:migration)', [this.version]);
          }
        });
      }, error => {
        // Sentry.captureException(error, { logger: 'sqlite.migrations' });
        next(error);
      }, next);
    }
  }
  