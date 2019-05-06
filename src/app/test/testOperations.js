const database = require('../common/database');
const oracledb = require('oracledb');

const operations = {};



/*
 * 
 *  Este proceso se encarga de conectarse con la base de datos por medio
 *  de un procedimiento almacenado y retornará la información de la búsqueda
 * 
 */
operations.match = function(users) {
  const sql = 'BEGIN GET_MATCH(:p_usersMatchs, :P_RESULT); END;';
  const parameters = {
    p_usersMatchs: users,
    P_RESULT: {
      dir: oracledb.BIND_OUT,
      type: oracledb.CURSOR
    }
  };

  // Conecta con la base de datos controlando el pool de conexiones
  return database.getConnection().then(connection => {
    // Ejecuta el query y cierra la conexión a la base de edatos
    return database.executeQuery(connection, sql, parameters, true).then(result => {
      // Transforma la información en objeto por cada ROW de la búsqueda
      return database.fetchRowsFromCursor(result.outBinds.P_RESULT).then(match => {
        
        database.closeConnection(connection);
        return result.outBinds.match = match;
      });
    });
  });
};


module.exports = operations;
