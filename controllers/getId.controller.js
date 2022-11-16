const {channelId} = require("@gonetone/get-youtube-id-by-url");

exports.getFormGetID = (req, res, next) => {
    res.render('index', {title: 'GET ID CHANNEL YOUTUBE'})
}
exports.getForm = (req, res, next) => {
    res.render('idChannel', {title: 'GET ID CHANNEL YOUTUBE'})
}
exports.postGetID = (req, res, next) => {
    const url = req.body.url;
    console.log(url)
    channelId(url)
        .then((id) => {
            // res.send(id);
            res.render('idChannel', {id:id})
            console.log({id:id})
        })
        .catch((err) => {
            res.send("Không lấy được id channel");
        });
}