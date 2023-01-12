/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_protocol_1_0_0_Code } from './org_accordproject_protocol_1_0_0_Code';

/**
 * An instance of org.accordproject.protocol@1.0.0.Function
 */
export type org_accordproject_protocol_1_0_0_Function = {
    /**
     * The class identifier for this type
     */
    $class: string;
    /**
     * The instance identifier for this type
     */
    name: string;
    requestType: string;
    responseType?: string;
    emittedTypes?: Array<string>;
    code: org_accordproject_protocol_1_0_0_Code;
};

