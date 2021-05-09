import {
  Table,
  Model,
  DataType,
  Column,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  AllowNull,
  AutoIncrement,
  BeforeSave,
} from 'sequelize-typescript';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Table
export class User extends Model {
  @AutoIncrement
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.INTEGER)
  id: number;

  @Column(DataType.STRING)
  first_name: string;

  @Column(DataType.STRING)
  last_name: string;

  @Column(DataType.STRING)
  email: string;

  @Column(DataType.STRING)
  password: string;

  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date;

  @BeforeSave
  static async hashPassword(user: User) {
    if (!user.changed('password')) {
    } else {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  matchPassword(enteredPassword: string) {
    return bcrypt.compare(enteredPassword, this.password);
  }

  getSignedJwtToken() {
    return jwt.sign({ id: this.id, email: this.email }, process.env.JWT_SECRET, { expiresIn: '2d' });
  }
}
