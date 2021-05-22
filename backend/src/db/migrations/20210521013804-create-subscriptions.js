'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'Subscriptions',
      {
        userId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
        },
        meetupId: {
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
    return queryInterface.dropTable('Subscriptions');
  },
};