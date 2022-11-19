module.exports = {
  HOST: db4free.net,
  USER:'Bacardii',
  PASSWORD: 'MG@Mw7aiC3VUcq@',
  DB: 'groupomania_db',
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
    port:3306,
  },
};
