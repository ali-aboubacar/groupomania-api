const bcrypt = require("bcrypt");
const db = require("./../models");
const User = db.users;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
//creation d'un utilisateur
exports.signup = async (req, res, next) => {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(req.body.password, salt, function(err, hash) {
        const user = {
          lastName: req.body.lastName,
          firstName: req.body.firstName,
          email: req.body.email,
          password: hash,
        };
        User.create(user)
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch((error) => res.status(401).json({ error }));
      });
  });
};
//utiliser bcrypte pour comparer le password saisie
exports.login = async (req, res, next) => {
try{
  const user = await User.findOne({ where : {email : req.body.email }});
  if(user){
     const password_valid = await bcrypt.compare(req.body.password,user.password);
     if(password_valid){
         const token = jwt.sign({ userId: user.id, isAdmin:user.isAdmin },process.env.JWT_SECRET);
         return res.status(200).json({ token : token ,userId: user.id ,isAdmin:user.isAdmin, loggedIn:true});
     } else {
       return res.status(400).json({ error : "Mots de passe Incorect" ,loggedIn:false});
     }
   
   }else{
     return res.status(404).json({ error : "Utilisateur n'existe pas" ,loggedIn:false});
   }
}
catch(err){
  return res.status(501).json({error:"une erreur inconnue est survenue",errorData:err,loggedIn:false})
}
};

//recupere une seul sauce
exports.getOneUser = (req, res, next) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((data) => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Utilisateur avec id=${id} est introuvable.`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Utilisateur est introuvable id="+ id,
      });
    });
};

function maskEmail(email) {
  const firstCharacter = email.slice(0, 1);
  const lastPart = email.match(/\D{1}[A-Za-z]+\D{1}[a-z]{2,}$/gi);
  const slicedEmail = email.slice(1, email.indexOf("@") - email.length);
  const splitEmailArr = slicedEmail.split("");
  let asterixArr = [];

  for (let i = 0; i < splitEmailArr.length; i++) {
    let asterix = splitEmailArr[i].replace(splitEmailArr[i], "*");
    asterixArr.push(asterix);
  }
  function addAllParts(...arr) {
    return arr.reduce(function (acc, curr) {
      return acc + curr;
    });
  }
  const hashedEmail = addAllParts(firstCharacter, ...asterixArr, lastPart);
  return hashedEmail;
}
