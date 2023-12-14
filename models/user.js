const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ]
    }
});

userSchema.methods.addToCart = function(product) {
    const cartProductIndex =  this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    let updatedCartItems = [...this.cart.items];
    if(cartProductIndex >= 0){
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity
        });
    }

    const updatedCart = {
        items: updatedCartItems
    };

    this.cart = updatedCart;
    return this.save();
}

// userSchema.methods.getCartItems = function() {
//     const productIds = this.cart.items.map(item => {
//             return item.productId;
//         });
//         return Product.find({ _id: {$in: productIds} })
//         .then(products => {
//                 return products.map(product => {
//                 return { ...product, 
//                 quantity: this.cart.items.find(i => {
//                     return i.productId.toString() === product._id.toString();
//                 }).quantity
//             };
//         });
//         })
//         .catch(err => {
//             console.log(err);
//         })
// }

module.exports = mongoose.model('User', userSchema);

//   deleteProductFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter(item => {
//       return item.productId.toString() !== productId.toString();
//     })
//     const db = getDb();
//     return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: updatedCartItems } } });
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCartItems()
//     .then(products => {
//       const order = {
//         items: products,
//         user: {
//           _id: new ObjectId(this._id),
//           name: this.name
//         }
//       };
//       return db.collection('orders').insertOne(order)
//     })
//     .then(result => {
//       this.cart = { items: [] };
//       return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: { items: [] } } })
//     })
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection('orders').find({ 'user._id': new ObjectId(this._id) }).toArray()
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users').findOne({ _id: new ObjectId(userId) })
//     .then(user => {
//       console.log(user);
//       return user;
//     })
//     .catch(err => {
//       console.log(err);
//     })
//   }

// }

// module.exports = User;
