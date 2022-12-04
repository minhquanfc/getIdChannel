const {GoogleSpreadsheet} = require('google-spreadsheet');
const key = require('../key.json');
const {channelId} = require("@gonetone/get-youtube-id-by-url");

const fs = require('fs');
const path = require('path');
// Initialize the sheet - doc ID is the long id in the sheets URL

exports.postData = async (req, res, next) => {
    const url = req.body.url;
    const doc = new GoogleSpreadsheet('1TQkT-2PlDtNnTdrKnJg-Y2M4yXLL_9j-Ogalk3_nrxE');
    await doc.useServiceAccountAuth(key);
    await doc.loadInfo(); // loads document properties and worksheets
    console.log(doc.title);
    await doc.updateProperties({title: 'Test data'});
    const sheet = doc.sheetsByIndex[0];
    const data = [];
    // arrayUrl.forEach(element => {
    channelId(url)
        .then(async (id) => {
            console.log(id)
            await sheet.addRow(id);
            res.render("idChannel")
        })
        .catch((err) => {
            res.render('index', {
                msg: 'Lỗi không lấy được id channel, vui lòng kiểm tra lại link',
                title: "GET ID CHANNEL YOUTUBE"
            })
        })
    // });
}


exports.getData = (req,res,next) =>{
    fs.readFile('./txt/ok.txt','utf-8', (err, data) => {
        if (err) throw err;
        console.log(data);
        // fs.writeFile('./txt/ok123.txt',data,(err)=>{
        //     if (err){
        //         console.log("err write file")
        //     }
        //     console.log("ok")
        // })
        // channelId(data[0])
        //     .then(async (id) => {
        //         console.log(id)
        //     })
        //     .catch((err) => {
        //         res.render('index', {
        //             msg: 'Lỗi không lấy được id channel, vui lòng kiểm tra lại link',
        //             title: "GET ID CHANNEL YOUTUBE"
        //         })
        //     })
    });
}