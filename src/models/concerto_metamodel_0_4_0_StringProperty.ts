/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { concerto_metamodel_0_4_0_Decorator } from './concerto_metamodel_0_4_0_Decorator';
import type { concerto_metamodel_0_4_0_Range } from './concerto_metamodel_0_4_0_Range';
import type { concerto_metamodel_0_4_0_StringRegexValidator } from './concerto_metamodel_0_4_0_StringRegexValidator';

/**
 * An instance of concerto.metamodel@0.4.0.StringProperty
 */
export type concerto_metamodel_0_4_0_StringProperty = {
    /**
     * The class identifier for this type
     */
    $class: string;
    defaultValue?: string;
    validator?: concerto_metamodel_0_4_0_StringRegexValidator;
    name: string;
    isArray: boolean;
    isOptional: boolean;
    decorators?: Array<concerto_metamodel_0_4_0_Decorator>;
    location?: concerto_metamodel_0_4_0_Range;
};

