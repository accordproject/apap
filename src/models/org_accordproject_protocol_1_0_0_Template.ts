/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_protocol_1_0_0_Blob } from './org_accordproject_protocol_1_0_0_Blob';
import type { org_accordproject_protocol_1_0_0_Logic } from './org_accordproject_protocol_1_0_0_Logic';
import type { org_accordproject_protocol_1_0_0_TemplateModel } from './org_accordproject_protocol_1_0_0_TemplateModel';
import type { org_accordproject_protocol_1_0_0_Text } from './org_accordproject_protocol_1_0_0_Text';

/**
 * An instance of org.accordproject.protocol@1.0.0.Template
 */
export type org_accordproject_protocol_1_0_0_Template = {
    /**
     * The class identifier for this type
     */
    $class: string;
    /**
     * The instance identifier for this type
     */
    name: string;
    author: string;
    displayName?: string;
    version: string;
    description?: string;
    license: string;
    keywords?: Array<string>;
    logo?: org_accordproject_protocol_1_0_0_Blob;
    templateModel: org_accordproject_protocol_1_0_0_TemplateModel;
    text: org_accordproject_protocol_1_0_0_Text;
    logic?: org_accordproject_protocol_1_0_0_Logic;
};

