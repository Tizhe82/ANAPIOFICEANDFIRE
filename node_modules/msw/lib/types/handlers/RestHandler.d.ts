import { Match, Path } from 'node-match-path';
import { body, cookie, delay, fetch, json, set, status, text, xml } from '../context';
import { SerializedResponse } from '../setupWorker/glossary';
import { ResponseResolutionContext } from '../utils/getResponse';
import { DefaultRequestBody, MockedRequest, RequestHandler, ResponseResolver } from './RequestHandler';
interface RestHandlerInfo {
    method: string;
    path: Path;
}
export declare enum RESTMethods {
    HEAD = "HEAD",
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    OPTIONS = "OPTIONS",
    DELETE = "DELETE"
}
export declare type RestContext = {
    set: typeof set;
    status: typeof status;
    cookie: typeof cookie;
    text: typeof text;
    body: typeof body;
    json: typeof json;
    xml: typeof xml;
    delay: typeof delay;
    fetch: typeof fetch;
};
export declare const restContext: RestContext;
export declare type RequestParams = {
    [paramName: string]: any;
};
export declare type RequestQuery = {
    [queryName: string]: any;
};
export interface RestRequest<BodyType extends DefaultRequestBody = DefaultRequestBody, ParamsType extends RequestParams = Record<string, any>> extends MockedRequest<BodyType> {
    params: ParamsType;
}
export declare type ParsedRestRequest = Match;
/**
 * Request handler for REST API requests.
 * Provides request matching based on method and URL.
 */
export declare class RestHandler<RequestType extends MockedRequest<DefaultRequestBody> = MockedRequest<DefaultRequestBody>> extends RequestHandler<RestHandlerInfo, RequestType, ParsedRestRequest, RestRequest<RequestParams>> {
    constructor(method: string, path: Path, resolver: ResponseResolver<any, any>);
    private checkRedundantQueryParameters;
    parse(request: RequestType, resolutionContext?: ResponseResolutionContext): Match;
    protected getPublicRequest(request: RequestType, parsedResult: ParsedRestRequest): RestRequest<any, RequestParams>;
    predicate(request: RequestType, parsedResult: ParsedRestRequest): boolean;
    log(request: RequestType, response: SerializedResponse): void;
}
export {};
