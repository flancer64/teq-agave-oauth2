export default class Fl64_OAuth2_Back_Helper_Web {
    /**
     * @param {typeof import('node:http2')} http2
     * @param {typeof import('node:url')} url
     * @param {Fl64_OAuth2_Back_Defaults} DEF
     */
    constructor(
        {
            'node:http2': http2,
            'node:url': url,
            Fl64_OAuth2_Back_Defaults$: DEF,
        }
    ) {
        // VARS
        const {
            HTTP2_HEADER_CONTENT_TYPE,
        } = http2.constants;

        // FUNCS
        // MAIN

        /**
         * Extracts the relative path parts from the request URL.
         *
         * The method removes the query string and extracts the portion of the path
         * that follows the predefined namespace (`DEF.SHARED.SPACE`). The resulting
         * path is split into an array of segments.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @returns {string[]} Array of path segments relative to `DEF.SHARED.SPACE`.
         */
        this.getPathParts = function (req) {
            const fullPath = req.url.split('?')[0];
            const baseIndex = fullPath.indexOf(DEF.SHARED.SPACE);
            const relativePath = fullPath.slice(baseIndex + DEF.SHARED.SPACE.length + 1);
            return relativePath.split('/');
        };

        /**
         * Parses the request body, supporting both JSON and x-www-form-urlencoded formats.
         *
         * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} req - Incoming HTTP request.
         * @return {Promise<*>} Parsed request body as an object.
         */
        this.parsePostedData = async function (req) {
            let body = {};
            const shares = req[DEF.MOD_WEB.HNDL_SHARE];

            // Check if the request body is already available in shared memory
            if (shares?.[DEF.MOD_WEB.SHARE_REQ_BODY_JSON]) {
                body = shares[DEF.MOD_WEB.SHARE_REQ_BODY_JSON];
            } else {
                const buffers = [];
                for await (const chunk of req) {
                    buffers.push(chunk);
                }
                const rawBody = Buffer.concat(buffers).toString();

                // Detect content type and parse accordingly
                const contentType = req.headers[HTTP2_HEADER_CONTENT_TYPE] || '';

                if (contentType.includes('application/json')) {
                    body = JSON.parse(rawBody);
                } else if (contentType.includes('application/x-www-form-urlencoded')) {
                    body = Object.fromEntries(new url.URLSearchParams(rawBody));
                }
            }
            return body;
        };

    }
}
