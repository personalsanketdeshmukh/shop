var schema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    shortName: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        capitalizeAll: true,
    },
    customerSegment: {
        type: Schema.Types.ObjectId,
        ref: "CustomerSegment",
        required: true,
        key: "customercompany"
    },
    customer: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Customer",
        }],
        index: true
    },
    insurer: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PolicyType",
        }],
        index: true
    },
    policydoc: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PolicyDoc",
        }],
        index: true
    },
    insurercompany: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "PolicyDoc",
        }],
        index: true
    },
    assignment: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: "Assignment",
        }],
        index: true
    },
});

schema.plugin(deepPopulate, {
    populate: {
        'customerSegment': {
            select: 'name _id'
        },
        'policydoc': {
            select: 'name _id policyType'
        },
        'policydoc.policyType':{
            select:'_id name'
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('CustomerCompany', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "customerSegment policydoc.policyType", "customerSegment policydoc.policyType"));
var model = {
    getIdByName: function (data, callback) {
        var Model = this;
        var Const = this(data);
        Model.findOne({
            shortName: data.shortName
        }, function (err, data2) {
            if (err) {
                callback(err);
            } else if (_.isEmpty(data2)) {
                Const.save(function (err, data3) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, data3._id);
                    }
                });
            } else {
                callback(null, data2._id);
            }
        });
    },
    getSegmented: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        console.log(data.segment);
        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'name'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        var Search = Model.find()
            .order(options)
            .keyword(options)
            .deepPopulate("customerSegment").exec(function (err, company) {
                if (err) {
                    callback(err, company);
                } else {
                    var company2 = {};
                    company2.results = _.slice(_.filter(company, function (c) {
                        return c.customerSegment.name == data.segment;
                    }), 0, Config.maxRow);
                    callback(err, company2);
                }

            });


    },
    getInsured: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var filter = {};

        if (data && data.filter && data.filter._id) {
            filter._id = data.filter._id;
        }

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'name'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };
        console.log("Company Filter: ",data.filter);
        var Search = Model.find(filter)
            .order(options)
            .keyword(options)
            .deepPopulate("customerSegment").exec(function (err, company) {
                // console.log("Company : ",company);
                if (err) {
                    callback(err, company);
                } else {
                    var company2 = {};
                    company2.results = _.slice(_.filter(company, function (c) {
                        return c.customerSegment.name == "Insured";
                    }), 0, Config.maxRow);
                    // console.log("company2 insured only : ",company2);
                    callback(err, company2);
                }

            });
    },
    getInsurer: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var filter = {};

        if (data && data.filter && data.filter._id) {
            filter._id = data.filter._id;
        }

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'name'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        var Search = Model.find(filter)
            .order(options)
            .keyword(options)
            .deepPopulate("customerSegment").exec(function (err, company) {
                if (err) {
                    callback(err, company);
                } else {
                    var company2 = {};
                    company2.results = _.slice(_.filter(company, function (c) {
                        return c.customerSegment.name == "Insurer";
                    }), 0, Config.maxRow);
                    callback(err, company2);
                }

            });


    },
    getBroker: function (data, callback) {
        var Model = this;
        var Const = this(data);
        var maxRow = Config.maxRow;
        var filter = {};

        if (data && data.filter && data.filter._id) {
            filter._id = data.filter._id;
        }

        var page = 1;
        if (data.page) {
            page = data.page;
        }
        var field = data.field;
        var options = {
            field: data.field,
            filters: {
                keyword: {
                    fields: ['name'],
                    term: data.keyword
                }
            },
            sort: {
                asc: 'name'
            },
            start: (page - 1) * maxRow,
            count: maxRow
        };

        var Search = Model.find(filter)
            .order(options)
            .keyword(options)
            .deepPopulate("customerSegment").exec(function (err, company) {
                if (err) {
                    callback(err, company);
                } else {
                    var company2 = {};
                    company2.results = _.slice(_.filter(company, function (c) {
                        return c.customerSegment.name == "Broker";
                    }), 0, Config.maxRow);
                    callback(err, company2);
                }

            });


    },
};
module.exports = _.assign(module.exports, exports, model);