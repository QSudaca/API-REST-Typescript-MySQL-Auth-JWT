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
const config_1 = __importDefault(require("../config"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const headerToken = req.headers["authorization"];
    if (headerToken !== undefined && (headerToken === null || headerToken === void 0 ? void 0 : headerToken.startsWith("Bearer "))) {
        const bearerToken = headerToken.slice(7);
        try {
            yield jsonwebtoken_1.default.verify(bearerToken, config_1.default.SECRET);
            return next();
        }
        catch (error) {
            return res.status(400).json({ message: "Token Invalido" });
        }
    }
    else {
        return res.status(400).json({ message: "Acceso denegado" });
    }
});
exports.default = validateToken;
