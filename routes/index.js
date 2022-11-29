var express = require('express');
var router = express.Router();
const getIdC = require('../controllers/getId.controller');
const getDownload = require('../controllers/douyin.controller');

/* GET home page. */
router.get('/', getIdC.getFormGetID);
router.post('/', getIdC.postGetID);
router.get('/id_channel', getIdC.getForm);
router.get('/download', getDownload.getFormDownload);
router.post('/download', getDownload.postDownLoadDouyin);
router.get('/download_douyin', getDownload.getFormDownLoads);;




module.exports = router;
