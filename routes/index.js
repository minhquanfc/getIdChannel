var express = require('express');
var router = express.Router();
const getIdC = require('../controllers/getId.controller');
const getDownload = require('../controllers/douyin.controller');
const ggSheet = require('../controllers/ggsheet.controller');

/* GET home page. */
router.get('/', getIdC.getFormGetID);
router.post('/', getIdC.postGetID);
router.get('/id_channel', getIdC.getForm);
router.get('/download', getDownload.getFormDownload);
router.post('/download', getDownload.postDownLoadDouyin);
router.get('/download_douyin', getDownload.getFormDownLoads);;
router.get('/test', ggSheet.getData);
router.get('/get_id', getIdC.getFormData);
router.post('/get_id', getIdC.clearData);






module.exports = router;
