var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/todoApp';

module.exports = function(app) {
    app.get('/setupTodos', function(req, res) {
        var starterTodos = [
            {
                username: 'test',
                todo: 'Buy milk',
                isDone: false,
                hasAttachment: false
            },
            {
                username: 'test',
                todo: 'Feed dog',
                isDone: false,
                hasAttachment: false
            },
            {
                username: 'test',
                todo: 'Learn Node',
                isDone: false,
                hasAttachment: false
            }
        ];

        // create new db name todoApp
        MongoClient.connect(url, function(err, db) {
            if (err) {
                throw err;
            }
            console.log('Database created!');

            // create a table name todos
            db.createCollection('todos', function(err, res) {
                if (err) {
                    throw err;
                }

                console.log('Table has created');

                // insert seed datas.
                db.collection('todos').insertMany(starterTodos, function(err, res) {
                    if (err) {
                        throw err;
                    }

                    console.log('Number of todos inserted: ' + res.insertedCount);

                    db.close();
                    res.writeHead(200, {'Content-Type': 'text/plain'});
                    res.end('Number of todos inserted: ' + res.insertedCount);
                });
            });
        });
    });
}