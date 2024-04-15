'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('user', 'companyId', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "company",
          key: "id",
        },
    
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('user', 'companyId', { transaction: t }),
      ]);
    });
  }
};
