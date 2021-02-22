
import { Connection, Model } from 'mongoose';
import { modelName } from './mongoose/model/order';

/**
 * Orderリポジトリー
 */
export class MongoRepository {
    public readonly orderModel: typeof Model;

    constructor(connection: Connection) {
        this.orderModel = connection.model(modelName);
    }

    /**
    * なければ作成する
    */
    public async createIfNotExist(order: any) {

        delete order.id
        delete order._id

        await this.orderModel.findOneAndUpdate(
            {
                orderNumber: order.orderNumber,
                orderStatus: order.orderStatus
            },
            { $setOnInsert: order },
            { new: true, upsert: true }
        )
            .exec();
    }

}
