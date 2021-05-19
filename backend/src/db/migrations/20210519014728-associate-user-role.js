'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'UserRole',
      {
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        roleId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        }
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    // remove table
    return queryInterface.dropTable('UserRole');
  },
};