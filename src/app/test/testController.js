const operations = require('./testOperations');
const responseManagement = require('./../common/responseManagement');




module.exports.getMatch = (request, response) => {
  let users = request.body.users;
  let dataUsers = [];

  users.map(user => {
    let concatUser = user.split('%20')

    dataUsers.push(concatUser);
  })

  operations.match(dataUsers)
    .then(data => {
      if (data.length !== 0) {
        data.map(usersMatch => {
          let dataMatch = []
          
          dataMatch = usersMatch.reduce((results, userMatch) => {
            (results[userMatch.name] = results[userMatch.name] || []).push(userMatch);
            return results;
          }, {})
  
          [dataMatch].forEach(validate => {
            let matchResponse = [];
  
            if (validate.length >= 3) {
              validate.map(match => {
                matchResponse.push(match.name + ' ' + match.url);
              });
            }
          })
  
          return responseManagement.customResponse(response, { 'search': matchResponse });
        });
      } else {
        return responseManagement.customErrorResponse(response);
      }

    })
    .catch(err => {
      return responseManagement.serverErrorResponse(response);
    });
}
