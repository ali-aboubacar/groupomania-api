//const User = require("../models/User");
const db = require("./../models");
const Post = db.posts;
const Like = db.likes;
const User = db.users;
const Op = db.Sequelize.Op;
const fs = require("fs");
//cree une sauce
exports.createPost = (req, res, next) => {
  const userId = req.auth.userId;
  const post = req.file
    ? {
        ...req.body,userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body,userId };

  Post.create(post)
    .then(() => {
      res.status(201).json({ message: "Objet enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//modifier une sauce
exports.modifyPost = (req, res, next) => {
  //verifier si
  const postObject = req.file
    ? {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  // delete postObject._userId;
  Post.findByPk(req.params.id)
    .then((post) => {
      if (!post) {
        return res.status(401).json({ message: "Acces Refuse" });
      } else {
        if(!req.auth.isAdmin && req.auth.userId != post.userId){
          return res.status(403).json({message:"Acces Refuse"})
        }
        if(post.imageUrl){
          const Filename = post.imageUrl.split("/images/")[1];
          fs.unlink(`images/${Filename}`, () => {
            Post.update({ ...postObject }, { where: { id: req.params.id } })
              .then(() => res.status(200).json({ message: "Objet modifié!" }))
              .catch((error) => res.status(401).json({ error }));
          });
      }else{
        Post.update({ ...postObject }, { where: { id: req.params.id } })
              .then(() => res.status(200).json({ message: "Objet modifié!" }))
              .catch((error) => res.status(401).json({ error }));
      }

      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
//ajouter les likes
exports.addLikes = async (req, res, next) => {

try{
  const userId = req.auth.userId;
  const postId = req.params.id;
  const found = await Like.findOne({
    where: { postId: postId, userId: userId },
  });
  const post = await Post.findByPk(postId);
  if (!found) {
     await Like.create({ postId: postId, userId: userId });
     await post.increment('likesNum', { by: 1 });
    return res.status(200).json({ liked: true });
  } else {
    await Like.destroy({
      where: { postId: postId, userId: userId },
    });
    await post.increment('likesNum', { by: -1 });
    return res.status(200).json({ liked: false });
  }
}catch(err){
  console.log(err)
  return res.status(500).json({message: err})
}
};
//suprimer une sauce
exports.deletePost = (req, res, next) => {
  Post.findByPk(req.params.id)
    .then((post) => {
      if (!post) {
        res.status(401).json({ message: "Acces Refuser" });
      } else {
        if(!req.auth.isAdmin && req.auth.userId != post.userId){
          return res.status(403).json({message:"Acces Refuse"})
        }
        const filename = post.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Post.destroy({ where: { id: req.params.id } })
            .then(() => {
              res.status(200).json({ message: "Objet supprimé !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

//recupere une seul sauce
exports.getOnePost = async (req, res, next) => {
  const id = req.params.id;
try {
  const singlePost = await Post.findOne({ include: {
    model: User,
    attributes:["firstName","lastName"]
  },where:{id:id}})
  console.log(JSON.stringify(singlePost, null, 2));
  return res.status(200).send(singlePost );
}catch(err){
  return res.status(500).json({message: err}) 
}
};
//recuperer toute les sauces
exports.getAllPost = async (req, res, next) => {
  try{
    const listOfPosts = await Post.findAll({ include: {
      model: User,
      attributes:["firstName","lastName"]
    }, order: [ [ 'createdAt', 'DESC' ]]},);
    const likedPosts = await Like.findAll({ where: { userId: req.auth.userId } });
    return res.status(200).send({likedPosts:likedPosts,listOfPosts:listOfPosts})
  }catch(err){
    return res.status(500).json({message: err})
  }

};
