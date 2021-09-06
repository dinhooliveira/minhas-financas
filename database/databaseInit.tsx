import { DatabaseConnection } from './databaseConnection';
import SqliteMigrator from './migrations/SqliteMigrator';
import SqliteMigration from './migrations/SqliteMigration';

var db = null
export default class DatabaseInit {

    constructor() {
        db = DatabaseConnection.getConnection()
        db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
            console.log('Foreign keys turned on')
        );
        this.InitDb()
    }

    private InitDb() {
        const v1 = require('./migrations/v01').default;
        const v2 = require('./migrations/v02').default;
        const migrator = new SqliteMigrator(db);
        migrator.up(new SqliteMigration(1,v1));
        migrator.up(new SqliteMigration(2,v2));
        migrator.migrate();

    }

}