/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { org_accordproject_protocol_1_0_0_Agreement } from '../models/org_accordproject_protocol_1_0_0_Agreement';
import type { org_accordproject_protocol_1_0_0_Capabilities } from '../models/org_accordproject_protocol_1_0_0_Capabilities';
import type { org_accordproject_protocol_1_0_0_PdfConversionOptions } from '../models/org_accordproject_protocol_1_0_0_PdfConversionOptions';
import type { org_accordproject_protocol_1_0_0_StateResponse } from '../models/org_accordproject_protocol_1_0_0_StateResponse';
import type { org_accordproject_protocol_1_0_0_Template } from '../models/org_accordproject_protocol_1_0_0_Template';
import type { org_accordproject_protocol_1_0_0_TriggerRequest } from '../models/org_accordproject_protocol_1_0_0_TriggerRequest';
import type { org_accordproject_protocol_1_0_0_TriggerResponse } from '../models/org_accordproject_protocol_1_0_0_TriggerResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DefaultService {

    /**
     * List All Templates
     * Gets a list of all `template` entities.
     * @returns org_accordproject_protocol_1_0_0_Template Successful response - returns an array of `template` entities.
     * @throws ApiError
     */
    public static listTemplates(): CancelablePromise<Array<org_accordproject_protocol_1_0_0_Template>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/templates',
        });
    }

    /**
     * Create a Template
     * Creates a new instance of a `template`.
     * @param requestBody A new `template` to be created.
     * @returns any Successful response.
     * @throws ApiError
     */
    public static createTemplate(
        requestBody: org_accordproject_protocol_1_0_0_Template,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/templates',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a template
     * Gets the details of a single instance of a `template`.
     * @param name A unique identifier for a `Template`.
     * @returns org_accordproject_protocol_1_0_0_Template Successful response - returns a single `template`.
     * @throws ApiError
     */
    public static getTemplate(
        name: string,
    ): CancelablePromise<org_accordproject_protocol_1_0_0_Template> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/templates/{name}',
            path: {
                'name': name,
            },
        });
    }

    /**
     * Update a template
     * Updates an existing `template`.
     * @param name A unique identifier for a `Template`.
     * @param requestBody Updated `template` information.
     * @returns any Successful response.
     * @throws ApiError
     */
    public static replaceTemplate(
        name: string,
        requestBody: org_accordproject_protocol_1_0_0_Template,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/templates/{name}',
            path: {
                'name': name,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a template
     * Deletes an existing `template`.
     * @param name A unique identifier for a `Template`.
     * @returns void
     * @throws ApiError
     */
    public static deleteTemplate(
        name: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/templates/{name}',
            path: {
                'name': name,
            },
        });
    }

    /**
     * List All Agreements
     * Gets a list of all `agreement` entities.
     * @returns org_accordproject_protocol_1_0_0_Agreement Successful response - returns an array of `agreement` entities.
     * @throws ApiError
     */
    public static listAgreements(): CancelablePromise<Array<org_accordproject_protocol_1_0_0_Agreement>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agreements',
        });
    }

    /**
     * Create a Agreement
     * Creates a new instance of a `agreement`.
     * @param requestBody A new `agreement` to be created.
     * @returns any Successful response.
     * @throws ApiError
     */
    public static createAgreement(
        requestBody: org_accordproject_protocol_1_0_0_Agreement,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agreements',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get a agreement
     * Gets the details of a single instance of a `agreement`.
     * @param agreementId A unique identifier for a `Agreement`.
     * @returns org_accordproject_protocol_1_0_0_Agreement Successful response - returns a single `agreement`.
     * @throws ApiError
     */
    public static getAgreement(
        agreementId: string,
    ): CancelablePromise<org_accordproject_protocol_1_0_0_Agreement> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agreements/{agreementId}',
            path: {
                'agreementId': agreementId,
            },
        });
    }

    /**
     * Update a agreement
     * Updates an existing `agreement`.
     * @param agreementId A unique identifier for a `Agreement`.
     * @param requestBody Updated `agreement` information.
     * @returns any Successful response.
     * @throws ApiError
     */
    public static replaceAgreement(
        agreementId: string,
        requestBody: org_accordproject_protocol_1_0_0_Agreement,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/agreements/{agreementId}',
            path: {
                'agreementId': agreementId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Delete a agreement
     * Deletes an existing `agreement`.
     * @param agreementId A unique identifier for a `Agreement`.
     * @returns void
     * @throws ApiError
     */
    public static deleteAgreement(
        agreementId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/agreements/{agreementId}',
            path: {
                'agreementId': agreementId,
            },
        });
    }

    /**
     * Convert agreement to PDF
     * Converts an existing `agreement` to PDF.
     * @param agreementId A unique identifier for a `Agreement`.
     * @param requestBody PDF conversion options.
     * @returns any Successful response.
     * @throws ApiError
     */
    public static convertAgreementPdf(
        agreementId: string,
        requestBody: org_accordproject_protocol_1_0_0_PdfConversionOptions,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agreements/{agreementId}/convert/pdf',
            path: {
                'agreementId': agreementId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Trigger an agreement
     * Sends data to an existing agreement.
     * @param agreementId A unique identifier for a `Agreement`.
     * @param requestBody Incoming data — a JSON serialized Concerto type
     * @returns org_accordproject_protocol_1_0_0_TriggerResponse Successful response - returns the result of calling a function.
     * @throws ApiError
     */
    public static triggerAgreement(
        agreementId: string,
        requestBody: org_accordproject_protocol_1_0_0_TriggerRequest,
    ): CancelablePromise<org_accordproject_protocol_1_0_0_TriggerResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/agreements/{agreementId}/trigger',
            path: {
                'agreementId': agreementId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * Get the state of an agreement
     * Gets the runtime state of an agreement.
     * @param agreementId A unique identifier for a `Agreement`.
     * @returns org_accordproject_protocol_1_0_0_StateResponse Successful response - returns the state of an `agreement`.
     * @throws ApiError
     */
    public static agreementState(
        agreementId: string,
    ): CancelablePromise<org_accordproject_protocol_1_0_0_StateResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/agreements/{agreementId}/state',
            path: {
                'agreementId': agreementId,
            },
        });
    }

    /**
     * Get server capabilities
     * Retrieve the supported features of the server.
     * @returns org_accordproject_protocol_1_0_0_Capabilities Successful response - returns `capabilities` for the server.
     * @throws ApiError
     */
    public static capabilities(): CancelablePromise<org_accordproject_protocol_1_0_0_Capabilities> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/capabilities',
        });
    }

}
