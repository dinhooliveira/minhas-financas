const  version = [
    `CREATE TABLE IF NOT EXISTS tipo_despesa (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          descricao DATE,
          data_registro DATETIME
   
      );`,
      `CREATE TABLE IF NOT EXISTS despesa (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          descricao TEXT,
          tipo_despesa_id INTEGER,
          valor REAL,
          data DATE,
          data_registro DATE,
          hora_registro HOUR,
          FOREIGN KEY (tipo_despesa_id) REFERENCES tipo_despesa (id)
      );`,        
      `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('Alimentação','NOW()');`,
      `INSERT INTO tipo_receita (descricao,data_registro) VALUES ('Educação','NOW()');`,
];

export default version;