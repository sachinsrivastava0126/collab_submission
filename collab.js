const fs = require('fs')
const parse = require('csv-parse')
const readline = require("readline");



class Solution {

	constructor(files) {
		this.files = files
	}


	// A function for basic testing of input type, length, and duplicates
	verifyInput() {
		// Check that we've been given an array and not some other object
		if (!Array.isArray(this.files)) {
			throw "ERROR: Please provide a list of file names."
		}

		// Check that the list has elements
		if (this.files.length === 0) {
			throw "ERROR: No files provided."
		}

		// Keep a set to check if duplicate filepaths have been provided
		let seenFiles = new Set()

		for (var i = 0; i < this.files.length; i++) {
			// If list doesn't contain strings, throw error
			if (!(this.files[i] instanceof String || typeof this.files[i] === "string")) {
				throw "ERROR: Please provide a list of filenames as strings."
			}

			// Check that filepaths provided are actually files in the current directory
			let stats = fs.statSync(this.files[i])
			if (!stats.isFile()) {
				throw "ERROR: Please provide ONLY valid filepaths (i.e. in current directory) as input."
			}

			// Check for duplicate files
			if (seenFiles.has(this.files[i])) {
				throw "ERROR: Please provide ONLY distinct files."
			}

			// Add file to those that have been seen
			seenFiles.add(this.files[i])
		}

	}


	checkDiscrepencies(concern="") {
		// Check that input was valid
		this.verifyInput()

		// Track user info
		var userMap = {}

		// Track discrepencies
		var discrepencies = []

		// Num of files
		var numFiles = this.files.length

		// Num read
		var filesRead = 0

		// Iterate through provided file paths
		for (let file of this.files) {
			
			// Read the file and then parse the csv data		
			fs.readFile(file, function (err, fileData) {

			  parse(fileData, {columns: true, trim: true}, function(err, records) {
			  	// Each record will contain email, channel, and subscriber count data that we want 
			  	// to compare to what's already been seen. If it differs, there is a discrepency 
			    for (let record of records) {
			    	let email = record['Account\ Email']
			    	let channel = record['YouTube\ Channel']
			    	channel = channel.substr(channel.length-22,channel.length)
			    	let subCount = record['Subscriber\ Count'].replace(",", "")


			    	if (email in userMap) {
			    		// Push to discrepencies list depending on type of concern or if there is a discrepency (absent specified concern)
			    		if (concern === "subscriber_count") {
			    			if (subCount !== userMap[email]['sub_count']) {
			    				discrepencies.push(email)
			    			}
			    		} else if (concern === "channel_ownership") {
			    			if (channel !== userMap[email]['channel_ownership']) {
			    				discrepencies.push(email)
			    			}

			    		} else if (concern === "") {
			    			if (subCount !== userMap[email]['sub_count'] || channel !== userMap[email]['channel_ownership']) {
			    				discrepencies.push(email)
			    			}

			    		}



			    	} else {
			    		// Add info for this email from the current file to the hash map
			    		userMap[email] = {}
			    		userMap[email]['sub_count'] = subCount
			    		userMap[email]['channel_ownership'] = channel

			    	}

			    	
			    }

			    
			    if (filesRead===numFiles-1) {
			    	// Print out the *unique* discrepencies that have been found after all files have been read
			    	console.log(new Set(discrepencies))
			    }
			    filesRead+=1
			  })
			  

			})
			

			
		}


	}

}




// Read in user input and then call the checkDiscrepencies function with optional parameter for concern
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
rl.question("Please enter filepaths to check for discrepencies:\n", function (answer) {
	var sol = new Solution(answer.split(','))

	rl.question("\nPlease specify a concern type (subscriber_count or channel_ownership) or just hit enter to continue:\n", function (response) {
		console.log("Finding discrepencies between "+sol.files.join(", ")+". The following concern was given: "+response+'\n')
		sol.checkDiscrepencies(concern=response)
		rl.close()
	})
	
})


