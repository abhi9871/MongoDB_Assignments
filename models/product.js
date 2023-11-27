const mongoDB = require('mongodb');
const { get } = require('../routes/admin');
const getDb = require('../util/database').getDB;

class Product {
  constructor(title, price, imageUrl, description, id) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.description = description;
    this._id = id;
  }

  save() {
    const db = getDb();
    let dbOp;
    if(this._id){
      dbOp = db.collection('products').updateOne({ _id: new mongoDB.ObjectId(this._id) }, { $set: this })
    } else {
      dbOp = db.collection('products').insertOne(this);
    }  
    return dbOp
    .then(result => {
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  }

  static fetchAll() {
    const db = getDb();
    return db.collection('products').find().toArray()
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => {
      console.log(err);
    })
  }

  static findById(prodId) {
    const db = getDb();
    return db.collection('products').find({ _id: new mongoDB.ObjectId(prodId) }).next()
    .then((product) => {
      console.log(product);
      return product;
    })
    .catch(err => {
      console.log(err);
    })
  }

  static deleteProduct(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({ _id: new mongoDB.ObjectId(prodId) })
    .then((product) => {
      console.log(`Product deleted: ${product}`);
    })
    .catch(err => {
      console.log(err);
    })
  }
}

module.exports = Product;
