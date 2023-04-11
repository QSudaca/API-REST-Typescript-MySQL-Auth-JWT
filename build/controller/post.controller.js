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
exports.deletePost = exports.updatePost = exports.getPosts = exports.getPost = exports.createPost = void 0;
const database_1 = __importDefault(require("../database"));
// import jwt from "jsonwebtoken";
function parseJwt(t) {
    var base64Url = t.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
}
;
function createPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const headerToken = req.headers["authorization"];
            const bearerToken = headerToken != undefined ? headerToken.slice(7) : "unknow";
            const decoded = parseJwt(bearerToken);
            const { body } = req;
            const conn = yield (0, database_1.default)();
            const [exist] = yield conn.query("SELECT * FROM post WHERE title = ?", [body.title]);
            if (exist.length > 0) {
                return res.status(200).json({ message: "Titulo en uso" });
            }
            const post = {
                title: body.title,
                post: body.post,
                author: decoded,
            };
            yield conn.query("INSERT INTO post SET ?", [post]);
            res.status(201).json(decoded);
        }
        catch (error) {
            return res.status(400).json(error);
        }
    });
}
exports.createPost = createPost;
function getPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const conn = yield (0, database_1.default)();
            const post = yield conn.query("SELECT * FROM post WHERE post_id = ?", [id]);
            if (post[0].length == 0) {
                return res
                    .status(204)
                    .json({ message: `Post id_ ${id} no existe en nuestra Base de Datos` });
            }
            return res.status(201).json(post[0]);
        }
        catch (err) {
            return res.status(400).json({ message: err });
        }
    });
}
exports.getPost = getPost;
function getPosts(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const conn = yield (0, database_1.default)();
            const [posts] = yield conn.query("SELECT * FROM post");
            if (posts[0].length == 0) {
                return res.json("Sin datos");
            }
            else {
                return res.status(200).json(posts[0]);
            }
        }
        catch (error) {
            return res.status(400).json(error);
        }
    });
}
exports.getPosts = getPosts;
function updatePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { body } = req;
            const conn = yield (0, database_1.default)();
            const post = yield conn.query("SELECT * FROM post WHERE post_id = ?", [id]);
            if (post[0].length == 0) {
                return res.status(204).json({ message: "Post Not Found" });
            }
            yield conn.query("UPDATE post SET ? WHERE post_id = ? ", [body, id]);
            return res
                .status(200)
                .json({ message: `Post id: ${id} updated successfully` });
        }
        catch (error) {
            return res.status(400).json(error);
        }
    });
}
exports.updatePost = updatePost;
function deletePost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const conn = yield (0, database_1.default)();
            const post = yield conn.query("SELECT * FROM post WHERE post_id = ?", [id]);
            if (post[0].length == 0) {
                return res.status(204).json({ message: "Post Not Found" });
            }
            yield conn.query("DELETE FROM post WHERE post_id = ? ", [id]);
            return res
                .status(200)
                .json({ message: `Post id: ${id} deleted successfully` });
        }
        catch (error) {
            return res.status(400).json(error);
        }
    });
}
exports.deletePost = deletePost;
