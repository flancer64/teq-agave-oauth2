/**
 * Plugin constants (hardcoded configuration) for frontend code.
 */
export default class Vendor_Plugin_Front_Defaults {
    /** @type {Vendor_Plugin_Shared_Defaults} */
    SHARED;

    /**
     * @param {Vendor_Plugin_Shared_Defaults} SHARED
     */
    constructor(
        {
            Vendor_Plugin_Shared_Defaults$: SHARED,
        }
    ) {
        this.SHARED = SHARED;
        Object.freeze(this);
    }
}
