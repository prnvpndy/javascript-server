import * as mongoose from "mongoose";
import { DocumentQuery, Query } from "mongoose";
import IVersionableDocument from './IVersionableDocument';

export default class VersioningRepository<D extends mongoose.Document, M extends mongoose.Model<D>>
{

      public static generateObjectId() {
            return String(mongoose.Types.ObjectId());
      }

      private model: M;
      constructor(model) {
            this.model = model;
      }

      public async create(options: any): Promise<D> {
            console.log("VersioningRepository :: create ", options);
            const id = VersioningRepository.generateObjectId();
            const model = new this.model({
                  ...options,
                  _id: id,
                  originalId: id,
                  createdAt: Date.now(),
                  createdBy: id
            });
            return await model.save();
      }

      public count(query: any): Query<number> {
            const finalQuery = { deleteAt: null, ...query };
            return this.model.countDocuments(finalQuery);
      }

      public getAll(query: any = {}, projection: any = {}, options: any = {}): DocumentQuery<D[], D> {
            const finalQuery = { deleteAt: null, ...query };
            return this.model.find(finalQuery, projection, options);
      }

      public findOne(query: any): mongoose.DocumentQuery<D, D> {
            const finalQuery = { deleteAt: null, ...query };
            return this.model.findOne(finalQuery);
      }

      public invalidate(id: any, prev: any): DocumentQuery<D, D> {
            const updateToData = {
                  deletedAt: Date.now(),
            }
            return this.model.updateOne({ _id: id, deletedAt: undefined }, updateToData);
      }

      public async update(originalId: string, restData: any): Promise<D> {
            const prev = await this.findOne({ originalId, deletedAt: undefined });
            console.log('value of prev ', prev);
            const originalData = prev;
            const id1 = originalData._id;
            await this.invalidate(id1, prev);

            console.log('values of original data', originalData);

            const newData = Object.assign(JSON.parse(JSON.stringify(originalData)), restData);
            newData._id = VersioningRepository.generateObjectId();
            console.log('new data', newData);
            delete newData.deletedAt;
            delete newData.deletedBy;
            const model = new this.model(newData);
            return model.save();
      }
      

      public async delete(id: string, remover: string) {

            let originalData;

            await this.findOne({ id: id, deletedAt: null })
                  .then((data) => {
                        if (data === null) {
                              throw '';
                        }

                        originalData = data;
                        const oldId = originalData._id;

                        const modelDelete = {
                              deletedAt: Date.now(),
                              deletedBy: remover,
                        };

                        this.model.updateOne({ _id: oldId }, modelDelete)
                              .then((res) => {
                                    if (res === null) {
                                          throw '';
                                    }
                              });

                  });
      }
}
