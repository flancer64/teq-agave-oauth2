/**
 * Persistent DTO with metadata for the RDB entity: Client Token.
 * @namespace Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token
 */

/**
 * Entity path for the schema.
 */
const ENTITY = '/fl64/oauth2/client/token';

/**
 * Attribute mappings for the entity.
 * @memberOf Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token
 */
const ATTR = {
    CLIENT_REF: 'client_ref',
    TOKEN_REF: 'token_ref',
};
Object.freeze(ATTR);

/**
 * DTO class representing the persistent structure of the Client Token entity.
 * @memberOf Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token
 */
class Dto {
    /** @type {number} */
    client_ref;

    /** @type {number} */
    token_ref;
}

/**
 * Implements metadata and utility methods for the Client Token entity.
 * @implements TeqFw_Db_Back_Api_RDb_Schema_Object
 */
export default class Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token {
    /**
     * @param {Fl64_OAuth2_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Util_Cast} cast - Utility for type casting.
     */
    constructor(
        {
            Fl64_OAuth2_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Util_Cast$: cast
        }
    ) {
        /**
         * Creates a DTO from input data, ensuring proper type casting.
         * @param {Object} data - Input data to be transformed into the DTO.
         * @returns {Dto} - The created DTO instance.
         */
        this.createDto = function (data) {
            const res = new Dto();
            if (data) {
                res.client_ref = cast.int(data.client_ref);
                res.token_ref = cast.int(data.token_ref);
            }
            return res;
        };

        /**
         * Returns the attribute map for the entity.
         * @returns {typeof Fl64_OAuth2_Back_Store_RDb_Schema_Client_Token.ATTR}
         */
        this.getAttributes = () => ATTR;

        /**
         * Returns the entity's path in the DEM.
         * @returns {string} - Full entity name.
         */
        this.getEntityName = () => `${DEF.NAME}${ENTITY}`;

        /**
         * Returns the primary key attributes for the entity.
         * @returns {Array<string>} - Primary key attributes.
         */
        this.getPrimaryKey = () => [ATTR.TOKEN_REF];
    }
}
