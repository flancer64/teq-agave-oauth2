import {configDto, dbConnect as dbConnectFw, RDBMS} from '@teqfw/test';
import {join} from 'node:path';
import {existsSync} from 'node:fs';

// import 'dotenv/config';

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbConnect(container) {
    /** @type {TeqFw_Db_Back_RDb_Connect} */
    const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
    // Set up DB connection for the Object Container
    await dbConnectFw(RDBMS.SQLITE_BETTER, conn);
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbDisconnect(container) {
    try {
        /** @type {TeqFw_Db_Back_RDb_Connect} */
        const conn = await container.get('TeqFw_Db_Back_RDb_IConnect$');
        await conn.disconnect();
    } catch (e) {
        debugger
    }
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<{token: {id:number}}>}
 */
export async function dbCreateFkEntities(container) {
    // Mock schemas for testing
    const schemaToken = {
        createDto: (dto) => ({id: dto.id, name: dto.name}),
        getAttributes: () => ({ID: 'id', NAME: 'name'}),
        getEntityName: () => '/test/token',
        getPrimaryKey: () => ['id'],
    };
    /** @type {TeqFw_Db_Back_App_Crud} */
    const crud = await container.get('TeqFw_Db_Back_App_Crud$');

    // Create an app user
    await dbConnect(container);
    // token
    const token = {id: undefined, name: 'Test Token'};
    const {primaryKey: pkToken} = await crud.createOne({schema: schemaToken, dto: token});
    token.id = pkToken.id;
    //
    await dbDisconnect(container);
    return {token};
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function dbReset(container) {
    // FUNCS
    /**
     * Get the path to the test data directory.
     * @param {string} root - The root path of the project.
     * @returns {string} The resolved path to the test data directory.
     */
    function getTestDataPath(root) {
        const pathInNodeModules = join(root, 'node_modules', '@flancer64', 'teq-agave-oauth2', 'test', 'data');
        const pathInRoot = join(root, 'test', 'data');

        return existsSync(pathInNodeModules) ? pathInNodeModules : pathInRoot;
    }

    // MAIN
    try {
        /** @type {TeqFw_Core_Back_Config} */
        const config = await container.get('TeqFw_Core_Back_Config$');
        // Initialize database structure using test DEM

        /** @type {{action: TeqFw_Db_Back_Cli_Init.action}} */
        const {action} = await container.get('TeqFw_Db_Back_Cli_Init$');
        const testRoot = getTestDataPath(config.getPathToRoot());
        const testDems = {
            test: testRoot,
        };
        await dbConnect(container);
        await action({testDems, testMapRoot: testRoot});
        await dbDisconnect(container);
    } catch (e) {
        debugger
    }
}

/**
 * @param {TeqFw_Di_Api_Container} container
 * @return {Promise<void>}
 */
export async function initConfig(container) {
    // Initialize environment configuration
    /** @type {TeqFw_Core_Back_Config} */
    const config = await container.get('TeqFw_Core_Back_Config$');
    config.init(configDto.pathToRoot, '0.0.0');

    // Set up console transport for the logger
    /** @type {TeqFw_Core_Shared_Logger_Base} */
    const base = await container.get('TeqFw_Core_Shared_Logger_Base$');
    /** @type {TeqFw_Core_Shared_Api_Logger_Transport} */
    const transport = await container.get('TeqFw_Core_Shared_Api_Logger_Transport$');
    base.setTransport(transport);
}
