"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const auth_routes_1 = __importDefault(require("./router/auth.routes"));
const post_routes_1 = __importDefault(require("./router/post.routes"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.set("port", config_1.default.PORT);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, morgan_1.default)("dev"));
//router
app.use("/api/auth", auth_routes_1.default);
app.use("/api/post", post_routes_1.default);
exports.default = app;
