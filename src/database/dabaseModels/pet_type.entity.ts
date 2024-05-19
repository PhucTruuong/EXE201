import { 
    Table, 
    Column, 
    Model,
    DataType, 
} from 'sequelize-typescript';
@Table({
    tableName: 'petcare_pet_type',
    timestamps: false,
    freezeTableName: true,
})

export class PetType extends Model{
    @Column({
        field: 'id',
        primaryKey: true,
        type: DataType.UUID,
        allowNull: false,
        unique: true,
        defaultValue: DataType.UUIDV4,
    })
    id: string;
    @Column({
        field: 'type_name',
        type: DataType.STRING(50),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 50],
        }
    })
    type_name: string;

    @Column({
        field: 'type_description',
        type: DataType.TEXT,
        allowNull: true,
    })
    type_description: string;

    @Column({
        field: 'status',
        type: DataType.BOOLEAN,
        allowNull: true,
        validate: {
            notEmpty: true,
        },
        defaultValue: true,
    })
    status: boolean;

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
}