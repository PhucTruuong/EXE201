// Import necessary modules from Sequelize
import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { PetType } from './pet_type.entity';

// Define the DogBreed model
@Table({
  tableName: 'petcare_pet_breed', // Define the table name
  timestamps: false, // Enable timestamps (created_at, updated_at)
  underscored: true,
  freezeTableName: true,
})
export class PetBreed extends Model {
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
    unique: true,
  })
  breed_name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  breed_description: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true, // Default status is true
  })
  status: boolean;

  // These columns will be automatically handled by Sequelize
  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  updated_at: Date;
  // Define the foreign key
  @ForeignKey(() => PetType)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  pet_type_id: string;
  @BelongsTo(() => PetType)
  petType: PetType;
}
