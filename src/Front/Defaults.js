/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Fl64_OAuth2_Front_Defaults {
    /** @type {Fl64_OAuth2_Shared_Defaults} */
    SHARED;

    /**
     * @param {Fl64_OAuth2_Shared_Defaults} SHARED
     */
    constructor(
        {
            Fl64_OAuth2_Shared_Defaults$: SHARED,
        }
    ) {
        this.SHARED = SHARED;
        Object.freeze(this);
    }
}
