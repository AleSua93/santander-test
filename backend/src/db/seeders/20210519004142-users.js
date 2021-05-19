'use strict';

const bcrypt = require('bcrypt');
const saltRounds = 10;
const hashedPassword = bcrypt.hashSync("password", saltRounds);

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      { 
        username: "admin",
        email: "admin@admin.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date() 
      },
      { 
        username: "user",
        email: "user@user.com",
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date() 
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};