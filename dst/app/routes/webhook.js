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
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * webhookルーター
 */
const express = require("express");
const mongoose = require("mongoose");
const bunyanLogger_1 = require("../middlewares/bunyanLogger");
const order_1 = require("../../repo/order");
const reservation_1 = require("../../repo/reservation");
const task_1 = require("../../repo/task");
const webhookRouter = express.Router();
webhookRouter.post('/order', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        //logに残しておく
        bunyanLogger_1.default.info({
            orderNumber: (_b = (_a = req.body) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.orderNumber,
            data: (_c = req.body) === null || _c === void 0 ? void 0 : _c.data
        }, `orderNumber:${(_e = (_d = req.body) === null || _d === void 0 ? void 0 : _d.data) === null || _e === void 0 ? void 0 : _e.orderNumber} , orderStatus:${(_g = (_f = req.body) === null || _f === void 0 ? void 0 : _f.data) === null || _g === void 0 ? void 0 : _g.orderStatus} , order is coming..`);
        const orderRepo = new order_1.MongoRepository(mongoose.connection);
        const taskRepo = new task_1.MongoRepository(mongoose.connection);
        // 通知内容を永続化
        yield orderRepo.createIfNotExist(req.body.data);
        // 一旦、QUEUEを入れるのはssktsのprocessingだけにしておく
        if (req.body.data.project.id.includes('sskts') && req.body.data.orderStatus === 'OrderProcessing') {
            yield taskRepo.createIfNotExist({
                name: 'orderRecieved',
                dataKey: req.body.data.orderNumber,
                dataStatus: req.body.data.orderStatus,
                status: 'QUEUED'
            });
        }
        ;
        res.send();
    }
    catch (e) {
        bunyanLogger_1.default.error(e);
        res.status(400).send();
        // next(e);
    }
}));
webhookRouter.post('/reservation', (req, res, _next) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    try {
        //logに残しておく
        bunyanLogger_1.default.info({
            reservationId: ((_j = (_h = req.body) === null || _h === void 0 ? void 0 : _h.data) === null || _j === void 0 ? void 0 : _j._id) || ((_l = (_k = req.body) === null || _k === void 0 ? void 0 : _k.data) === null || _l === void 0 ? void 0 : _l.reservationId),
            data: (_m = req.body) === null || _m === void 0 ? void 0 : _m.data
        }, `reservationId:${((_p = (_o = req.body) === null || _o === void 0 ? void 0 : _o.data) === null || _p === void 0 ? void 0 : _p._id) || ((_r = (_q = req.body) === null || _q === void 0 ? void 0 : _q.data) === null || _r === void 0 ? void 0 : _r.reservationId)} , reservationStatus:${(_t = (_s = req.body) === null || _s === void 0 ? void 0 : _s.data) === null || _t === void 0 ? void 0 : _t.reservationStatus} , reservation is coming..`);
        // uniqueじゃないものは保存しない
        if (((_v = (_u = req.body) === null || _u === void 0 ? void 0 : _u.data) === null || _v === void 0 ? void 0 : _v.reservationId) === undefined && ((_x = (_w = req.body) === null || _w === void 0 ? void 0 : _w.data) === null || _x === void 0 ? void 0 : _x._id) === undefined) {
            res.send();
            return;
        }
        const reservationRepo = new reservation_1.MongoRepository(mongoose.connection);
        const taskRepo = new task_1.MongoRepository(mongoose.connection);
        // 通知内容を永続化
        yield reservationRepo.createIfNotExist(req.body.data);
        // 一旦、QUEUEを入れるのはtttsだけにしておく
        if (req.body.data.project.id.includes('ttts')) {
            yield taskRepo.createIfNotExist({
                name: 'reservationRecieved',
                dataKey: req.body.data.reservationId || req.body.data._id,
                dataStatus: req.body.data.reservationStatus,
                status: 'QUEUED'
            });
        }
        res.send();
    }
    catch (e) {
        bunyanLogger_1.default.error(e);
        res.status(400).send();
        // next(e);
    }
}));
exports.default = webhookRouter;
