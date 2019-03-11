var fileController = require('./controllers/FileController')
const express = require('express');
exports.router = (function() { var apiRouter = express.Router();


apiRouter.route('/testfile').post(fileController.postImg);
return apiRouter; })();

