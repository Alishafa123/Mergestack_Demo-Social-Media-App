import { DataTypes, Model, Optional } from "sequelize";
import  sequelize  from "../config/database.js";
import type { PostShareModel } from "../types/index.js";

interface PostShareCreationAttributes extends Optional<PostShareModel, 'id' | 'createdAt' | 'updatedAt'> {}

class PostShare extends Model<PostShareModel, PostShareCreationAttributes> implements PostShareModel {
  declare id: string;
  declare post_id: string;
  declare user_id: string;
  declare shared_content?: string;
  declare createdAt: Date;
  declare updatedAt: Date;

  declare getPost: () => Promise<any>;
  declare getUser: () => Promise<any>;
}

PostShare.init(
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
        key: 'id'
      }
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    shared_content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      field: 'updated_at',
    },
  },
  {
    sequelize,
    modelName: "PostShare",
    tableName: "post_shares",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['post_id', 'user_id'],
        name: 'unique_post_user_share'
      },
      {
        fields: ['post_id']
      },
      {
        fields: ['user_id']
      },
      {
        fields: ['created_at']
      }
    ]
  }
);

export default PostShare;