/**
 * @namespace Fl64_OAuth2_Back_Cli_Client_Create
 */

// MODULE'S VARS
const NS = 'Fl64_OAuth2_Back_Cli_Client_Create';
const OPT_NAME = 'name';
const OPT_REDIRECT_URI = 'redirectUri';

// MODULE'S FUNCTIONS
/**
 * Factory for a CLI command to register a new OAuth2 client.
 *
 * @param {typeof import('node:crypto')} crypto
 * @param {Fl64_OAuth2_Back_Defaults} DEF - Contains global CLI prefix configuration
 * @param {TeqFw_Core_Shared_Api_Logger} logger
 * @param {TeqFw_Core_Back_Api_Dto_Command.Factory} fCommand
 * @param {TeqFw_Core_Back_Api_Dto_Command_Option.Factory} fOpt
 * @param {TeqFw_Core_Back_App} app - Provides lifecycle management for the application
 * @param {TeqFw_Db_Back_RDb_IConnect} conn - Interface for managing database transactions
 * @param {Fl64_OAuth2_Back_Store_RDb_Repo_Client} repoClient
 *
 * @returns {TeqFw_Core_Back_Api_Dto_Command}
 */
export default function Factory(
    {
        'node:crypto': crypto,
        Fl64_OAuth2_Back_Defaults$: DEF,
        TeqFw_Core_Shared_Api_Logger$$: logger,
        'TeqFw_Core_Back_Api_Dto_Command.Factory$': fCommand,
        'TeqFw_Core_Back_Api_Dto_Command_Option.Factory$': fOpt,
        TeqFw_Core_Back_App$: app,
        TeqFw_Db_Back_RDb_IConnect$: conn,
        Fl64_OAuth2_Back_Store_RDb_Repo_Client$: repoClient,
    }
) {
    // VARS
    const {randomUUID} = crypto;


    // FUNCS
    /**
     * Handles the creation of a new OAuth2 client.
     *
     * @param {Object} opts - Command-line options provided by the user
     * @returns {Promise<void>}
     */
    async function action(opts) {
        const name = opts[OPT_NAME];
        const redirectUri = opts[OPT_REDIRECT_URI];

        if (name && redirectUri) {
            logger.info(`Creating new OAuth2 client '${name}'...`);

            const dto = repoClient.createDto();
            dto.client_id = randomUUID();
            dto.client_secret = randomUUID();
            dto.name = name;
            dto.redirect_uri = redirectUri;

            const trx = await conn.startTransaction();
            try {
                const {primaryKey: key} = await repoClient.createOne({trx, dto});
                const {record: created} = await repoClient.readOne({trx, key});
                await trx.commit();
                logger.info(`\n\nClient created successfully: ID='${created.client_id}', SECRET='${created.client_secret}'.\n\n`);
            } catch (error) {
                await trx.rollback();
                logger.error(`Error creating client: ${error.message}`);
            }
        } else {
            logger.error('Both name and redirectUri must be provided.');
        }

        await app.stop();
    }

    Object.defineProperty(action, 'namespace', {value: NS});

    const res = fCommand.create();
    res.realm = DEF.CLI_PREFIX;
    res.name = 'client-create';
    res.desc = 'Create a new OAuth2 client with a generated clientId and clientSecret.';
    res.action = action;

    // Define the --name option
    const optName = fOpt.create();
    optName.flags = `-n, --${OPT_NAME} <name>`;
    optName.description = 'The human-readable name for the OAuth2 client';
    res.opts.push(optName);

    // Define the --redirectUri option
    const optRedirectUri = fOpt.create();
    optRedirectUri.flags = `-r, --${OPT_REDIRECT_URI} <redirectUri>`;
    optRedirectUri.description = 'The redirect URI for the OAuth2 client';
    res.opts.push(optRedirectUri);

    return res;
}
