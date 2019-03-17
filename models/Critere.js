let connection = require('../config/db')
var table = "User_criteres"


class Critere{

		static create(id,request){
		connection.query('INSERT INTO ' + table + ' SET user_id = ?, minage = ?, maxage = ?, sexe = ?', 
			[id,
			null,
			null,
			null],
			function(err,result){
				if(err) throw err
			})
	}
	static update(id,request,cb){
		connection.query('UPDATE ' + table + ' SET minage = ?, maxage = ?, sexe = ? WHERE user_id= ?', 
			[request.body.minage,
			request.body.maxage,
			request.body.sexe,
			id],
			function(err,result){
				if(err) throw err
				result.critere = request.body
				result.critere.id = id
				result.critere.user_id = request.session.user.id

				cb(result.critere)
			})
	}

	static find(user_id,cb){
		var critere
		connection.query('SELECT * FROM '+ table + ' WHERE user_id = ?', [user_id], function(err,result){
			if(err) throw err
			critere= result[0]
			cb(critere)
		})
	}

}

module.exports=Critere