import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.entity'; // Adjust the import path as necessary

@Table({
  tableName: 'petcare_notification', // Define the table name
  timestamps: true, // Enable automatic timestamps for createdAt and updatedAt
  freezeTableName: true, // Prevent Sequelize from pluralizing table name
})
export class Notification extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4, // Generate UUID by default
  })
  id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  icons: string;

  @Column({
    type: DataType.ENUM('info', 'warning', 'error'),
    allowNull: false,
  })
  type: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false, // Default read status is false
  })
  read: boolean;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW, // Set current date as default
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW, // Set current date as default
  })
  updated_at: Date;
}
