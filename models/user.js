const mongoDB = require('mongodb');
const getDb = require('../util/database').getDB;

const ObjectId = mongoDB.ObjectId;

class User {
  constructor(name, email, cart, id){
    this.name = name;
    this.email = email;
    this.cart = cart;
    this._id = id;
  }

  save() {
    const db = getDb();
    const user = db.collection('users').insertOne(this)
    .then((user) => {
      console.log(user);
      return user;
    })
    .catch(err => {
      console.log(err);
    })
  }

  addToCart(product) {
    let updatedCart = {};
    if(this.cart){
      let cartProductId = this.cart.items.findIndex(item => new ObjectId(item.productId).equals(new ObjectId(product._id)));
      if(cartProductId !== -1){
        updatedCart.items = [...this.cart.items];
        updatedCart.items[cartProductId].quantity += 1;
      }
    else {
      updatedCart.items = [...this.cart.items, { productId: new ObjectId(product._id), quantity: 1 }];
    }
  } else {
    updatedCart.items = [{ productId: new ObjectId(product._id), quantity: 1 }];
  }
    const db = getDb();
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new ObjectId(userId) })
    .then(user => {
      console.log(user);
      return user;
    })
    .catch(err => {
      console.log(err);
    })
  }

}

module.exports = User;
