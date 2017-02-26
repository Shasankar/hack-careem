var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlGetCar = require('../controllers/getCar');
var ctrlCaptain = require('../controllers/captain');
var ctrlSeed = require('../controllers/seed');
/* GET home page. */

router.get('/', ctrlMain.index);

router.get('/getCar', ctrlGetCar.index);

router.get('/captain', ctrlCaptain.index);

router.get('/seed', ctrlSeed.index);

module.exports = router;
