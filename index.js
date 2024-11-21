const express = require('express');
const app = express();
const port = 3000; 
const cors = require('cors');
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

// חיבור למסד הנתונים
mongoose.connect('mongodb://localhost:27017/customersdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));
   

// הגדרת מודל עבור לקוחות
const customerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
});

const Customer = mongoose.model('Customer', customerSchema);

// הפונקציה שתשאב את הנתונים מ-MongoDB
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find(); // שואב את כל הלקוחות
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers from MongoDB:', error);
    res.status(500).send('Error fetching customers');
  }
});

// עדכון לקוח
app.put('/api/customers/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;
  
    Customer.findByIdAndUpdate(id, { name, email, phone }, { new: true })
      .then(updatedCustomer => {
        res.json(updatedCustomer);
      })
      .catch(error => {
        res.status(500).json({ message: 'Error updating customer', error });
      });
  });

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


// const customers = [
//     { id: 1, name: 'John Doe', email: 'john@example.com' },
//     { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
//     { id: 3, name: 'Alice Johnson', email: 'alice@example.com' },
//     { id: 4, name: 'Bob Brown', email: 'bob@example.com' },
//     { id: 5, name: 'Ella Davis', email: 'ella@example.com' },

//   ];
  
//   app.get('/api/customers', (req, res) => {
//     res.json(customers);
//   });
  


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`http://localhost:${port}`);
});

