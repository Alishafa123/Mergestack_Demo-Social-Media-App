'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table already exists
    const tableExists = await queryInterface.showAllTables().then((tables) => tables.includes('posts'));

    if (!tableExists) {
      await queryInterface.createTable('posts', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
        },
        content: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        likes_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        comments_count: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      });

      // Add indexes
      await queryInterface.addIndex('posts', ['user_id']);
      await queryInterface.addIndex('posts', ['created_at']);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts');
  },
};
