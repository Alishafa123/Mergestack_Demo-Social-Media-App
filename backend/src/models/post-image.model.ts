import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class PostImage extends Model {
  declare id: string;
  declare post_id: string;
  declare image_url: string;
  declare image_order: number;
  declare createdAt: Date;
  declare updatedAt: Date;
}

PostImage.init(
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
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image_order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    }
  },
  {
    sequelize,
    modelName: "postImage",
    tableName: "post_images",
    indexes: [
      {
        fields: ['post_id']
      },
      {
        fields: ['post_id', 'image_order']
      }
    ]
  }
);

export default PostImage;