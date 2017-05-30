/**
 * UploadController
 *
 * @description :: Server-side logic for managing uploads
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    index: function (req, res) {
        function callback2(err) {
            Config.GlobalCallback(err, fileNames, res);
        }
        var fileNames = [];
        req.file("file").upload({
            maxBytes: 10000000 // 10 MB Storage 1 MB = 10^6
        }, function (err, uploadedFile) {
            if (uploadedFile && uploadedFile.length > 0) {
                async.each(uploadedFile, function (n, callback) {
                    Config.uploadFile(n.fd, function (err, value) {
                        if (err) {
                            callback(err);
                        } else {
                            fileNames.push(value.name);
                            callback(null);
                        }
                    });
                }, callback2);
            } else {
                callback2(null, {
                    value: false,
                    data: "No files selected"
                });
            }
        });
    },
    readFile: function (req, res) {
        Config.readUploaded(req.query.file, req.query.width, req.query.height, req.query.style, res);
    },
    wallpaper: function (req, res) {
        Config.readUploaded(req.query.file, req.query.width, req.query.height, req.query.style, res);
    },
    removeImage: function (req, res) {
        //$in delete only single file. so used with each
        //Remove files from fs.files and fs.chunks
        if (req.body.filename) {
            if (_.isArray(req.body.filename)) {
                var filename = req.body.filename;
            } else {
                var filename = [];
                filename.push(req.body.filename);
            }
            console.log('filename' ,filename);
            async.eachSeries(filename, function (n, callback) {
                 gfs.remove({
                filename: n
            }, function (err) {
                if (!err) {
                   return callback();
                } else {
                   return res.send({
                        value: false,
                        data: "There was an error while deleting data"
                    });
                }
            });
            }, function (err, data) {
                if (err) {
                    return res.send({
                        value: false,
                        data: "There was an error while deleting data"
                    });
                } else {
                    return res.send({
                        value: true,
                        data: "Data Successfully Deleted"
                    });
                }
            });
        } else {
            res.json({
                value: false,
                data: "Invalid Request"
            });
        }
    }
};