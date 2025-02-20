import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_OAuth2_Back_Defaults} */
const DEF = await container.get('Fl64_OAuth2_Back_Defaults$');
/** @type {Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token} */
const schema = await container.get('Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token$');

describe('Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token', () => {
    const ATTR = schema.getAttributes();
    const expectedProperties = [
        'client_ref',
        'token_ref',
    ];

    it('should create an RDB DTO with only the expected properties', () => {
        const dto = schema.createDto({client_ref: 1, token_ref: 2});
        const dtoKeys = Object.keys(dto).sort();

        // Verify that the DTO has only the expected properties
        assert.deepStrictEqual(dtoKeys, expectedProperties.sort(), 'DTO should contain only the expected properties');

        // Check that each property is correctly set
        assert.strictEqual(dto.client_ref, 1, 'client_ref should be set correctly');
        assert.strictEqual(dto.token_ref, 2, 'token_ref should be set correctly');
    });

    it('ATTR should contain only the expected properties', () => {
        const attrKeys = Object.keys(ATTR).sort();
        const upperCaseExpectedProperties = expectedProperties.map(p => p.toUpperCase()).sort();

        // Check that ATTR has the expected properties in uppercase
        assert.deepStrictEqual(attrKeys, upperCaseExpectedProperties, 'ATTR should contain only the expected properties in uppercase format');

        // Verify that each uppercase property in ATTR maps correctly to its original property name
        expectedProperties.forEach(prop => {
            assert.strictEqual(ATTR[prop.toUpperCase()], prop, `ATTR.${prop.toUpperCase()} should map to ${prop}`);
        });
    });

    it('should have the correct ENTITY name and primary key', () => {
        assert.equal(schema.getEntityName(), `${DEF.NAME}/fl64/oauth2/client/token`, 'Entity name should match the expected path');
        assert.deepStrictEqual(schema.getPrimaryKey(), [ATTR.TOKEN_REF], 'Primary key should be set to client_ref, token_ref');
    });
});
