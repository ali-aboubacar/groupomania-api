const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.users = require("./User.js")(sequelize, Sequelize);
db.posts = require("./Post.js")(sequelize, Sequelize);
db.likes = require("./Like.js")(sequelize, Sequelize);


db.users.hasMany(db.posts, {
  onDelete: "cascade",
});

db.posts.belongsTo(db.users, {
  onDelete: "cascade",
});

db.users.hasMany(db.likes, {
  onDelete: "cascade",
});

db.posts.hasMany(db.likes, {
  onDelete: "cascade",
});


module.exports = db;
