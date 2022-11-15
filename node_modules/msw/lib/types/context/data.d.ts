import { ResponseTransformer } from '../response';
export declare type DataContext<T> = (payload: T) => ResponseTransformer;
/**
 * Sets a given payload as a GraphQL response body.
 * @example
 * res(ctx.data({ user: { firstName: 'John' }}))
 * @see {@link https://mswjs.io/docs/api/context/data `ctx.data()`}
 */
export declare const data: DataContext<Record<string, unknown>>;
