const {channelId} = require("@gonetone/get-youtube-id-by-url");
const ytch = require('yt-channel-info');
const https = require("https");
let path = require("path");
const url = require('url');
var request = require('request');
const fs = require('fs');

const {GoogleSpreadsheet} = require('google-spreadsheet');
const key = require('../key.json');

exports.getFormGetID = (req, res, next) => {
    res.render('index', {title: 'GET ID CHANNEL YOUTUBE'})
}
exports.getForm = (req, res, next) => {
    res.render('idChannel', {title: 'GET ID CHANNEL YOUTUBE'})
}
exports.getFormData = (req, res, next) => {
    fs.readFile('./txt/ok123.txt', 'utf-8', (err, data) => {
        if (err) throw err;
        res.render('getData', {data: data})
    })
}
exports.postGetID = async (req, res, next) => {
    const url = req.body.url;
    if (url == "") {
        res.render('index', {msg: 'Vui lòng nhập link kênh', title: "GET ID CHANNEL YOUTUBE"})
        return;
    }
    // console.log(url)
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
exports.postGetChannel2 =async (req, res, next) => {
    // console.log(req.body.data123)
    const data = req.body.link_channel;
    const lines = data.split(/\n/)
    // print all lines
    lines.forEach(line => {
        channelId(line)
            .then(async (id) => {
                fs.appendFileSync('./txt/ok123.txt', '\n' + id, (err) => {
                    if (err) {
                        console.log("err write file")
                    }
                    console.log("ok")
                })
            })
            .catch((err) => {
                fs.appendFileSync('./txt/ok123.txt', '\n' + err, (err) => {
                    if (err) {
                        console.log("err write file")
                    }
                    console.log("ok")
                })
            })
    })
    return res.redirect('/get_id');
    /////////// doc file
    // fs.readFile('./txt/ok.txt', 'utf-8', (err, data) => {
    //     if (err) throw err;
    //     // console.log(data);
    //     const lines = data.split(/\n/)
    //     // print all lines
    //     lines.forEach(line => {
    //         channelId(line)
    //             .then((id) => {
    //                 console.log(id)
    //                 fs.appendFileSync('./txt/ok123.txt', '\n' + id, (err) => {
    //                     if (err) {
    //                         console.log("err write file")
    //                     }
    //                     console.log("ok")
    //                 })
    //             })
    //             .catch((err) => {
    //                 fs.appendFileSync('./txt/ok123.txt', '\n' + err, (err) => {
    //                     if (err) {
    //                         console.log("err write file")
    //                     }
    //                     console.log("ok")
    //                 })
    //                 // res.render('index', {
    //                 //     msg: 'Lỗi không lấy được id channel, vui lòng kiểm tra lại link',
    //                 //     title: "GET ID CHANNEL YOUTUBE"
    //                 // })
    //             })
    //     })
    //     res.redirect('/')
    // });


    // const url = req.body.url;
    // const arrayUrl = [
    //     "https://www.youtube.com/channel/UCMfn-voayc7DspHHaiPUgRg",
    //     "https://youtube.com/@jannatpawriyavlogs7513"
    // ];
    // console.log(arrayUrl)
    // arrayUrl.forEach(element =>
    //     channelId(element)
    //         .then((id) => {
    //             console.log(id)
    //             fs.appendFileSync('./txt/ok123.txt', '\n' + id, (err) => {
    //                 if (err) {
    //                     console.log("err write file")
    //                 }
    //                 console.log("ok")
    //                 res.redirect("/")
    //             })
    //         })
    //         .catch((err) => {
    //             res.render('index', {
    //                 msg: 'Lỗi không lấy được id channel, vui lòng kiểm tra lại link',
    //                 title: "GET ID CHANNEL YOUTUBE"
    //             })
    //         })
    // );
}

exports.clearData = (req,res,next) =>{
    fs.writeFile('./txt/ok123.txt', "", (err) => {
        if (err) {
            console.log("err write file")
        }
        console.log("ok")
        res.redirect('/get_id');
    })
}

//cach 2
// const payload = {
//     channelId: url,
//     channelIdType: 0,
// }
//
// ytch.getChannelInfo(payload).then((response) => {
//     if (!response.alertMessage) {
//         console.log(response)
//         res.send(response)
//     } else {
//         console.log('Channel could not be found.')
//     }
// }).catch((err) => {
//     console.log(err)
//     res.send("Loi")
// })
