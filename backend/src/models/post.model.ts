import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class Post extends Model {
  declare id: string;
  declare user_id: string;
  declare content: string | null;
  declare likes_count: number;
  declare comments_count: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Post.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true, // Can be null if post only has images
    },
    likes_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    comments_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: "post",
    tableName: "posts",
    indexes: [
      {
        fields: ['user_id']
      },
      {
        fields: ['created_at']
      }
    ]
  }
);

export default Post;