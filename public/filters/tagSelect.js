angular.module('myApp').filter('tagSelect', () => {
	return ( filteredEntries,tagIndex,flt1stTag,flt2ndTag,hlTagMode) => {
		if (flt1stTag&&flt2ndTag&&!hlTagMode){
			if (tagIndex[flt1stTag]&&tagIndex[flt2stTag]) {
				return filteredEntries.filter(e => {
					return tagIndex[flt1stTag].has(e.entry_id)&&
							 tagIndex[flt2ndTag].has(e.entry_id)
				})
			} else {
				return []
			}
		} else if (flt1stTag){
			if (tagIndex[flt1stTag]) {
				return filteredEntries.filter(e => tagIndex[flt1stTag].has(e.entry_id))
			} else {
				return []
			}
		} else if (flt2ndTag&&!hlTagMode){
			if (tagIndex[flt2ndTag]) {
				return filteredEntries.filter(e => tagIndex[flt2ndTag].has(e.entry_id))
			} else {
				return []
			}
		} else {
			return filteredEntries
		}
	}
})