const isJsonString = (str) => {
    try {
        const json = JSON.parse(str)
		return json
    }
	catch (e) {
        return false
    }
    return true
}

module.exports = {
    isJsonString
}
