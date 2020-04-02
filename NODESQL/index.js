const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

/*app.get('/brugere', function (req, res){
    res.sendFile(path.join(__dirname + '/brugere.js'));
});*/

app.get('/employees', function (req, res){
    res.sendFile(path.join(__dirname + '/employees.html'));
});

app.get('/', function (req, res){
    res.sendFile(path.join(__dirname + '/test.html'));
});




//Tilgår driverne
const sql = require("mssql");

//Min database konfiguration
const config = {
    user: 'sa',
    password: 'reallyStrongPwd123',
    server: 'localhost',
    database: 'DataProg3',
    port: 1433,
    dateStrings: true
};

app.post('/employees', function (req, res) {
    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();


        let sqlQuery='SELECT * FROM Personer';
        sqlRequest.query(sqlQuery, function(err, data){
            if (err) console.log(err)

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1>Alle brugere</h1>'
        let str='<table class="table">';
        let row='';
        for (let j=0;j<data.recordset.length;j++){
            row=row + '<tr>' + '<td>' + data.recordset[j].id +'</td>' + '<td>' + data.recordset[j].navn +'</td>'
        }
         str=str + row + '</table>';
        let bottom ='</div>'
        res.send(head+h+str+bottom)


        sql.close();
        });
    });
});

app.post('/employee', function (req, res) {
    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let personId=req.body.emprating;

        let sqlQuery='SELECT Tasks.id, Tasks.navn, Tasks.timeStart, Tasks.timeStop, Personer.navn AS personNavn FROM Tasks INNER JOIN PersonerToTasks ON PersonerToTasks.tasksId = Tasks.id INNER JOIN Personer ON PersonerToTasks.personerId = Personer.id WHERE Personer.id = ' + parseInt(personId);
        sqlRequest.query(sqlQuery, function(err, data){
            if (err) console.log(err)

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1>' + data.recordset[0].personNavn + 's detaljer</h1>'
        let str='<table class="table">';
        let row='';
        for (let j=0;j<data.recordset.length;j++){
            row=row + '<tr>' + '<td>' + data.recordset[j].id +'</td>' + '<td>' + data.recordset[j].navn +'</td>' + '<td>' + data.recordset[j].timeStart +'</td>'+ '<td>' + data.recordset[j].timeStop +'</td>'
        }
         str=str + row + '</table>';
        let bottom ='</div>'
        res.send(head+h+str+bottom)


        sql.close();
        });
    });
});




app.post('/person', function (req, res) {
    sql.connect(config, function(err) {
        let creatPersonId=req.body.inputId;
        let creatPersonNavn=req.body.inputNavn;
        console.log(creatPersonNavn);

        let sqlRequest = new sql.Request();

        let sqlQuery="EXEC InsertPerson2 @Id = " + parseInt(creatPersonId) + ", @Name = '" + creatPersonNavn + "';";
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 

            let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
            let h='<div class="container"> <h1>' + data.recordset[0].navn + 'er oprettet med ID' + data.recordset[0].id + '</h1></div>'
            
            res.send(head+h)
            sql.close();
        });
    });
});

app.post('/changed-person', function (req, res) {
    
    let changedPersonId=req.body.changedInputId;
    let changedPersonNavn=req.body.changedInputNavn;

    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="UPDATE Personer SET navn = ' " + changedPersonNavn + "' WHERE id = " + parseInt(changedPersonId);
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1>' + changedPersonNavn + ' blev ændret</h1>'
        res.send(head+h)

        sql.close();
        });
    });
});

app.post('/deleted-person', function (req, res) {
    
    let deletedPersonId=req.body.deletedInputId;

    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="DELETE FROM Personer WHERE id = " + parseInt(deletedPersonId);
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1> Bruger med ID' + deletedPersonId + ' blev slettet</h1>'
        res.send(head+h)

        sql.close();
        });
    });
});

app.post('/tasks', function (req, res) {
    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();


        let sqlQuery='SELECT * FROM Tasks';
        sqlRequest.query(sqlQuery, function(err, data){
            if (err) console.log(err)

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1>Alle tasks</h1>'
        let str='<table class="table">';
        let row='';
        for (let j=0;j<data.recordset.length;j++){
            row=row + '<tr>' + '<td>' + data.recordset[j].id +'</td>' + '<td>' + data.recordset[j].projectId +'</td>' + '<td>' + data.recordset[j].navn +'</td>' + '<td>' + data.recordset[j].timeStart +'</td>' + '<td>' + data.recordset[j].timeStop +'</td>'
        }
         str=str + row + '</table>';
        let bottom ='</div>'
        res.send(head+h+str+bottom)


        sql.close();
        });
    });
});

