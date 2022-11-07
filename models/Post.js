module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    title: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.TEXT,
    },
    imageUrl: {
      type: Sequelize.STRING,
    },
    likesNum:{
      type: Sequelize.INTEGER,
      defaultValue: 0,
    }
  });
  return Post;
};
