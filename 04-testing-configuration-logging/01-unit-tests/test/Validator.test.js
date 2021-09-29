const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
  
    it('Validating one field with wrong type', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 10,
        }
      });
    
      const errorCaseType = validator.validate({ name: false });
    
      expect(errorCaseType, 'The number of errors is 1').to.have.length(1);
      expect(errorCaseType[0], 'The "name" field contains an error').to.have.property('field').and.to.be.equal('name');
      expect(errorCaseType[0], 'The value of the "name" field has an incorrect data type').to.have.property('error').and.to.be.equal('expect string, got boolean');
    
    });
    
    it('Validating one field with type "String"', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 3,
          max: 8,
        }
      });
      
      const errorCaseMinValue = validator.validate({ name: 'ab' });
      
      expect(errorCaseMinValue, 'The number of errors is 1').to.have.length(1);
      expect(errorCaseMinValue[0], 'The "name" field contains an error').to.have.property('field').and.to.be.equal('name');
      expect(errorCaseMinValue[0], 'The value of the "name" field is shorter than the minimum allowed value').to.have.property('error').and.to.be.equal('too short, expect 3, got 2');
      
      const errorCaseMaxValue = validator.validate({ name: 'abrakadabra' });
      
      expect(errorCaseMaxValue, 'The number of errors is 1').to.have.length(1);
      expect(errorCaseMaxValue[0], 'The "name" field contains an error').to.have.property('field').and.to.be.equal('name');
      expect(errorCaseMaxValue[0], 'The value of the "name" field is longer than the maximum allowed value').to.have.property('error').and.to.be.equal('too long, expect 8, got 11');
      
      const successCase = validator.validate({ name: 'kadabra' });
      
      expect(successCase, 'There are no errors').to.have.length(0);
    });
    
    it('Validating one field with type "Number"', () => {
      const validator = new Validator({
        penalties: {
          type: 'number',
          min: 4,
          max: 6,
        }
      });
      
      const errorCaseMinValue = validator.validate({ penalties: 1 });
      
      expect(errorCaseMinValue, 'The number of errors is 1').to.have.length(1);
      expect(errorCaseMinValue[0], 'The "penalties" field contains an error').to.have.property('field').and.to.be.equal('penalties');
      expect(errorCaseMinValue[0], 'The value of the "penalties" field is less than the minimum allowed value').to.have.property('error').and.to.be.equal('too little, expect 4, got 1');
      
      const errorCaseMaxValue = validator.validate({ penalties: 8 });
      
      expect(errorCaseMaxValue, 'The number of errors is 1').to.have.length(1);
      expect(errorCaseMaxValue[0], 'The "penalties" field contains an error').to.have.property('field').and.to.be.equal('penalties');
      expect(errorCaseMaxValue[0], 'The value of the "penalties" field is greater than the maximum allowed value').to.have.property('error').and.to.be.equal('too big, expect 6, got 8');
      
      const successCase = validator.validate({ penalties: 5 });
      
      expect(successCase, 'There are no errors').to.have.length(0);
    });
    
    it('Validating 4 fields', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 1,
          max: 5,
        },
        fullName: {
          type: 'string',
          min: 10,
          max: 20,
        },
        sex: {
          type: 'string',
          min: 8,
          max: 14,
        },
        penalties: {
          type: 'number',
          min: 2,
          max: 5,
        }
      });
      
      const testCase = validator.validate({
        name: false,
        fullName: 'Angelina Jolie',
        sex: 'Women',
        penalties: 7,
      });
      
      expect(testCase, 'The number of errors is 3').to.have.length(3);
      expect(testCase, 'The value of the "name" field has an incorrect data type').to.deep.include({ field: 'name', error: 'expect string, got boolean' });
      expect(testCase, 'The value of the "sex" field is shorter than the minimum allowed value').to.deep.include({ field: 'sex', error: 'too short, expect 8, got 5' });
      expect(testCase, 'The value of the "penalties" field is greater than the maximum allowed value').to.deep.include({ field: 'penalties', error: 'too big, expect 5, got 7' });
    });
  });
});
