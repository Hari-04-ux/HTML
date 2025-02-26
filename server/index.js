const express = require("express");
const users = require("./sample.json");
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(express.json());
const port = 8000;
app .use(
    cors({
   origin:"http://localhost:5173",
   methods:["GET","POST","PATCH","DELETE"]
    })
);
app.get("/users",(req, res)=>{
    return res.json(users);
});

app.delete("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let filteredUsers = users.filter((user)=>user.id !==id);
    fs.writeFile("./sample.json",JSON.stringify
        (filteredUsers),(err,data)=>{
            return res.json(filteredUsers);
        });
});

// app.delete("/users/:id", (req, res) => {
//     let id = Number(req.params.id);
//     console.log(`Deleting user with ID: ${id}`); // Add logging
//     let filteredUsers = users.filter((user) => user.id !== id);
//     fs.writeFile("./sample.json", JSON.stringify(filteredUsers), (err) => {
//         if (err) {
//             console.error("Error writing file:", err); // Add logging
//             return res.status(500).json({ error: "Failed to delete the user." });
//         } else {
//             console.log("User deleted successfully");
//             return res.json(filteredUsers);
//         }
//     });
// });

app.post("/users",(req,res)=>{
    let{name, age, city} = req.body;
    if(!name || !age || !city){
      res.status(400).send({message:"All Fields Required"});
    }
    let id = Date.now();
    users.push({id,name,city,age});
    fs.writeFile("./sample.json",JSON.stringify(users),(err,data)=>{
            return res.json({message: "user details added success"});
        });
});

app.patch("/users/:id",(req,res)=>{
    let id = Number(req.params.id);
    let{name, age, city} = req.body;
    if(!name || !age || !city){
      res.status(400).send({message:"All Fields Required"});
    }
    let index=users.findIndex((user)=> user.id == id);
    users.splice(index,1,{...req.body});
    fs.writeFile("./sample.json",JSON.stringify(users),(err, data)=>{
            return res.json({message: "user details updated success"});
        });
});
app.listen(port, (err)=>{
    console.log(`App is running in port ${port}`);
});