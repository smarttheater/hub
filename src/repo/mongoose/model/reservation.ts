import * as mongoose from 'mongoose';

const modelName = 'Reservation';

const writeConcern: mongoose.WriteConcern = { j: true, w: 'majority', wtimeout: 10000 };

/**
 * Reservationスキーマ
 * @ignore
 */
const schema = new mongoose.Schema(
    {
    },
    {
        collection: 'reservations',
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

schema.index(
    { bookingTime: -1 },
    { name: 'searchByBookingTime-v3' }
);

schema.index(
    { 'project.id': 1, bookingTime: -1 },
    {
        name: 'searchByProjectId-v3',
        partialFilterExpression: {
            'project.id': { $exists: true }
        }
    }
);

schema.index(
    { reservationNumber: 1, bookingTime: -1 },
    { name: 'searchByReservationNumber-v3' }
);

schema.index(
    { reservationStatus: 1, bookingTime: -1 },
    { name: 'searchByReservationStatus-v3' }
);

schema.index(
    { checkedIn: 1, bookingTime: -1 },
    { name: 'searchByCheckedIn-v3' }
);

schema.index(
    { attended: 1, bookingTime: -1 },
    { name: 'searchByAttended-v3' }
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