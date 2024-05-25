import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
    BelongsTo,
    HasMany
} from 'sequelize-typescript';
import { Role } from './role.entity';
import { Booking } from './booking.entity';
import { Pet } from './pet.entity';
import { Service } from './service.entity';
@Table({
    tableName: 'petcare_user',
    timestamps: false,
    freezeTableName: true,
})
export class User extends Model {
    @Column({
        field: 'user_id',
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUID,
    })
    user_id: string;

    @Column({
        field: 'full_name',
        type: DataType.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50],
        }
    })
    full_name: string;

    @Column({
        field: 'user_email',
        type: DataType.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50],
        },
        unique: true,
    })
    email: string;

    @Column({
        field: 'password_hashed',
        type: DataType.TEXT,
        allowNull: true,
        validate: {
            notEmpty: true,
            len: [1, 100],
        },
    })
    password_hashed: string;

    @Column({
        field: 'user_phone',
        type: DataType.STRING(12),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [10, 12],
        },
    })
    phone_number: string;

    @Column({
        field: 'user_status',
        type: DataType.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: true,
    })
    account_status: boolean;

    @BelongsTo(() => Role, { as: 'role' })
    @ForeignKey(() => Role)
    @Column({
        field: 'role_id',
        type: DataType.UUID,
        allowNull: false,
    })
    role_id: string;
    @Column({
        field: 'created_at',
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: new Date(),
    })
    created_at: Date;

    @Column({
        field: 'updated_at',
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: new Date(),
    })
    updated_at: Date;

    @Column({
        field: 'user_avatar',
        type: DataType.TEXT,
        allowNull: true,
    })
    avatar: string;

    @HasMany(() => Booking, { foreignKey: 'user_id' })
    bookings: Booking[];
    @HasMany(() => Pet, { foreignKey: 'user_id' })
    pets: Pet[];
    @HasMany(() => Service, { foreignKey: 'user_id' })
    services: Service[];
};
