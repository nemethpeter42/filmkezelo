angular.module('myApp').filter('titleSearch', () => {
  return ( filteredEntries,filterTitle) => {
	return filteredEntries.filter(e => {
		var orig = e.orig!==null?e.orig:''
		var hun = e.hun!==null?e.hun:''
		return orig.indexOf(filterTitle)!==-1||hun.indexOf(filterTitle)!==-1
	})
  }
})