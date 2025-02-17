/**
 * Interface for adapting this plugin into the application.
 *
 * This is a documentation-only interface (not executable).
 *
 * @interface
 */
export default class Fl64_OAuth2_Back_Api_Adapter {

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
        throw new Error('Cannot instantiate an interface');
    }

    /**
     * Retrieves the authentication URL where the user should be redirected
     * when authentication is required.
     *
     * This method is part of the OAuth2 adapter interface and must be implemented
     * by the application. It determines the appropriate login page URL based on
     * the request context.
     *
     * The authentication URL is used when an unauthenticated user attempts to
     * initiate an OAuth2 authorization request. The OAuth handler stores the
     * current authorization state, sets a cookie, and redirects the user to this URL.
     * After successful authentication, the application is responsible for
     * redirecting the user back to the OAuth2 authorization process.
     *
     * @param {Object} params - Input parameters.
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} params.req - The HTTP request object.
     * @returns {Promise<{authenticationUrl: string}>} Resolves with the authentication URL.
     */
    async getAuthRedirectUrl({req}) {
        throw new Error('Cannot instantiate an interface');
    }


    /**
     * Checks the authentication status of the current request.
     *
     * @param {Object} params
     * @param {module:http.IncomingMessage|module:http2.Http2ServerRequest} params.req - The HTTP request object.
     * @returns {Promise<{isAuthenticated:boolean}>} - The authentication status.
     */
    async getAuthStatus({req}) {
        throw new Error('Cannot instantiate an interface');
    }
}
