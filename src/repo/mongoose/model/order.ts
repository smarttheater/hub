import * as mongoose from 'mongoose';

const modelName = 'Order';

const writeConcern: mongoose.WriteConcern = { j: true, w: 'majority', wtimeout: 10000 };

/**
 * Orderスキーマ
 * @ignore
 */
const schema = new mongoose.Schema(
    {
    },
    {
        collection: 'orders',
        id: true,
        read: 'primaryPreferred',
        writeConcern: writeConcern,
        strict: false,
        useNestedStrict: true,
        timestamps: {
            createdAt: 'createdAt',
            updatedAt: 'updatedAt'
        },
        toJSON: {
            getters: false,
            virtuals: false,
            minimize: false,
            versionKey: false
        },
        toObject: {
            getters: false,
            virtuals: true,
            minimize: false,
            versionKey: false
        }
    }
);

schema.index(
    { createdAt: 1 },
    { name: 'searchByCreatedAt' }
);
schema.index(
    { updatedAt: 1 },
    { name: 'searchByUpdatedAt' }
);

// 注文番号と注文ステータスでユニークにしておく
schema.index(
    { orderNumber: 1 , orderStatus: 1 },
    {
        name: 'searchByOrderNumberAndOrderStatus'
    }
);

schema.index(
    { orderDate: -1 },
    {
        name: 'searchByOrderDate'
    }
);
schema.index(
    { orderStatus: 1, orderDate: -1 },
    {
        name: 'searchOrdersByOrderStatusAndOrderDate'
    }
);

mongoose.model(modelName, schema)
    .on(
        'index',
        // tslint:disable-next-line:no-single-line-block-comment
        /* istanbul ignore next */
        (error) => {
            if (error !== undefined) {
                // tslint:disable-next-line:no-console
                console.error(error);
            }
        }
    );

export { modelName, schema };