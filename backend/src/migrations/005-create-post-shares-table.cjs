'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Create post_shares table
    await queryInterface.createTable('post_shares', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      shared_content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique constraint to prevent duplicate shares
    await queryInterface.addConstraint('post_shares', {
      fields: ['post_id', 'user_id'],
      type: 'unique',
      name: 'unique_post_user_share',
    });

    // Add shares_count column to posts table
    await queryInterface.addColumn('posts', 'shares_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });

    // Add indexes for better performance
    await queryInterface.addIndex('post_shares', ['post_id']);
    await queryInterface.addIndex('post_shares', ['user_id']);
    await queryInterface.addIndex('post_shares', ['createdAt']);
  },

  async down(queryInterface, Sequelize) {
    // Remove indexes
    await queryInterface.removeIndex('post_shares', ['post_id']);
    await queryInterface.removeIndex('post_shares', ['user_id']);
    await queryInterface.removeIndex('post_shares', ['createdAt']);

    // Remove shares_count column from posts
    await queryInterface.removeColumn('posts', 'shares_count');

    // Drop post_shares table
    await queryInterface.dropTable('post_shares');
  },
};
