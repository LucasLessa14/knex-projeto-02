var knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'docker',
      password : 'docker',
      database : 'inventory'
    }
  });

module.exports = knex