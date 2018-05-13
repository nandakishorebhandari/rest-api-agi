const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: true,
  },
});

/*
UserSchema.methods.generateHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
};
*/

module.exports = mongoose.model('user', UserSchema);