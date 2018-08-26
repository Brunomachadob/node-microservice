import { Router, Request, Response, NextFunction } from 'express';
import * as winston from 'winston';

import { filterProperties, validateOnlyParams } from '../../../utils/ObjectUtils';

import Customer from './CustomerModel';

class CustomerController {
    router: Router

    constructor() {
        this.router = Router();

        this.router.get('/', this.getCustomers);
        this.router.post('/', this.createCustomer);
        this.router.put('/:exampleId', this.updateCustomer);
        this.router.delete('/:exampleId', this.deleteCustomer);
    }

    public async getCustomers(req: Request, res: Response, next: NextFunction) {
        try {
            let possibleFilters = ['name'];

            if (!validateOnlyParams(req.query, possibleFilters)) {
                return res.status(400).json({ message: 'Invalid filters, please, use only ' + possibleFilters.join(' and ') })
            }

            let query = filterProperties(req.query, possibleFilters);

            let customers = await Customer.find(query);

            res.json(customers);
        } catch (err) {
            next(err)
        }
    }

    public async createCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            let newCustomer = await new Customer(req.body).save();

            res.json(newCustomer.toJSON());
        } catch (err) {
            next(err)
        }
    }

    public async updateCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ message: 'id param is required' })
            }
            
            let newCustomer = await Customer.findOneAndUpdate({
                id: req.params.id
            }, req.body, { new: true })

            res.json(newCustomer.toJSON());
        } catch (err) {
            next(err)
        }
    }

    public async deleteCustomer(req: Request, res: Response, next: NextFunction) {
        try {
            if (!req.params.id) {
                return res.status(400).json({ message: 'id param is required' })
            }
            
            let deletedCustomer = await Customer.findOneAndRemove({
                id: req.params.id
            }, req.body);

            res.json(deletedCustomer.toJSON());
        } catch (err) {
            next(err)
        }
    }
}

export default new CustomerController().router;