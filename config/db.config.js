module.exports = {
  HOST: 'db4free.net',
  USER:process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: 'groupomania_db',
  dialect: "mysql",
  port:3306,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
