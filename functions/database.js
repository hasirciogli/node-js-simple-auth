var mysql      = require('mysql');

exports.callSql = (sql, callBack=null) => {
  
  var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'test'
  });

  connection.connect();

  connection.query(sql, function (error, results, fields) {
    if(callBack != null) callBack(error, results, fields);
  });
  connection.end();
}