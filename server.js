const express = require("express");
const bodyParser = require("body-parser");
const firebase = require("firebase");

var app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

var id;

const firebaseConfig = {
    apiKey: "AIzaSyDvOYhfFuKyAMnK9yglOEwSlZKqNI2-53U",
    authDomain: "task-manager-e4202.firebaseapp.com",
    databaseURL: "https://task-manager-e4202.firebaseio.com",
    projectId: "task-manager-e4202",
    storageBucket: "task-manager-e4202.appspot.com",
    messagingSenderId: "435962504620",
    appId: "1:435962504620:web:5e5355de89d51f3acfc609",
    measurementId: "G-11LJ8JHJRY"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

app.get("/", async function (req, res) {
    let allTask = [];
    db.collection("task")
        .get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                //console.log(doc.id, "=>", doc.data());
                allTask.push({ id: doc.id, ...doc.data() });
            })
        })
        .catch(err => {
            console.log("Error getting documents", err);
        })

    setTimeout(() => {
        //console.log(allTask);
        res.render("task.ejs", { frontTask: allTask });
    }, 1500);
});

app.post("/addTask", (req, res) => {
    var date = req.body.date;
    var dateArray = date.split("-");
    var today = (dateArray[1] + "-" + dateArray[2] + "-" + dateArray[0]);
    db.collection("task").add({
        complete: false,
        date: today,
        task: req.body.newTask,
    }).then(ref => {
        //console.log("Added document with ID: ", ref.id);
    });
    //console.log(req.body.date);
    res.redirect("/");
});

app.get("/doneTask/:id", (req, res) => {
    var id = req.params.id;
    //console.log(id);
    let setDoc = db.collection("task").doc(id);
    setDoc.set({
        complete: true
    }, { merge: true });
    res.redirect("/");
});

app.get("/taskID/:id", (req, res) => {
    id = req.params.id;
    // console.log(id);
    // res.redirect("/");
});

app.post("/update", (req, res) => {
    db.collection("task").doc(id).update({ task: req.body.editedTask });
    res.redirect("/");
});

app.get("/delete/:id", (req, res) => {
    var id = req.params.id;
    //console.log(id);
    db.collection("task").doc(id).delete();
    res.redirect("/");
});

app.listen(3000, function () {
    console.log("Server is up at 3000...")
});