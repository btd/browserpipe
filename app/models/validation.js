exports.nonEmpty = [
    function (value) {
        return value !== ''
    },
    'should be not empty'
]

//TODO we should be able combine validating in chains