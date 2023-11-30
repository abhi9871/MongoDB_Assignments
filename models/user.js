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

  getCartItems() {
    const db = getDb();
    const productIds = this.cart.items.map(item => {
      return item.productId;
    });
    return db.collection('products').find({ _id: {$in: productIds} }).toArray()
    .then(products => {
          return products.map(product => {
          return { ...product, 
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === product._id.toString();
          }).quantity
        };
    });
    })
    .catch(err => {
      console.log(err);
    })
  }

  deleteProductFromCart(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    })
    const db = getDb();
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
  }

  addOrder() {
    const db = getDb();
    return this.getCartItems()
    .then(products => {
      const order = {
        items: products,
        user: {
          _id: new ObjectId(this._id),
          name: this.name
        }
      };
      return db.collection('orders').insertOne(order)
    })
    .then(result => {
      this.cart = { items: [] };
      return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } })
    })
  }

  getOrders() {
    const db = getDb();
    return db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray()
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
