var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var uniqueValidator = require('mongoose-unique-validator');
var timestamps = require('mongoose-timestamp');
var validators = require('mongoose-validators');
var monguurl = require('monguurl');
require('mongoose-middleware').initialize(mongoose);

var Schema = mongoose.Schema;

var schema = new Schema({
    assignment: {
        type: Schema.Types.ObjectId,
        ref: "Assignment",
        index: true,
        required: true,
        key: "timeline"
    },
    chat: [{
        viewEmailStatus: {
            type: String
        },
        isSurveyApproved: {
            type: Boolean
        },
        onSurveyAttended: {
            type: Boolean
        },
        emailStatus: {
            type: Boolean,
            default: false
        },
        acknowledgmentStatus: {
            type: Boolean,
            default: false
        },
        deputationStatus: {
            type: Boolean,
            default: false
        },
        event: {
            type: String
        },
        surveyor: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            index: true
        },
        employee: {
            type: Schema.Types.ObjectId,
            ref: "Employee",
            index: true
        },
        title: {
            type: String
        },
        time: {
            type: Date,
            default: Date.now
        },
        type: {
            type: String,
            enum: ["Email", "Normal", "SurveyDone"]
        },
        message: {
            type: String
        },
        email: {
            type: {}
        },
        attachment: {
            type: []
        },
        surveyEndTime: {
            type: Date
        },
        surveyStartTime: {
            type: Date
        },
        surveyDate: {
            type: Date
        },
        surveyTime: {
            type: Date
        },
        address: {
            type: String
        },
        invoiceNumber: {
            type: String
        },
        typeName:{
            type:String
        }
    }]
});

schema.plugin(deepPopulate, {
    populate: {
        'chat.employee': {
            select: "name photo func houseColor email officeEmail"
        },
        // 'chat.employee.employee': {
        //     select: ""
        // },
        'chat.employee.func': {
            select: "name"
        }
    }
});
schema.plugin(uniqueValidator);
schema.plugin(timestamps);
module.exports = mongoose.model('Timeline', schema);

var exports = _.cloneDeep(require("sails-wohlig-service")(schema, "chat.employee  chat.employee.func", "chat.employee"));
var model = {
    getTimeline: function (data, callback) {
        Timeline.findOne({
            assignment: data.assignment
        }).limit(10).lean().exec(function (err, data2) {
            if (err) {
                callback(err, null);
            } else {
                callback(err, data2);
            }
        });
    },
    updateEmailStatus: function (data, callback) {
        var matchObj = {};
        var matchObj2 = {};
        matchObj = {
            _id: data.timelineId,
            chat: {
                $elemMatch: {
                    _id: data.chatId
                }
            }
        };
        if (data.event == "Acknowledgment Email") {
            matchObj2 = {
                $set: {
                    "chat.$.acknowledgmentStatus": true
                }
            };
        } else if (data.event == "Deputation mail") {
            matchObj2 = {
                $set: {
                    "chat.$.deputationStatus": true
                }
            };
        } else {
            matchObj2 = {
                $set: {
                    "chat.$.emailStatus": true
                }
            };
        }


        Timeline.update(matchObj, matchObj2).exec(function (err, data) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, data);
            }
        });
    },

  updateTimeline: function (data, callback) {
    Timeline.update({
      assignment: data.assignment
    }, {
      $push: {
        chat: data.chat
      }
    }).exec(function (err, updated) {
        console.log("updated : ",updated);
      if (err) {
        callback(err, null);
      } else {
        if (updated.nModified == 1) {
            callback(err,updated);
        } else {
          callback("There was an error while updating timeline", updated);
        }
      }
    });
  },
};
module.exports = _.assign(module.exports, exports, model);