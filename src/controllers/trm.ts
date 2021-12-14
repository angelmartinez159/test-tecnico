import { Model } from 'mongoose';
import trmModel from '../models/TRM';
import _ from 'lodash';
import { TRM } from '../types/TRM';

export default class trmControllers {
    private trmModel: Model<TRM>;

    constructor() {
        this.trmModel = trmModel;
    }

    public async create(data: any): Promise<TRM> {
        /**Custom parsing here */
        const newTRM = await this.trmModel.create(data);

        return newTRM;
    }

    public async findMany(findData: any, parameters: any): Promise<TRM[]> {
        const trms: Array<TRM> = await this.trmModel.find(
            { ...findData },
            {},
            { ...parameters }
        );

        return trms;
    }
}
