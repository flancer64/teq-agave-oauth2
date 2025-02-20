import {constants as H2} from 'node:http2';

const {
    HTTP2_HEADER_AUTHORIZATION,
} = H2;

/**
 * @typedef {Object} AuthorizationResult
 * @property {boolean} isAuthorized - Whether the request is authorized.
 * @property {number|null} userId - The user ID if authorized, otherwise null.
 * @property {number|null} clientId - The client ID if authorized, otherwise null.
 * @property {Object|null} userInfo - The user information if authorized, otherwise null.
 */

/**
 * Manages OAuth2 authorization logic for the backend application.
 */
export default class Fl64_OAuth2_Back_Manager {
    /**
     * Creates an instance of the OAuth2 manager.
     * @param {Object} params - The initialization parameters.
     * @param {Fl64_OAuth2_Back_Defaults} params.Fl64_OAuth2_Back_Defaults$ - Default settings for the manager.
     * @param {TeqFw_Core_Shared_Api_Logger} params.TeqFw_Core_Shared_Api_Logger$$ - Logger instance.
     * @param {TeqFw_Db_Back_App_TrxWrapper} params.TeqFw_Db_Back_App_TrxWrapper$ - Database transaction wrapper.
     * @param {Fl64_Otp_Back_Mod_Token} modToken
     * @param {typeof Fl64_OAuth2_Back_Enum_Token_Type} TOKEN
     */
    constructor(
        {
            Fl64_OAuth2_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger, // Logger instance
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper, // Database transaction wrapper
            Fl64_Otp_Back_Mod_Token$: modToken,
            'Fl64_OAuth2_Back_Enum_Token_Type.default': TOKEN,
        }
    ) {
        // FUNCS

        /**
         * Extract the Bearer token from the HTTP request's Authorization header.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - The HTTP request object.
         * @returns {string|null} - The extracted Bearer token, or null if not found.
         */
        function extractBearerToken(req) {
            let res = null;
            const authHeader = req.headers[HTTP2_HEADER_AUTHORIZATION];
            if (authHeader && authHeader.startsWith('Bearer ')) {
                res = authHeader.slice(7); // Extract the token by removing the 'Bearer ' prefix.
            }
            return res;
        }

        // MAIN

        /**
         * Authorize the HTTP request and extract relevant user information.
         * Checks if the request is authorized and retrieves specified user data.
         *
         * @param {Object} params - The input parameters.
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} params.req - The HTTP request object.
         * @param {TeqFw_Db_Back_RDb_ITrans} [params.trx] - Optional database transaction.
         * @param {boolean} [params.getClientId=false] - Flag to include the client ID in the response.
         * @param {boolean} [params.getUserInfo=false] - Flag to include the full user information in the response.
         * @returns {Promise<AuthorizationResult>} - A promise that resolves to the authorization result.
         */
        this.authorize = async function ({req, trx, getClientId = false, getUserInfo = false}) {
            let isAuthorized = false, userId, clientId, userInfo;
            const token = extractBearerToken(req);

            // Validate the token using stored data and handle authorization process
            if (token) {
                await trxWrapper.execute(trx, async (trx) => {
                    const {dto} = await modToken.read({trx, token});
                    if (dto?.id && (dto.type === TOKEN.ACCESS)) {
                        isAuthorized = true;
                        userId = dto.user_ref;
                    }
                });
            }

            return {isAuthorized, userId, clientId, userInfo}; // Return the result
        };
    }
}
