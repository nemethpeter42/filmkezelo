var Datastore = require('nedb')
var Papa = require('papaparse')
var fs = require('fs');

var express = require('express')
var backEnd = express()
var frontEnd = express()

var cors = require('cors')
backEnd.all('*', cors())

db = new Datastore({
	filename: 'movies.db',
	autoload:true,
})

var path = require('path')
// for using req.body.anything
var bodyParser = require('body-parser') 
// to support JSON-encoded bodies
backEnd.use( bodyParser.json() )
// to support URL-encoded bodies	
backEnd.use(bodyParser.urlencoded({
  extended: true
}))
// WARNING: don't put module.exports at the end,
// otherwise you get stuck in circular dependency problem
// (because of the earlier require calls)
module.exports = db
var backupRoute = require('./routes/backup')
backEnd.use('/backup', backupRoute)
var editRoute = require('./routes/edit')
backEnd.use('/edit', editRoute)
var newRoute = require('./routes/new')
backEnd.use('/new', newRoute)
var queryRoute = require('./routes/query')
backEnd.use('/query', queryRoute)
var removeRoute = require('./routes/remove')
backEnd.use('/remove', removeRoute)


backEnd.set('port', 3000)
frontEnd.set('port', 80)
frontEnd.use(express.static(path.join(__dirname, 'public')))
frontEnd.get('/', function(req, res){
	res.redirect('filmkezelo.html')
})
backEnd.listen(backEnd.get('port'))
frontEnd.listen(frontEnd.get('port'))
console.log('Express front end server listening on port ' + frontEnd.get('port'))
console.log('Express back end server listening on port ' + backEnd.get('port'))

