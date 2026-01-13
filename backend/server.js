const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const products = require("./products.json");
const ordersFile = "./orders.json";

/* LOGIN */
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (username === "admin" && password === "admin123") {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

/* PRODUCTS */
app.get("/products", (req, res) => {
    res.json(products);
});

/* SAVE ORDER */
app.post("/order", (req, res) => {
    let orders = JSON.parse(fs.readFileSync(ordersFile));
    req.body.id = Date.now();
    req.body.date = new Date().toLocaleString();
    orders.push(req.body);
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    res.json({ message: "Order placed" });
});

/* GET ORDERS */
app.get("/orders", (req, res) => {
    const orders = JSON.parse(fs.readFileSync(ordersFile));
    res.json(orders);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
const cors = require("cors");
app.use(cors());
