'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Meetups', [
      { 
        name: "Seeded metup 1",
        date: '2021-10-11',
        numPeople: 10,
        estimatedBeerPacks: 3,
        tempInCelsius: 14,
        createdAt: new Date(),
        updatedAt: new Date() 
      },
      { 
        name: "Seeded metup 2",
        date: '2021-10-17',
        numPeople: 15,
        estimatedBeerPacks: 2,
        tempInCelsius: 12.9,
        createdAt: new Date(),
        updatedAt: new Date() 
      },
      { 
        name: "Seeded metup 3",
        date: '2021-11-9',
        numPeople: 20,
        estimatedBeerPacks: 3,
        tempInCelsius: 13.3,
        createdAt: new Date(),
        updatedAt: new Date() 
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Meetups', null, {});
  }
};