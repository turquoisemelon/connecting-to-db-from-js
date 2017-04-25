var pg = require('pg');
var moment = require('moment');
const settings = require("./settings"); // settings.json

// instantiate a new client
// the client will read connection information from
// the same environment variables used by postgres cli tools
const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

const input = process.argv[2];

// connect to our database
client.connect(function (err) {
  if (err) throw err;

  // execute a query on our database
  console.log('searching...');
  client.query("SELECT * FROM famous_people WHERE last_name ILIKE $1 OR first_name ILIKE $1;", [`${input}%`], function (err, results) {

    if (err) throw err;
    
    outputData(input, results);
  });
});

function outputData(input, results) {
  console.log(results.rows);
  console.log(`Found 1 person(s) by the name ${input}:
  - ${results.rows[0].id}: ${results.rows[0].first_name} ${results.rows[0].last_name}, born '${results.rows[0].birthdate.getFullYear()}-${results.rows[0].birthdate.getMonth()}-${results.rows[0].birthdate.getDate()}'`);
}
