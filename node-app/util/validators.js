const Schema = require( 'object-schema-validation' );

const userSchema = new Schema({
  userName: {
    type: String,
    min: 5, 
    max: 100, 
    required: true
  },
  phone: {
    type: String, 
    min: 10, 
    required: true
  },
  email: {
    type: String, 
    max: 100, 
    required: true
  },
  password: {
    type: String,
    min: 6, 
    max: 30, 
    required: true
  },
  role: {
    type: String, 
    required: true
  },
});

module.exports = userSchema