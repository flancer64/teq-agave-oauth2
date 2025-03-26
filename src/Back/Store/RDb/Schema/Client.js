/**
 * Persistent DTO with metadata for the RDB entity: OAuth2 Client.
 * @namespace Fl64_OAuth2_Back_Store_RDb_Schema_Client
 */

// MODULE'S VARS

/**
 * Path to the entity in the plugin's DEM.
 *
 * @type {string}
 */
const ENTITY = '/fl64/oauth2/client';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_OAuth2_Back_Store_RDb_Schema_Client
 */
const ATTR = {
    CLIENT_ID: 'client_id',
    CLIENT_SECRET: 'client_secret',
    DATE_CREATED: 'date_created',
    ID: 'id',
    NAME: 'name',
    REDIRECT_URI: 'redirect_uri',
    STATUS: 'status',
};
Object.freeze(ATTR);

// MODULE'S CLASSES

/**
 * DTO class representing the persistent structure of the OAuth2 Client entity.
 * @memberOf Fl64_OAuth2_Back_Store_RDb_Schema_Client
 */
class Dto {
    /**
     * Unique identifier for the client, used during authorization.
     *
     * @type {string}
     */
    client_id;

    /**
     * Secret key assigned to the client for secure communication.
     *
     * @type {string}
     */
    client_secret;

    /**
     * Date and time when the client was registered.
     *
     * @type {Date}
     */
    date_created;

    /**
     * Internal numeric identifier for the client.
     *
     * @type {number}
     */
    id;

    /**
     * Human-readable name of the client (e.g., 'My App').
     *
     * @type {string}
     */
    name;

    /**
     * Authorized redirect URI for the client.
     *
     * @type {string}
     */
    redirect_uri;

    /**
     * Status of the client registration.
     *
     * @type {string}
     * @see Fl64_OAuth2_Shared_Enum_Client_Status
     */
    status;
}

/**
 * Implements metadata and utility methods for the OAuth2 Client entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Fl64_OAuth2_Back_Store_RDb_Schema_Client {
    /**
     * Constructor for the OAuth2 Client persistent DTO class.
     *
     * @param {Fl64_OAuth2_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast
     * @param {typeof Fl64_OAuth2_Shared_Enum_Client_Status} STATUS
     */
    constructor(
        {
            Fl64_OAuth2_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast,
            Fl64_OAuth2_Shared_Enum_Client_Status$: STATUS,
        }
    ) {
        // INSTANCE METHODS

        /**
         * @param {Fl64_OAuth2_Back_Store_RDb_Schema_Client.Dto|Object} [data]
         * @returns {Fl64_OAuth2_Back_Store_RDb_Schema_Client.Dto}
         */
        this.createDto = function (data) {
            const res = new Dto();
            res.status = STATUS.ACTIVE;
            if (data) {
                res.client_id = cast.string(data.client_id);
                res.client_secret = cast.string(data.client_secret);
                res.date_created = cast.date(data.date_created);
                res.id = cast.int(data.id);
                res.name = cast.string(data.name);
                res.redirect_uri = cast.string(data.redirect_uri);
                res.status = data.status ? cast.enum(data.status, STATUS) : res.status;
            }
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         *
         * @returns {typeof Fl64_OAuth2_Back_Store_RDb_Schema_Client.ATTR}
         */
        this.getAttributes = () => ATTR;

        /**
         * Returns the entity's path in the DEM.
         *
         * @returns {string}
         */
        this.getEntityName = () => `${DEF.NAME}${ENTITY}`;

        /**
         * Returns the primary key attributes for the entity.
         *
         * @returns {Array<string>}
         */
        this.getPrimaryKey = () => [ATTR.ID];
    }
}
