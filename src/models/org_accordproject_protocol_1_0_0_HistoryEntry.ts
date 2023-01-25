/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_protocol_1_0_0_AgreementStatusType } from './org_accordproject_protocol_1_0_0_AgreementStatusType';
import type { org_accordproject_protocol_1_0_0_JSON } from './org_accordproject_protocol_1_0_0_JSON';
import type { org_accordproject_protocol_1_0_0_Metadata } from './org_accordproject_protocol_1_0_0_Metadata';

/**
 * An instance of org.accordproject.protocol@1.0.0.HistoryEntry
 */
export type org_accordproject_protocol_1_0_0_HistoryEntry = {
    /**
     * The class identifier for this type
     */
    $class: string;
    agreementStatus: org_accordproject_protocol_1_0_0_AgreementStatusType;
    data: org_accordproject_protocol_1_0_0_JSON;
    metadata: org_accordproject_protocol_1_0_0_Metadata;
};

