const operations = require('./testOperations');
const responseManagement = require('./../common/responseManagement');



/*
 * 
 *  El siguiente método recibe un ARRAY con la cantidad de etiquetas deseadas,
 *  las cuales seran enviadas a un procedimiento almacenado en una base de datos
 *  Oracle, que realizará las búsquedas a través de un SELECT e INNER JOIN en cada
 *  tabla: Terrorismo, Narcotráfico y Lavado de Activos.
 * 
 *  Si el nombre del cliente o proveedor devuelve un match en las búsquedas superior a 3,
 *  el servicio marcará y agregar las URL en las que encontró la información, sino retornará
 *  un mensaje "El usuario no supera el máximo de 3 búsquedas".
 * 
 *  El último mensaje es por si se encuentra un error al momento de retornar la información
 *  de la base de datos.
 * 
 */
module.exports.getMatch = (request, response) => {
  let user = request.body.user;

  // Realizamos el llamado a la base de datos
  operations.match(user)
    .then(data => {
      let matchResponse = [];

      // La base de datos retornará la información en modo de objetos, entonces 
      // se mapea la data y transformamos la información como se desea
      // antes de realizar el push a nuestro ARRAY de respuesta del servicio
      if (data.length >= 3) {
        data.map(userMatch => {
          matchResponse.push(userMatch.name + ' ' + userMatch.url);
        });

        return responseManagement.customResponse(response, { 'search': matchResponse });
      } else {
        return responseManagement.customErrorResponse(response);
      }

    })
    .catch(err => {
      return responseManagement.serverErrorResponse(response);
    });
}
