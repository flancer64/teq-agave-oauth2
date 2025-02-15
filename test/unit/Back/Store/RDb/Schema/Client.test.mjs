import {container} from '@teqfw/test';
import assert from 'assert';

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_OAuth2_Back_Defaults} */
const DEF = await container.get('Fl64_OAuth2_Back_Defaults$');
/** @type {Fl64_OAuth2_Back_Store_RDb_Schema_Client} */
const schema = await container.get('Fl64_OAuth2_Back_Store_RDb_Schema_Client$');

describe('Fl64_OAuth2_Back_Store_RDb_Schema_Client', () => {
    const ATTR = schema.getAttributes();
    const expectedProperties = [
        'client_id',
        'client_secret',
        'date_created',
        'id',
        'name',
        'redirect_uri',
        'status',
    ];

    it('should create an RDB DTO with only the expected properties', () => {
        const dto = schema.createDto();
        const dtoKeys = Object.keys(dto).sort();

        // Verify that the DTO has only the expected properties
        assert.deepStrictEqual(dtoKeys, expectedProperties.sort(), 'DTO should contain only the expected properties');

        // Check that each property is initially undefined (except status, which has a default value)
        expectedProperties.forEach(prop => {
            if (prop !== 'status') {
                assert.strictEqual(dto[prop], undefined, `Property ${prop} should initially be undefined`);
            }
        });

        // Check default value for status
        assert.strictEqual(dto.status, 'ACTIVE', 'Default status should be ACTIVE');
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
        assert.equal(schema.getEntityName(), `${DEF.NAME}/fl64/oauth2/client`, 'Entity name should match the expected path');
        assert.deepStrictEqual(schema.getPrimaryKey(), [ATTR.ID], 'Primary key should be set to ID');
    });

    it('should correctly cast data when creating a DTO', () => {
        const inputData = {
            client_id: 'my-client',
            client_secret: 'my-secret',
            date_created: '2024-02-14T12:00:00Z',
            id: 100,
            name: 'Test Client',
            redirect_uri: 'https://example.com/callback',
            status: 'INACTIVE',
        };

        const dto = schema.createDto(inputData);

        assert.strictEqual(dto.client_id, 'my-client', 'client_id should match input');
        assert.strictEqual(dto.client_secret, 'my-secret', 'client_secret should match input');
        assert.strictEqual(dto.date_created instanceof Date, true, 'date_created should be a Date object');
        assert.strictEqual(dto.id, 100, 'id should match input');
        assert.strictEqual(dto.name, 'Test Client', 'name should match input');
        assert.strictEqual(dto.redirect_uri, 'https://example.com/callback', 'redirect_uri should match input');
        assert.strictEqual(dto.status, 'INACTIVE', 'status should be correctly casted');
    });
});
