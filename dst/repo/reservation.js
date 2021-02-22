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
exports.MongoRepository = void 0;
const reservation_1 = require("./mongoose/model/reservation");
/**
 * Reservationリポジトリー
 */
class MongoRepository {
    constructor(connection) {
        this.reservationModel = connection.model(reservation_1.modelName);
    }
    /**
    * なければ作成する
    */
    createIfNotExist(reservation) {
        return __awaiter(this, void 0, void 0, function* () {
            if (reservation.reservationId == undefined) {
                reservation.reservationId = reservation._id;
            }
            delete reservation.id;
            delete reservation._id;
            delete reservation.updatedAt;
            delete reservation.createdAt;
            try {
                yield this.reservationModel.findOneAndUpdate({
                    reservationId: reservation.reservationId,
                    reservationStatus: reservation.reservationStatus
                }, { $setOnInsert: reservation }, { new: true, upsert: true })
                    .exec();
            }
            catch (error) {
                //console.log(error)
                //no ops
            }
        });
    }
}
exports.MongoRepository = MongoRepository;
