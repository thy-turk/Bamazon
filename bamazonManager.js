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

    prompt();


});

function prompt() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    type: "list",
                    name: "selector",
                    message: "What would you like to do?",
                    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
                }
            ]).then(function (user) {
                switch (user.selector) {
                    case "View Products for Sale":
                        listProducts();
                        break;
                    case "View Low Inventory":
                        lowInventory();
                        break;
                    case "Add to Inventory":
                        addInventory();
                        break;
                    case "Add New Product":
                        newProduct();
                }
                function listProducts() {
                    for (let i = 0; i < res.length; i++) {
                        console.log("\nItem Id: " + res[i].item_id +
                            "\nProduct Name: " + res[i].product_name +
                            "\nDepartment: " + res[i].department_name +
                            "\nPrice: " + res[i].price +
                            "\nQuantity Available: " + res[i].stock_quantity)
                    }
                };

                function lowInventory() {
                    for (var i = 0; i < res.length; i++) {
                        if (res[i].stock_quantity < 5) {
                            console.log("\nItem Id: " + res[i].item_id +
                                "\nProduct Name: " + res[i].product_name +
                                "\nDepartment: " + res[i].department_name +
                                "\nPrice: " + res[i].price +
                                "\nQuantity Available: " + res[i].stock_quantity)
                        }
                    }
                };

                function addInventory() {
                    inquirer
                        .prompt([
                            {
                                type: "rawlist",
                                message: "Please Enter the ID of the product you would like to restock.",
                                name: "productId",
                                choices: function () {
                                    var choiceArray = [];
                                    for (var i = 0; i < res.length; i++) {
                                        choiceArray.push(res[i].item_id);
                                    }
                                    return choiceArray;
                                },
                            },
                            {
                                type: "input",
                                message: "How many additonal units are to be added?",
                                name: "quantity"
                            }
                        ])
                        .then(function (answer) {
                            productId = answer.productId;
                            quantity = answer.quantity;
                            var chosenItem;

                            if (productId > res.length) {
                                console.log("Item ID invalid");
                                connection.end();
                            }


                            for (var i = 0; i < res.length; i++) {
                                if (res[i].item_id === productId) {
                                    chosenItem = res[i];
                                }
                            }

                            updatedQuantity = parseInt(chosenItem.stock_quantity) + parseInt(quantity);

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
                            console.log("Total Quantity is now: " + updatedQuantity)

                        })
                };

                function newProduct() {
                    inquirer.prompt([
                        {
                            type: "input",
                            message: "Please enter the name of the product.",
                            name: "newProduct",
                        },
                        {
                            type: "input",
                            message: "Please enter the department of the product.",
                            name: "newDepartment",
                        },
                        {
                            type: "input",
                            message: "Please enter the price of the product.",
                            name: "newPrice",
                        },
                        {
                            type: "input",
                            message: "Please enter the quantity of the product",
                            name: "newQuantity",
                        }
                    ]).then(function (answer) {
                        connection.query(
                            "INSERT INTO products SET ?",
                            {
                                product_name: answer.newProduct,
                                department_name: answer.newDepartment,
                                price: answer.newPrice,
                                stock_quantity: answer.newQuantity
                            },
                            function(err, res) {
                                if (err) throw err;
                                console.log(res.affectedRows + " product inserted!\n");
                              }
                        )
                    })
                }
            })
    })
};