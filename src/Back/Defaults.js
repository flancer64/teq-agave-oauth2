/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Fl64_OAuth2_Back_Defaults {
    NAME;

    /** @type {Fl64_OAuth2_Shared_Defaults} */
    SHARED;

    /**
     * @param {Fl64_OAuth2_Shared_Defaults} SHARED
     */
    constructor(
        {
            Fl64_OAuth2_Shared_Defaults$: SHARED
        }
    ) {
        this.SHARED = SHARED;
        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
