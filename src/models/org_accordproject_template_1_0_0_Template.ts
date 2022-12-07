/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_template_1_0_0_Logic } from './org_accordproject_template_1_0_0_Logic';
import type { org_accordproject_template_1_0_0_Logo } from './org_accordproject_template_1_0_0_Logo';
import type { org_accordproject_template_1_0_0_Model } from './org_accordproject_template_1_0_0_Model';
import type { org_accordproject_template_1_0_0_Text } from './org_accordproject_template_1_0_0_Text';

/**
 * An instance of org.accordproject.template@1.0.0.Template
 */
export type org_accordproject_template_1_0_0_Template = {
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
    logo?: org_accordproject_template_1_0_0_Logo;
    model: org_accordproject_template_1_0_0_Model;
    text: org_accordproject_template_1_0_0_Text;
    logic?: org_accordproject_template_1_0_0_Logic;
};

