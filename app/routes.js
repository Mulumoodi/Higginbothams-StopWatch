var Todo = require('./models/todo');

function getTodos(res) {
    Todo.find(function (err, todos) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(todos); // return all todos in JSON format
    });
};

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/todos', function (req, res) {
        // use mongoose to get all todos in the database
        getTodos(res);

    });

    app.put('/api/todos/:todo_id', function (req, res) {
        // use mongoose to get all todos in the database
        /*Todo.find({
            _id: req.params.todo_id,
        }, function (err, todo) {
            if (err)
                res.send(err);

          todo.text=req.body.text;
          //todo.save(function (err, updatedTank) {
            //if (err) return handleError(err);
            res.send(updatedTank);
          //});
          //res.json(todo);
        });*/
      var txt=req.body.text;
        console.log(txt);
        Todo.findByIdAndUpdate(req.params.todo_id, { $set: { stop: txt }}, { new: true }, function (err, tank) {
          if (err) return handleError(err);
          console.log(tank);
            //res.send(tank);
            getTodos(res);
        });


    });



    // create todo and send back all todos after creation
    app.post('/api/todos', function (req, res) {

        // create a todo, information comes from AJAX request from Angular
        Todo.create({
            text: req.body.text,
            done: false
        }, function (err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            //getTodos(res);
            res.send(todo);
        });

    });

    // delete a todo
    app.delete('/api/todos/:todo_id', function (req, res) {
        Todo.remove({
            _id: req.params.todo_id
        }, function (err, todo) {
            if (err)
                res.send(err);

            getTodos(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};
