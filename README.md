# CSV Discrepency Checker

## Setup
Please clone the repo and make sure you have node installed. Additionally make sure you have the fs, csv-parse, and readline packages.  
`npm install` should do the trick but if not, please manually install the aforementioned packages.

## Usage
This solution is designed to be a simple CLI. When you run `node collab.js` you will be prompted to enter a list of
comma-separate filenames. 

**IMPORTANT NOTE:** 
1. Be sure to include the files you'd like to find discrepencies for in the same directory (4 test files are provided in the repo by default)
2. When entering the filenames please type their exact names along with the .csv extension and <ins>**do not have spaces**</ins> anywhere in the input and
be sure to escape spaces if they occur within the filename itself. Hit enter after responding to each prompt.
3. For multiple runs, you'll have to run the script again from the command-line.

#### Example
##### Input
```
node collab.js  

Please enter comma-separated (no spaces) filepaths to check for discrepencies:  
file1.csv,file2.csv,file3.csv  

Please specify a concern type (subscriber_count or channel_ownership) or just hit enter to continue:
subscriber_count  

Finding discrepencies between: file1.csv, file2.csv, file3.csv. The following concern was given: subscriber_count
```  
##### Output
```
Set {
  'test_1@gmail.com',
  'test_9@gmail.com',
  'test_14@gmail.com',
  'test_15@gmail.com',
  'test_26@gmail.com',
  'test_34@gmail.com',
  'test_35@gmail.com',
  'test_45@gmail.com',
  'test_46@gmail.com'
}
```
## Features
- Supports optional parameter for concern
- Supports multi-file input
- Uses performant comparison algorithm. Leverages hash table to avoid O(n) lookup and thus O(n^2) overall runtime where n is the number of unique emails.
If an email has already been seen in a previously read file, this approach offers O(1) lookup to check discrepency with subscriber count or channel ownership information. 
Also O(1) addition to the hash map if the email has not been seen before.

## Future Work
- #1 priority: Automated and varied testing. I have not used JS in a while and did not want to do this and do it poorly.
- Support storage of user and discrepency info in class instance (ran into scoping issues) to allow for programmatic access for other useful tasks.
- Web-based UI to allow for file upload or text-pasting
- Generalize to other input file formats? 

