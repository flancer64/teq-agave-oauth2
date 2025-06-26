/**
 * Dispatcher for handling HTTP requests in the plugin space.
 * @implements Fl32_Web_Back_Api_Handler
 */
export default class Fl64_OAuth2_Back_Web_Handler {
    /**
     * Initializes the handler with required dependencies.
     *
     * @param {typeof import('node:http2')} http2
     * @param {Fl64_OAuth2_Back_Defaults} DEF
     * @param {TeqFw_Core_Shared_Api_Logger} logger
     * @param {TeqFw_Web_Back_Help_Respond} respond
     * @param {Fl32_Web_Back_Dto_Handler_Info} dtoInfo
     * @param {typeof Fl32_Web_Back_Enum_Stage} STAGE
     * @param {Fl64_OAuth2_Back_Helper_Web} helpWeb
     * @param {Fl64_OAuth2_Back_Web_Handler_A_Authorize} aAuthorize
     * @param {Fl64_OAuth2_Back_Web_Handler_A_Token} aToken
     */
    constructor(
        {
            'node:http2': http2,
            Fl64_OAuth2_Back_Defaults$: DEF,
            TeqFw_Core_Shared_Api_Logger$$: logger,
            TeqFw_Web_Back_Help_Respond$: respond,
            Fl32_Web_Back_Dto_Handler_Info$: dtoInfo,
            Fl32_Web_Back_Enum_Stage$: STAGE,
            Fl64_OAuth2_Back_Helper_Web$: helpWeb,
            Fl64_OAuth2_Back_Web_Handler_A_Authorize$: aAuthorize,
            Fl64_OAuth2_Back_Web_Handler_A_Token$: aToken,
        }
    ) {
        // VARS
        const {
            HTTP2_METHOD_GET,
            HTTP2_METHOD_POST,
        } = http2.constants;

        const _info = dtoInfo.create();
        _info.name = this.constructor.name;
        _info.stage = STAGE.PROCESS;
        _info.before = ['Fl32_Cms_Back_Web_Handler_Template'];
        Object.freeze(_info);

        // FUNCS
        /**
         * Handles incoming HTTP requests and delegates processing to specific handlers.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req
         * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} res
         * @return {Promise<boolean>}
         */
        async function process(req, res) {
            try {
                const parts = helpWeb.getPathParts(req);
                const endpoint = parts[0];
                switch (endpoint) {
                    case DEF.SHARED.ROUTE_AUTHORIZE:
                        return aAuthorize.run(req, res);
                    case DEF.SHARED.ROUTE_TOKEN:
                        return aToken.run(req, res);
                }
            } catch (error) {
                logger.exception(error);
                respond.code500_InternalServerError({res, body: error.message});
                return true;
            }
        }

        /**
         * Provides the function to process requests.
         * @returns {Function}
         */
        this.getProcessor = () => process;

        /** @returns {Fl32_Web_Back_Dto_Handler_Info.Dto} */
        this.getRegistrationInfo = () => _info;

        this.handle = async function (req, res) {
            return process(req, res);
        };

        /**
         * Placeholder for initialization logic.
         */
        this.init = async function () { };

        /**
         * Checks if the request can be handled by this instance.
         *
         * @param {Object} options
         * @param {string} options.method
         * @param {Object} options.address
         * @returns {boolean}
         */
        this.canProcess = function ({method, address} = {}) {
            return (
                ((method === HTTP2_METHOD_GET) || (method === HTTP2_METHOD_POST))
                && (address?.space === DEF.SHARED.SPACE)
            );
        };
    }
}
