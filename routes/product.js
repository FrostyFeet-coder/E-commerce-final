const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { validateProduct , isLoggedIn, isSeller, isAuthor } = require('../middleware');
const {showAllProducts, productForm , createProduct , showProduct , editProductForm , updateProduct , deleteProduct} =  require('../controllers/product')
const stripe = require("stripe")("sk_test_tR3PYbcVNZZ796tH88S4VQ2u");

router.get('/products', showAllProducts);

router.get('/products/new', isLoggedIn, productForm);

router.post('/products',isLoggedIn, isSeller, validateProduct,createProduct);

router.get('/products/:id', isLoggedIn, showProduct);

router.get('/products/:id/edit', isLoggedIn, editProductForm);

router.patch('/products/:id', isLoggedIn, validateProduct, isAuthor, updateProduct);

router.delete('/products/:id', isLoggedIn, isAuthor, deleteProduct);


router.post("/create-checkout-session", async (req, res) => {
  try {
    const { products } = req.body;

    // Parse the products from the form data
    const parsedProducts = products.map(product => JSON.parse(product));

    const line_items = parsedProducts.map(product => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product.name,
        },
        unit_amount: product.price * 100, // assuming the price is in INR
      },
      quantity: product.quantity || 1, // default to 1 if quantity is not provided
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "http://localhost:5000/products",
      cancel_url: "http://localhost:5000/products",
    });

    res.redirect(303, session.url);
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});

module.exports = router;