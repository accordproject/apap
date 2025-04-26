"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var concerto_core_1 = require("@accordproject/concerto-core");
var fs = require("fs");
var concerto_util_1 = require("@accordproject/concerto-util");
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
var DrizzleVisitor = /** @class */ (function () {
    function DrizzleVisitor() {
    }
    /**
     * Visitor design pattern
     * @param {Object} thing - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @public
     */
    DrizzleVisitor.prototype.visit = function (thing, parameters) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if ((_a = thing.isModelManager) === null || _a === void 0 ? void 0 : _a.call(thing)) {
            return this.visitModelManager(thing, parameters);
        }
        else if ((_b = thing.isModelFile) === null || _b === void 0 ? void 0 : _b.call(thing)) {
            return this.visitModelFile(thing, parameters);
        }
        else if ((_c = thing.isEnum) === null || _c === void 0 ? void 0 : _c.call(thing)) {
            return this.visitEnumDeclaration(thing, parameters);
        }
        else if ((_d = thing.isClassDeclaration) === null || _d === void 0 ? void 0 : _d.call(thing)) {
            return this.visitClassDeclaration(thing, parameters);
        }
        else if ((_e = thing.isMapDeclaration) === null || _e === void 0 ? void 0 : _e.call(thing)) {
            return this.visitMapDeclaration(thing, parameters);
        }
        else if ((_f = thing.isTypeScalar) === null || _f === void 0 ? void 0 : _f.call(thing)) {
            return this.visitField(thing.getScalarField(), __assign({ scalarType: thing.getType() }, parameters));
        }
        else if ((_g = thing.isField) === null || _g === void 0 ? void 0 : _g.call(thing)) {
            return this.visitField(thing, parameters);
        }
        else if ((_h = thing.isRelationship) === null || _h === void 0 ? void 0 : _h.call(thing)) {
            return this.visitRelationship(thing, parameters);
        }
        else if ((_j = thing.isEnumValue) === null || _j === void 0 ? void 0 : _j.call(thing)) {
            return this.visitEnumValueDeclaration(thing, parameters);
        }
        else {
            throw new Error('Unrecognized type: ' + thing);
        }
    };
    /**
     * Visitor design pattern
     * @param {ModelManager} modelManager - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitModelManager = function (modelManager, parameters) {
        var _this = this;
        parameters.fileWriter.openFile('schema.ts');
        parameters.fileWriter.writeLine(0, "\nimport {\n    text,\n    uuid,\n    serial,\n    integer,\n    pgTable,\n    pgEnum,\n    varchar,\n    json,\n    boolean,\n    timestamp,\n    uniqueIndex,\n    } from 'drizzle-orm/pg-core';\nimport { PgTable } from 'drizzle-orm/pg-core';\nimport { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-zod';");
        modelManager.getModelFiles(true).forEach(function (modelFile) {
            modelFile.accept(_this, parameters);
        });
        parameters.fileWriter.closeFile();
        return null;
    };
    /**
     * Visitor design pattern
     * @param {ModelFile} modelFile - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitModelFile = function (modelFile, parameters) {
        var _this = this;
        modelFile.getAllDeclarations()
            .filter(function (declaration) { var _a; return !((_a = declaration.isScalarDeclaration) === null || _a === void 0 ? void 0 : _a.call(declaration)); }).forEach(function (decl) {
            decl.accept(_this, parameters);
        });
        return null;
    };
    /**
     * Visitor design pattern
     * @param {EnumDeclaration} enumDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitEnumDeclaration = function (enumDeclaration, parameters) {
        var names = enumDeclaration.getProperties().map(function (property) { return "'".concat(property.getName(), "'"); });
        parameters.fileWriter.writeLine(0, "export const ".concat(enumDeclaration.getName(), " = pgEnum('").concat(enumDeclaration.getName(), "', [").concat(names.join(',\n'), "]);"));
        return null;
    };
    /**
     * Visitor design pattern
     * @param {ClassDeclaration} classDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitClassDeclaration = function (classDeclaration, parameters) {
        var _this = this;
        if (classDeclaration.getDecorator('resource')) {
            parameters.fileWriter.writeLine(0, "\n// **** ".concat(classDeclaration.getName(), " ***"));
            parameters.fileWriter.writeLine(0, "export const ".concat(classDeclaration.getName(), " = pgTable(\"").concat(classDeclaration.getName(), "\", {"));
            var idFieldName_1 = classDeclaration.getIdentifierFieldName();
            classDeclaration.getOwnProperties().forEach(function (property) {
                var idField = property.getName() === idFieldName_1;
                property.accept(_this, __assign({ idField: idField }, parameters));
            });
            parameters.fileWriter.writeLine(0, '});');
            parameters.fileWriter.writeLine(0, "export const ".concat(classDeclaration.getName(), "SelectSchema = createSelectSchema(").concat(classDeclaration.getName(), ");"));
            parameters.fileWriter.writeLine(0, "export const ".concat(classDeclaration.getName(), "InsertSchema = createInsertSchema(").concat(classDeclaration.getName(), ");"));
            parameters.fileWriter.writeLine(0, "export const ".concat(classDeclaration.getName(), "UpdateSchema = createUpdateSchema(").concat(classDeclaration.getName(), ");\n"));
        }
        return null;
    };
    /**
     * Visitor design pattern
     * @param {Field} field - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitField = function (field, parameters) {
        if (parameters.idField) {
            // ID fields are always serial, PK
            parameters.fileWriter.writeLine(1, "".concat(field.getName(), ": serial().primaryKey(),"));
        }
        else {
            var type = parameters.scalarType ? parameters.scalarType : field.getType();
            var line = "".concat(field.getName(), ": ").concat(this.toDrizzleType(type, field.isTypeEnum())).concat(field.isArray() ? '.array()' : '').concat(field.isOptional() ? '' : '.notNull()', ",");
            parameters.fileWriter.writeLine(1, line);
        }
        return null;
    };
    /**
     * Visitor design pattern
     * @param {EnumValueDeclaration} enumValueDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitEnumValueDeclaration = function (enumValueDeclaration, parameters) {
        return null;
    };
    /**
     * Visitor design pattern
     * @param {MapDeclaration} mapDeclaration - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitMapDeclaration = function (mapDeclaration, parameters) {
        throw new Error('Not implemented');
    };
    /**
     * Visitor design pattern
     * @param {Relationship} relationship - the object being visited
     * @param {Object} parameters  - the parameter
     * @return {Object} the result of visiting or null
     * @private
     */
    DrizzleVisitor.prototype.visitRelationship = function (relationship, parameters) {
        // hack, should use https://orm.drizzle.team/docs/relations
        parameters.fileWriter.writeLine(1, "".concat(relationship.getName(), ": text(),"));
        return null;
    };
    /**
     * Converts a Concerto type to a Drizzle type.
     * @param {string} type  - the concerto type
     * @return {string} the corresponding type in Drizzle
     * @private
     */
    DrizzleVisitor.prototype.toDrizzleType = function (type, isTypeEnum) {
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
                return isTypeEnum ? "".concat(type, "()") : 'json()';
            }
        }
    };
    return DrizzleVisitor;
}());
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var mm, cto, fileWriter, visitor, params;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mm = new concerto_core_1.ModelManager({ strict: true });
                    cto = fs.readFileSync('../model/protocol.cto', 'utf8');
                    mm.addCTOModel(cto, 'protocol.cto', true);
                    return [4 /*yield*/, mm.updateExternalModels()];
                case 1:
                    _a.sent();
                    fileWriter = new concerto_util_1.FileWriter('./db');
                    visitor = new DrizzleVisitor();
                    params = { fileWriter: fileWriter };
                    mm.accept(visitor, params);
                    return [2 /*return*/];
            }
        });
    });
}
main();
