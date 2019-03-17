let connection = require('../config/db')
let bcrypt = require('bcrypt')
let moment = require('moment')
var table = 'Users'
let Auth = require('../middlewares/Auth')
let Photos = require('./Photo')
class User {

  constructor (datas){
    this.data = data
  }


  static create(request, cb){
    var user= request.body
    bcrypt.hash(user.password,10,function(err, hashed){
      if(err) throw err
        connection.query('INSERT INTO '+ table +' SET nom = ?, prenom = ?, email = ?, datenaissance = ?, password = ?, sexe = ?, description = ?, likes = ? ', [
          user.nom,
          user.prenom,
          user.email,
          user.datenaissance,
          hashed,
          user.sexe,
          user.description,
          JSON.stringify([{id : 80, likes : 1} , {id : 85 , likes : 0 }])
          ],

          (error,result) => {
            if(error) cb(undefined)
              else{
                result.user = user
                result.user.id= result.insertId
                user.datenaissance = moment(user.datenaissance).format('YYYY-MM-DD')
                result.user.password = undefined
                result.user.password_confirm = undefined

                request.session.user = result.user
                cb(result.user)
              }
            })
    })
  }

  static update(id,request,cb){
    var user=request.body
    var criteres = request.session.user.critere
    user.id=id
    connection.query('UPDATE ' + table +' SET nom = ?, prenom = ?, email = ?, datenaissance = ?, sexe = ?, description = ? WHERE id= ?',[
      user.nom,
      user.prenom,
      user.email,
      user.datenaissance,
      user.sexe,
      user.description,
      user.id
      ],
      (error,result) => {
        if(error) throw error
          request.session.user=user
        request.session.user.critere = criteres
        cb(user,result)
      })
  }



  static authenticate(request, cb){
    connection.query('SELECT * FROM ' + table + ' WHERE email = ?' , [request.body.email],
      (err,result) => {
        if(err) throw err
          if(result[0]){
            var user=result[0]
            user.datenaissance = moment(user.datenaissance).format('YYYY-MM-DD')
            bcrypt.compare(request.body.password, result[0].password, function(err,res){
              if(res===true){
                cb(user)
              }
              else
                cb(undefined)
            })
          }
          else{
            cb(undefined)
          }

        })
  }

  static find(id,cb){
    connection.query('SELECT U.nom,U.email, U.prenom,U.description,U.sexe,P.name AS photo,@age := (YEAR(CURDATE()) - YEAR(datenaissance)) AS age FROM ' + table
         + '  AS U JOIN Photos AS P ON U.id = P.user_id WHERE U.id = ? LIMIT 1 ', [id], function(err,result){
          if(err) throw err
            cb(result[0])
         })
  }

  //Fonction qui cherche les personnes respectants les criteres  : criteres
  static findByCritere(criteres,cb){
    User.getJSONLikes(criteres.user_id,function(likes){
      //On récupére tout les id qui sont dans la liste de Like en format JSON
      var idfind = likes.map(el => parseInt(el.id)).join(" , ")
      //Si la personne ne cherche un sexe bien spécifique, on ajoute cette condition à la requete sql
      if(criteres.sexe != 'B'){
        connection.query('SELECT U.id,U.nom,U.prenom,U.description,U.sexe,P.name AS photo,@age := (YEAR(CURDATE()) - YEAR(datenaissance)) AS age FROM ' + table
         + ' AS U JOIN Photos AS P ON U.id = P.user_id WHERE U.sexe = ? AND ((YEAR(CURDATE()) - YEAR(datenaissance)) BETWEEN ? AND ? ) AND U.id != ? AND U.id NOT IN (' + idfind + ')',
         [criteres.sexe,
         criteres.minage,
         criteres.maxage,
         criteres.user_id],
         function(err,result){
          if(err) throw err
            cb(result)

        })
      }
      //Sinon, pas de condition sur le sexe
      else{
        connection.query('SELECT U.id,U.nom,U.prenom,U.description,U.sexe,P.name AS photo,@age := (YEAR(CURDATE()) - YEAR(datenaissance)) AS age FROM ' + table
         + ' AS U JOIN Photos AS P ON U.id = P.user_id WHERE ((YEAR(CURDATE()) - YEAR(datenaissance)) BETWEEN ? AND ? ) AND U.id != ? AND U.id NOT IN (' + idfind + ')',
         [criteres.minage,
         criteres.maxage,
         criteres.user_id],
         function(err,result){
          if(err) throw err
            cb(result)

        })
      }
    })

  }
  //Fonction qui récupére tout les likes/dislikes de la personne ayant pour id : id
  static getJSONLikes(id,cb){
    connection.query('SELECT likes FROM ' + table + ' WHERE id = ? ', id , function(err,result){

      if(err) throw err
        cb(JSON.parse(result[0].likes))
    })
  }

  static findMatches(id,cb){
    User.getJSONLikes(id,function(likes){

      //On récupére tout les id qui sont dans la liste de Like en format JSON
      var idfind = likes.map(el => parseInt(el.id)).join(" , ")
      idfind = '( '  + idfind + ' )'
      connection.query('SELECT * FROM  '+ table +' WHERE `id` IN ' + idfind , function(err,result){
        if(err) throw err
          let matches = []

        //Pour chaque personne trouvée dans la liste 
        for(person of result){
          //on Parse les likes de la personne courante
          var likes2 = JSON.parse(person.likes)
            //on vérifie s'il  le like est réciproque
            if(User.isLiked(id, likes2) && User.isLiked(person.id,likes)){
              matches.push(person)
            }
          }

          //On retourne tous les matchs
          cb(matches)
        })
    })
    
  }


  //Fonction  qui cherche si la personne avec id : toFind est liké dans le JSONLikes, elle retourne le like si c'est le cas, null sinon
  static isLiked(toFind, JSONLikes){
    for(var like of JSONLikes){
      if(like.id == toFind && like.likes == 1)
        return like
      else if(like.id==toFind && like.likes == 0)
        return null
    }
    return null
  }

}

module.exports= User
