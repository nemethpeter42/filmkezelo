var express = require('express')
var app = express.Router()
var db = require('../server');

app.get('/entry', function(req, res){
	db.find({},(err,docs) => {
		if (err) {
			console.log('database error: '+err)
		} 
		res.send(JSON.stringify(docs.map( (e) => ({
			entry_id:e._id,
			orig:e.orig,
			hun:e.hun,
			prec:e.prec,
			rating:e.rating,
			seen:e.seen,
			tag_cnt:e.tags.length,
			cmnt_cnt:e.comments.length,
		}) )))
	})
})

app.get('/details/:entry_id', function(req, res){
	db.find({_id:parseInt(req.params.entry_id)},(err,docs) => {
		if (err) {
			console.log('database error: '+err)
		} 
		if (docs.length>0){
			res.send(JSON.stringify({
				comments:[].concat(docs[0].comments),
				locations:[].concat(docs[0].locations),
				tags:[].concat(docs[0].tags),
			}))
		}else{
			res.send({success:false,errorMsg:'invalid _id: '+req.params.entry_id})
		}
	})
})

app.get('/locations', function(req, res){
	db.find({},(err,docs) => {
		if (err) {
			console.log('database error: '+err)
		} 
		var result = {};
		docs.forEach(e1 => {
			e1.locations.forEach(e2 => {
				if (result[e2]===undefined){
					result[e2]=[]
				}
				result[e2].push(e1._id)
			})
		})
		res.send(JSON.stringify(result))
	})
})

app.get('/tags', function(req, res){
	db.find({},(err,docs) => {
		if (err) {
			console.log('database error: '+err)
		} 
		var result = {};
		docs.forEach(e1 => {
			e1.tags.forEach(e2 => {
				if (result[e2]===undefined){
					result[e2]=[]
				}
				result[e2].push(e1._id)
			})
		})
		res.send(JSON.stringify(result))
	})
})

module.exports = app