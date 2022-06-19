// Web App's firebase Configuration
const firebaseConfig = {
    apiKey: "XXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "XXXXXXXXXXXXXXXXXXXXXX",
    databaseURL: "XXXXXXXXXXXXXXXXXXXXXX",
    projectId: "XXXXXXXXXXXXXXXXXXXXXX",
    storageBucket: "XXXXXXXXXXXXXXXXXXXXXX",
    messagingSenderId: "XXXXXXXXXXXXXXXXXXXXXX",
    appId: "XXXXXXXXXXXXXXXXXXXXXX",
    measurementId: "XXXXXXXXXXXXXXXXXXXXXX"
};

// Initialize Firebase
var app = firebase.initializeApp(firebaseConfig);
var database = firebase.database();
// console.log(database);

var header = document.getElementById("header");
var form = document.getElementById("form");
var toDoList = document.getElementById("to-do-list");

function countToDo() {
    var counter = document.getElementById("counter");
    var tasks = toDoList.children.length;
    if (!tasks) {
        counter.textContent = "No Tasks";
    } else if (tasks === 1) {
        counter.textContent = tasks + " " + "Task";
    } else {
        counter.textContent = tasks + " " + "Tasks";
    }
}

// 3. Get Data using "on(...)" for firebase database
database.ref("/todos").on("child_added", function (data) {

    // Create To do list
    var ul = document.createElement("ul");
    toDoList.appendChild(ul);
    ul.className = "todo";
    var li = document.createElement("li");
    var h4 = document.createElement("h4");
    var h4Text = document.createTextNode(data.val().todo);  // Get value of todo from database
    h4.appendChild(h4Text);
    li.appendChild(h4);
    ul.appendChild(li);

    // Create and append edit button
    var div = document.createElement("div");
    ul.appendChild(div);
    var editBtn = document.createElement("button");
    editBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    div.appendChild(editBtn);
    editBtn.setAttribute("onclick", "editToDo(this)");
    editBtn.setAttribute("id", data.val().key);  // Set key in id attribute for firebase database
    editBtn.className = "edit-btn";

    // Create and append delete button
    var delBtn = document.createElement("button");
    delBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    div.appendChild(delBtn);
    delBtn.setAttribute("onclick", "delToDo(this)");
    delBtn.setAttribute("id", data.val().key);  // Set key in id attribute for firebase database
    delBtn.className = "del-btn";
});

function addToDo() {
    var input = document.getElementById("todo-input");

    if (input.value.length >= 5 && input.value.length <= 34) {
        // Sava Data in firebase database:
        // 1. Generate Key
        var key = database.ref("/todos").push().key;

        var todoObj = {
            key: key,
            todo: input.value
        }
        // 2. Set/Push Object in the key
        database.ref("/todos").child(key).set(todoObj);
        // // OR
        // 2. // database.ref("/todos").push(todoObj);

        // Check if alert exists
        if (header.children.length > 2) {
            header.lastElementChild.remove();
        }
    } else {
        // Display Alert
        for (var i = 0; i < header.children.length; i++) {
            if (header.children.length == 2) {
                var alert = document.createElement("p");
                var alertText = document.createTextNode("Invalid entry");
                alert.appendChild(alertText);
                alert.className = "alert";

                header.appendChild(alert);
            }
        }
    }
    // Empty the Input field
    input.value = "";
}

function deleteAll() {
    // Delete all to-dos from firebase database
    database.ref("/todos").remove();

    // Delete all to-dos from DOM
    toDoList.innerHTML = "";
    countToDo();
}

function editToDo(element) {
    var toDo = element.parentNode.previousElementSibling.firstElementChild; // h4
    var toDoLi = element.parentNode.previousElementSibling; // li

    // Create input field and remove h4 in DOM
    editInput = document.createElement('input');
    toDoLi.appendChild(editInput);
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = toDo.innerHTML;
    toDoLi.removeChild(toDo);
    element.innerHTML = '<i class="fa-solid fa-check"></i>';
    element.setAttribute("onclick", "updateToDo(this)");
}

function updateToDo(element) {
    var toDoLi = element.parentNode.previousElementSibling; // li

    if (editInput.value.length >= 5 && editInput.value.length <= 34) {

        // Remove alert if exists
        if (toDoLi.children.length == 2) {
            toDoLi.removeChild(span);
        }
        // Create h4, remove input field and update edited to-do in DOM
        h4 = document.createElement('h4');
        h4.textContent = editInput.value;
        toDoLi.appendChild(h4);
        toDoLi.removeChild(editInput);
        element.innerHTML = '<i class="fa-solid fa-pencil"></i>';
        element.setAttribute("onclick", "editToDo(this)");
        element.className = "edit-btn";

        // Create & set new object for updated to-do in firebase database
        var updatedTodoObj = {
            key: element.id,
            todo: h4.textContent
        }
        database.ref("/todos").child(element.id).set(updatedTodoObj);

    } else {
        if (toDoLi.children.length == 1) {
            // Display alert
            span = document.createElement('span');
            span.textContent = 'Invalid Entry';
            span.className = 'alert';
            toDoLi.appendChild(span);
        }
    }
}

function delToDo(element) {
    // Delete to-do from firebase database
    database.ref("/todos").child(element.id).remove();

    // Delete to-do from DOM
    element.parentNode.parentNode.remove();
    countToDo();
}