let connection = require('../config/db')
var table = 'Photos'


class Photos{

	static create(user_id, fileName,cb){
		connection.query('INSERT INTO '+ table +' SET user_id = ? , name = ?', [user_id,fileName],
			(err,result) => {
				if(err) 
					throw err
				
				else{
					return 1
				}
			})
	}
}

module.exports = Photos