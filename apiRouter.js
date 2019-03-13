var fileController = require('./controllers/FileController')
var userController = require('./controllers/UserController')
var photoController = require('./controllers/UserController')


const express = require('express');
exports.router = (function() { var apiRouter = express.Router();


apiRouter.route('/signup').get(userController.create)

apiRouter.router('/signup').post(userController.store)


return apiRouter; })();

