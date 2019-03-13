let connection = require('../config/db')
let bcrypt = require('bcrypt')
let moment = require('moment')
var table = "Users"

module.exports{
	authenticate: function(request,cb){
		connection.query('SELECT * FROM ' + table + ' WHERE email = ?' , [request.body.email],
			(err,result) => {
				if(err) throw err
					var user=result[0]
				user.datenaissance = moment(user.datenaissance).format('YYYY-MM-DD')
				bcrypt.compare(request.body.password, result[0].password, function(err,res){
					if(res===true){
						request.session.user = user
						cb(user)
					}
					else
						cb(undefined)
				})
			})
	}
}