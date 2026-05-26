const express = require("express");
const { authMiddleware } = require("./middleware");
const jwt = require("jsonwebtoken");
const { todoModel, userModel } = require("./model");

const app = express()
app.use(express.json());


app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await userModel.findOne({
        username: username,
        password: password
    });
    if (existingUser) {
        res.status(403).json({
            message: "User with this username already exists"
        })
        return 
    }
   
    const newUser = await userModel.create({
        username: username,
        password: password
    })
    res.status(201).json({
      message: "User created successfully",
      id: newUser._id
    })
})


app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userExists = await userModel.findOne({
        username: username,
        password: password
    });
    if (!userExists) {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }

    const token = jwt.sign({
        userId: userExists.id
    }, "secret123123");

    res.status(200).json({
      message: "User signed in successfully",
        token
    })
})

//TODO: Finish all the endpoints from here, migrate them from in memory to mongodb
app.post("/todo", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const title = req.body.title;
    const description = req.body.description;

    const newTodo = await todoModel.create({
        title: title,
        description: description,
        userId: userId
    })
    res.status(201).json({
        message: "New todo made successfully",
        todoId: newTodo._id
    })
})

// harkirats id might send a request to delete mark zuckerbergs todo id.
app.delete("/todo/:todoId", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const todoId = req.params.todoId; /// MongoDB ObjectId

    const doesUserOwnTodo = await todoModel.findOne({
        _id: todoId,
        userId: userId
    });

    if (doesUserOwnTodo) {
        await todoModel.deleteOne({
            _id: todoId,
            userId: userId
        });
        res.status(200).json({
            message: "Deleted"
        })
    } else {
        res.status(411).json({
            message: "Either todo doesnt exist or this is not your todo"
        })
    }
})

app.get("/todos", authMiddleware, async (req, res) => {
    const userId = req.userId;
    const userTodos = await todoModel.find({
        userId: userId
    });
    res.status(200).json({
        todos: userTodos
    })
})

app.listen(3000);
console.log("Server started at port 3000")