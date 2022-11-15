import { PartialDeep } from 'type-fest';
import { SetupWorkerApi, SetupWorkerInternalContext, StartHandler, StartOptions } from '../../glossary';
export declare const DEFAULT_START_OPTIONS: StartOptions;
/**
 * Returns resolved worker start options, merging the default options
 * with the given custom options.
 */
export declare function resolveStartOptions(initialOptions?: PartialDeep<StartOptions>): StartOptions;
export declare function prepareStartHandler(handler: StartHandler, context: SetupWorkerInternalContext): SetupWorkerApi['start'];
