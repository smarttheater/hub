
import { Connection, Model } from 'mongoose';
import { modelName } from './mongoose/model/task';


/**
 * Taskリポジトリー
 */
export class MongoRepository {
    public readonly taskModel: typeof Model;

    constructor(connection: Connection) {
        this.taskModel = connection.model(modelName);
    }

    /**
    * なければ作成する
    */
    public async createIfNotExist(task: any) {
        await this.taskModel.findOneAndUpdate(
            {
                name: task.name,
                dataKey: task.dataKey,
                dataStatus: task.dataStatus
            },
            { $setOnInsert: task },
            { new: true, upsert: true }
        )
            .exec();
    }

}
