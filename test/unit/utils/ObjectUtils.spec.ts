import { expect } from 'chai';

import { filterProperties, validateOnlyParams } from '../../../src/utils/ObjectUtils'

describe('ObjectUtils Tests', () => {


    describe('filterProperties', () => {
        it('Empty objects should remain empty', () => {
            let result = filterProperties({}, ['test']);
            expect(result).to.be.empty
        });

        it('Ojects with more props than needed should be filtered', () => {
            let result:any = filterProperties({
                propA: 1,
                propB: 2
            }, ['propA']);
            
            expect(Object.keys(result)).to.have.lengthOf(1);
            expect(result.propA).to.be.eql(1)
        });
    });

    describe('validateOnlyParams', () => {
        it('Empty objects should return true', () => {
            let result = validateOnlyParams({}, ['test']);
            expect(result).to.be.true
        });

        it('Ojects with more props than needed should return false', () => {
            let result:any = validateOnlyParams({
                propA: 1,
                propB: 2
            }, ['propA']);
            expect(result).to.be.false
        });

        it('Ojects with only available props should return true', () => {
            let result:any = validateOnlyParams({
                propA: 1,
                propB: 2
            }, ['propA', 'propB']);
            expect(result).to.be.true
        });
    });
});