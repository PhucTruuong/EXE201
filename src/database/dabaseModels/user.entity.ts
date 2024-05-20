import { 
    Table, 
    Column, 
    Model,
    DataType, 
    ForeignKey
} from 'sequelize-typescript';
import { Role } from './role.entity';
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
        allowNull: false,
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
};
