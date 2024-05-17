import { 
    Table, 
    Column, 
    Model,
    DataType, 
    ForeignKey
} from 'sequelize-typescript';
import { Role } from './role.entity';

@Table({
    tableName: 'User',
    timestamps: true,
    freezeTableName: true,
})

export class User extends Model {
    @Column({
        field: 'UserId',
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUID,
    })
    user_id: number;

    @Column({
        field: 'FullName',
        type: DataType.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50],
        }
    })
    full_name: string;

    @Column({
        field: 'Email',
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
        field: 'PasswordHashed',
        type: DataType.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50],
        },
    })
    password_hashed: string;

    @Column({
        field: 'Phone',
        type: DataType.STRING(12),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [10, 12],
        },
    })
    phone_number: string;

    @Column({
        field: 'Status',
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
        field: 'RoleId',
        type: DataType.UUID,
        allowNull: false,
    })
    role_id: number;

    @Column({
        field: 'createdAt',
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: new Date(),
    })
    created_at: Date;

    @Column({
        field: 'updatedAt',
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: new Date(),
    })
    updated_at: Date;
}
