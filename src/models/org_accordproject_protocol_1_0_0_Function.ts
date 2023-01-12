/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_protocol_1_0_0_Code } from './org_accordproject_protocol_1_0_0_Code';
import type { org_accordproject_protocol_1_0_0_FullyQualifiedTypeName } from './org_accordproject_protocol_1_0_0_FullyQualifiedTypeName';

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
    requestType: org_accordproject_protocol_1_0_0_FullyQualifiedTypeName;
    responseType?: org_accordproject_protocol_1_0_0_FullyQualifiedTypeName;
    emittedTypes?: Array<org_accordproject_protocol_1_0_0_FullyQualifiedTypeName>;
    code: org_accordproject_protocol_1_0_0_Code;
};

