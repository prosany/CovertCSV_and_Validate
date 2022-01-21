const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require('express-fileupload');
const csv = require('csv-parser');
const fs = require('fs');
const PORT = process.env.PORT || 8080;
const results = [];
const finalResults = [];


app.use(cors());
app.use(express.json());
app.use(express.static('previousCSV'));
app.use(fileUpload());

app.get("/", (req, res) => {
    res.status(200).send({
        status: 1,
        message: `🚀 App Running on port http://localhost:${PORT}`
    })
})


app.post("/v1/convert_csv", (req, res) => {
    let uploadedCSV = req.files.csv;
    if (uploadedCSV.mimetype !== "text/csv") return res.status(406).send({ status: 0, message: "Please upload csv file only" });
    uploadedCSV.mv("previousCSV/" + uploadedCSV.name, (err) => {
        if (err) return res.status(400).send({ status: 0, message: "Upload failed" });
        fs.createReadStream(`./previousCSV/${uploadedCSV.name}`)
            .pipe(csv())
            .on("data", (data) => results.push(data))
            .on("end", () => {
                if (results.length <= 0) return res.status(200).send({ status: 0, message: "File is empty, No data in csv." });

                for (let index = 0; index < results.length; index++) {
                    const singleData = results[index];

                    switch (singleData.sensorType) {
                        case "temperature":
                            if (Number(singleData.value) >= -50 && Number(singleData.value) <= 100 && singleData.value !== "") {
                                finalResults.push(singleData)
                            } else {
                                console.log("temperature not match");
                            }
                            break;
                        case "pH":
                            if (Number(singleData.value) >= 0 && Number(singleData.value) <= 14 && singleData.value !== "") {
                                finalResults.push(singleData)
                            } else {
                                console.log("pH not match");
                            }
                            break;
                        case "rainFall":
                            if (Number(singleData.value) >= 0 && Number(singleData.value) <= 500 && singleData.value !== "") {
                                finalResults.push(singleData)
                            } else {
                                console.log("rainFall not match");
                            }
                            break;
                        default:
                            break;
                    }
                }
                res.send(finalResults)
            })
    })
})

app.listen(PORT, () => console.log(`🚀 App Running on port http://localhost:${PORT}`))