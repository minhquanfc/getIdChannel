const https = require("https");
let path = require("path");
const url = require('url');
const Downloader = require("nodejs-file-downloader");

exports.getFormDownload = (req, res, next) => {
    res.render('index2', {title: 'Video Douyin Download'})
}
exports.getFormDownLoads = (req, res, next) => {
    res.render('DownLoads', {title: 'Download video douyin'})
}
exports.downLoad =  (req, res, next) => {

}
exports.postDownLoadDouyin = (req, res, next) => {
    var link = req.body.url;
    if (link == "") {
        res.render('index2', {msg: 'Vui lòng nhập link video', title: 'Video Douyin Download'})
        return;
    }
    const URL = require('url').URL

    https.get(link, (resp) => {
        let data = '';
        resp.on('data', (chunk) => {
            data += chunk;
        });
        resp.on('end', () => {
            let ok = url.parse(resp.headers.location);
            const index = ok.pathname.substring(0, ok.pathname.length - 1).split(path.sep)
                .join('/')
                .lastIndexOf('/');
            const idVideo = ok.pathname.substring(index + 1, ok.pathname.length - 1);
            const api = "https://www.iesdouyin.com/web/api/v2/aweme/iteminfo/?item_ids=" + idVideo;
            https.get(api, (resp) => {
                let data = '';
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    const result = JSON.parse(data);
                    const {item_list} = result;
                    const {video} = item_list[0];
                    const mp4 = video.play_addr.url_list[0].replace('playwm', 'play');
                    console.log(mp4)
                    res.render('DownLoads', {mp4: mp4})
                });
            }).on("error", (err) => {
                res.render('index2', {msg: 'Lỗi vui lòng kiểm tra lại link video', title: 'Video Douyin Download'})
            });
        });
    })
}