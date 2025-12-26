import { DataTypes, Model } from "sequelize";

import sequelize from "@config/database.js";

class UserFollow extends Model {
  declare id: string;
  declare follower_id: string; 
  declare following_id: string; 
  declare createdAt: Date;
  declare updatedAt: Date;
}

UserFollow.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    follower_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    following_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    }
  },
  {
    sequelize,
    modelName: "userFollow",
    tableName: "user_follows",
    indexes: [
      {
        fields: ['follower_id']
      },
      {
        fields: ['following_id']
      },
      {
        unique: true,
        fields: ['follower_id', 'following_id'] 
      }
    ]
  }
);

export default UserFollow;