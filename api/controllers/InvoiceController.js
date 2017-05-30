module.exports = _.cloneDeep(require("sails-wohlig-controller"));
var controller = {
    generateSalesRegisterExcel: function (req, res) {
       JsonStore.findOne({
            _id: req.query.id
        }).lean().exec(function (err, data) {
            if (err || _.isEmpty(data)) {
                res.badRequest();
            } else {
                req.model.generateSalesRegisterExcel(data.json, res.callback, res, req.user);
            }
        });
    },
    getInvoiceApprovalList: function (req, res) {
        if (req.body) {
            req.model.getInvoiceApprovalList(req.body, res.callback);

        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
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

};
module.exports = _.assign(module.exports, controller);
