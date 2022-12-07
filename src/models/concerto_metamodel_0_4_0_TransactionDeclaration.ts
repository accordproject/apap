/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { concerto_metamodel_0_4_0_Decorator } from './concerto_metamodel_0_4_0_Decorator';
import type { concerto_metamodel_0_4_0_Identified } from './concerto_metamodel_0_4_0_Identified';
import type { concerto_metamodel_0_4_0_Property } from './concerto_metamodel_0_4_0_Property';
import type { concerto_metamodel_0_4_0_Range } from './concerto_metamodel_0_4_0_Range';
import type { concerto_metamodel_0_4_0_TypeIdentifier } from './concerto_metamodel_0_4_0_TypeIdentifier';

/**
 * An instance of concerto.metamodel@0.4.0.TransactionDeclaration
 */
export type concerto_metamodel_0_4_0_TransactionDeclaration = {
    /**
     * The class identifier for this type
     */
    $class: string;
    isAbstract: boolean;
    identified?: concerto_metamodel_0_4_0_Identified;
    superType?: concerto_metamodel_0_4_0_TypeIdentifier;
    properties: Array<concerto_metamodel_0_4_0_Property>;
    name: string;
    decorators?: Array<concerto_metamodel_0_4_0_Decorator>;
    location?: concerto_metamodel_0_4_0_Range;
};

