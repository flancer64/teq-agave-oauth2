/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl64_OAuth2_Back_Defaults {
    CLI_PREFIX = 'fl64-oauth2'; // prefix for CLI actions

    LOCALE = 'en';

    /** @type {TeqFw_Web_Back_Defaults} */
    MOD_WEB;
    /** @type {string} */
    NAME;

    /** @type {Fl64_OAuth2_Shared_Defaults} */
    SHARED;

    /**
     * @param {Fl64_OAuth2_Shared_Defaults} SHARED
     * @param {TeqFw_Web_Back_Defaults} MOD_WEB
     */
    constructor(
        {
            Fl64_OAuth2_Shared_Defaults$: SHARED,
            TeqFw_Web_Back_Defaults$: MOD_WEB
        }
    ) {
        this.MOD_WEB = MOD_WEB;
        this.SHARED = SHARED;

        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
