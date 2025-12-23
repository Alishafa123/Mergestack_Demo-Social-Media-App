'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns exist with camelCase names
    const tableDescription = await queryInterface.describeTable('post_shares');
    
    // If createdAt exists (camelCase), rename to created_at (snake_case)
    if (tableDescription.createdAt) {
      await queryInterface.renameColumn('post_shares', 'createdAt', 'created_at');
    }
    
    // If updatedAt exists (camelCase), rename to updated_at (snake_case)
    if (tableDescription.updatedAt) {
      await queryInterface.renameColumn('post_shares', 'updatedAt', 'updated_at');
    }

    // Update index to use snake_case column name
    try {
      await queryInterface.removeIndex('post_shares', ['createdAt']);
    } catch (e) {
      // Index might not exist or already removed
    }
    
    try {
      await queryInterface.addIndex('post_shares', ['created_at']);
    } catch (e) {
      // Index might already exist
    }
  },

  async down(queryInterface, Sequelize) {
    // Revert back to camelCase
    const tableDescription = await queryInterface.describeTable('post_shares');
    
    if (tableDescription.created_at) {
      await queryInterface.renameColumn('post_shares', 'created_at', 'createdAt');
    }
    
    if (tableDescription.updated_at) {
      await queryInterface.renameColumn('post_shares', 'updated_at', 'updatedAt');
    }

    // Update index back
    try {
      await queryInterface.removeIndex('post_shares', ['created_at']);
    } catch (e) {
      // Index might not exist
    }
    
    try {
      await queryInterface.addIndex('post_shares', ['createdAt']);
    } catch (e) {
      // Index might already exist
    }
  }
};
