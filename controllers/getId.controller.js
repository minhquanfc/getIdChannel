const {channelId} = require("@gonetone/get-youtube-id-by-url");
const ytch = require('yt-channel-info');


exports.getFormGetID = (req, res, next) => {
    res.render('index', {title: 'GET ID CHANNEL YOUTUBE'})
}
exports.getForm = (req, res, next) => {
    res.render('idChannel', {title: 'GET ID CHANNEL YOUTUBE'})
}
exports.postGetID = async (req, res, next) => {
    const url = req.body.url;
    if (url == "") {
        res.render('index', {msg: 'Vui lòng nhập link kênh', title: "GET ID CHANNEL YOUTUBE"})
        return;
    }
    console.log(url)
    channelId(url)
        .then((id) => {
            // res.send(id);
            let payload = {
                channelId: id,
                channelIdType: 0,
            }

            ytch.getChannelInfo(payload).then((response) => {
                if (!response.alertMessage) {
                    res.render('idChannel', {response: response})
                } else {
                    res.send("Không tìm thấy kênh.")
                }
            }).catch((err) => {
                res.send("Lỗi không lấy được id channel")
            })

            // res.render('idChannel', {id: id})
            // console.log({id: id})
        })
        .catch((err) => {
            res.render('index', {
                msg: 'Lỗi không lấy được id channel, vui lòng kiểm tra lại link',
                title: "GET ID CHANNEL YOUTUBE"
            })
        });
}
exports.postGetChannel2 = (req, res, next) => {
    const url = req.body.url;
    const payload = {
        channelId: url,
        channelIdType: 0,
    }

    ytch.getChannelInfo(payload).then((response) => {
        if (!response.alertMessage) {
            console.log(response)
            res.send(response)
        } else {
            console.log('Channel could not be found.')
        }
    }).catch((err) => {
        console.log(err)
        res.send("Loi")
    })

}