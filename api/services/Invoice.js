var objectid = require("mongodb").ObjectID;
var schema = new Schema({
    name: {
        type: String,
    },
    billedTo: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        index: true
    },
    narrationFee: {
        type: String,
    },
    grossAssessedLoss: {
        type: Number,
    },
    grossSalvage: {
        type: Number,
    },
    taxes: {
        type: Number,
    },
    excessFranchise: {
        type: Number,
    },
    grossDepreciation: {
        type: Number,
    },
    grossUnderInsurance: {
        type: Number,
    },
    netPayable: {
        type: Number,
    },
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        index: true
    },
    invoiceNumber: String,
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Employee",
        index: true
    },
    segment: {
        type: Schema.Types.ObjectId,
        ref: "CustomerSegment",
        index: true,
        key: "assignment"
    },
    customerCompany: {
        type: Schema.Types.ObjectId,
        ref: "CustomerCompany",
        index: true,
        key: "assignment"
    },
    invoiceList: [{
        name: String,
        description: String,
        quantity: Number,
        unit: String,
        rate: Number,
        amount: {
            type: Number,
            default: 0
        },
        type: {
            type: Boolean
        }
    }],
    tax: [{
        name: String,
        percent: Number,
        amount: {
            type: Number,
            default: 0
        }
    }],
    roundOff: {
        type: Number
    },
    grandTotal: {
        type: Number
    },
    subTotal: {
        type: Number
    },
    templateInvoice: {
        type: Schema.Types.ObjectId,
        ref: "TemplateInvoice",
        index: true
    },
    approvalStatus: {
        type: String,
        enum: ["Draft", "Pending", "Revised", "Approved", "Rejected", "Regenerated", "Cancelled"]
    },
    approvalTime: {
        type: Date
    },
    draftTimeStamp: {
        type: Date
    },
    rejectTimestamp: {
        type: Date
    },
    timestamp: {
        type: Date,
        default: Date.now()
    },
    reqtimestamp: {
        type: Date
    },
    file: {
        type: String
    },
    status: {
        type: Boolean
    }
});

