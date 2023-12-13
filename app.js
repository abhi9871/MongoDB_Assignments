const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('65798a756b0374ad24149779')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://abhishek_481:Oeo31Zp2RBbE2nrA@cluster0.rmpeadv.mongodb.net/shop?retryWrites=true&w=majority')
.then(result =>{
  User.findOne()
  .then(user => {
    if(!user){
      const user = new User({
        name: 'Abhishek',
        email: 'abhi@test.com',
        cart: {
          items: []
        }
      });
      user.save();
    }
  })
  app.listen(4000);
})
.catch(err => {
  console.log(err);
})