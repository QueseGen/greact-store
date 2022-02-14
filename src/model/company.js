const mongoose=require('mongoose');
const Schema=mongoose.Schema;

//_id: ID! name: String! inventory: [Product]
const companySchema = new Schema({
  _id: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  inventory: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  ],
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

module.exports=mongoose.model('Company', companySchema)