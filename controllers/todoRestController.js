var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/todoApp';

module.exports = function(app) {
    app.get('/rest/todos', function(req, res) {
        MongoClient.connect(url, function(err, db) {
            if (err) {
                throw err;
            }

            db.collection('todos').find({}, {_id: false}).toArray(function(err, result) {
                if (err) {
                    throw err;
                }

                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(result));

                db.close();
            });
        });
    });
}