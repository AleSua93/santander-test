'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = await queryInterface.sequelize.query(
      'SELECT id from Users;'
    );

    const roles = await queryInterface.sequelize.query(
      'SELECT id from Roles;'
    );

    return await queryInterface.bulkInsert('UserRole', [
      {
        userId: users[0][0].id,
        roleId: roles[0][0].id,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: users[0][1].id,
        roleId: roles[0][1].id,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('UserRole', null, {});
  }
};
