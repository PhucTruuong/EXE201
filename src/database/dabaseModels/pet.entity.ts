import { Table, Column, Model, DataType, ForeignKey } from 'sequelize-typescript';
import { User } from './user.entity';
import { PetType } from './pet_type.entity';
import { PetBreed } from './pet_breed.entity';

@Table({
  tableName: 'petcare_pet',
  timestamps: false,
  freezeTableName: true,
})
export class Pet extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING(50),
    allowNull: false,
  })
  pet_name: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  pet_DOB: Date;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  height: number;

  @Column({
    type: DataType.STRING(20),
    allowNull: false,
  })
  color: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  weight: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  status: boolean;

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  user_id: string;

  @ForeignKey(() => PetType)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  pet_type_id: string;

  @ForeignKey(() => PetBreed)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  pet_breed_id: string;
}
