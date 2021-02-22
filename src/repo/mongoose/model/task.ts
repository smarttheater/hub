import * as mongoose from 'mongoose';

const modelName = 'Task';

const writeConcern: mongoose.WriteConcern = { j: true, w: 'majority', wtimeout: 10000 };

/**
 * Taskスキーマ
 * @ignore
 */
const schema = new mongoose.Schema(
    {
    },
    {
        collection: 'tasks',
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
    { status: 1 },
    {
        name: 'searchByStatus'
    }
);

schema.index(
    {
        name: 1,
        status: 1
    },
    {
        name: 'serchByNameAndStatus'
    }
);

schema.index(
    {
        orderNumber: 1,
        orderStatus: 1
    },
    {
        name: 'serchByOrderNumberAndOrderStatus'
    }
);

schema.index(
    {
        name: 1,
        dataKey: 1,
        dataStatus: 1
    },
    {
        name: 'serchByNameAndDataKeyAndDataStatus'
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

schema.index(
    { status: 1, updatedAt: -1 },
    {
        name: 'searchByStatusAndUpdatedAt'
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