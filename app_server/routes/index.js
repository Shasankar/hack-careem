var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlGetCar = require('../controllers/getCar');
/* GET home page. */

router.get('/', ctrlMain.index);

router.get('/getCar', ctrlGetCar.index);

module.exports = router;
