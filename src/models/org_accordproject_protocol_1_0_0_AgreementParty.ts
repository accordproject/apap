/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_protocol_1_0_0_Address } from './org_accordproject_protocol_1_0_0_Address';

/**
 * An instance of org.accordproject.protocol@1.0.0.AgreementParty
 */
export type org_accordproject_protocol_1_0_0_AgreementParty = {
    /**
     * The class identifier for this type
     */
    $class: string;
    name: string;
    signatory: boolean;
    role?: string;
    email?: string;
    phone?: string;
    company?: string;
    network?: string;
    address?: org_accordproject_protocol_1_0_0_Address;
    /**
     * The instance identifier for this type
     */
    partyId: string;
};

