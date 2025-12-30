import { DataTypes, Model } from 'sequelize';

import sequelize from '@config/database';

class PostLike extends Model {
  declare id: string;
  declare post_id: string;
  declare user_id: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PostLike.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    post_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'posts',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  },
  {
    sequelize,
    modelName: 'postLike',
    tableName: 'post_likes',
    indexes: [
      {
        fields: ['post_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        unique: true,
        fields: ['post_id', 'user_id'], // Prevent duplicate likes
      },
    ],
  },
);

export default PostLike;
