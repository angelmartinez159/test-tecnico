import { Model } from 'mongoose';
import trmModel from '../models/TRM';
import _ from 'lodash';
import { TRM } from '../types/TRM';

export default class trmControllers {
    private trmModel: Model<TRM>;

    constructor() {
        this.trmModel = trmModel;
    }

    public get model(): Model<TRM> {
        return this.trmModel;
    }

    public async createOne(data: any): Promise<TRM> {
        /**Custom parsing here */
        const newTRM = await this.trmModel.create(data);

        return newTRM;
    }

    public async insert(data: any): Promise<Array<TRM>> {
        if (_.isArray(data)) {
            /** Parse and create one by one */
            const insertMany = await Promise.all(
                data.map(async (item: any) => {
                    const created = await this.createOne(item);
                    return created;
                })
            ).then((r) => r);

            return insertMany;
        } else {
            /** Parse and create just one */
            const insertOne = await this.createOne(data);
            return [insertOne];
        }
    }

    public async findMany(findData: any, parameters: any): Promise<TRM[]> {
        const trms: Array<TRM> = await this.trmModel.find(
            { ...findData },
            {},
            { ...parameters }
        );

        return trms;
    }

    public async findOne(findData: any, parameters: any): Promise<TRM> {
        const trms: Array<TRM> = await this.trmModel.find(
            { ...findData },
            {},
            { ...parameters }
        );

        return trms[0];
    }
}
