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
const task_1 = require("./mongoose/model/task");
/**
 * Taskリポジトリー
 */
class MongoRepository {
    constructor(connection) {
        this.taskModel = connection.model(task_1.modelName);
    }
    /**
    * なければ作成する
    */
    createIfNotExist(task) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.taskModel.findOneAndUpdate({
                name: task.name,
                dataKey: task.dataKey,
                dataStatus: task.dataStatus
            }, { $setOnInsert: task }, { new: true, upsert: true })
                .exec();
        });
    }
}
exports.MongoRepository = MongoRepository;
