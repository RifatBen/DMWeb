let connection = require('../config/db')
var table = 'Photos'


class Photos{

	static create(user_id, fileName){
		connection.query('INSERT INTO '+ table +' SET user_id = ? , name = ?', [user_id,fileName],
			(err,result) => {
				if(err) 
					return 0
			})
	}

	static update(user_id, fileName){
		connection.query('UPDATE  '+ table +' SET name = ? WHERE user_id = ? ', [fileName,user_id],
			(err,result) => {
				if(err) 
					console.log(err)
					return 0
			})
	}

	static delete(id,cb){
		connection.query('DELETE FROM ' + table + ' WHERE id = ?', [id], (err) => {
			if(err) throw err

			cb()
		})
	}
	
	static findAll(user_id,cb){
		connection.query('SELECT * FROM ' + table +' WHERE user_id= ? ', user_id , function(err,result){
			if(err) throw err
			cb(result[0])
		})
	}
}

module.exports = Photos