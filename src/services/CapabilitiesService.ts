/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { org_accordproject_protocol_1_0_0_Capabilities } from '../models/org_accordproject_protocol_1_0_0_Capabilities';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class CapabilitiesService {

    /**
     * Get server capabilities
     * Retrieve the supported features of the server.
     * @returns org_accordproject_protocol_1_0_0_Capabilities Successful response - returns `capabilities` for the server.
     * @throws ApiError
     */
    public static getCapabilities(): CancelablePromise<org_accordproject_protocol_1_0_0_Capabilities> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/capabilities',
        });
    }

}
