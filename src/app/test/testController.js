const responseManagement = require('./../common/responseManagement');
const axios = require('axios')
const fs = require('fs')
const path = require('path');
const os = require('os');
const filename = path.join('C:/Users/AssistPC14/Downloads', 'prueba_michaelpage.csv');
const output = []; // holds all rows of data



const key = 'AIzaSyAIC_Zun1NbWFexLyzXtIa0zUNlXa_RV1k'
const cx = '016984041105582089425:hkcxdsg7pyw'
const pathURL = 'https://www.googleapis.com/customsearch/v1?key=' +key+ '&cx=' +cx+ '&q='


module.exports.getMatch = (request, response) => {
  let users = request.body.users;
  let matchResponse = [];
  let promises = [];


  for (let a = 0; a < users.length; a++) {
    promises.push(axios.get(pathURL + users[a]))
  }

  Promise.all(promises)
    .then(userMatch => {
      for (let j = 0; j < userMatch.length; j++) {
        if (userMatch[j].data.items) {
          if (userMatch[j].data.items.length >= 3) {
            for (let i = 0; i < userMatch[j].data.items.length; i++) {
              // if (userMatch[j].data.items[i].link.indexOf('.xl') < 0) {
                matchResponse.push({ user: userMatch[j].data.queries.request[0].searchTerms, link: userMatch[j].data.items[i].link });
              // }
            }
          }
        }
      }

      if (matchResponse.length !== 0) {

        matchResponse.forEach((d) => {
          const row = []; // a new array for each row of data
          row.push(d.user);
          row.push(d.link);
      
          output.push(row.join()); // by default, join() uses a ','
        });
      
        fs.writeFileSync(filename, output.join(os.EOL));

        return responseManagement.customResponse(response, { 'search': matchResponse });
      } else {
        return responseManagement.customErrorResponse(response);
      }
    })
    .catch(error => {
      console.log(error);
    });
}
