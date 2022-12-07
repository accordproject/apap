/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { org_accordproject_commonmark_0_5_0_Node } from './org_accordproject_commonmark_0_5_0_Node';
import type { org_accordproject_commonmark_0_5_0_TagInfo } from './org_accordproject_commonmark_0_5_0_TagInfo';

/**
 * An instance of org.accordproject.commonmark@0.5.0.CodeBlock
 */
export type org_accordproject_commonmark_0_5_0_CodeBlock = {
    /**
     * The class identifier for this type
     */
    $class: string;
    info?: string;
    tag?: org_accordproject_commonmark_0_5_0_TagInfo;
    text?: string;
    nodes?: Array<org_accordproject_commonmark_0_5_0_Node>;
    startLine?: number;
    endLine?: number;
};

