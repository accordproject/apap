/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { org_accordproject_protocol_1_0_0_PdfConversionOptions } from '../models/org_accordproject_protocol_1_0_0_PdfConversionOptions';
import type { org_accordproject_protocol_1_0_0_StateResponse } from '../models/org_accordproject_protocol_1_0_0_StateResponse';
import type { org_accordproject_protocol_1_0_0_TriggerRequest } from '../models/org_accordproject_protocol_1_0_0_TriggerRequest';
import type { org_accordproject_protocol_1_0_0_TriggerResponse } from '../models/org_accordproject_protocol_1_0_0_TriggerResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class AgreementsService {

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

}
