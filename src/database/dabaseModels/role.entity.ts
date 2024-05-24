import { 
    Table, 
    Column, 
    Model,
    DataType, 
    ForeignKey,
    HasMany,
} from 'sequelize-typescript';
import { User } from './user.entity';

@Table({
    tableName: 'petcare_role',
    timestamps: false,
    freezeTableName: true,
})

export class Role extends Model {
     @ForeignKey(() => User)
    @Column({
        field: 'role_id',
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUID,
    })
    role_id: string;

    @Column({
        field: 'role_name',
        type: DataType.STRING(10),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 10],
        }
    })
    role_name: string;

    @Column({
        field: 'role_status',
        type: DataType.BOOLEAN,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: true,
    })
    role_status: boolean;

    @Column({
        field: 'created_at',
        type: DataType.DATE,
        allowNull: false,
        validate: {
            notEmpty: true,
        },
        defaultValue: new Date(),
    })
    created_date: Date;

    @Column({
        field: 'updated_at',
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
    // @HasMany(() => User, { foreignKey: 'role_id' })
    // users: User[];
}