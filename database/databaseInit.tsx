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
        const v3 = require('./migrations/v03').default;
        const v4 = require('./migrations/v04').default;
        const migrator = new SqliteMigrator(db);
        migrator.up(new SqliteMigration(1,v1));
        migrator.up(new SqliteMigration(2,v2));
        migrator.up(new SqliteMigration(3,v3));
        migrator.up(new SqliteMigration(4,v4));
        migrator.migrate();
        

    }

}