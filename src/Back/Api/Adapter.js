/**
 * Interface for implementing an application-level adapter for this plugin.
 *
 * @interface
 */
export default class Fl64_OAuth2_Back_Api_Adapter {

    /**
     * Redirects the user to the authentication process after the plugin has completed
     * its processing of the HTTP request. This method signals that authentication is required,
     * and the request should be forwarded to the next handler (e.g., an authentication page).
     *
     * The application must ensure that after successful authentication, the user is redirected
     * back to the same URL that was being processed when authentication was initiated.
     *
     * @param {Object} params - The input parameters.
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} params.req - The HTTP request object.
     * @param {module:http.ServerResponse|module:http2.Http2ServerResponse} params.res - The HTTP response object.
     *
     * @throws {Error} If the method is called directly on an interface, as it should be implemented in concrete classes.
     */
    forwardToAuthentication({req, res}) {
        throw new Error('Cannot instantiate an interface');
    }

    /**
     * Extracts locale preferences from the HTTP request.
     *
     * @param {Object} params - Input parameters.
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} params.req - The HTTP request object.
     * @returns {Promise<{localeUser:string, localeApp:string}>} -
     *          An object containing extracted locales:
     *          - `localeUser`: Preferred locale extracted from the `Accept-Language` header.
     *          - `localeApp`: Default application locale, usually configured globally.
     */
    async getLocales({req}) {
        // TODO: use it or remove it
        throw new Error('Cannot instantiate an interface');
    }


    /**
     * Checks the authentication status of the current request.
     *
     * TODO: should we use sessionManager here? This plug depends on the session plugin.
     *
     * @param {Object} params
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} params.req - The HTTP request object.
     * @returns {Promise<{isAuthenticated:boolean, userId:number}>} - The authentication status.
     */
    async getAuthStatus({req}) {
        throw new Error('Cannot instantiate an interface');
    }

}
