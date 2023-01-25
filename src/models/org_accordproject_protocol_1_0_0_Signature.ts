/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_protocol_1_0_0_AgreementParty } from './org_accordproject_protocol_1_0_0_AgreementParty';
import type { org_accordproject_protocol_1_0_0_Blob } from './org_accordproject_protocol_1_0_0_Blob';
import type { org_accordproject_protocol_1_0_0_Metadata } from './org_accordproject_protocol_1_0_0_Metadata';

/**
 * An instance of org.accordproject.protocol@1.0.0.Signature
 */
export type org_accordproject_protocol_1_0_0_Signature = {
    /**
     * The class identifier for this type
     */
    $class: string;
    signatory: org_accordproject_protocol_1_0_0_AgreementParty;
    signedAt?: string;
    metadata: org_accordproject_protocol_1_0_0_Metadata;
    signatureImage: Array<org_accordproject_protocol_1_0_0_Blob>;
};

