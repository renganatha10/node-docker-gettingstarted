import * as mongoose from 'mongoose';
const schema = mongoose.Schema;

const UserModel = mongoose.model(
  'User',
  new schema({
    name: String,
    password: String,
    admin: Boolean
  })
);

export default UserModel;
