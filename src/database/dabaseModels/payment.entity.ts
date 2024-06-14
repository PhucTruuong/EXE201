import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Booking } from './booking.entity'; // Adjust the import path as necessary

@Table({
  tableName: 'petcare_payment',
  timestamps: false, // Disable automatic timestamps
  freezeTableName: true, // Prevent Sequelize from pluralizing table name
})
export class Payment extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4, // Generate UUID by default
  })
  id: string;

  @ForeignKey(() => Booking)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  booking_id: string;

  @BelongsTo(() => Booking)
  booking: Booking;
  
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  payment_date: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  note: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default status is true
  })
  status: boolean;

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
