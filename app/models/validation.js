exports.nonEmpty = function(label){
	return [
	    function (value) {
	        return value !== ''
	    },
	    label + ' should be not empty'
	]
}

//TODO we should be able combine validating in chains