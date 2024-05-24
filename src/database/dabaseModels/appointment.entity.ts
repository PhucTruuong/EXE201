import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Pet } from './pet.entity'; // Adjust the import path as necessary
import { Service } from './service.entity'; // Adjust the import path as necessary
import { Booking } from './booking.entity';

@Table({
  tableName: 'petcare_appointment',
  timestamps: false, 
  freezeTableName: true, 
})
export class Appointment extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4, 
  })
  id: string;

  @ForeignKey(() => Pet)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  pet_id: string;

  @BelongsTo(() => Pet)
  pet: Pet;

  @ForeignKey(() => Service)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  service_id: string;

  @BelongsTo(() => Service)
  service: Service;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  appointment_date: Date;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  appointment_time: string;

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
  @HasMany(() => Booking,{ foreignKey: 'appointment_id' })
  bookings: Booking[];
}
