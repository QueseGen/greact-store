const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const productSchema = new Schema({
  _id: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  size: {
    type: Number,
    require: true
  },
  color: {
    type: String,
    require: true
  },
  sold: {
    type: Number,
    require: true
  },
  instock: {
    type: Number,
    require: true
  },
});

module.exports=mongoose.model('Product', productSchema)