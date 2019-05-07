'use strict';
const responses = {};

//RESPUESTA A LOS ESTADOS DESDE LA BASE DE DATOS
responses.customResponse = function (response, message) {
  return response.status(200).send(message);
};

responses.customErrorResponse = function (response) {
  return response.status(202).send({
    message: 'No se encontraron usuarios que superara el máximo de 3 búsquedas'
  });
};

//ERROR EN LOS SERVIDORES
responses.serverErrorResponse = function (response) {
  return response.status(500).send({
    message: 'Internal server error'
  });
};


module.exports = responses;