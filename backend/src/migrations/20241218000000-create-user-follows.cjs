'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_follows', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      follower_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      following_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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

    // Add indexes for performance
    await queryInterface.addIndex('user_follows', ['follower_id']);
    await queryInterface.addIndex('user_follows', ['following_id']);

    // Add unique constraint to prevent duplicate follows
    await queryInterface.addConstraint('user_follows', {
      fields: ['follower_id', 'following_id'],
      type: 'unique',
      name: 'unique_follow_relationship',
    });

    // Add check constraint to prevent self-following
    await queryInterface.addConstraint('user_follows', {
      fields: ['follower_id', 'following_id'],
      type: 'check',
      name: 'prevent_self_follow',
      where: {
        follower_id: {
          [Sequelize.Op.ne]: Sequelize.col('following_id'),
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_follows');
  },
};
