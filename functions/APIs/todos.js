const { db } = require("../util/admin");

//read todos
exports.readTodos = (request, response) => {
  db.collection("todos")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let todos = [];
      data.forEach((doc) => {
        todos.push({
          todoId: doc.id,
          title: doc.data().title,
          body: doc.data().body,
          createdAt: doc.data().createdAt,
        });
      });
      return response.json(todos);
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

//read todo
exports.readTodo = (request, response) => {
  const document = db.doc(`/todos/${request.params.todoId}`);

  document
    .get()
    .then((doc) => {
      return response.json(doc.data());
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

//write todo
exports.writeTodo = (request, response) => {
  var title = request.body.title;
  var body = request.body.body;
  if (title.trim() === "") {
    return response.status(400).json({ title: "Must not be empty" });
  }

  if (body.trim() === "") {
    return response.status(400).json({ body: "Must not be empty" });
  }

  const newTodoItem = {
    title: request.body.title,
    body: request.body.body,
    createdAt: new Date().toISOString(),
  };

  db.collection("todos")
    .add(newTodoItem)
    .then((doc) => {
      const responseTodoItem = newTodoItem;
      responseTodoItem.id = doc.id;
      return response.json(responseTodoItem);
    })
    .catch((err) => {
      response.status(500).json({ error: "Something went wrong" });
      console.log(err);
    });
};

//delete todo
exports.deleteTodo = (request, response) => {
  const document = db.doc(`/todos/${request.params.todoId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return response.status(404).json({ error: "Todo Not Found" });
      }
      return document.delete();
    })
    .then(() => {
      response.json({ message: "Delete Successfull!" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};

//edit todo
exports.editTodo = (request, response) => {
  if (request.body.todoId || request.body.createdAt) {
    response.status(403).json({ message: "Not allowed to edit" });
  }
  let document = db.collection("todos").doc(`${request.params.todoId}`);
  document
    .update(request.body)
    .then(() => {
      response.json({ message: "Updated successfully" });
    })
    .catch((err) => {
      console.log(err);
      return response.status(500).json({ error: err.code });
    });
};
