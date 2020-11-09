import * as mongoose from 'mongoose';
import { userModel } from './UserModel';
import IUserModel from './IUserModel';

export  default class UserRepository {
    public static genrateObjectId() {
        return String(mongoose.Types.ObjectId());
    }

    public findOne ( query ): mongoose.DocumentQuery<IUserModel, IUserModel, {}> {
        return userModel.findOne(query).lean();
    }

    public find(query, projection ?: any, options ?: any): any {
        return userModel.find(query, projection, options);
    }

    public create(data: any): Promise<IUserModel> {
        console.log( 'UserRepository :: create', data );
        const id = UserRepository.genrateObjectId();
        const model = new userModel({
            _id: id,
            ...data,

        });
        return model.save();

    }

    public count() {
        return userModel.countDocuments();
    }
}