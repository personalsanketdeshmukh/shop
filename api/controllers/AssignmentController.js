/**
 * CountryController
 *
 * @description :: Server-side logic for managing countries
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    getPerson: function (req, res) {
        if (req.body) {
            req.model.getPerson(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateInvoicePdf: function (req, res) {
        if (req.body) {
            req.model.generateInvoicePdf(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getNearestSurveyor: function (req, res) {
        if (req.body) {
            req.model.getNearestSurveyor(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    // assignmentNumberDetail: function (req, res) {
    //     if (req.body) {
    //         req.model.assignmentNumberDetail(req.body, res.callback);
    //     } else {
    //         res.json({
    //             value: false,
    //             data: "Invalid Request"
    //         });
    //     }
    // },

    // updateSurveyor: function (req, res) {
    //     if (req.body) {
    //         req.model.updateSurveyor(req.body, function (err, mailData) {
    //             console.log("mailData =  = ", mailData);
    //             Assignment.getEmailsData(mailData, function (err, allData) {
    //                 console.log("allData in ", allData);
    //                 if (err) {
    //                     callback(err, null);
    //                 } else {
    //                     if (_.isEmpty(allData)) {
    //                         callback("No mail data found!", null);
    //                     } else {
    //                         var emailsData = {};
    //                         emailsData = allData;
    //                         emailsData.user = req.user;
    //                         Assignment.sendEmails(emailsData, res.callback);
    //                     }
    //                 }
    //             });

    //         });
    //     } else {
    //         res.json({
    //             value: false,
    //             data: "Invalid Request"
    //         });
    //     }
    // },

    updateSurveyor: function (req, res) {
        if (req.body) {
            req.model.updateSurveyor(req.body, function (err, mailData) {
                console.log("mailData =  = ", mailData);
                Assignment.getEmailsData(mailData, function (err, allData) {
                    console.log("allData in ", allData);
                    if (err) {
                        callback(err, null);
                    } else {
                        if (_.isEmpty(allData)) {
                            callback("No mail data found!", null);
                        } else {
                            var emailsData = {};
                            emailsData = allData;
                            emailsData.user = req.user;
                            Assignment.sendEmails(emailsData, function (err, threadData) {
                                console.log("threadData in ", threadData);
                                if (err) {
                                    res.callback(err, null);
                                } else {
                                    if (_.isEmpty(threadData)) {
                                        res.callback("No mail data found!", null);
                                    } else {
                                        threadData._id = mailData[2];
                                        Assignment.updateThreadId(threadData, res.callback);
                                    }
                                }
                            });
                        }
                    }
                });

            });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    decline: function (req, res) {
        if (req.body) {
            req.model.decline(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    mobileSubmit: function (req, res) {
        if (req.body) {
            req.model.mobileSubmit(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    editSurvey: function (req, res) {
        if (req.body) {
            req.model.editSurvey(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    taskList: function (req, res) {
        if (req.body) {
            req.model.taskList(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    searchOnlyForInvoice: function (req, res) {
        if (req.body) {
            req.model.searchOnlyForInvoice(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    setGlobalAssignmentStatus: function (req, res) {
        if (req.body) {
            req.model.setGlobalAssignmentStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getNearestSurveyor2: function (req, res) {
        if (req.body) {
            req.model.getNearestSurveyor2(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateAssignmentNumber: function (req, res) {
        if (req.body) {
            req.model.generateAssignmentNumber(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAssignmentApprovalList: function (req, res) {
        if (req.body) {
            req.model.getAssignmentApprovalList(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    searchLogistic: function (req, res) {
        if (req.body) {
            req.model.searchLogistic(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getApprovalList: function (req, res) {
        if (req.body) {
            req.model.getApprovalList(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateNewSurveyor: function (req, res) {
        if (req.body) {
            req.model.updateNewSurveyor(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    removeSurveyor: function (req, res) {
        if (req.body) {
            req.model.removeSurveyor(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getSurveyorApprovalList: function (req, res) {
        if (req.body) {
            req.model.getSurveyorApprovalList(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    saveTemplate: function (req, res) {
        if (req.body) {
            req.model.saveTemplate(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateAssignmentNumberForAll: function (req, res) {
        // first make all the new params of assignment as null
        // get all assignements id ascending 
        // async.eachSeries(allassignement, function(n,callback) {
        //     assignement ka generate Assignment number for n element 
        //}, final callback {}) 
        if (req.body) {
            req.model.generateAssignmentNumberForAll(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    },
    setTimeStampForInvoice: function (req, res) {
        if (req.body) {
            req.model.setTimeStampForInvoice(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    },
    generateDataForGlobalStatus: function (req, res) {
        if (req.body) {
            req.model.generateDataForGlobalStatus(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }

    },
    getAssignmentTemplate: function (req, res) {
        if (req.body) {
            req.model.getAssignmentTemplate(req.body.type, req.body._id, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    editAssignmentTemplate: function (req, res) {
        if (req.body) {
            req.model.editAssignmentTemplate(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    CheckLr: function (req, res) {
        if (req.body) {
            req.model.CheckLr(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateAllIntimatedLoss: function (req, res) {
        if (req.body) {
            req.model.updateAllIntimatedLoss(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    updateAssignment: function (req, res) {
        if (req.body) {
            req.model.updateAssignment(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    generateMRExcel: function (req, res) {
        req.model.generateMRExcel(req.query, res);
    },
    generateExcel: function (req, res) {
        JsonStore.findOne({
            _id: req.query.id
        }).lean().exec(function (err, data) {
            console.log("CITY");
            console.log(data.json.city);
            if (err || _.isEmpty(data)) {
                res.badRequest();
            } else {
                req.model.generateAssignmentExcel(data.json, res.callback, res, req.user);
            }
        });
    },
    getAll: function (req, res) {
        if (req.body) {
            req.model.getAll(req.body, res.callback, req.user);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getExpenditure: function (req, res) {
        if (req.body) {
            req.model.getExpenditure(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    assignmentFilter: function (req, res) {
        if (req.body) {
            req.model.assignmentFilter(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    updateOfficeId: function (req, res) {
        if (req.body) {
            req.model.updateOfficeId(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAssignmentCreateMail: function (req, res) {
        if (req.body) {
            req.model.getAssignmentCreateMail(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },
    getAssignmentMatchedData: function (req, res) {
        if (req.body) {
            req.model.getAssignmentMatchedData(req.body, res.callback);
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    },

    replaceExcel: function (req, res) {
        var xlsx = require('node-xlsx').default;
        var jsonExcel = xlsx.parse("./replace.xls");
        jsonExcel = _.slice(jsonExcel[0].data, 1);
        var resValue = [];
        console.log(jsonExcel);
        async.eachLimit(jsonExcel, 20, function (n, callback) {
            Assignment.findOne({
                name: _.trim(n[2])
            }).exec(function (err, data) {
                if (err || _.isEmpty(data)) {
                    resValue.push(err);
                    callback();
                } else {
                    data.name = _.trim(n[1]);
                    data.save(function (err, data2) {
                        callback();
                        if (err) {
                            resValue.push(err);
                        } else {
                            resValue.push(data2);
                        }
                    });
                }
            });
        }, function (err) {
            if (err) {
                res.callback(err);
            } else {
                res.callback(null, resValue);
            }
        });
    },

    sendEmailTo: function (req, res) {

        var mailData = {};
        mailData.email = [];
        mailData.from = {};
        mailData.cc = [];
        mailData.email = [{
                email: "priyank.parmar@wohlig.com",
                name: "Priyank Parmar"
            }]
            // mailData.cc = [{
            //    email: "priyank.parmar@wohlig.com",
            //     name: "Priyank Parmar"
            // }]
        mailData.from = {
            name: "Priyank Parmar",
            email: "priyank.parmar@wohlig.com"
        };
        //   mailData.filename = "sellerinspectionassign.ejs";
        mailData.subject = "Absolute surveyors";

        //Email to 
        Config.emailTo(mailData, function (err, emailRespo) {
            if (err) {
                console.log(err);
                res.callback(null, err);
            } else {
                res.callback(null, emailRespo);
                //  callback(null, doc);
            }
        });
    },

    sendEmailAttachment: function (req, res) {

        // var xoauth2 = require('xoauth2');
        //Attachment files
        var files = [];
        var imageData = {};
        var images = [];
        var image = getAttachments_(files);
        console.log("Image : ", image);


        function getAttachments_(files) {
            var files = ["58df550390366f15f5c74274.jpg"];

            _.each(files, function (values) {
                // console.log("files : ", values,"realHost = ",realHost);
                var imageData = {
                    filename: values,
                    path: global["env"].realHost + '/api/upload/readFile?file=' + values
                };
                images.push(imageData);
            });

            setTimeout(function () {
                return images;
            }, 2000);

        }

        var attachments = [{
            filename: "58f6fcd81cf21319008c047c.png",
            path: global["env"].realHost + '/api/upload/readFile?file=58f6fcd81cf21319008c047c.png'
        }];

        console.log("users = ", req.user);
        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'priyank.parmar@wohlig.com',
                pass: 'Prriyyannk394'
            }
            // auth: {
            //     xoauth2: xoauth2.createXOAuth2Generator({
            //         user: req.user.name,
            //         clientId: global["GoogleclientId"],
            //         clientSecret: global["GoogleclientSecret"],
            //         refreshToken: req.user.googleRefreshToken,
            //         accessToken: req.body.accessToken
            //     })
            // }
        });

        // console.log("transporter : ", transporter.options.xoauth2);
        // setup email data with unicode symbols
        var mailOptions = {
            // from: '"' + req.user.name + '" <' + req.user.email + '>', // sender address
            from: '"Priyank Parmar" <priyank.parmar@wohlig.com>', // sender address
            to: 'priyank.parmar@wohlig.com', // list of receivers
            // reply_to: 'priyank.parmar@wohlig.com',
            subject: 'Hello ✔', // Subject line
            // text: 'Jai ho', // plain text body
            html: '<b>Gmail mail</b>', // html body
            attachments: attachments
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, emailData) {
            if (error) {
                res.callback(error, null);
            } else {
                res.callback(null, emailData);
            }
            console.log("mail Data", emailData);
        });
    },

    generateZip: function (req, res) {
        var JSZip= require("jszip");
        var type = req.query.type; 
        var zip = new JSZip();
        var folder = "./.tmp/";
        var path = _.capitalize(type) + "-" + moment().format("MMM-DD-YYYY-hh-mm-ss-a") + ".zip";
        var finalPath = folder + path;
        var files = [];
        Assignment.findOne({
            _id: req.query.id
        }).lean().exec(function (err, assignementData) {
            if (err || _.isEmpty(assignementData)) {
                res.callback(err, assignementData);
            } else {
                if (type === "photos") {
                    files = assignementData.photos;
                } else if (type === "Documents") {
                    files = assignementData.docs;
                } else if (type === "jir") {
                    files = assignementData.jir;
                } else {
                    files = [];
                }
                
                async.eachSeries(files, function (image, callback) {
                    request(global["env"].realHost + '/api/upload/readFile?file=' + image.file).pipe(fs.createWriteStream(image.file)).on('finish', function (images) {
                        // JSZip generates a readable stream with a "end" event,
                        // but is piped here in a writable stream which emits a "finish" event.
                        fs.readFile(image.file, function (err, imagesData) {
                            if (err) {
                                res.callback(err, null);
                            } else {
                                //Remove image
                                fs.unlink(image.file);
                                // zip.file("file", content); ... and other manipulations
                                zip.file(image.file, imagesData);
                                // console.log('contents : ', zip);
                                callback();
                            }
                        });
                    });
                }, function () {
                    //Generate Zip file
                    zip.generateNodeStream({
                            type: 'nodebuffer',
                            streamFiles: true
                        })
                        .pipe(fs.createWriteStream(finalPath))
                        .on('finish', function (zipData) {
                            // JSZip generates a readable stream with a "end" event,
                            // but is piped here in a writable stream which emits a "finish" event.
                            fs.readFile(finalPath, function (err, zip) {
                                if (err) {
                                    res.callback(err, null);
                                } else {
                                    res.set('Content-Type', "application/octet-stream");
                                    res.set('Content-Disposition', "attachment;filename=" + path);
                                    res.send(zip);
                                    fs.unlink(finalPath);
                                }
                            });
                        });
                });

            }
        });

    }
};
module.exports = _.assign(module.exports, controller);