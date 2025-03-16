/**
 * Dispatcher for handling HTTP requests.
 */
export default class Fl64_OAuth2_Back_Web_Handler_A_Token {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {typeof import('node:http2')} http2
     * @param {Fl64_OAuth2_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
     * @param {Fl64_OAuth2_Back_Helper_Web} helpWeb
     * @param {Fl64_Otp_Back_Mod_Token} modToken - OTP token model to manage OTP tokens
     * @param {Fl64_OAuth2_Back_Api_Adapter} adapter
     * @param {Fl64_OAuth2_Back_Store_RDb_Repo_Client} repoClient
     * @param {Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token} repoClientToken
     * @param {typeof Fl64_Tmpl_Back_Enum_Type} TMPL
     * @param {typeof Fl64_OAuth2_Back_Enum_Token_Type} TOKEN
     */
    constructor(
        {
            'node:http2': http2,
            Fl64_OAuth2_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Db_Back_App_TrxWrapper$: trxWrapper,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl64_Tmpl_Back_Service_Render$: tmplRender,
            Fl64_OAuth2_Back_Helper_Web$: helpWeb,
            Fl64_Otp_Back_Mod_Token$: modToken,
            Fl64_OAuth2_Back_Api_Adapter$: adapter,
            Fl64_OAuth2_Back_Store_RDb_Repo_Client$: repoClient,
            Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token$: repoClientToken,
            'Fl64_Tmpl_Back_Enum_Type.default': TMPL,
            'Fl64_OAuth2_Back_Enum_Token_Type.default': TOKEN,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CACHE_CONTROL,
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_METHOD_GET,
            HTTP2_METHOD_POST,
        } = http2.constants;

        const A_CLIENT = repoClient.getSchema().getAttributes();
        const A_CLIENT_TOKEN = repoClientToken.getSchema().getAttributes();

        // MAIN
        /**
         * Handles the provider selection action.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
         *
         * @return {Promise<void>}
         */
        this.run = async function (req, res) {

            // FUNCS
            /**
             * @param {TokenRequestParams} params
             * @returns {boolean} `true` if all required parameters are present, otherwise `false`.
             */
            function validateParams(params) {
                const {grant_type, client_id, client_secret, code, redirect_uri} = params;
                if (!grant_type || grant_type !== 'authorization_code') {
                    return false; // Invalid or missing grant_type
                } else if (!client_id || !client_secret || !code || !redirect_uri) {
                    return false;
                }
                return true;
            }


            // MAIN
            if (req.method === HTTP2_METHOD_GET) {
                debugger
            } else if (req.method === HTTP2_METHOD_POST) {
                /** @type {TokenRequestParams} */
                const params = await helpWeb.parsePostedData(req);
                if (!validateParams(params)) {
                    const body = (params?.grant_type === 'authorization_code')
                        ? 'Missing required parameters'
                        : 'Invalid or missing grant_type';
                    respond.code400_BadRequest({res, body});
                } else {
                    await trxWrapper.execute(null, async (trx) => {
                        // get corresponded OTP token
                        const {dto: dtoToken} = await modToken.read({trx, token: params.code});
                        if (dtoToken && (dtoToken.type === TOKEN.AUTHORIZATION)) {
                            const {record: dtoRef} = await repoClientToken.readOne({trx, key: dtoToken.id});
                            const {record: client} = await repoClient.readOne({trx, key: dtoRef?.client_ref});
                            if (
                                client
                                && (client.client_id === params.client_id)
                                && (client.client_secret === params.client_secret)
                            ) {
                                // generate an access token
                                const lifetime = 7 * 24 * 3600; // in seconds
                                const {token, tokenId} = await modToken.create({
                                    trx,
                                    userId: dtoToken.user_ref,
                                    type: TOKEN.ACCESS,
                                    lifetime,
                                });
                                const dtoRefAccess = repoClientToken.createDto();
                                dtoRefAccess.client_ref = client.id;
                                dtoRefAccess.token_ref = tokenId;
                                await repoClientToken.createOne({trx, dto: dtoRefAccess});
                                // remove used authorization token
                                await modToken.delete({trx, id: dtoToken.id});
                                const body = JSON.stringify({
                                    access_token: token,
                                    // refresh_token: created.refreshToken,
                                    token_type: 'Bearer',
                                    expires_in: lifetime
                                });
                                const headers = {
                                    [HTTP2_HEADER_CONTENT_TYPE]: 'application/json',
                                    [HTTP2_HEADER_CACHE_CONTROL]: 'no-store',
                                    'pragma': 'no-cache',
                                };
                                respond.code200_Ok({res, headers, body});
                            } else {
                                respond.code401_Unauthorized({res, body: 'Invalid client credentials'});
                            }
                        } else {
                            respond.code400_BadRequest({res, body: 'Invalid or expired authorization code'});
                        }
                    });
                }
            }
        };
    }
}


/**
 * @typedef {Object} TokenRequestParams
 * @property {string} grant_type - The type of the authorization grant being used (e.g., "authorization_code").
 * @property {string} client_id - The unique identifier of the OAuth client.
 * @property {string} client_secret - The secret associated with the client identifier.
 * @property {string} code - The authorization code received after user consent.
 * @property {string} redirect_uri - The URI to which the user will be redirected after the authorization process.
 */