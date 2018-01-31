var express = require('express')
var app = express.Router()
var db = require('../server')

var Papa = require('papaparse')
var dateFormat = require('dateformat')
var zip = new require('node-zip')()
var fs = require('fs')

app.get('/', function(req, res){
	db.find({},(err,docs) => {
		if (err) {
			console.log('database error: '+err)
		} 
		var movies = docs.map( e => ({
			_id:e._id,
			orig:e.orig,
			hun:e.hun,
			prec:e.prec,
			rating:e.rating,
			seen:e.seen,
		}) )
		var comments = []
		docs.forEach( e1 => {
			e1.comments.forEach( e2 => {
				comments.push({
					created_at:e2.created_at,
					entry_id:e1._id,
					content:e2.content,
					type:e2.type,
				})
			})
		})
		var locations = []
		docs.forEach( e1 => {
			e1.locations.forEach( e2 => {
				locations.push({
					entry_id:e1._id,
					content:e2,
				})
			})
		})
		var tags = []
		docs.forEach( e1 => {
			e1.tags.forEach( e2 => {
				tags.push({
					entry_id:e1._id,
					content:e2,
				})
			})
		})
		zip.file('movies.csv', Papa.unparse(movies, {newline:'\n'}))
		zip.file('comments.csv', Papa.unparse(comments, {newline:'\n'}))
		zip.file('locations.csv', Papa.unparse(locations, {newline:'\n'}))
		zip.file('tags.csv', Papa.unparse(tags, {tag:'\n'}))
		var data = zip.generate({base64:false,compression:'DEFLATE'})
		var now = new Date()
		var fn = 'backup_' +dateFormat(now,'yyyy_mm_dd_HH_MM_ss')+'.zip'
		fs.writeFileSync(fn, data, 'binary')
		res.send('backup zip file written')
	})
})

module.exports = app