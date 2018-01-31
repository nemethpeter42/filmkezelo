angular.module('myApp').filter('customOrderBy', () => {
  return (arr,propertyName,reverse) => {
	return arr.sort((e1, e2)=>{
		if (propertyName) { 
			var v1=e1[propertyName]
			var v2=e2[propertyName]
		} else {
			var v1=e1
			var v2=e2
		}
		var order = reverse===true?-1:1
		var t1= typeof v1
		var t2= typeof v2
		if ((t1 !== 'string'&& t1 !== 'number') && (t2 !== 'string'&& t2 !== 'number')) {return 0}
		if (t1 !== 'string'&& t1 !== 'number') {return 1}
		if (t2 !== 'string'&& t2 !== 'number') {return -1}
		if (t1==='number'&&t2==='number'){
			if(v1===v2){return 0}
			if(v1>v2){return order*1}
			if(v1<v2){return order*-1}
		}
		//biztos ami biztos - elvileg sztring és szám egyszerre egy oszlopban nem lehet
		return order*v1.localeCompare(v2,'hu')
	})
  }
})