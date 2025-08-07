import { DataTypes } from 'sequelize';
import { sequelize } from "../../../db/connectToSql.js";

const Authentication = sequelize.define('Authentication', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,  // Use UUID as primary key
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,  // Make email unique
    allowNull: false,  // Ensure email is provided
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'authentication',  // Using snake_case for table name
  timestamps: true,  // Add createdAt and updatedAt automatically
});

export default Authentication;
