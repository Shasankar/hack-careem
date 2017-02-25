var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main');
var ctrlGetCar = require('../controllers/getCar');
/* GET home page. */

router.get('/', ctrlMain.index);

getCarController = function(req, res, next) {
  console.log(req.query.lat);
  console.log(req.query.long);
  res.render('car', { title: 'Get A Car', carId: 1234, time: '5 mins'});
};
router.get('/getCar', getCarController);

module.exports = router;
