var express = require('express');
var router = express.Router();
const getIdC = require('../controllers/getId.controller');

/* GET home page. */
router.get('/', getIdC.getFormGetID);
router.post('/', getIdC.postGetID);
router.get('/id_channel', getIdC.getForm);


module.exports = router;
