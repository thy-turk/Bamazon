var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: 'root',
    password: 'password',

    database: 'bamazon'
});

connection.connect(function (err) {
    if (err) throw err;
    // console.log("connected to the db with the id of " + connection.threadId);

    listItems();


});

function prompt() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "Please Enter the ID of the product you would like to buy.",
                name: "productID"
            },
            {
                type: "input",
                message: "How many units would you like to buy?",
                name: "quantity"
            }
        ])
            .then(function (inquirerResponse) {
                productId = inquirerResponse.productID;
                quantity = inquirerResponse.quantity;
                var chosenItem;

                if (productId > res.length) {
                    console.log("Item ID invalid");
                    connection.end();
                }
                

                // connection.query("SELECT * FROM products", function(err, res) {
                //     if (err) throw err;
                //     for (let i = 0; i < res.length; i++) {
                //         if (res[i].quantity < )
                //     }

                // });

                // connection.query(
                //     "UPDATE products SET ? WHERE ?",
                //     [
                //         {
                //             stock_quantity: 900
                //         },
                //         {
                //             item_id: productId
                //         }
                //     ]

                // )

            })
    });
};

function listItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            console.log("\nItem Id: " + res[i].item_id +
                "\nProduct Name: " + res[i].product_name +
                "\nDepartment: " + res[i].department_name +
                "\nPrice: " + res[i].price +
                "\nQuantity Available: " + res[i].stock_quantity)
        }
        prompt();
    })
}
