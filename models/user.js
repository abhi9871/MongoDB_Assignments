const mongoDB = require('mongodb');
const getDb = require('../util/database').getDB;

class User {
  constructor(name, email){
    this.name = name;
    this.email = email
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

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new mongoDB.ObjectId(userId) })
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
