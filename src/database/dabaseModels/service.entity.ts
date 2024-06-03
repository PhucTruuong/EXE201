import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { Brand } from './brand.entity'; // Adjust the import path as necessary
import { Category } from './category.entity'; // Adjust the import path as necessary
import { Location } from './location.entity'; // Adjust the import path as necessary
import { Appointment } from './appointment.entity';
import { User } from './user.entity';

@Table({
  tableName: 'petcare_service',
  timestamps: false, // Disable automatic timestamps
  freezeTableName: true, // Prevent Sequelize from pluralizing table name
})
export class Service extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;
  @BelongsTo(() => Brand)
  brand: Brand;
  @ForeignKey(() => Brand)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  brand_id: string;
  @BelongsTo(() => Category)
  category: Category;
  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  category_id: string;
  @BelongsTo(() => Location)
  location: Location;
  @ForeignKey(() => Location)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  location_id: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  service_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  service_description: string;
  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  price: number;
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  startTime: string;

  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  endTime: string;

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
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @BelongsTo(() => User)
  user: User;

  @HasMany(() => Appointment, { foreignKey: 'service_id' })
  appointments: Appointment[];



}
