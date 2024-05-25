import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Service } from './service.entity';

@Table({
  tableName: 'petcare_brand', // Define the table name
  timestamps: false, // Disable automatic timestamps
  freezeTableName: true, // Prevent Sequelize from pluralizing table name
  underscored: true,
})
export class Brand extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4, // Generate UUID by default
  })
  id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  brand_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  brand_description: string;

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
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image: string;
  @HasMany(() => Service ,{ foreignKey: 'brand_id' })
  services: Service[];
}
