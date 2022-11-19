module.exports = {
  HOST: 'db4free.net',
  USER:'bacardii',
  PASSWORD: 'MG@Mw7aiC3VUcq@',
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
