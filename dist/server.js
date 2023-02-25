"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const createUserAndPost = (name, place) => {
    return client_1.Prisma.validator()({
        data: {
            name,
            place
        }
    });
};
const findSpecificUser = (id) => {
    return client_1.Prisma.validator()({
        where: {
            id: id
        }
    });
};
const updateSpecificUser = (id, name, place) => {
    return client_1.Prisma.validator()({
        where: { id: id },
        data: {
            name: name,
            place: place
        }
    });
};
const deleteSpecificUser = (id) => {
    return client_1.Prisma.validator()({
        where: {
            id: id
        }
    });
};
app.use(express_1.default.json());
//get all available users
app.get("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield prisma.user.findMany();
    res.json({
        data: allUsers,
    });
}));
// //get user by id
app.get("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const getUserById = yield prisma.user.findUnique(findSpecificUser(id));
    if (!!getUserById) {
        res.json({
            data: getUserById,
        });
    }
    else {
        res.json({
            data: "Unable to find user with id:" + id,
        });
    }
}));
//create user
app.post("/user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userName = req.body.name;
    const userPlace = req.body.place;
    // if (!userName || !userPlace) {
    //   return res.status(400).json({ message: "Either name or place is missing" });
    // }
    try {
        const userData = yield prisma.user.create(createUserAndPost(userName, userPlace));
        return res.json({ userData });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ message: "something went wrong" });
    }
}));
// //update a user
app.put("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name, place } = req.body;
    try {
        const post = yield prisma.user.update(updateSpecificUser(id, name, place));
        res.json(post);
    }
    catch (error) {
        res.json({ error: `User with ID ${id} does not exist in the database` });
    }
}));
// //delete a user
app.delete("/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deleteUser = yield prisma.user.delete(deleteSpecificUser(id));
        if (!!deleteUser) {
            res.json({ data: "Sucessfully deleted user with id: " + id });
        }
    }
    catch (error) {
        res.json({ error: `User with ID ${id} does not exist in the database` });
    }
}));
const server = app.listen(PORT, () => console.log("Server running at: http://localhost:" + PORT));
