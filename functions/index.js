const functions = require("firebase-functions");
const app = require("express")();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//  export GOOGLE_APPLICATION_CREDENTIALS="./firebase-todo-app-001-firebase-adminsdk-iyytg-0981a87d80.json"

const auth = require("./util/auth");

const {
  readTodos,
  readTodo,
  writeTodo,
  deleteTodo,
  editTodo,
} = require("./APIs/todos");

const { loginUser, signUpUser, uploadProfilePhoto } = require("./APIs/users");

//read todos
app.get("/todos", readTodos);

//read todo
app.get("/todo/:todoId", readTodo);

//write todo
app.post("/todo", writeTodo);

//delete todo
app.delete("/todo/:todoId", deleteTodo);

//edit todo
app.put("/todo/:todoId", editTodo);

// login user
app.post("/login", loginUser);

//signup user
app.post("/signup", signUpUser);

app.post("/user/image", auth, uploadProfilePhoto);

exports.api = functions.https.onRequest(app);
