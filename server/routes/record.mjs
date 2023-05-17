import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/tasks/load", async (req, res) => {
    const currentDate = new Date();

    let collection = await db.collection("tasks");

    await collection.updateMany(
        {
            deadline: { $lt: currentDate.toISOString() },
            status: { $ne: "finished" }
        },
        { $set: { status: "overdue" } }
    );

    let results = await collection.find({}).toArray();
    res.send(results).status(200);
});

router.get("/tasks/load/:id", async (req, res) => {
    let collection = await db.collection("records");
    let query = {_id: new ObjectId(req.params.id)};
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
});

router.post("/tasks/create", async (req, res) => {
    let newDocument = {...req.body};
    let collection = await db.collection("tasks");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
});

router.patch("/tasks/update/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };
    const updates =  {
        $set: {
            name: req.body.name,
            description: req.body.description,
            status: req.body.status,
            assignedTo: req.body.assignedTo,
            deadline: req.body.deadline
        }
    };

    let collection = await db.collection("tasks");
    let result = await collection.updateOne(query, updates);

    res.status(200).send(result);
});

router.delete("/tasks/delete/:id", async (req, res) => {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("tasks");
    let result = await collection.deleteOne(query);

    res.status(200).send(result);
});

router.get("/sign/in", async (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    let collection = await db.collection("users");
    let query = { username: username };
    let result = await collection.findOne(query);

    if (!result) {
        res.status(404).send("User not found");
        return;
    }
    const hashedPassword = result.password;
    const isPasswordValid = await bcrypt.compare(password, hashedPassword);
    if (!isPasswordValid) {
        res.status(401).send("Invalid password");
        return;
    }
    res.status(200).send(result);
});

router.post("/sign/up", async (req, res) => {
    let newDocument = {
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10)
    };
    let collection = await db.collection("users");

    const existingUser = await collection.findOne({ username: req.body.username });
    if (existingUser) {
        return res.status(400).send("Username already exists");
    }
    let result = await collection.insertOne(newDocument);
    res.status(204).send(result);
});

router.get("/users/list", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}, { projection: { password: 0 } }).toArray();
    res.status(200).send(results);
});

export default router;
