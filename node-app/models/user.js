const Sequelize = require('sequelize');
const sequelize = require('../app');
const userSchema = require('../util/validators')
const { Model, DataTypes } = Sequelize;

class User extends Model {}
User.init({
  // attributes
  id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    primaryKey: true,
    unique: true,
    autoIncrement: true
  },
  data: {
    type: DataTypes.JSONB,
    allowNull: true,
    validate: {
      isEven(value) {
        const validateSchema = userSchema.validate(value);
        if (!validateSchema.valid) {
          throw new Error(validateSchema.error);
        }
      }
    }
  }
}, {
  sequelize
});
sequelize.models.modelName