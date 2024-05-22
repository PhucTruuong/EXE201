import { Table, Column, Model, DataType, ForeignKey, HasMany, BelongsTo } from 'sequelize-typescript';
import { City } from './city.entity'; // Adjust the import path as necessary
import { Service } from './service.entity';

@Table({
    tableName: 'petcare_location', // Define the table name
    timestamps: false, // Disable automatic timestamps
    freezeTableName: true, // Prevent Sequelize from pluralizing table name
})
export class Location extends Model {
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
    location_name: string;

    @Column({
        type: DataType.STRING(255),
        allowNull: false,
    })
    location_address: string;

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
    @BelongsTo(() => City)
    city: City;
    @ForeignKey(() => City)
    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    city_id: string;
    //
    @HasMany(() => Service,{ foreignKey: 'location_id' })
    services: Service[];
}
