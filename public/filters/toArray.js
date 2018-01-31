/*
http://ngmodules.org/modules/angular-toArrayFilter

"The filter iterates over the object's keys and creates an array containing the value of each property. By default, the filter also attaches a new property $key to the value containing the original key that was used in the object we are iterating over to reference the property."
*/

angular.module('myApp').filter('toArray', function () {
  return function (obj, addKey) {
    if (!angular.isObject(obj)) return obj;
    if ( addKey === false ) {
      return Object.keys(obj).map(function(key) {
        return obj[key];
      });
    } else {
      return Object.keys(obj).map((key) => {
        var value = obj[key];
        return angular.isObject(value) ?
          Object.defineProperty(value, '$key', { enumerable: false, value: key}) :
          { $key: key, $value: value }
      })
    }
  }
})