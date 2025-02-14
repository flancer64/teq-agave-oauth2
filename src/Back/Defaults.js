/**
 * Plugin constants (hardcoded configuration) for backend code.
 */
export default class Vendor_Plugin_Back_Defaults {
    NAME;

    /** @type {Vendor_Plugin_Shared_Defaults} */
    SHARED;

    /**
     * @param {Vendor_Plugin_Shared_Defaults} SHARED
     */
    constructor(
        {
            Vendor_Plugin_Shared_Defaults$: SHARED
        }
    ) {
        this.SHARED = SHARED;
        this.NAME = SHARED.NAME;
        Object.freeze(this);
    }
}
