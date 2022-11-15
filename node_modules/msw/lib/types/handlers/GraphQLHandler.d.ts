import { DocumentNode, OperationTypeNode } from 'graphql';
import { Path } from 'node-match-path';
import { SerializedResponse } from '../setupWorker/glossary';
import { set } from '../context/set';
import { status } from '../context/status';
import { delay } from '../context/delay';
import { fetch } from '../context/fetch';
import { DataContext } from '../context/data';
import { errors } from '../context/errors';
import { cookie } from '../context/cookie';
import { MockedRequest, RequestHandler, ResponseResolver } from './RequestHandler';
import { ParsedGraphQLRequest, GraphQLMultipartRequestBody } from '../utils/internal/parseGraphQLRequest';
export declare type ExpectedOperationTypeNode = OperationTypeNode | 'all';
export declare type GraphQLHandlerNameSelector = DocumentNode | RegExp | string;
export declare type GraphQLContext<QueryType> = {
    set: typeof set;
    status: typeof status;
    delay: typeof delay;
    fetch: typeof fetch;
    data: DataContext<QueryType>;
    errors: typeof errors;
    cookie: typeof cookie;
};
export declare const graphqlContext: GraphQLContext<any>;
export declare type GraphQLVariables = Record<string, any>;
export interface GraphQLHandlerInfo {
    operationType: ExpectedOperationTypeNode;
    operationName: GraphQLHandlerNameSelector;
}
export declare type GraphQLRequestBody<VariablesType extends GraphQLVariables> = GraphQLJsonRequestBody<VariablesType> | GraphQLMultipartRequestBody | Record<string, any> | undefined;
export interface GraphQLJsonRequestBody<Variables extends GraphQLVariables> {
    query: string;
    variables?: Variables;
}
export interface GraphQLRequest<Variables extends GraphQLVariables> extends MockedRequest<GraphQLRequestBody<Variables>> {
    variables: Variables;
}
export declare function isDocumentNode(value: DocumentNode | any): value is DocumentNode;
export declare class GraphQLHandler<Request extends GraphQLRequest<any> = GraphQLRequest<any>> extends RequestHandler<GraphQLHandlerInfo, Request, ParsedGraphQLRequest | null, GraphQLRequest<any>> {
    private endpoint;
    constructor(operationType: ExpectedOperationTypeNode, operationName: GraphQLHandlerNameSelector, endpoint: Path, resolver: ResponseResolver<any, any>);
    parse(request: MockedRequest): ParsedGraphQLRequest<GraphQLVariables>;
    protected getPublicRequest(request: Request, parsedResult: ParsedGraphQLRequest): GraphQLRequest<any>;
    predicate(request: MockedRequest, parsedResult: ParsedGraphQLRequest): boolean;
    log(request: Request, response: SerializedResponse, handler: this, parsedRequest: ParsedGraphQLRequest): void;
}
