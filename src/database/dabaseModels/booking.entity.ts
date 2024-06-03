import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from './user.entity'; // Adjust the import path as necessary
import { Appointment } from './appointment.entity'; // Adjust the import path as necessary
import { Payment } from './payment.entity';

@Table({
    tableName: 'petcare_booking',
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
})
export class Booking extends Model {
    @Column({
        type: DataType.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUIDV4, // Generate UUID by default
    })
    id: string;

    @ForeignKey(() => User)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    user_id: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Appointment)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    appointment_id: string;

    @BelongsTo(() => Appointment)
    appointment: Appointment;
    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    booking_date: Date;
   
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
        defaultValue: DataType.NOW,
    })
    updated_at: Date;
    @Column({
        type: DataType.ENUM('not_paid', 'paid', 'processing', 'completed', 'delayed', 'not_completed'),
        allowNull: true, 
    })
    status_string: 'not_paid' | 'paid' | 'processing' | 'completed' | 'delayed' | 'not_completed';
    @HasMany(() => Payment, { foreignKey:'booking_id' })
    payments: Payment[];
}
