import * as supertest from 'supertest';
import { expect } from 'chai';

import App from '../../../../../src/App';

describe('Testing orders v1', () => {
    let request: supertest.SuperTest<supertest.Test>;

    before((done) => {
        App.build().then((api) => {
            request = supertest(api);
            done();
        })
    })

    describe('POST /api/v1/orders', () => {
        it('should fail to create an order without customerName', done => {
            request
                .post('/api/v1/orders')
                .send({
                    'orderId': 1,
                    'customerAddress': 'Steindamm 80',
                    'itemName': 'Macbook',
                    'price': 1700,
                    'currency': 'BRL'
                })
                .expect(500)
                .end((err, res) => {
                    expect(res.body).to.have.ownProperty('errors')
                    done(err);
                });
        });

        it('should create an order #1', done => {
            request
                .post('/api/v1/orders')
                .send({
                    'orderId': 1,
                    'customerName': 'Peter Lustig',
                    'customerAddress': 'Steindamm 80',
                    'itemName': 'Macbook',
                    'price': 1700,
                    'currency': 'BRL'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.nested.include({
                        orderId: 1
                    })

                    done(err);
                });
        });

        it('should create an order #2', done => {
            request
                .post('/api/v1/orders')
                .send({
                    'orderId': 2,
                    'customerName': 'John Smith',
                    'customerAddress': 'Reeperbahn 153',
                    'itemName': 'Macbook',
                    'price': 1700,
                    'currency': 'BRL'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.nested.include({
                        orderId: 2
                    })

                    done(err);
                });
        });

        it('should create an order #3', done => {
            request
                .post('/api/v1/orders')
                .send({
                    'orderId': 3,
                    'customerName': 'Ted Justice',
                    'customerAddress': 'Lagerstrasse 11',
                    'itemName': 'Book',
                    'price': 20,
                    'currency': 'BRL'
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.nested.include({
                        orderId: 3
                    })

                    done(err);
                });
        });
    });

    describe('PUT /api/v1/orders', () => {
        it('should update the order #1', done => {
            request
                .put('/api/v1/orders/1')
                .send({
                    'price': 2500
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.nested.include({
                        orderId: 1,
                        price: 2500
                    })

                    done(err);
                });
        });

        it('should fail to update an order that doesn\'t exist', done => {
            request
                .put('/api/v1/orders/99')
                .send({
                    'price': 2500
                })
                .expect(500)
                .end(done);
        });
    });

    describe('GET /api/v1/orders', () => {
        it('should return all orders', done => {
            request
                .get('/api/v1/orders')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.have.lengthOf(3);
                    done(err);
                });
        });

        it('should fail to filter orders with not implemented param', done => {
            request
                .get('/api/v1/orders?itemName=Book')
                .expect(400)
                .expect('Content-Type', /json/)
                .end(done);
        });

        it('should return all orders matching address', done => {
            request
                .get('/api/v1/orders?customerAddress=Lagerstrasse 11')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]).to.nested.include({
                        orderId: 3
                    })
                    done(err);
                });
        });

        it('should return all orders matching customer name', done => {
            request
                .get('/api/v1/orders?customerName=John Smith')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.have.lengthOf(1);
                    expect(res.body[0]).to.nested.include({
                        orderId: 2
                    })
                    done(err);
                });
        });
    });

    describe('GET /api/v1/orders/mostOrderedItems', () => {
        it('should get the list of the most ordered items', done => {
            request
                .get('/api/v1/orders/mostOrderedItems')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.have.lengthOf(2);

                    expect(res.body).to.deep.equal([
                        { itemName: 'Macbook', count: 2 },
                        { itemName: 'Book', count: 1 }
                    ]);

                    done(err);
                });
        });
    });

    describe('DELETE /api/v1/orders/1', () => {
        it('should delete the order #1', done => {
            request
                .delete('/api/v1/orders/1')
                .expect(200)
                .expect('Content-Type', /json/)
                .end((err, res) => {
                    expect(res.body).to.nested.include({
                        orderId: 1,
                        price: 2500
                    })

                    done(err);
                });
        });

        it('should fail to delete an order that doesn\'t exist', done => {
            request
                .delete('/api/v1/orders/99')
                .expect(500)
                .end(done);
        });
    });
});