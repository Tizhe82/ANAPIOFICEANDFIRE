import { StartOptions, SetupWorkerInternalContext, ServiceWorkerIncomingEventsMap } from '../../setupWorker/glossary';
import { ServiceWorkerMessage } from '../createBroadcastChannel';
export declare const createRequestListener: (context: SetupWorkerInternalContext, options: StartOptions) => (event: MessageEvent, message: ServiceWorkerMessage<'REQUEST', ServiceWorkerIncomingEventsMap['REQUEST']>) => Promise<void>;
