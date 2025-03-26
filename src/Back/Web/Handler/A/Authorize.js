/**
 * @typedef {Object} AuthorizeRequestParams
 * @property {string} clientId - The unique identifier of the OAuth client.
 * @property {string} redirectUri - The URI where the user should be redirected after authorization.
 * @property {string} responseType - The type of response expected by the client (e.g., "code").
 * @property {string} scope - The scope of the requested permissions.
 * @property {string} state - A random string used to prevent CSRF attacks.
 */

/**
 * Dispatcher for handling HTTP requests.
 */
export default class Fl64_OAuth2_Back_Web_Handler_A_Authorize {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {typeof import('node:http2')} http2
     * @param {Fl64_OAuth2_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Db_Back_App_TrxWrapper} trxWrapper - Database transaction wrapper
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Fl64_Tmpl_Back_Service_Render} tmplRender
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
            Fl64_Otp_Back_Mod_Token$: modToken,
            Fl64_OAuth2_Back_Api_Adapter$: adapter,
            Fl64_OAuth2_Back_Store_RDb_Repo_Client$: repoClient,
            Fl64_OAuth2_Back_Store_RDb_Repo_Client_Token$: repoClientToken,
            Fl64_Tmpl_Back_Enum_Type$: TMPL,
            Fl64_OAuth2_Back_Enum_Token_Type$: TOKEN,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
            HTTP2_METHOD_GET,
        } = http2.constants;

        const A_CLIENT = repoClient.getSchema().getAttributes();

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
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
             * @param {AuthorizeRequestParams} params - Extracted OAuth 2.0 parameters.
             * @param {number} userId
             * @returns {Promise<void>}
             */
            async function respondAuthorizationPage(req, res, params, userId) {
                await trxWrapper.execute(null, async (trx) => {
                    // Get client information from DB
                    const key = {[A_CLIENT.CLIENT_ID]: params.clientId};
                    const {record} = await repoClient.readOne({trx, key});
                    if (!record) return respondFailure(req, res, params);
                    // generate a code for authorization
                    const {token, tokenId} = await modToken.create({trx, userId, type: TOKEN.AUTHORIZATION});
                    // save reference between client & token
                    const dto = repoClientToken.createDto();
                    dto.client_ref = record.id;
                    dto.token_ref = tokenId;
                    await repoClientToken.createOne({trx, dto});
                    // Prepare the view for mustache template
                    const {localeApp, localeUser} = await adapter.getLocales({req});
                    const view = {
                        clientName: record.name,
                        code: token,
                        redirectUri: params.redirectUri,
                        scopes: params.scope ? params.scope.split(' ') : [],
                        state: params.state,
                    };
                    const {content: body} = await tmplRender.perform({
                        pkg: DEF.NAME,
                        type: TMPL.WEB,
                        name: 'authorize/authorizeRequest.html',
                        view,
                        localeUser,
                        localeApp,
                        localePkg: DEF.LOCALE,
                    });

                    respond.code200_Ok({
                        res, body, headers: {
                            [HTTP2_HEADER_CONTENT_TYPE]: 'text/html'
                        }
                    });
                });

            }

            /**
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request
             * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res - HTTP response object
             * @param {AuthorizeRequestParams} params - Extracted OAuth 2.0 parameters.
             * @returns {Promise<void>}
             */
            async function respondFailure(req, res, params) {
                const {localeApp, localeUser} = await adapter.getLocales({req});
                const view = {
                    isMissingParams: !params.clientId || !params.redirectUri || !params.responseType || !params.state,
                    isInvalidResponseType: params.responseType && params.responseType !== 'code',
                    isUnknownError: false,
                };

                // If no specific error is detected, mark as unknown error
                if (!view.isMissingParams && !view.isInvalidResponseType) {
                    view.isUnknownError = true;
                }

                const {content: body} = await tmplRender.perform({
                    pkg: DEF.NAME,
                    type: TMPL.WEB,
                    name: 'authorize/failedRequest.html',
                    view,
                    localeUser,
                    localeApp,
                    localePkg: DEF.LOCALE,
                });
                respond.code400_BadRequest({
                    res, body, header: {
                        [HTTP2_HEADER_CONTENT_TYPE]: 'text/html'
                    }
                });
            }

            /**
             * Extracts OAuth 2.0 parameters from the incoming HTTP request.
             *
             * This method parses the query parameters from the request URL and returns them
             * as an object. These parameters are required for processing an OAuth 2.0 authorization request.
             *
             * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
             * @returns {AuthorizeRequestParams} Extracted OAuth 2.0 parameters.
             */
            function getParams(req) {
                // get parameters from URL
                const url = new URL(req.url, `https://${req.headers.host}`);
                const clientId = url.searchParams.get('client_id');
                const redirectUri = url.searchParams.get('redirect_uri');
                const responseType = url.searchParams.get('response_type');
                const scope = url.searchParams.get('scope');
                const state = url.searchParams.get('state');
                return {clientId, redirectUri, responseType, scope, state};
            }

            /**
             * Checks if the extracted OAuth 2.0 parameters are valid.
             *
             * @param {AuthorizeRequestParams} params - Extracted OAuth 2.0 parameters.
             * @returns {boolean} `true` if all required parameters are present, otherwise `false`.
             */
            function validateParams(params) {
                return !!(params.clientId && params.redirectUri && params.responseType === 'code' && params.state);
            }

            // MAIN
            if (req.method === HTTP2_METHOD_GET) {
                const params = getParams(req);
                if (!validateParams(params)) {
                    logger.info(`Received new authorization request with invalid parameters: ${JSON.stringify(params)}`);
                    await respondFailure(req, res, params);
                } else {
                    const {isAuthenticated, userId} = await adapter.getAuthStatus({req});
                    if (isAuthenticated) {
                        logger.info(`Received new authorization request for an authenticated user.`);
                        await respondAuthorizationPage(req, res, params, userId);
                    } else {
                        logger.info(`Received new authorization request for a non-authenticated user.`);
                        // The application should redirect the user to the same URL after authentication
                        adapter.forwardToAuthentication({req, res});
                    }
                }
            }

        };
    }
}
