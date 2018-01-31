var express = require('express')
var app = express.Router()
var db = require('../server');

app.get('/entry/:entry_id',function(req, res){
	db.remove({_id: parseInt(req.params.entry_id) }, {}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
})

app.post('/tag',function(req, res){
	db.update({ _id: { $in: req.body.entry_ids } }, { $pull: { tags: req.body.content } }, {multi:true}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
})

app.post('/comment',function(req, res){
	db.update({_id:req.body.entry_id}, { $pull: { comments: { created_at:req.body.created_at } } }, {}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
	
})

app.post('/location',function(req, res){
	db.update({ _id: { $in: req.body.entry_ids } }, { $pull: { locations: req.body.content } }, {multi:true}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
})

module.exports = app