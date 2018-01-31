var express = require('express')
var app = express.Router()
var db = require('../server');

app.post('/entry', function(req, res){
	var e = req.body.entry
	db.update({_id:e.entry_id},{
		$set:{
			'orig':e.orig,
			'hun':e.hun,
			'prec':e.prec,
			'rating':e.rating,
			'seen':e.seen,
		}
	},{}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false,errorMsg:err}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
})

app.post('/comment', function(req, res){
	db.update({_id:req.body.entry_id},{
		$pull:{
			'comments': {
				'created_at':req.body.comment.created_at,
			},
		},
		$push:{
			'comments': req.body.comment,
		},
	},{}, function (err) {
		if (err){
			console.log('database error: '+err)
			res.send(JSON.stringify({success:false,errorMsg:err}))
		}else{
			res.send(JSON.stringify({success:true}))
		}
	})
})

module.exports = app