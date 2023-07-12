const {videoId} = require("@gonetone/get-youtube-id-by-url");
const ytch = require('yt-channel-info');
const fs = require('fs');
const http = require('http');
const cheerio = require('cheerio');

const {GoogleSpreadsheet} = require('google-spreadsheet');
const key = require('../key.json');
const e = require("express");
const https = require("https");
const axios = require('axios')

const axiosInstance = axios.create({
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Mobile Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5,pl;q=0.4',
        'Cache-Control': 'max-age=0',
        'Cookie': 'GPS=1; YSC=wSvP2vUYAoY; VISITOR_INFO1_LIVE=z1I0o9u2gkY; PREF=f4=4000000&f6=40000000&tz=Asia.Saigon; CONSISTENCY=ACeCFAUXlLOO33tOnVqQL6uDVgLMt9pwUROuGOy2tVrAvplrb-rjE1F5ZrBupjhZGQMjctJpOtSNuZzQQSBebMmzfyyS1sPh6ieq2R_oNKxWijiW6a6jgbcL8wcbVr_SLVprJsGELId6x1NS0TjN9kc',
        'Accept-Encoding': 'gzip, deflate, br',
    },
    validateStatus: () => {
        return true
    },
})

const checkUrl = (url) => url.indexOf('youtube.com') !== -1 || url.indexOf('youtu.be') !== -1

const channelId = async (url) => {
    const videoRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=)?([a-zA-Z0-9_-]{11})/;
    if (checkUrl(url)) {
        if (videoRegex.test(url)) {
            const id = await getChannelId(url);
            if (id) {
                return id
            }
        } else {
            const ytChannelPageResponse = await axiosInstance.get(url)
            const $ = await cheerio.load(ytChannelPageResponse.data)
            const id = $('meta[itemprop="identifier"]').attr('content')
            if (id) {
                return id
            }
        }
    } else {
        console.log(`"${url}" is not a YouTube url.`)
    }

    // throw Error(`Unable to get "${url}" channel id.`)
}


function getChannelId(url) {
    https.get(url, (response) => {
        let data = '';

        // Data is received in chunks, so we need to concatenate it
        response.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received
        response.on('end', () => {
            const attribute = 'itemprop="identifier"'; // Attribute to match
            const regex = new RegExp(`<meta ${attribute} content="(.*?)"`, 'gi');
            const matches = data.match(regex);

            if (matches && matches.length > 0) {
                const content = matches[0].match(/content="(.*?)"/i)[1];
                return content;
            } else {
                console.log('Attribute not found');
            }
        });
    }).on('error', (error) => {
        console.error(`Error: ${error.message}`);
    });
}

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
exports.getFormMassId = (req, res, next) => {
    res.render('index3', {title: 'GET ID CHANNEL YOUTUBE'})
}
exports.postGetID = async (req, res, next) => {
    const url = req.body.url;
    if (url == "") {
        res.render('index', {msg: 'Vui lòng nhập link kênh', title: "GET ID CHANNEL YOUTUBE"})
        return;
    }

    await channelId(url)
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
exports.postGetChannel2 = async (req, res, next) => {
    const data = req.body.link_channel;
    const lines = data.split(/\n/)

    const doc = new GoogleSpreadsheet('1TQkT-2PlDtNnTdrKnJg-Y2M4yXLL_9j-Ogalk3_nrxE');
    await doc.useServiceAccountAuth(key);
    await doc.loadInfo(); // loads document properties and worksheets
    const sheet = doc.sheetsByIndex[0];
    await sheet.setHeaderRow(['Link', 'ID', 'Start', ' Chanel Name']);
    // print all lines
    let array = [];
    lines.forEach((line, index) => {
        let id123;
        setTimeout(() => {
            channelId(line)
                .then(async (id) => {
                    /////////add link voi id
                    // const data123 = [{
                    //     line: line, id: id
                    // }]
                    // await sheet.addRows(data123.map(function (value) {
                    //     return [value.line, value.id];
                    // }));
                    ////////////////////////////////////
                    let payload = {
                        channelId: id,
                        channelIdType: 0,
                    }

                    ytch.getChannelInfo(payload).then(async (response) => {
                        if (!response.alertMessage) {
                            const data123 = [{
                                line: line, id: id, start: response.subscriberCount, name: response.author
                            }]
                            await sheet.addRows(data123.map(function (value) {
                                return [value.line, value.id, value.start, value.name];
                            }));
                        } else {
                            const data1 = [{
                                line: line, id: "Error"
                            }]
                            await sheet.addRows(data1.map(function (value) {
                                return [value.line, value.id];
                            }));
                        }
                    }).catch(async (err) => {
                        const data1 = [{
                            line: line, id: "Error"
                        }]
                        await sheet.addRows(data1.map(function (value) {
                            return [value.line, value.id];
                        }));
                    })

                    array.push("\n" + id[0].toUpperCase() + id.slice(1));
                    if (index === lines.length - 1) {
                        res.render("getData", {array: [array.join(' ')]})
                    }
                })
                .catch(async (err) => {
                    array.push("\n" + "Error");
                    if (index === lines.length - 1) {
                        res.render("getData", {array: [array.join(' ')]})
                    }
                    const data1 = [{
                        line: line, id: "Error"
                    }]
                    await sheet.addRows(data1.map(function (value) {
                        return [value.line, value.id];
                    }));
                });
        }, index * 1000);
    });
}

exports.clearData = (req, res, next) => {
    fs.writeFile('./txt/ok123.txt', "", (err) => {
        if (err) {
            console.log("err write file")
        }
        console.log("ok")
        res.redirect('/get_id');
    })
}
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


//
//
// channelId(line)
//     .then(async (id) => {
//         // fs.appendFileSync('./txt/ok123.txt', '\n' +line +" | "+ id, (err) => {
//         //     if (err) {
//         //         console.log("err write file")
//         //     }
//         //     console.log("ok")
//         // })
//         // Create an array for putting to Spreadsheet.
//         const data123 = [{
//             line: line, id: id
//         }]
//         await sheet.addRows(data123.map(function (value) {
//             return [value.line, value.id];
//         }));
//
//         // let payload = {
//         //     channelId: id,
//         //     channelIdType: 0,
//         // }
//         //
//         // ytch.getChannelInfo(payload).then(async (response) => {
//         //     if (!response.alertMessage) {
//         //         const data123 = [{
//         //             line: line, id: id, start: response.subscriberCount, name: response.author
//         //         }]
//         //         await sheet.addRows(data123.map(function (value) {
//         //             return [value.line, value.id, value.start, value.name];
//         //         }));
//         //     } else {
//         //         const data1 = [{
//         //             line: line, id: "Error"
//         //         }]
//         //         await sheet.addRows(data1.map(function (value) {
//         //             return [value.line, value.id];
//         //         }));
//         //     }
//         // }).catch(async (err) => {
//         //     const data1 = [{
//         //         line: line, id: "Error"
//         //     }]
//         //     await sheet.addRows(data1.map(function (value) {
//         //         return [value.line, value.id];
//         //     }));
//         // })
//     })
//     .catch(async (err) => {
//         // fs.appendFileSync('./txt/ok123.txt', '\n' + err, (err) => {
//         //     if (err) {
//         //         console.log("err write file")
//         //     }
//         //     console.log("ok")
//         // })
//         const data1 = [{
//             line: line, id: "Error"
//         }]
//         await sheet.addRows(data1.map(function (value) {
//             return [value.line, value.id];
//         }));
//     })