app.post('/task', function (req, res) {
    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let taskId=req.body.taskSelected;

        let sqlQuery='SELECT Personer.navn AS personNavn, Personer.id, Tasks.navn AS taskNavn, Tasks.timeStart, Tasks.timeStop FROM Personer INNER JOIN PersonerToTasks ON PersonerToTasks.personerId = Personer.id INNER JOIN Tasks ON PersonerToTasks.tasksId = Tasks.id WHERE Tasks.id = ' + parseInt(taskId);
        sqlRequest.query(sqlQuery, function(err, data){
            if (err) console.log(err)

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1>' + data.recordset[0].taskNavn + 's detaljer</h1>'
        let str='<table class="table">';
        let row='';
        for (let j=0;j<data.recordset.length;j++){
            row=row + '<tr>' + '<td>' + data.recordset[j].id +'</td>' + '<td>' + data.recordset[j].personNavn +'</td>' + '<td>' + data.recordset[j].timeStart +'</td>'+ '<td>' + data.recordset[j].timeStop +'</td>'
        }
         str=str + row + '</table>';
        let bottom ='</div>'
        res.send(head+h+str+bottom)


        sql.close();
        });
    });
});

app.post('/created-task', function (req, res) {
    sql.connect(config, function(err) {
        let creatTaskId=req.body.taskInputId;
        let creatTasknNavn=req.body.taskInputNavn;
        let creatTaskInputTimeStart=req.body.taskInputTimeStart;
        let creatTaskInputTimeStop=req.body.taskInputTimeStop;
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="INSERT INTO Tasks(id, projectId, navn, timeStart, timeStop) VALUES (" + creatTaskId + ", 1, '"+ creatTasknNavn + "', '" + creatTaskInputTimeStart + "', '" + creatTaskInputTimeStop + "')";
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 
            
            res.send(head+h)
            sql.close();
        });
    });
});

app.post('/changed-task', function (req, res) {
    sql.connect(config, function(err) {
        let creatTaskId=req.body.taskChangeInputId;
        let creatTasknNavn=req.body.taskChangeInputNavn;
        let creatTaskInputTimeStart=req.body.changedTaskInputTimeStart;
        let creatTaskInputTimeStop=req.body.changedTaskInputTimeStop;
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="UPDATE Tasks SET navn = '" + creatTasknNavn + "', timeStart = '" + creatTaskInputTimeStart + "', timeStop = '" + creatTaskInputTimeStop + "' WHERE id = " + creatTaskId;
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 
            
            res.send(head+h)
            sql.close();
        });
    });
});

app.post('/deleted-task', function (req, res) {
    
    let deletedTaskId=req.body.taskDeleteInputId;

    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="DELETE FROM Tasks WHERE id = " + parseInt(deletedTaskId);
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1> Task med ID' + deletedTaskId + ' blev slettet</h1>'
        res.send(head+h)

        sql.close();
        });
    });
});

app.post('/bruger-task', function (req, res) {
    sql.connect(config, function(err) {
        let brugerTaskInputId=req.body.brugerTaskInputId;
        let brugerTaskInputId2=req.body.brugerTaskInputId2;
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="INSERT INTO PersonerToTasks(personerId, tasksId) VALUES (" + brugerTaskInputId + ", " + brugerTaskInputId2 + ")"
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 
            
            res.send(head+h)
            sql.close();
        });
    });
});

app.post('/delete-bruger-task', function (req, res) {
    
    let deleteBrugerTaskInputId=req.body.deleteBrugerTaskInputId;
    let deleteBrugerTaskInputId2=req.body.deleteBrugerTaskInputId2;

    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="DELETE FROM PersonerToTasks WHERE personerId = " + deleteBrugerTaskInputId + " AND tasksId = " + deleteBrugerTaskInputId2 ;
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 

        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let h='<div class="container"> <h1> Task med ID' + deleteBrugerTaskInputId + ' blev slettet</h1>'
        res.send(head+h)

        sql.close();
        });
    });
});

const webserver = app.listen(5000, function (){
    console.log('Node Web Server is running..');
});