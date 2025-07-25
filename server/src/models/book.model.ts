import { DataTypes, Model } from 'sequelize';
import sequelize from '../util/sequelize.util';

class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public description?: string;
  public isbn!: string;
  public publicationDate!: Date;
  public genre!: string;
  public language!: string;
  public coverUrl?: string;
}

Book.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isbn: {
    type: DataTypes.STRING(13),
    allowNull: false,
    unique: true,
  },
  publicationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  coverUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'books',
  timestamps: true,
});

export default Book;
