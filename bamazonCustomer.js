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
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "rawlist",
                    message: "Please Enter the ID of the product you would like to buy.",
                    name: "productId",
                    choices: function() {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].item_id);
                        }
                        return choiceArray;
                        },
                },
                {
                    type: "input",
                    message: "How many units would you like to buy?",
                    name: "quantity"
                }
            ])
            .then(function (answer) {
                productId = answer.productId;
                quantity = answer.quantity;
                var chosenItem;

                if (productId > results.length) {
                    console.log("Item ID invalid");
                    connection.end();
                }


                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_id === productId) {
                        chosenItem = results[i];
                    }
                }

                if (chosenItem.stock_quantity > quantity) {
                    updatedQuantity = chosenItem.stock_quantity - quantity;
                    totalCost = chosenItem.price * quantity;

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedQuantity
                            },
                            {
                                item_id: productId
                            }
                        ]
                    )
                    console.log("Total Purchase cost is: $" + totalCost); 
                    connection.end();                   
                }
                else {
                    console.log("Insufficient stock! Please choose fewer items.");
                    connection.end();
                }

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
