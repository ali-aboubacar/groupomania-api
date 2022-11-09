module.exports = {
  HOST: "localhost",
  USER:DB_USER,
  PASSWORD: DB_PASSWORD,
  DB: DATABASE,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
