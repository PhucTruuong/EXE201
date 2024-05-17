import { 
    Table, 
    Column, 
    Model,
    DataType, 
    ForeignKey,
    HasMany
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
    tableName: 'Role',
    timestamps: true,
    freezeTableName: true,
})

export class Role extends Model {
    @ForeignKey(() => User)
    @Column({
        field: 'RoleId',
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUID,
    })
    role_id: number;

    @Column({
        field: 'RoleName',
        type: DataType.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50],
        }
    })
    role_name: string;

    @Column({
        field: 'Status',
        type: DataType.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: true,
    })
    role_status: boolean;

    @Column({
        field: 'createdAt',
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: new Date(),
    })
    created_date: Date;

    @Column({
        field: 'updateAt',
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: new Date(),
    })
    updated_date: Date;

    @HasMany(() => User, { foreignKey: 'role_id' })
    users: User[];
}