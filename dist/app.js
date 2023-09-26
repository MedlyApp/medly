"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbConnect_1 = __importDefault(require("./config/dbConnect"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
dotenv_1.default.config();
(0, dbConnect_1.default)();
const app = (0, express_1.default)();
const port = process.env.PORT;
const server = http_1.default.createServer(app);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.static(path_1.default.join(__dirname, './public')));
app.use(express_1.default.json({
    limit: '10mb'
}));
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use('/', indexRoute_1.default);
app.use('/medly/user', userRoute_1.default);
app.use(function (err, req, res, _next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
});
server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
exports.default = app;
//# sourceMappingURL=app.js.map