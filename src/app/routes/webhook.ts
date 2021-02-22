/**
 * webhookルーター
 */
import * as express from 'express';
import * as mongoose from 'mongoose';
import logger from '../middlewares/bunyanLogger'
import { MongoRepository as OrderRepo } from '../../repo/order';
import { MongoRepository as ReservationRepo } from '../../repo/reservation';
import { MongoRepository as TaskRepo } from '../../repo/task';
const webhookRouter = express.Router();

webhookRouter.post(
    '/order',
    async (req, res, _next) => {
        try {

            //logに残しておく
            logger.info({
                orderNumber: req.body?.data?.orderNumber,
                data: req.body?.data
            }, `orderNumber:${req.body?.data?.orderNumber} , orderStatus:${req.body?.data?.orderStatus} , order is coming..`);

            const orderRepo = new OrderRepo(mongoose.connection);
            const taskRepo = new TaskRepo(mongoose.connection);

            // 通知内容を永続化
            await orderRepo.createIfNotExist(req.body.data);

            // 一旦、QUEUEを入れるのはssktsのprocessingだけにしておく
            if (req.body.data.project.id.includes('sskts') && req.body.data.orderStatus === 'OrderProcessing') {
                await taskRepo.createIfNotExist({
                    name: 'orderRecieved',
                    dataKey: req.body.data.orderNumber,
                    dataStatus: req.body.data.orderStatus,
                    status: 'QUEUED'
                });
            };

            res.send();
        } catch (e) {
            logger.error(e);
            res.status(400).send();
            // next(e);
        }
    });

webhookRouter.post(
    '/reservation',
    async (req, res, _next) => {
        try {

            //logに残しておく
            logger.info({
                reservationId: req.body?.data?._id || req.body?.data?.reservationId,
                data: req.body?.data
            }, `reservationId:${req.body?.data?._id || req.body?.data?.reservationId} , reservationStatus:${req.body?.data?.reservationStatus} , reservation is coming..`);

            // uniqueじゃないものは保存しない
            if (req.body?.data?.reservationId === undefined && req.body?.data?._id === undefined) {
                res.send();

                return;
            }

            const reservationRepo = new ReservationRepo(mongoose.connection);
            const taskRepo = new TaskRepo(mongoose.connection);

            // 通知内容を永続化
            await reservationRepo.createIfNotExist(req.body.data);

            // 一旦、QUEUEを入れるのはtttsだけにしておく
            if (req.body.data.project.id.includes('ttts')) {
                await taskRepo.createIfNotExist({
                    name: 'reservationRecieved',
                    dataKey: req.body.data.reservationId || req.body.data._id,
                    dataStatus: req.body.data.reservationStatus,
                    status: 'QUEUED'
                })
            }

            res.send();
        } catch (e) {
            logger.error(e);
            res.status(400).send();
            // next(e);
        }
    });

export default webhookRouter;
