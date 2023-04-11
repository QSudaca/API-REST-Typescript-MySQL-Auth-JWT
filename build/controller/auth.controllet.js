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
exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = __importDefault(require("../database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const config_1 = __importDefault(require("../config"));
function signup(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { body } = req;
            const conn = yield (0, database_1.default)();
            const [t] = yield conn.query("SELECT * FROM user WHERE username = ? ", [body.username]);
            console.log(t.length);
            //Verificar username y email
            if (t.length > 0) {
                return res.status(204).json({ message: "Username o email ya en uso" });
            }
            //Encriptar contraseña
            const salt = yield bcryptjs_1.default.genSalt(10);
            console.log(salt);
            const encryptedPassword = yield bcryptjs_1.default.hash(body.password, salt);
            console.log(encryptedPassword);
            const newUser = {
                username: body.username,
                email: body.email,
                password: encryptedPassword,
            };
            //Query
            yield conn.query("INSERT INTO user SET ?", [newUser]);
            return res
                .status(200)
                .json(`Usuario ${body.username} created successfully`);
        }
        catch (error) {
            return res.status(400).json(error);
        }
    });
}
exports.signup = signup;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { body } = req;
        const conn = yield (0, database_1.default)();
        const [t] = yield conn.query("SELECT * FROM user WHERE username = ?", [body.username]);
        if (t.length == 0 || t == undefined) {
            return res.status(200).json({ message: "Usuario no encontrado" });
        }
        else {
            const encryptedPassword = t[0].password;
            const vToken = yield bcryptjs_1.default.compare(body.password, encryptedPassword);
            if (vToken == false) {
                return res.status(400).json({ message: "Contraseña Incorrecta" });
            }
            else {
                const token = yield jsonwebtoken_1.default.sign({ user: t[0].username }, config_1.default.SECRET);
                return res.status(200).json({ token: token });
            }
        }
    });
}
exports.login = login;
