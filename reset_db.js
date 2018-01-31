var Datastore = require('nedb')
var Papa = require('papaparse')
var fs = require('fs')
var moviesFile = 'import_data/movies.csv'
var properties = [
	{
		name:'comments',
		fn:'import_data/comments.csv',
		numCols:[],
	},
	{
		name:'locations',
		fn:'import_data/locations.csv',
		numCols:[],
	},
	{
		name:'tags',
		fn:'import_data/tags.csv',
		numCols:[],
	},
]

db = new Datastore({
	filename: 'movies.db',
	autoload:true,
})
Papa.parse(fs.readFileSync(moviesFile, { encoding: 'utf-8' }), {
	header:true,
	complete: function(results) {
		results.data.forEach( (e) => {
			Object.keys(e).forEach( (k) => {
				// converting empty strings to null, 
				// and at the same time avoiding null to be parsed as NaN
				if (e[k]===''){
					e[k]=null
				}else if (['prec','rating','seen','_id'].includes(k)){
					e[k]=parseInt(e[k])
				}
			})
			e.comments=[]
			e.locations=[]
			e.tags=[]
		})
		db.insert(results.data, function (err, newDoc) {  
			if (err){
				console.log(err)
			}else{
				console.log('main ')
				callbackMovies()
			}
		})
	}
})
var callbackMovies=()=>{
	var i = 0
	var rsvForEachPropFile = () => {
		if (i<properties.length){
			var prop = properties[i]
			Papa.parse(fs.readFileSync(prop.fn, { encoding: 'utf-8' }), {
				header:true,
				complete: function(results) {
					var j = 0
					var rsvForEachLine = () => {
						if (j<results.data.length){
							var e = results.data[j]
								Object.keys(e).forEach( (k) => {
								// converting empty strings to null, 
								// and at the same time avoiding null to be parsed as NaN
								if (e[k]===''){
									e[k]=null
								}else if (['entry_id'].includes(k)){
									e[k]=parseInt(e[k])
								}
							})
							var setParam={}
							if (prop.name==='comments'){
								setParam[prop.name]={
									content:e.content,
									created_at:e.created_at,
									type:e.type,
								}
							}else{
								setParam[prop.name]=e.content
							}
							db.update({_id:e.entry_id},{$push: setParam}, function (err) {
								if (err){
									console.log('Error: '+err)
								}
								j++
								rsvForEachLine()
							})
						}else{
							i++
							rsvForEachPropFile()
						}
					}
					rsvForEachLine()
				}
			})
		}
	}
	rsvForEachPropFile()
}