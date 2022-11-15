import { InterceptorApi } from '@mswjs/interceptors';
import { SetupWorkerInternalContext, StartOptions } from '../../setupWorker/glossary';
export declare function createFallbackRequestListener(context: SetupWorkerInternalContext, options: StartOptions): InterceptorApi;
