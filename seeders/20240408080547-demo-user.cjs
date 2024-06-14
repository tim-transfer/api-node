'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {

  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('user', [{
      firstName: 'John',
      lastName: 'Doe',
      password: 'password',
      email: 'kevinquiercelin@numidev.fr',
      isAdmin: true,
      companyId: 1,
      createdAt: new Date()
    }]);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
