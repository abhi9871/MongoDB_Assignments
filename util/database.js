const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://abhishek_481:Oeo31Zp2RBbE2nrA@cluster0.rmpeadv.mongodb.net/shop?retryWrites=true&w=majority')
  .then(client => {
    console.log('connected!');
    _db = client.db();
    callback();
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
};

const getDB = () => {
  if(_db)
    return _db;
  else
    throw 'No database found';
}

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;





