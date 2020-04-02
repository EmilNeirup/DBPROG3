const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const path = require('path');

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/brugere', function (req, res){
    res.sendFile(path.join(__dirname + '/brugere.html'));
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

let personerList = []

sql.connect(config, function(err) {
    if (err) console.log(err);

    let sqlRequest = new sql.Request();

    let sqlQuery='SELECT * FROM Personer'
    sqlRequest.query(sqlQuery, function(err, data){
        if (err) console.log(err)
    
    personerList = data.recordset;
    console.log(personerList);
    sql.close();
    });
});

app.post('/test', function (req, res) {
    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery='SELECT * FROM Personer'
        sqlRequest.query(sqlQuery, function(err, data){
            if (err) console.log(err)
        
        let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
        let dropDown = "<form action='/employees' method='POST'><select class='form-control mb-2' name='emprating' id='emprating'>'"
        let row = ''
        for (let j=0;j<data.recordset.length;j++){
            row=row + '<option value= ' + data.recordset[j].id + '>' + data.recordset[j].navn + '</option>'
        }
        dropDown = dropDown + row + "</select><input class='btn btn-primary mb-2' type='submit' id='query' value='Vis data' /></form>";

        res.send(head+dropDown)
        sql.close();
        });
    });
});

app.post('/employees', function (req, res) {
    sql.connect(config, function(err) {
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let personId=req.body.emprating;
        console.log(personId);

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
        console.log(creatPersonId);
        let creatPersonNavn=req.body.inputNavn;
        console.log(creatPersonNavn);
        if (err) console.log(err);

        let sqlRequest = new sql.Request();

        let sqlQuery="EXEC InsertPerson2 @Id = " + parseInt(creatPersonId) + ", @Name = '" + creatPersonNavn + "';";
        sqlRequest.query(sqlQuery,sql, function(err, data){
            if (err) console.log(err) 
            console.log(data.recordset);

            let head=' <head><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous"></head>'  
            let h='<div class="container"> <h1>' + data.recordset[0].navn + 'er oprettet med ID' + data.recordset[0].id + '</h1></div>'
            console.log(data.recordset[0].navn + data.recordset[0].id) 
            
            res.send(head+h)
            sql.close();
        });
    });
});

app.post('/changed-person', function (req) {
    
    let changedPersonId=req.body.changedInputId;
    console.log(changedPersonId);
    let changedPersonNavn=req.body.changedInputNavn;
    console.log(changedPersonNavn);

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


const webserver = app.listen(5000, function (){
    console.log('Node Web Server is running..');
});