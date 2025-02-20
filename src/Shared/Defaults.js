/**
 * Plugin constants (hardcoded configuration) for shared code.
 */
export default class Fl64_OAuth2_Shared_Defaults {

    NAME = '@flancer64/teq-agave-oauth2';

    ROUTE_AUTHORIZE = 'authorize';
    ROUTE_TOKEN = 'token';

    SPACE = 'fl64-oauth2';

    constructor() {
        Object.freeze(this);
    }
}
