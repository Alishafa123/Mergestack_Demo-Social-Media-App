import { DataTypes, Model } from 'sequelize';

import sequelize from '@config/database';

class PostComment extends Model {
  declare id: string;
  declare post_id: string;
  declare user_id: string;
  declare parent_comment_id: string | null;
  declare content: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PostComment.init(
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
    parent_comment_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'post_comments',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'postComment',
    tableName: 'post_comments',
    indexes: [
      {
        fields: ['post_id'],
      },
      {
        fields: ['user_id'],
      },
      {
        fields: ['parent_comment_id'],
      },
      {
        fields: ['post_id', 'parent_comment_id'],
      },
    ],
  },
);

export default PostComment;
