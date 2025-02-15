import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbDisconnect, dbReset, initConfig} from '../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// GET OBJECTS FROM CONTAINER
/** @type {Fl64_OAuth2_Back_Store_RDb_Repo_Client} */
const repoClient = await container.get('Fl64_OAuth2_Back_Store_RDb_Repo_Client$');
const ATTR = repoClient.getSchema().getAttributes();

// MOCK DATA
const CLIENT_ID = 'test-client';
const CLIENT_SECRET = 'test-secret';
const DATE_CREATED = new Date();
const NAME = 'Test Client';
const REDIRECT_URI = 'https://example.com/callback';
const STATUS = 'ACTIVE';
let CLIENT_DB_ID;

describe('Fl64_OAuth2_Back_Store_RDb_Repo_Client', () => {
    before(async () => {
        await dbReset(container);
        await dbConnect(container);
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new client entry', async () => {
        /** @type {Fl64_OAuth2_Back_Store_RDb_Schema_Client.Dto} */
        const dto = repoClient.createDto();
        dto.client_id = CLIENT_ID;
        dto.client_secret = CLIENT_SECRET;
        dto.date_created = DATE_CREATED;
        dto.name = NAME;
        dto.redirect_uri = REDIRECT_URI;
        dto.status = STATUS;

        const {primaryKey} = await repoClient.createOne({dto});
        CLIENT_DB_ID = primaryKey[ATTR.ID];
        assert.ok(primaryKey, 'Client should be created');
    });

    it('should read an existing client by ID', async () => {
        const {record} = await repoClient.readOne({key: {id: CLIENT_DB_ID}});

        assert.ok(record, 'Client should exist');
        assert.strictEqual(record.id, CLIENT_DB_ID, 'Client ID should match');
        assert.strictEqual(record.client_id, CLIENT_ID, 'Client client_id should match');
    });

    it('should list all clients', async () => {
        const clients = await repoClient.readMany({});

        assert.ok(clients.records.length > 0, 'There should be at least one client');
    });

    it('should update an existing client', async () => {
        const {record} = await repoClient.readOne({key: {id: CLIENT_DB_ID}});
        record.name = 'Updated Client';

        const {updatedCount} = await repoClient.updateOne({key: {id: CLIENT_DB_ID}, updates: {name: 'Updated Client'}});

        assert.strictEqual(updatedCount, 1, 'One client should be updated');
        const {record: updated} = await repoClient.readOne({key: {id: CLIENT_DB_ID}});
        assert.strictEqual(updated.name, 'Updated Client', 'Client name should be updated');
    });

    it('should delete an existing client', async () => {
        const {deletedCount} = await repoClient.deleteOne({key: {id: CLIENT_DB_ID}});

        assert.strictEqual(deletedCount, 1, 'One client should be deleted');
    });
});
