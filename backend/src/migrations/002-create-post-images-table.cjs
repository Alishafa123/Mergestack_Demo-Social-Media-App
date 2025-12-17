'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table already exists
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('post_images')
    );
    
    if (!tableExists) {
      await queryInterface.createTable('post_images', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      image_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image_order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      }
      });

      // Add indexes
      await queryInterface.addIndex('post_images', ['post_id']);
      await queryInterface.addIndex('post_images', ['post_id', 'image_order']);
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('post_images');
  }
};