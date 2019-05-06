const oracledb = require('oracledb');
oracledb.fetchAsString = [ oracledb.BUFFER ];


const databaseFuncs = {};

const config = {
    user: 'CEM',
    password: 'pass2018',
    connectString: '201.184.75.194/corred1',
    events: false,
    externalAuth: false,
    poolIncrement: 1,
    poolAlias: 'corredor',
    poolMax: 4,
    poolMin: 1,
    poolPingInterval: 60,
    poolTimeout: 6,
    queueTimeout: 600,
    stmtCacheSize: 30
};

databaseFuncs.init = function () {
    return oracledb.createPool(config).then(pool => {
        return pool;
    }).catch(err => {
        console.error(err);
        return null;
    });
};

databaseFuncs.getConnection = function () {
    const pool = oracledb.getPool(config.poolAlias);
    return pool.getConnection().then(connect => {
        return connect;
    });
};

databaseFuncs.closeConnection = function (connection) {
    connection.close(function (err) {
        if (err) console.error(err);
    });
};

databaseFuncs.executeQuery = function (connection, sql, parameters = [], autoCommit = false) {
    return connection.execute(sql, parameters, { outFormat: oracledb.OBJECT, autoCommit: autoCommit }).catch(err =>{
        this.closeConnection(connection);
        throw err;
    });
};


databaseFuncs.fetchRowsFromCursor = function (resultSet) {
    const numRows = 500;
    return resultSet.getRows(numRows).then(result => {
        resultSet.close();
        return result;
    }).catch(err => {
        console.log(err);
    });
};

databaseFuncs.fetchRowFromCursor = function (resultSet) {
    return resultSet.getRow().then(result => {
        resultSet.close();
        return result;
    });
};

module.exports = databaseFuncs;
