const express = require('express')
const bodyParser = require('body-parser');
const request = require('request');

const app = express()
const apiToken = 'a26b198d9e55465f964d7fe5754a64ef';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs')

app.get('/', function (req, res) {
  res.render('index', {balance: null, error: null});
})

//This corresponds to checking  the balance of the given address.
app.post('/form1', function (req, res) {
  let address = req.body.address;
  let url = `http://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {balance: null, error: 'Error, please try again'});
    } else {
      let balance = JSON.parse(body)
      if(balance.address == undefined){
        res.render('index', {balance: null, error: 'Error, undefined'});
      } else {
        let balanceText = `The address ${balance.address} has a balance of ${balance.balance} SATOSHIS!`;
        res.render('index', {balance: balanceText, error: null});
      }
    }
});
})

//This corresponds to creating a transaction with the parameters:
/*  sender: Public key
 *  recipient: Public  key
 *  amount: amount of btc to be transferred.
 */
app.post('/form2', function (req, res) {
  let sender = req.body.sender;
  let recipient = req.body.recipient;
  let amount = req.body.amount;
  let url = `http://api.blockcypher.com/v1/btc/test3/addrs/${sender}/balance`
  var sufficient = 0;
  //check the balance is sufficient and that the sender and recipient addresses are valid
  request(url, function (err, response, body) {
    if(err){
      res.render('index', {balance: null, error: 'Error, please try again'});
    } else {
      let balance = JSON.parse(body)
      if(balance.address == undefined){
        res.render('index', {balance: null, error: 'Error, undefined'});
      } else {
        if (balance.balance >= amount) {
          sufficient = 1;
        }else {
          res.render('index', {balance: null, error: 'Error, not enough BTC for this transaction'});
        }
      }
    }
  });

  let url2 = `http://api.blockcypher.com/v1/btc/test3/txs/new?token=${apiToken}`
})

app.listen(3000, function () {
  console.log('listening on port 3000!')
})

//check for error
function printResponse(error, data) {
  if (error !== null) {
    console.log(error);
  } else {
    console.log(data);
  }
}
