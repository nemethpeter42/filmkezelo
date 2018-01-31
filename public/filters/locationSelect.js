angular.module('myApp').filter('locationSelect', () => {
	return ( filteredEntries,locationEntries,filterLocation,hlLocMode) => {
		return filterLocation&&!hlLocMode ? filteredEntries.filter(e => locationEntries[filterLocation].has(e.entry_id)) : filteredEntries
	}
})