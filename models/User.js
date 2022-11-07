module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    lastName: {
      type: Sequelize.STRING,
    },
    firstName: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    isAdmin: {
      type: Sequelize.BOOLEAN,
      defaultValue:false,
    }
  });

  return User;
};
