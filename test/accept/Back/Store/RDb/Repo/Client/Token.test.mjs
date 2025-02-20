import assert from 'assert';
import {createContainer} from '@teqfw/test';
import {dbConnect, dbCreateFkEntities, dbDisconnect, dbReset, initConfig} from '../../../../../common.mjs';

// SETUP CONTAINER
const container = await createContainer();
await initConfig(container);

// SETUP ENVIRONMENT
/** @type {Fl64_OAuth2_Back_Store_RDb_Repo_Client} */
const repoClient = await container.get('Fl64_OAuth2_Back_Store_RDb_Repo_Client$');
/** @type {Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token} */
const repoClientToken = await container.get('Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token$');
/** @type {typeof Fl64_OAuth2_Shared_Enum_Client_Status} */
const STATUS = await container.get('Fl64_OAuth2_Shared_Enum_Client_Status.default');

const ATTR_CLIENT = repoClient.getSchema().getAttributes();
const ATTR = repoClientToken.getSchema().getAttributes();

// TEST CONSTANTS
let CLIENT_REF;
let TOKEN_REF;

// Test Suite for Client Token Repository
describe('Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token', () => {
    before(async () => {
        await dbReset(container);
        const {token} = await dbCreateFkEntities(container);
        TOKEN_REF = token.id;
        await dbConnect(container);
        // create a client
        const dto = repoClient.createDto();
        dto.client_id = 'test_id';
        dto.client_secret = 'test_secret';
        dto.date_created = new Date();
        dto.name = 'test';
        dto.redirect_uri = 'redirect';
        dto.status = STATUS.ACTIVE;
        const {primaryKey} = await repoClient.createOne({dto});
        CLIENT_REF = primaryKey[ATTR_CLIENT.ID];
    });

    after(async () => {
        await dbDisconnect(container);
    });

    it('should create a new ClientToken reference', async () => {
        /** @type {Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token.Dto} */
        const dto = repoClientToken.createDto({
            client_ref: CLIENT_REF, token_ref: TOKEN_REF
        });

        const {primaryKey} = await repoClientToken.createOne({dto});
        assert.ok(primaryKey, 'Client Token should be created');
    });

    it('should read an existing ClientToken reference', async () => {
        const key = {
            [ATTR.CLIENT_REF]: CLIENT_REF,
            [ATTR.TOKEN_REF]: TOKEN_REF,
        };
        const {record} = await repoClientToken.readOne({key});

        assert.ok(record, 'Client Token should exist');
    });

    it('should list all ClientToken references', async () => {
        const tokens = await repoClientToken.readMany({});
        assert.ok(tokens.records.length > 0, 'There should be at least one Client Token');
    });


    it('should delete an existing ClientToken reference', async () => {
        const key = {
            [ATTR.CLIENT_REF]: CLIENT_REF,
            [ATTR.TOKEN_REF]: TOKEN_REF,
        };
        const {deletedCount} = await repoClientToken.deleteOne({key});

        assert.strictEqual(deletedCount, 1, 'One Client Token should be deleted');
    });
});
