"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * ルーター
 */
const express_1 = require("express");
const webhook_1 = require("./webhook");
const router = express_1.Router();
router.use('/webhook', webhook_1.default);
exports.default = router;
