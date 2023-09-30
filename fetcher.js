const args = process.argv.slice(2);
const readline = require('readline');
const url = args[0];
const filePath = args[1];

if(args.length !== 2) {
  console.log("Enter url and file path in the command line.");
  process.exit();
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const fs = require('fs');
const request = require('request');
request(url, (error, response, body) => {
  if (error) {
    console.log("URL is invalid");
    process.exit();
  }
  fs.stat(filePath, function (err, stat) {
    if (err == null) {
      rl.question("File exists in this directory, do you wish to overwrite it? (type Y/N)", (answer) => {
        if (answer.toUpperCase() === 'Y') {
          fs.writeFile(filePath, body, err => {
            if (err) {
              console.error(err);
            }
          });
        } else {
          process.exit();
        }
        rl.close();
      });
    } else if (err.code === 'ENOENT') {
      // file does not exist 
      fs.writeFile(filePath, body, err => {
        if (err) {
          console.log("File path is invalid");
          process.exit();
        }
      });
      rl.close();
    } else {
      console.log('Some other error: ', err.code);
    }
  });
}); 