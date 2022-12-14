/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { concerto_metamodel_0_4_0_Property } from './concerto_metamodel_0_4_0_Property';

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
    inputs: Array<concerto_metamodel_0_4_0_Property>;
    output?: concerto_metamodel_0_4_0_Property;
    code: string;
};

