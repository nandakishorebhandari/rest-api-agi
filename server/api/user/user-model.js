const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

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

UserSchema.pre('save', function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = this.encryptPassword(this.password);
  next();
});


UserSchema.methods = {
  authenticate: function(plainTextPword) {
    return bcrypt.compareSync(plainTextPword, this.password);
  },
  encryptPassword: function(plainTextPword) {
    if (!plainTextPword) {
      return '';
    } else {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(plainTextPword, salt);
    }
  },
  toJson: function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
  },
};

module.exports = mongoose.model('user', UserSchema);
