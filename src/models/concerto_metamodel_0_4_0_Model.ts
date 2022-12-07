/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { concerto_metamodel_0_4_0_Declaration } from './concerto_metamodel_0_4_0_Declaration';
import type { concerto_metamodel_0_4_0_Import } from './concerto_metamodel_0_4_0_Import';

/**
 * An instance of concerto.metamodel@0.4.0.Model
 */
export type concerto_metamodel_0_4_0_Model = {
    /**
     * The class identifier for this type
     */
    $class: string;
    namespace: string;
    sourceUri?: string;
    concertoVersion?: string;
    imports?: Array<concerto_metamodel_0_4_0_Import>;
    declarations?: Array<concerto_metamodel_0_4_0_Declaration>;
};

