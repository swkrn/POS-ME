const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('./auth');
// router.use(isLoggedIn);

const Bill = require('../models/bill');
const Item = require('../models/item')
const ItemType = require('../models/item_type')
const User = require('../models/user')


const zeroPad = (num, places) => String(num).padStart(places, '0')


// save bill
router.post('/', isLoggedIn, async (req, res) => {
  function receipt_generate(num, digit) {
    num = num.toString();
    while (num.length < digit) num = '0' + num;
    return num;
  }
    try {
      const { payment_method, cash, quantity } = req.body;
      let quan_bill = [];
  
      for (let q of quantity) {
        let data = await Item.findOne({ _id: q._id });
        if (!data) {
          return res.status(400).json('item not found');
        }
  
        quan_bill.push({
          item_name: data.name,
          price_each: data.price,
          quantity: q.amount,
          item: q._id
        });
      }
  
      const receipt_no = receipt_generate(req.user.receipt_gen, 10);
      await User.findOneAndUpdate({ _id: req.user._id }, { receipt_gen: req.user.receipt_gen+1 });

      const bill = new Bill({
        receipt_no: receipt_no,
        payment_method: payment_method,
        cash: cash,
        quantity: quan_bill,
        user_id: req.user._id
      });
  
      await bill.save();
      return res.json({ message: 'successfully save bill', bill_id: bill._id, payment_method: payment_method });
    } catch (err) {
      return res.status(400).json(err);
    }
  });


// get bill
// router.get('/', async (req, res) => {
//   try {
//     let { receipt_no, date } = req.query;

//     if (receipt_no) {
//       const bill = await Bill.findOne({ 'receipt_no': receipt_no }).populate('user_id');
//       return res.json(bill);
//     } else if (date) {
//       date = new Date(date);
//       const bills = await Bill.find({user_id: req.user._id}).populate('user_id');
//       const result = bills.filter(bill => {
//         const { time } = bill;
//         return time.getFullYear() === date.getFullYear() && time.getMonth()+1 === date.getMonth()+1 && time.getDate() === date.getDate()
//       });
//       return res.json(result)
//     }
//     const bills = await Bill.find( {user_id: req.user._id} ).populate('user_id');
//     return res.json(bills);

//   } catch (err) {
//     return res.status(400).json(err);
//   }
// });


// (new) get bill by 'date' or 'receipt_no'
router.get('/', isLoggedIn, async (req, res) => {
  try {
    let { receipt_no, date } = req.query;

    if (receipt_no) {
      const bills = await Bill.find({ receipt_no: { "$regex": receipt_no, "$options": "i" }, user_id: req.user._id});
      const newBills = [];
      for (let bill of bills) {
        let year = bill.time.getFullYear(), month = bill.time.getMonth()+1, date = bill.time.getDate();
        let hour = bill.time.getHours(), minute = bill.time.getMinutes();
        let date_format = date + '/' + month + '/' + year;
        let time = zeroPad(hour, 2)  + ':' + zeroPad(minute, 2);
        let newBill = JSON.parse(JSON.stringify(bill));
        newBill.date = date_format;
        newBill.time = time
        newBills.push(newBill);
      }
      return res.json(newBills);
    } else if (date) {
      date = new Date(date);
      const bills = await Bill.find({user_id: req.user._id}).populate('user_id');
      const result = bills.filter(bill => {
        const { time } = bill;
        return time.getFullYear() === date.getFullYear() && time.getMonth()+1 === date.getMonth()+1 && time.getDate() === date.getDate()
      });
      const newBills = [];
      for (let bill of result) {
        let year = bill.time.getFullYear(), month = bill.time.getMonth()+1, date = bill.time.getDate();
        let hour = bill.time.getHours(), minute = bill.time.getMinutes();
        let date_format = date + '/' + month + '/' + year;
        let time = zeroPad(hour, 2)  + ':' + zeroPad(minute, 2);
        let newBill = JSON.parse(JSON.stringify(bill));
        newBill.date = date_format;
        newBill.time = time
        newBills.push(newBill);
      }
      return res.json(newBills)
    }
    const bills = await Bill.find( {user_id: req.user._id} ).populate('user_id');
    const newBills = [];
    for (let bill of bills) {
      let year = bill.time.getFullYear(), month = bill.time.getMonth()+1, date = bill.time.getDate();
      let hour = bill.time.getHours(), minute = bill.time.getMinutes();
      let date_format = date + '/' + month + '/' + year;
      let time = zeroPad(hour, 2)  + ':' + zeroPad(minute, 2);
      let newBill = JSON.parse(JSON.stringify(bill));
      newBill.date = date_format;
      newBill.time = time
      newBills.push(newBill);
    }
    return res.json(newBills);

  } catch (err) {
    return res.status(400).json(err);
  }
});


// get bill by id (no auth)
router.get('/id/:bill_id', async (req, res) => {
  try {
    bill_id = req.params['bill_id']
    const bill = await Bill.findOne({'_id': bill_id}).populate('user_id')

    let year = bill.time.getFullYear(), month = bill.time.getMonth()+1, date = bill.time.getDate();
    let hour = bill.time.getHours(), minute = bill.time.getMinutes();
    let date_format = date + '/' + month + '/' + year;
    let time = zeroPad(hour, 2)  + ':' + zeroPad(minute, 2);
    let newBill = JSON.parse(JSON.stringify(bill));
    newBill.date = date_format;
    newBill.time = time
    return res.json(newBill)

  } catch (err) {
    return res.status(400).json(err)
  }
})


// ยอดขาย
router.post('/total', isLoggedIn, async (req, res) => {
  try {
    const { date } = req.body;
    let month = Number(date.slice(5, 7))
    let year = Number(date.slice(0, 4))

    const bills = await Bill.find({ user_id: req.user._id });
    let sum = 0;
    for (let i = 0; i < bills.length; i++) {
      let { time } = bills[i];
      if (time.getMonth()+1 === month && year === time.getFullYear()) {
        for (let j = 0; j < bills[i].quantity.length; j++) {
          let price_each = bills[i].quantity[j].price_each;
          let quantity = bills[i].quantity[j].quantity;
          sum += price_each * quantity
        }
      }
    }
    return res.json({total: sum});
  } catch (err) {
    return res.status(400).json(err);
  }
});


// best selling item
router.post('/bestselling', isLoggedIn, async (req, res) => {
  try {

    const { sort, date } = req.body
    if (sort == null && date == null) {
      return res.status(400).json( {message: "required 'sort' and 'date'"} )
    }
    let month = Number(date.slice(5, 7))
    let year = Number(date.slice(0, 4))

    const bills = await Bill.find({ user_id: req.user._id });
    let items_data = []
    for (let i = 0; i < bills.length; i++) {
      let { time } = bills[i];
      if (time.getMonth()+1 === month && year === time.getFullYear()) {
        for (let j = 0; j < bills[i].quantity.length; j++) {
          items_data.push(bills[i].quantity[j])
        }
      }
    }

    let items_group = []
    items_data.reduce((res, value) => {
      if (!res[value.item]) {
        res[value.item] = { item: value.item, item_name: value.item_name, amount: 0, total_sales: 0}
        items_group.push(res[value.item])
      }
      res[value.item].amount += value.quantity
      res[value.item].total_sales += value.price_each * value.quantity
      return res
    }, {})

    items_group.sort(dynamicSort("-" + sort))

    return res.json(items_group)

  } catch (err) {
    return res.status(400).json(err)
  }
})


function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}


module.exports = router;