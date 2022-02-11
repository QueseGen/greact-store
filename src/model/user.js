const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: String,
    require: true
  },
  name: {
  type: String,
    require: true
  },
  password: {
    type: String,
    require: true
  },
  company: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    }
    ]
});

module.exports=mongoose.model('User', userSchema)