'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if table already exists
    const tableExists = await queryInterface.showAllTables().then(tables => 
      tables.includes('post_likes')
    );
    
    if (!tableExists) {
      await queryInterface.createTable('post_likes', {
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
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
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

      await queryInterface.addIndex('post_likes', ['post_id']);
      await queryInterface.addIndex('post_likes', ['user_id']);
      
      await queryInterface.addConstraint('post_likes', {
        fields: ['post_id', 'user_id'],
        type: 'unique',
        name: 'unique_post_user_like'
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('post_likes');
  }
};