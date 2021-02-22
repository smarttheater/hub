
import { Connection, Model } from 'mongoose';
import { modelName } from './mongoose/model/reservation';

/**
 * Reservationリポジトリー
 */
export class MongoRepository {
    public readonly reservationModel: typeof Model;

    constructor(connection: Connection) {
        this.reservationModel = connection.model(modelName);
    }

    /**
    * なければ作成する
    */
    public async createIfNotExist(reservation: any) {
        if (reservation.reservationId == undefined) {
            reservation.reservationId = reservation._id;
        }
        delete reservation.id;
        delete reservation._id;
        delete reservation.updatedAt;
        delete reservation.createdAt;
        try {
            await this.reservationModel.findOneAndUpdate(
                {
                    reservationId: reservation.reservationId,
                    reservationStatus: reservation.reservationStatus
                },
                { $setOnInsert: reservation },
                { new: true, upsert: true }
            )
                .exec();
        } catch (error) {
            //console.log(error)
            //no ops
        }

    }

}
