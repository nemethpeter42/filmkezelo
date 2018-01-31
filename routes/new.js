var express = require('express')
var app = express.Router()
var db = require('../server');
var dateFormat = require('dateformat')

app.post('/entry', function(req, res){
	var newEntry = req.body.entry
	newEntry.comments=[]
	newEntry.locations=[]
	newEntry.tags=[]
	db.find({},(err,docs) => {
		if (err) {
			console.log('database error: '+err)
		} 
		var next_id = 0
		if (docs.length > 0){
			next_id = Math.max(...docs.map(e => e._id)) + 1
		}
		newEntry._id=next_id
		db.insert(newEntry, function (err, newDoc) {
			if (err){
				console.log('database error: '+err)
				res.send(JSON.stringify({success:false,errorMsg:err}))
			}else{
				res.send(JSON.stringify({success:true,entry_id: next_id}))
			}
		})
	})
})

app.post('/tag', function(req, res){
	db.update({ _id: { $in: req.body.entry_ids } }, { $addToSet: { tags: req.body.content } }, {multi:true}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
})

app.post('/location', function(req, res){
	db.update({ _id: { $in: req.body.entry_ids } }, { $addToSet: { locations: req.body.content } }, {multi:true}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
})

app.post('/comment', function(req, res){
	var now = new Date()
	var created_at = dateFormat(now,'yyyy-mm-dd HH:MM:ss')
	db.update({_id:req.body.entry_id}, { 
		$push: {
			'comments': {
				'created_at':created_at,
				'content':req.body.content,
				'type':req.body.type,
			},
		}, 
	}, {}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false}))
		}else{
			res.send(JSON.stringify({success:true,created_at:created_at}))
		}
	})
})

module.exports = app