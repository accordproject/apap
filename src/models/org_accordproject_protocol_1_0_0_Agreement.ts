/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_protocol_1_0_0_AgreementParty } from './org_accordproject_protocol_1_0_0_AgreementParty';
import type { org_accordproject_protocol_1_0_0_AgreementStatusType } from './org_accordproject_protocol_1_0_0_AgreementStatusType';
import type { org_accordproject_protocol_1_0_0_Blob } from './org_accordproject_protocol_1_0_0_Blob';
import type { org_accordproject_protocol_1_0_0_HistoryEntry } from './org_accordproject_protocol_1_0_0_HistoryEntry';
import type { org_accordproject_protocol_1_0_0_JSON } from './org_accordproject_protocol_1_0_0_JSON';
import type { org_accordproject_protocol_1_0_0_Metadata } from './org_accordproject_protocol_1_0_0_Metadata';
import type { org_accordproject_protocol_1_0_0_Signature } from './org_accordproject_protocol_1_0_0_Signature';

/**
 * An instance of org.accordproject.protocol@1.0.0.Agreement
 */
export type org_accordproject_protocol_1_0_0_Agreement = {
    /**
     * The class identifier for this type
     */
    $class: string;
    /**
     * The instance identifier for this type
     */
    agreementId: string;
    data: org_accordproject_protocol_1_0_0_JSON;
    /**
     * The identifier of an instance of org.accordproject.protocol@1.0.0.Template
     */
    template: string;
    agreementParties: Array<org_accordproject_protocol_1_0_0_AgreementParty>;
    signatures: Array<org_accordproject_protocol_1_0_0_Signature>;
    agreementStatus: org_accordproject_protocol_1_0_0_AgreementStatusType;
    historyEntries: Array<org_accordproject_protocol_1_0_0_HistoryEntry>;
    attachments: Array<org_accordproject_protocol_1_0_0_Blob>;
    references: Array<string>;
    metadata: org_accordproject_protocol_1_0_0_Metadata;
};

