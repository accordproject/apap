import { ClassDeclaration, EnumDeclaration, EnumValueDeclaration, MapDeclaration, ModelFile, ModelManager, Property, RelationshipDeclaration } from '@accordproject/concerto-core';
import * as fs from 'fs';
import { FileWriter } from '@accordproject/concerto-util';

/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Convert the contents of a ModelManager to Drizzle ORM definitions.
 */
class DrizzleVisitor {
    /**
     * Visitor design pattern
     * @param {Object} thing - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @public
     */
    visit(thing: any, parameters: any) {
        if (thing.isModelManager?.()) {
            return this.visitModelManager(thing, parameters);
        } else if (thing.isModelFile?.()) {
            return this.visitModelFile(thing, parameters);
        } else if (thing.isEnum?.()) {
            return this.visitEnumDeclaration(thing, parameters);
        } else if (thing.isClassDeclaration?.()) {
            return this.visitClassDeclaration(thing, parameters);
        } else if (thing.isMapDeclaration?.()) {
            return this.visitMapDeclaration(thing, parameters);
        } else if (thing.isTypeScalar?.()) {
            return this.visitField(thing.getScalarField(), {scalarType: thing.getType(), ...parameters});
        } else if (thing.isField?.()) {
            return this.visitField(thing, parameters);
        } else if (thing.isRelationship?.()) {
            return this.visitRelationship(thing, parameters);
        } else if (thing.isEnumValue?.()) {
            return this.visitEnumValueDeclaration(thing, parameters);
        } else {
            throw new Error('Unrecognized type: ' + thing);
        }
    }

    /**
     * Visitor design pattern
     * @param {ModelManager} modelManager - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitModelManager(modelManager: ModelManager, parameters: any): any {
        parameters.fileWriter.openFile('schema.ts');

        parameters.fileWriter.writeLine(0, `
// GENERATED CODE, DO NOT MODIFY
import {
    text,
    uuid,
    serial,
    integer,
    pgTable,
    pgEnum,
    varchar,
    json,
    boolean,
    timestamp,
    uniqueIndex,
    } from 'drizzle-orm/pg-core';
import { PgTable } from 'drizzle-orm/pg-core';
import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';`);

        (modelManager as any).getModelFiles(true).forEach((modelFile: ModelFile) => {
            modelFile.accept(this, parameters);
        });

        parameters.fileWriter.closeFile();
        return null;
    }

    /**
     * Visitor design pattern
     * @param {ModelFile} modelFile - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitModelFile(modelFile: ModelFile, parameters: any): any {
        modelFile.getAllDeclarations()
            .filter(declaration => !declaration.isScalarDeclaration?.()).forEach((decl) => {
                decl.accept(this, parameters);
            });

        return null;
    }

    /**
     * Visitor design pattern
     * @param {EnumDeclaration} enumDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitEnumDeclaration(enumDeclaration: EnumDeclaration, parameters: any): any {
        const names = enumDeclaration.getProperties().map((property) => `'${property.getName()}'`);
        parameters.fileWriter.writeLine(0, `export const ${enumDeclaration.getName()} = pgEnum('${enumDeclaration.getName()}', [${names.join(',\n')}]);`);
        return null;
    }

    /**
     * Visitor design pattern
     * @param {ClassDeclaration} classDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitClassDeclaration(classDeclaration: ClassDeclaration, parameters: any): any {
        if(classDeclaration.getDecorator('resource')) {
            parameters.fileWriter.writeLine(0, `\n// **** ${classDeclaration.getName()} ***`);
            parameters.fileWriter.writeLine(0, `export const ${classDeclaration.getName()} = pgTable("${classDeclaration.getName()}", {`);

            const idFieldName = classDeclaration.getIdentifierFieldName();

            // create a database ID for the resource, serial, PK
            parameters.fileWriter.writeLine(1, 'id: serial().primaryKey(),');

            classDeclaration.getOwnProperties().forEach((property) => {
                const idField = property.getName() === idFieldName;
                property.accept(this, {idField, ...parameters});
            });
    
            parameters.fileWriter.writeLine(0, '});');

            parameters.fileWriter.writeLine(0, `export const ${classDeclaration.getName()}SelectSchema = createSelectSchema(${classDeclaration.getName()});`);
            parameters.fileWriter.writeLine(0, `export const ${classDeclaration.getName()}InsertSchema = createInsertSchema(${classDeclaration.getName()});`);
            parameters.fileWriter.writeLine(0, `export const ${classDeclaration.getName()}UpdateSchema = createUpdateSchema(${classDeclaration.getName()});\n`);
        }
        return null;
    }

    /**
     * Visitor design pattern
     * @param {Field} field - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitField(field: Property, parameters: any): any {
        if(parameters.idField) {
            // resource ID fields are always unique (note, not the PK for the table!)
            parameters.fileWriter.writeLine(1, `${field.getName()}: text().unique().notNull(),`);
        }
        else {
            const type = parameters.scalarType ? parameters.scalarType : field.getType();
            const line = `${field.getName()}: ${this.toDrizzleType(type, field.isTypeEnum())}${field.isArray() ? '.array()' : ''}${field.isOptional() ? '' : '.notNull()'},`;
            parameters.fileWriter.writeLine(1, line);
        }
        return null;
    }

    /**
     * Visitor design pattern
     * @param {EnumValueDeclaration} enumValueDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitEnumValueDeclaration(enumValueDeclaration: EnumValueDeclaration, parameters: any): any {
        return null;
    }

    /**
     * Visitor design pattern
     * @param {MapDeclaration} mapDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitMapDeclaration(mapDeclaration: MapDeclaration, parameters: any): any {
        throw new Error('Not implemented');
    }

    /**
     * Visitor design pattern
     * @param {Relationship} relationship - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    visitRelationship(relationship: RelationshipDeclaration, parameters: any): any {
        // hack, should use https://orm.drizzle.team/docs/relations
        parameters.fileWriter.writeLine(1, `${relationship.getName()}: text(),`);
        return null;
    }

    /**
     * Converts a Concerto type to a Drizzle type.
     * @param {string} type  - the concerto type
     * @return {string} the corresponding type in Drizzle
     * @private
     */
    toDrizzleType(type: string, isTypeEnum:boolean): string {
        switch (type) {
            case 'DateTime':
                return 'timestamp()';
            case 'Boolean':
                return 'boolean()';
            case 'String':
                return 'text()';
            case 'Double':
                return 'double()';
            case 'Long':
                return 'bigint()';
            case 'Integer':
                return 'integer()';
            case 'JSON':
                return 'json()';
            default: {
                // enum types are supported, everything else is json
                return isTypeEnum ? `${type}()` : 'json()';
            }
        }
    }
}

async function main() {
    const mm = new ModelManager({ strict: true });
    const cto = fs.readFileSync('../model/protocol.cto', 'utf8');
    mm.addCTOModel(cto, 'protocol.cto', true);
    await mm.updateExternalModels();

    const fileWriter = new FileWriter('./db');
    const visitor = new DrizzleVisitor();
    const params = { fileWriter };
    mm.accept(visitor, params);
}

main();
