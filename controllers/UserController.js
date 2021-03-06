let connection = require('../config/db')
let bcrypt = require('bcrypt')
let moment = require('moment')
var table = 'Users'
let Auth = require('../middlewares/Auth')
let Photos = require('./Photo')

module.exports={
	store: function(req,res){
		bcrypt.hash(user.password,10,function(err, hashed){
			if(err) throw err
				connection.query('INSERT INTO '+ table +' SET nom = ?, prenom = ?, email = ?, datenaissance = ?, password = ?, sexe = ?, description = ?', [
					user.nom,
					user.prenom,
					user.email,
					user.datenaissance,
					hashed,
					user.sexe,
					user.description
					],

					(error,result) => {
						if(error) 
							cb(undefined)
						else{
							result.user = user
							result.user.id= result.insertId
							user.datenaissance = moment(user.datenaissance).format('YYYY-MM-DD')
							result.user.password = undefined
							result.user.password_confirm = undefined
							cb(result.user)
						}
					})
		})
	},

	update: function(id,request,cb){
		var user=request.body
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
				cb(result)
			})
	},


}