schema.plugin(deepPopulate, {
    populate: {
        'billedTo': {
            select: ''
        },
        'billedTo.city': {
            select: 'name _id district'
        },
        'billedTo.city.district': {
            select: 'name _id state'
        },
        'billedTo.city.district.state': {
            select: 'name _id zone'
        },
        'billedTo.city.district.state.zone': {
            select: 'name _id country'
        },
        'billedTo.city.district.state.zone.country': {
            select: 'name _id'
        },
        'billedTo.customerCompany': {
            select: 'name _id'
        },
        'createdBy': {
            select: 'name'
        },
        'assignment': {
            select: ''
        },
        'assignment.customer': {
            select: 'name'
        },
        'assignment.department': {
            select: 'name'
        },
        'assignment.products.product': {
            select: 'name _id category'
        },
        'assignment.products.product.category': {
            select: 'name _id industry'
        },
        'assignment.causeOfLoss': {
            select: 'name'
        },
        'assignment.natureOfLoss': {
            select: 'name'
        },
        'assignment.insurerOffice': {
            select: 'name'
        },
        'assignment.insuredOffice': {
            select: 'name'
        },
        'assignment.city': {
            select: 'name _id district'
        },
        'assignment.city.district': {
            select: 'name _id state'
        },
        'assignment.city.district.state': {
            select: 'name _id zone'
        },
        'assignment.city.district.state.zone': {
            select: 'name _id country'
        },
        'assignment.city.district.state.zone.country': {
            select: 'name _id'
        },
        'assignment.company': {
            select: ''
        },
        'assignment.company.bank': {
            select: ''
        },
        'assignment.company.city': {
            select: 'name district'
        },
        'assignment.company.city.district': {
            select: 'name state _id'
        },
        'assignment.company.city.district.state': {
            select: 'name _id'
        },
        'assignment.insurer': {
            select: ''
        },
        'assignment.insured': {
            select: ''
        },
        'assignment.policyType': {
            select: ''
        },
        'assignment.branch': {
            select: ''
        },
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Invoice', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "assignment.company assignment.products.product.category billedTo createdBy", "assignment.companyassignment.products.product.category billedTo createdBy"));
var model = {
    search: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['invoiceNumber'],
                    term: data.keyword
                }
            },
            sort: {
                desc: 'invoiceNumber'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        var Search = Invoice.find(data.filter)
            .order(options)
            .keyword(options)
            .deepPopulate("assignment.company assignment.insuredOffice assignment.products.product.category billedTo createdBy")
            .page(options, function (err, found) {
                if (err) {
                    callback(err, found);
                } else {
                    if (_.isEmpty(found)) {
                        callback("No data found!!", found);
                    } else {
                        callback(null, found);
                    }
                }
            });
    },

    saveData: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var foreignKeys = Config.getForeignKeys(schema);
        if (data._id) {
            Model.findOne({
                _id: data._id
            }, function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else if (data2) {
                    async.each(foreignKeys, function (n, callback) {
                        if (data[n.name] != data2[n.name]) {
                            Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "delete", function (err, md) {
                                if (err) {
                                    callback(err, md);
                                } else {
                                    Config.manageArrayObject(mongoose.models[n.ref], data[n.name], data2._id, n.key, "create", callback);
                                }
                            });
                        } else {
                            callback(null, "no found for ");
                        }
                    }, function (err) {
                        data2.update(data, {
                            w: 1
                        }, function (err, updated) {
                            if (err) {
                                callback(err, null);
                            } else {
                                console.log("updated data", updated, data);
                                // callback(null,updated);
                                Invoice.getAssignmentMailData(data, function (err, mailData) {
                                    if (err) {
                                        callback("There was an error while sending mail", null);
                                    } else {
                                        if (_.isEmpty(mailData)) {
                                            callback("No Data found in sending mail", null);
                                        } else {
                                            callback(null, updated);
                                        }
                                    }
                                });
                            }
                        });
                    });
                } else {
                    callback("No Data Found", data2);
                }
            });
        } else {
            Const.save(function (err, data2) {
                if (err) {
                    callback(err, data2);
                } else {
                    async.each(foreignKeys, function (n, callback) {
                        Config.manageArrayObject(mongoose.models[n.ref], data2[n.name], data2._id, n.key, "create", function (err, md) {
                            callback(err, data2);
                        });
                    }, function (err) {
                        if (err) {
                            callback(err, data2);
                        } else {
                            Model.generateInvoiceNumber(data2, function (err, mailData) {
                                if (err) {
                                    callback("There was an error while generating Invoice number", null);
                                } else {
                                    if (_.isEmpty(mailData)) {
                                        callback("No Data found in generating Invoice number", null);
                                    } else {
                                        data.saveStatus = true;
                                        data.invoiceNumber = data2.invoiceNumber;
                                        console.log("Invoice number , ", data2.invoiceNumber);
                                        Invoice.getAssignmentMailData(data, function (err, mailData) {
                                            if (err) {
                                                callback(err, null);
                                            } else {
                                                if (_.isEmpty(mailData)) {
                                                    callback("No Data found in sending mail", null);
                                                } else {
                                                    callback(null, data2);
                                                }
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    });
                }
            });
        }
    },

    getAssignmentMailData: function (data, callback) {
        if (data.saveStatus === true) {
            var id = data.assignment;
        } else {
            var id = data.assignment._id;
        }
        Assignment.getOne({
            _id: id
        }, function (err, assignmentData) {
            // console.log("assignmentData =========", assignmentData);
            if (err) {
                console.log("err", err);
                callback("No data found in assignment", null);
            } else {
                console.log("assignmentData else", assignmentData);
                if (_.isEmpty(assignmentData)) {
                    callback("No data found in assignment search", null);
                } else {
                    toName = "";
                    toEmail = "";
                    if (data.officeEmail) {
                        console.log("office Email", data.officeEmail);
                        var to = data.officeEmail;
                        to = to.split("<");
                        // console.log("to[1]",to[1]);
                        toName = to[0];
                        var toEmails = to[1].split(">");
                        toEmail = toEmails[0];
                    }
                    console.log("assignmentData In ", assignmentData);
                    var emailData = {};
                    emailData.assignmentNo = assignmentData.name;
                    emailData.ownerName = assignmentData.owner.name;
                    emailData.ownerEmail = assignmentData.owner.officeEmail;
                    emailData.ownerPhone = assignmentData.owner.officeMobile;
                    if (assignmentData.city !== undefined) {
                        emailData.siteCity = assignmentData.city.name;
                    }
                    emailData.invoiceNumber = data.invoiceNumber;
                    if (assignmentData.insured) {
                        if (assignmentData.insured.name) {
                            emailData.insuredName = (assignmentData.insured.name ? assignmentData.insured.name : "");
                        } else {
                            emailData.insuredName = "";
                        }
                    } else {
                        emailData.insuredName = "";
                    }
                    if (assignmentData.templateIla[0]) {
                        emailData.ilaAuthDate = assignmentData.templateIla[0].authTimestamp;
                    }
                    if (assignmentData.products[0]) {
                        if (assignmentData.products[0].product) {
                            emailData.productName = (assignmentData.products[0].product.name ? assignmentData.products[0].product.name : "NA");
                        }
                    }

                    // emailData.surveyDate = (surveyDate ? moment(surveyDate).format("DD/MM/YYYY") : "");
                    // console.log("emailData In 1 ", emailData);
                    if (assignmentData.survey) {
                        _.each(assignmentData.survey, function (values) {
                            console.log("survey: ", values);
                            if (values.status == "Pending") {
                                console.log("In surveyor");
                                if (values.employee) {
                                    emailData.surveyorNumber = values.employee.officeMobile;
                                    emailData.surveyorName = values.employee.name;
                                    emailData.surveyorEmail = values.employee.officeEmail;
                                    emailData.surveyDate = values.surveyDate;
                                }
                            }
                        });
                    }


                    // console.log("emailData In 2 ", emailData);
                    emailData.to = [];
                    emailData.to.push({
                        name: assignmentData.owner.name,
                        email: assignmentData.owner.officeEmail
                    });
                    emailData.cc = [];
                    if (assignmentData.shareWith) {
                        _.each(assignmentData.shareWith, function (values) {
                            console.log("values", values);
                            _.each(values.persons, function (personss) {
                                console.log("persons", personss);
                                emailData.cc.push({
                                    name: personss.name,
                                    email: personss.officeEmail
                                });
                            });
                        });
                    }

                    if (data.user) {
                        emailData.assignmentAuthorizer = data.user.name;
                    }
                    console.log('emailData', emailData);

                    //Find Acknowledgment Email data
                    if (data.approvalStatus === "Pending" && data.saveStatus === true) {
                        console.log("Approval status : Pending ->");
                        emailData.to = [];
                        emailData.to.push({
                            name: toName,
                            email: toEmail
                        });
                        var mailData = [];
                        mailData[0] = "Invoice Send Authorization";
                        mailData[1] = emailData;
                        mailData[2] = data.accessToken;
                        mailData[3] = data.users.email;
                        Assignment.getMailAndSendMail(mailData, function (err, newData) {
                            if (err) {
                                callback(null, err);
                            } else {
                                if (_.isEmpty(newData)) {
                                    callback("There was an error while sending mail", null);
                                } else {
                                    callback(null, newData);
                                }
                            }
                        });
                    } else if (data.approvalStatus == "Approved") {

                        console.log(" Approval status : Approved ->");
                        emailData.to = [];
                        emailData.to.push({
                            name: toName,
                            email: toEmail
                        });
                        var mailData = [];
                        mailData[0] = "Invoice Authorization";
                        mailData[1] = emailData;
                        mailData[2] = data.accessToken;
                        mailData[3] = data.users.email;
                        Assignment.getMailAndSendMail(mailData, function (err, newData) {
                            if (err) {
                                callback(null, err);
                            } else {
                                if (_.isEmpty(newData)) {
                                    callback("There was an error while sending mail", null);
                                } else {
                                    callback(null, newData);
                                }
                            }
                        });
                    } else if (data.approvalStatus == "Revised") {
                        console.log(" Approval status : Revised ->");
                        var mailData = [];
                        mailData[0] = "Invoice Back to Regenerate";
                        mailData[1] = emailData;
                        mailData[2] = data.accessToken;
                        mailData[3] = data.users.email;
                        Assignment.getMailAndSendMail(mailData, function (err, newData) {
                            if (err) {
                                callback(null, err);
                            } else {
                                if (_.isEmpty(newData)) {
                                    callback("There was an error while sending mail", null);
                                } else {
                                    callback(null, newData);
                                }
                            }
                        });
                    } else {
                        callback(null, data);
                    }

                }
            }
        });
    },
    generateInvoiceNumber: function (data, callback) {
        Invoice.find({
            assignment: data.assignment
        }).sort({
            createdBy: 1
        }).lean().deepPopulate('assignment').exec(function (err, invNumber) {
            if (err) {
                callback(err, null)
            } else {

                if (invNumber.length === 1) {
                    console.log("Invoice...............................", invNumber, invNumber[0].assignment.name);
                    var sInput = '';
                    sInput = _.split(invNumber[0].assignment.name, '-');
                    data.invoiceNumber = sInput[1] + "-" + sInput[2] + "-" + sInput[3];
                    console.log("........", sInput, data.invoiceNumber);
                    data.save(function (err, data) {
                        if (err) {
                            callback(err, data);
                        } else {
                            callback(null, data);
                        }
                    });
                } else {
                    console.log("In Else...............................", invNumber, invNumber[invNumber.length - 1].assignment.name);
                    var sInput = '';
                    sInput = _.split(invNumber[invNumber.length - 1].assignment.name, '-');
                    data.invoiceNumber = sInput[1] + "-" + sInput[2] + "-" + sInput[3] + "-" + String.fromCharCode(63 + invNumber.length);
                    console.log("........", sInput, data.invoiceNumber);
                    data.save(function (err, data) {
                        if (err) {
                            callback(err, data);
                        } else {
                            callback(null, data);
                        }
                    });
                }

            }
        });
    },
    generateSalesRegisterExcels: function (data, res) {
        Invoice.find({
                approvalStatus: "Approved"
            })
            .sort({
                createdAt: -1
            })
            .deepPopulate("assignment assignment.branch billedTo assignment.insured")
            .exec(
                function (err, data1) {
                    if (err) {
                        console.log(err);
                        res(err, null);
                    } else if (data1) {
                        if (_.isEmpty(data1)) {
                            res("No Payment found.", null);
                        } else {
                            var fee = 0;
                            var expense = 0;
                            // console.log("Done", data1[37]);
                            var excelData = [];
                            // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.", data1[0].assignment);
                            _.each(data1, function (n, key) {
                                var fee = 0;
                                var expense = 0;
                                var obj = {};
                                obj["SR #"] = key + 1;
                                if (n.assignment !== null) {
                                    if (n.assignment.branch === null) {} else {
                                        obj["Branch"] = n.assignment.branch.name;
                                    }
                                }
                                obj["Invoice Number"] = n.invoiceNumber;
                                obj["Invoice Date"] = moment(n.approvalTime).format("DD-MM-YYYY");
                                if (n.billedTo === null) {} else {
                                    obj["Billed To"] = n.billedTo.name;
                                }
                                if (n.assignment !== null) {
                                    obj["Insurer Claim No"] = n.assignment.insurerClaimId;
                                }
                                if (n.assignment !== null) {
                                    if (n.assignment.insured) {
                                        obj["Insurer Claim #"] = n.assignment.insured.name;
                                    }
                                }
                                _.each(n.invoiceList, function (m) {
                                    if (m.type) {
                                        fee = fee + m.amount;
                                    } else {
                                        expense = expense + m.amount;
                                    }
                                });
                                obj["Fee"] = fee;
                                obj["expense"] = expense;
                                obj["Total"] = fee + expense;
                                _.each(n.tax, function (m) {
                                    if (m.name == "Service Tax") {
                                        obj["Service Tax"] = m.amount;
                                    }
                                    if (m.name == "Swachh Bharat Cess" || m.name == "SBC") {
                                        obj["SBC"] = m.amount;
                                    }
                                    if (m.name == "Krishi Kalyan Cess") {
                                        obj["KKC"] = m.amount;
                                    }
                                });
                                obj["RoundOff"] = n.roundOff;
                                obj["SubTotal"] = n.subTotal;
                                obj["GrandTotal"] = n.grandTotal;
                                excelData.push(obj);
                            });
                            Config.generateExcel("Assignment", excelData, res);
                        }
                    } else {
                        res("Invalid data", null);
                    }
                });
    },
    getInvoiceApprovalList: function (data, callback) {
        var Model = this;
        var maxRow = Config.maxRow;
        var pagestartfrom = (data.page - 1) * maxRow;
        var page = 1;
        var aggText = [];
        var aggTextCount = [];

        var employee = {
            _id: data.employee
        };
        var childArr = [];
        Employee.getChildEmployee(employee, function (err, childArray) {
            if (err) {
                red("Bad");
                callback(err, null);
            } else {
                childArray.push(data.employee);
                _.each(childArray, function (n) {
                    childArr.push(objectid(n));
                })
                console.log(childArr);
                aggText = [{
                        $match: {
                            "invoiceNumber": {
                                $regex: data.keyword,
                                $options: 'i'
                            }
                        }
                    }, {
                        $lookup: {
                            from: "assignments",
                            localField: "assignment",
                            foreignField: "_id",
                            as: "assignment"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "employees",
                            localField: "assignment.owner",
                            foreignField: "_id",
                            as: "assignment.owner"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment.owner",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insurerOffice",
                            foreignField: "_id",
                            as: "insurer"
                        }
                    }, {
                        $unwind: {
                            path: "$insurer",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insuredOffice",
                            foreignField: "_id",
                            as: "insured"
                        }
                    }, {
                        $unwind: {
                            path: "$insured",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $match: {
                            "$or": [{
                                'assignment.shareWith.persons': {
                                    $in: childArr
                                }
                            }, {
                                "assignment.owner._id": {
                                    $in: childArr
                                }
                            }],
                            approvalStatus: "Pending"
                        }
                    }, {
                        $skip: parseInt(pagestartfrom)
                    }, {
                        $limit: maxRow
                    }],
                    aggTextCount = [{
                        $match: {
                            "invoiceNumber": {
                                $regex: data.keyword,
                                $options: 'i'
                            }
                        }
                    }, {
                        $lookup: {
                            from: "assignments",
                            localField: "assignment",
                            foreignField: "_id",
                            as: "assignment"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "employees",
                            localField: "assignment.owner",
                            foreignField: "_id",
                            as: "assignment.owner"
                        }
                    }, {
                        $unwind: {
                            path: "$assignment.owner",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insurerOffice",
                            foreignField: "_id",
                            as: "insurer"
                        }
                    }, {
                        $unwind: {
                            path: "$insurer",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $lookup: {
                            from: "customers",
                            localField: "assignment.insuredOffice",
                            foreignField: "_id",
                            as: "insured"
                        }
                    }, {
                        $unwind: {
                            path: "$insured",
                            preserveNullAndEmptyArrays: true
                        }
                    }, {
                        $match: {
                            "$or": [{
                                'assignment.shareWith.persons': {
                                    $in: childArr
                                }
                            }, {
                                "assignment.owner._id": {
                                    $in: childArr
                                }
                            }],
                            approvalStatus: "Pending"
                        }
                    }, {
                        $group: {
                            _id: null,
                            count: {
                                $sum: 1
                            }
                        }
                    }, {
                        $project: {
                            "_id": 1,
                            "count": 1
                        }
                    }]
                async.parallel([
                        function (callback) {
                            Model.aggregate(aggText,
                                function (err, data1) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, data1)
                                    }

                                });
                        },
                        function (callback) {
                            Model.aggregate(aggTextCount,
                                function (err, data2) {
                                    if (err) {
                                        callback(err, null);
                                    } else {
                                        callback(null, data2)
                                    }

                                });
                        }
                    ],
                    function (err, data4) {
                        if (err) {
                            callback(err, null);
                        } else {
                            if (_.isEmpty(data4[1])) {
                                var data5 = {
                                    results: data4[0],
                                    options: {
                                        count: 0
                                    }
                                };
                            } else {
                                var data5 = {
                                    results: data4[0],
                                    options: {
                                        count: maxRow
                                    }
                                };
                                data5.total = data4[1][0].count;
                            }
                            callback(null, data5);
                        }
                    });

            }
        });
    },
    projectionOfGetAssignmentAggregate: function () {
        var allTable = [{
            $lookup: {
                from: "customers",
                localField: "billedTo",
                foreignField: "_id",
                as: "billedTo"
            }
        }, {
            $unwind: {
                path: "$billedTo",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "employees",
                localField: "createdBy",
                foreignField: "_id",
                as: "createdBy"
            }
        }, {
            $unwind: {
                path: "$createdBy",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "cities",
                localField: "assignment.city",
                foreignField: "_id",
                as: "assignment.city"
            }
        }, {
            $unwind: {
                path: "$assignment.city",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "branches",
                localField: "assignment.branch",
                foreignField: "_id",
                as: "assignment.branch"
            }
        }, {
            $unwind: {
                path: "$assignment.branch",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "assignment.insurerOffice",
                foreignField: "_id",
                as: "assignment.insurer"
            }
        }, {
            $unwind: {
                path: "$assignment.insurer",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "assignment.brokerOffice",
                foreignField: "_id",
                as: "assignment.broker"
            }
        }, {
            $unwind: {
                path: "$assignment.broker",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "customers",
                localField: "assignment.insuredOffice",
                foreignField: "_id",
                as: "assignment.insured"
            }
        }, {
            $unwind: {
                path: "$assignment.insured",
                preserveNullAndEmptyArrays: true
            }
        }, {
            $lookup: {
                from: "departments",
                localField: "assignment.department",
                foreignField: "_id",
                as: "assignment.department"
            }
        }, {
            $unwind: {
                path: "$assignment.department",
                preserveNullAndEmptyArrays: true
            }
        }];

        return allTable;
    },
    lookupOfAssignmentAggregate: function (data, user) {
        var retObj = {};
        retObj = [{
            $lookup: {
                from: "assignments",
                localField: "assignment",
                foreignField: "_id",
                as: "assignment"
            }
        }, {
            $unwind: {
                path: "$assignment",
                preserveNullAndEmptyArrays: true
            }
        }];

        return retObj;
    },
    typeOfGetAssignmentAggregate: function (data, user) {
        var retObj = {};
        if (data.ownerStatus == "My files") {
            var allUsersUnder = _.map(_.concat(user.children, data.ownerId), function (n) {
                return objectid(n);
            });
            //   retObj = {
            //     $match: {
            //       'assignment.owner': objectid(data.ownerId),
            //     }
            //   };
            retObj = {
                $match: {
                    'assignment.owner': {
                        $in: allUsersUnder
                    }
                }
            };
        } else if (data.ownerStatus == "All files") {
            retObj = null;
        }

        return [retObj];
    },
    filterOfGetAssignmentAggregate: function (data) {
        var filterObject = {};
        //Timeline status filter
        if (!_.isEmpty(data.timelineStatus)) {
            var timelineStatus = {
                'assignment.timelineStatus': {
                    $in: data.timelineStatus
                }
            };
            filterObject = _.assign(filterObject, timelineStatus);
        }

        //Invoice Number
        if (!_.isEmpty(data.invoiceNumber)) {
            var invoiceNumber = {
                'invoiceNumber': {
                    $regex: data.invoiceNumber,
                    $options: 'i'
                }
            };
            filterObject = _.assign(filterObject, invoiceNumber);
        }

        //Intimated Loss from range to to range
        if (!_.isEmpty(data.from) && !_.isEmpty(data.to)) {
            var intimatedLoss = {
                'assignment.intimatedLoss': {
                    "$gte": data.from,
                    "$lte": data.to
                }
            };
            filterObject = _.assign(filterObject, intimatedLoss);
        }

        //Assignment from date to to date
        if (!_.isEmpty(data.fromDate) && !_.isEmpty(data.toDate)) {
            var approvalTime = {
                'approvalTime': {
                    "$gte": new Date(moment(data.fromDate)),
                    "$lte": new Date(moment(data.toDate).add(1, "d"))
                }
            };
            filterObject = _.assign(filterObject, approvalTime);
        }

        //Mr number filter
        if (!_.isEmpty(data.name)) {
            var name = {
                'assignment.name': {
                    $regex: data.name,
                    $options: 'i'
                }
            };
            filterObject = _.assign(filterObject, name);
        }

        //Owner of assignment filter
        if (!_.isEmpty(data.owner)) {
            var owner = {
                'assignment.owner': {
                    $in: _.map(data.owner, function (n) {
                        return objectid(n);
                    })
                },
            };
            console.log(owner);
            filterObject = _.assign(filterObject, owner);
        }

        //City filter
        if (!_.isEmpty(data.city)) {
            var city = {
                'assignment.city': {
                    $in: _.map(data.city, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, city);
        }

        ///Branch filter 
        if (!_.isEmpty(data.branch)) {
            var branch = {
                'assignment.branch': {
                    $in: _.map(data.branch, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, branch);
        }

        //Insurer filter
        if (!_.isEmpty(data.insurer)) {
            var insurer = {
                'assignment.insurerOffice': {
                    $in: _.map(data.insurer, function (n) {
                        return objectid(n);
                    })
                }
            };
            filterObject = _.assign(filterObject, insurer);
        }

        //Insured filter
        if (!_.isEmpty(data.insured)) {
            var insured = {
                'assignment.insuredOffice': {
                    $in: _.map(data.insured, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, insured);
        }

        //Department filter
        if (!_.isEmpty(data.department)) {
            var department = {
                'assignment.department': {
                    $in: _.map(data.department, function (n) {
                        return objectid(n);
                    })
                },
            };
            filterObject = _.assign(filterObject, department);
        }

        //Broker Office filter
        if (!_.isEmpty(data.broker)) {
            var broker = {
                'assignment.customer': {
                    $in: _.map(data.broker, function (n) {
                        return (n);
                    })
                },
            };
            filterObject = _.assign(filterObject, broker);
        }

        //Invoice Approval Status True
        if (!_.isEmpty(data.invoiceApproval)) {
            var invoiceApproval = {
                'approvalStatus': {
                    $in: data.invoiceApproval
                }
            };
            filterObject = _.assign(filterObject, invoiceApproval);
        } else {
            var invoiceApproval = {
                'approvalStatus': {
                    $in: ["Approved", "Cancelled", "Revised"]
                }
            };
            filterObject = _.assign(filterObject, invoiceApproval);
        }
        // Old Code
        // var invoiceApproval = {
        //     'approvalStatus': {
        //         $in: ["Approved", "Cancelled", "Revised"]
        //     }
        // };
        // filterObject = _.assign(filterObject, invoiceApproval);

        if (_.isEmpty(filterObject)) {
            return null;
        } else {
            return [{
                $match: filterObject
            }];
        }

    },
    sortOfGetAssignmentAggregate: function (data) {
        //Sorting
        var sort = {
            $sort: {}
        };

        function makeSort(name, value) {
            sort.$sort[name] = value;
        }
        if (_.isEmpty(data.sorting[0])) {
            sort = {
                $sort: {
                    approvalTime: -1
                }
            };
        } else {
            switch (data.sorting[0]) {
                case "billedTo":
                    makeSort(data.sorting[0] + ".name", data.sorting[1]);
                    break;
                case "invoiceNumber":
                    makeSort(data.sorting[0], data.sorting[1]);
                    break;
                case "createdBy":
                    makeSort(data.sorting[0] + ".name", data.sorting[1]);
                    break;
                case "insured":
                    makeSort("assignment." + data.sorting[0] + ".name", data.sorting[1]);
                    break;
                case "grandTotal":
                    makeSort(data.sorting[0], data.sorting[1]);
                    break;
                default:
                    makeSort("approvalTime", -1);
                    break;
            }
        }
        console.log("sorting", [sort]);
        return [sort];
    },
    completeGetAssignmentAggregate: function (data, user) {
        var aggregateArr = _.concat(this.lookupOfAssignmentAggregate(), this.filterOfGetAssignmentAggregate(data), this.typeOfGetAssignmentAggregate(data, user), this.projectionOfGetAssignmentAggregate());
        return _.compact(aggregateArr);
    },
    completeGetAssignmentExcelAggregate: function (data, user) {
        var aggregateArr = _.concat(this.lookupOfAssignmentAggregate(), this.filterOfGetAssignmentAggregate(data), this.typeOfGetAssignmentAggregate(data, user), this.projectionOfGetAssignmentAggregate());
        return _.compact(aggregateArr);
    },
    getAll: function (data, callback, user) {
        var coreArr = this.completeGetAssignmentAggregate(data, user);

        var paginationArr = [{
            $skip: parseInt((data.pagenumber - 1) * data.pagelimit)
        }, {
            $limit: data.pagelimit
        }, {
            $project: {
                file: 1,
                approvalStatus: 1,
                _id: 1,
                invoiceNumber: 1,
                billedTo: "$billedTo.name",
                createdBy: "$createdBy.name",
                insuredName: "$assignment.insured.name",
                grandTotal: 1
            }
        }];
        var countArr = [{
            $group: {
                _id: null,
                count: {
                    $sum: 1
                }
            }
        }];
        var sortArr = this.sortOfGetAssignmentAggregate(data);
        console.log(sortArr);
        async.parallel({
            results: function (callback) {
                Invoice.aggregate(_.concat(coreArr, sortArr, paginationArr)).allowDiskUse(true).exec(callback);
                console.log("final concat : ", _.concat(coreArr, sortArr, paginationArr));
            },
            total: function (callback) {
                Invoice.aggregate(_.concat(coreArr, countArr)).exec(callback);
            }
        }, function (err, data2) {
            if (err || _.isEmpty(data2.results)) {
                data2.total = 0;
                callback(err, data2);
            } else {
                data2.total = data2.total[0].count;
                callback(err, data2);
            }
        });
    },
    generateSalesRegisterExcel: function (data, callback, res, user) {
        console.log("data json", data);
        var coreArr = this.completeGetAssignmentAggregate(data, user);
        var group = [{
            $group: {
                _id: "$_id",
                branch: {
                    $first: "$assignment.branch.name"
                },
                approvalTime: {
                    $first: "$approvalTime"
                },
                billedTo: {
                    $first: "$billedTo.name"
                },
                invoiceNumber: {
                    $first: "$invoiceNumber"
                },
                createdBy: {
                    $first: "$createdBy.name",
                },
                insurerClaimId: {
                    $first: "$assignment.insurerClaimId"
                },
                insured: {
                    $first: "$assignment.insured.name"
                },
                invoiceList: {
                    $first: "$invoiceList"
                },
                tax: {
                    $first: "$tax"
                },
                roundOff: {
                    $first: "$roundOff"
                },
                subTotal: {
                    $first: "$subTotal"
                },
                grandTotal: {
                    $first: "$grandTotal"
                },
                approvalStatus: {
                    $first: "$approvalStatus"
                }
            }
        }];
        var project = [{
            $project: {
                _id: 1,
                branch: 1,
                billedTo: 1,
                approvalTime: 1,
                invoiceNumber: 1,
                createdBy: 1,
                insurerClaimId: 1,
                insured: 1,
                invoiceList: 1,
                tax: 1,
                roundOff: 1,
                subTotal: 1,
                grandTotal: 1,
                approvalStatus: 1
            }
        }];
        var sortArr = this.sortOfGetAssignmentAggregate(data);

        Invoice.aggregate(_.concat(coreArr, group, project, sortArr)).allowDiskUse(true).exec(function (err, data1) {
            if (err) {
                console.log("In IF");
                callback(null, data1);
            } else {
                // console.log("In Else", data1);
                if (_.isEmpty(data1)) {
                    callback("No Data Found", null);
                } else {
                    var fee = 0;
                    var expense = 0;
                    // console.log("Done", data1[37]);
                    var excelData = [];
                    // console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA.", _.concat(coreArr,  group, sortArr, project));
                    _.each(data1, function (n, key) {
                        var fee = 0;
                        var expense = 0;
                        var obj = {};
                        obj["SR #"] = key + 1;
                        if (!_.isEmpty(n.branch)) {
                            obj["Branch"] = n.branch;
                        }
                        obj["Invoice Number"] = n.invoiceNumber;
                        obj["Invoice Date"] = moment(n.approvalTime).format("DD-MM-YYYY");
                        if (!_.isEmpty(n.billedTo)) {
                            obj["Billed To"] = n.billedTo;
                        }
                        if (n.insurerClaimId != "") {
                            obj["Insurer Claim No"] = n.insurerClaimId;
                        }
                        if (!_.isEmpty(n.insured)) {
                            obj["Insured Claim #"] = n.insured;
                        }
                        _.each(n.invoiceList, function (m) {
                            if (m.type) {
                                fee = fee + m.amount;
                            } else {
                                expense = expense + m.amount;
                            }
                        });
                        obj["Fee"] = fee;
                        obj["Expense"] = expense;
                        obj["Total"] = fee + expense;
                        _.each(n.tax, function (m) {
                            if (m.name == "Service Tax") {
                                obj["Service Tax"] = m.amount;
                            }
                            if (m.name == "Swachh Bharat Cess" || m.name == "SBC") {
                                obj["SBC"] = m.amount;
                            }
                            if (m.name == "Krishi Kalyan Cess") {
                                obj["KKC"] = m.amount;
                            }
                        });
                        obj["RoundOff"] = n.roundOff;
                        obj["SubTotal"] = n.subTotal;
                        obj["GrandTotal"] = n.grandTotal;
                        obj["Invoice Status"] = n.approvalStatus;
                        excelData.push(obj);
                    });
                    Config.generateExcel("Assignment", excelData, res);
                }
            }
        });
    },

};
module.exports = _.assign(module.exports, exports, model);