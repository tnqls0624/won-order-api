/* eslint-disable @typescript-eslint/ban-types */
import {
  // CACHE_MANAGER,
  // DynamicModule,
  // Inject,
  Module
  // OnModuleInit,
} from '@nestjs/common';
// import {
//   DiscoveryModule,
//   DiscoveryService,
//   MetadataScanner,
//   Reflector,
// } from '@nestjs/core';
// import {Cache} from 'cache-manager';
// import {CronJob} from 'cron';
// import {
//   CacheOptions,
//   CACHE_METADATA,
// } from 'src/common/decorators/cache.decorator';
import { CacheService } from './service/cache.service';

@Module({
  // imports: [DiscoveryModule],
  providers: [CacheService],
  exports: [CacheService]
})
export class CacheStoreModule {}

// constructor(
//   private readonly discovery: DiscoveryService,
//   private readonly scanner: MetadataScanner,
//   private readonly reflector: Reflector,
// @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
// ) {}
// static forRoot(): DynamicModule {
//   return {
//     module: CacheModule,
//     global: true,
//   };
// }
// onModuleInit() {
//   this.registerAllCache();
// }
// private getCacheKey(instance: any, methodName: string, args: any[]): string {
//   const cache_key_prefix = `${instance.constructor.name}.${methodName}`;
//   const key = args.length ? JSON.stringify(args) : null;
//   return key ? `${cache_key_prefix}(${key})` : cache_key_prefix;
// }
// private async wrapMethodWithCacheLogic(
//   instance: any,
//   method_mame: string,
//   cacheManager: Cache,
//   metadata: any,
//   logger: LoggerFunction
// ) {
//   const methodRef = instance[method_mame];
//   const originMethod = (...args: unknown[]) =>
//     methodRef.call(instance, ...args);
//   return async (...args: unknown[]) => {
//     const cacheKey = this.getCacheKey(instance, method_mame, args);
//     // logger({cacheKey});
//     const cached = await cacheManager.get(cacheKey);
//     if (cached) {
//       // logger({cached});
//       return cached;
//     }
//     const data = await originMethod(...args);
//     if (!metadata.validate(data)) {
//       throw new Error('cache error');
//     }
//     // logger({data});
//     await cacheManager.set(cacheKey, data, {ttl: metadata.ttl || 0});
//     return data;
//   };
// }
// registerCacheAndJob(instance: any) {
//   const {cacheManager, reflector} = this;
//   return async (method_mame: string) => {
//     const methodRef = instance[method_mame];
//     const metadata: CacheOptions = reflector.get(CACHE_METADATA, methodRef);
//     if (!metadata) return;
//     const {cron, validate = Boolean, logger = () => null} = metadata;
//     const wrappedMethod = this.wrapMethodWithCacheLogic(
//       instance,
//       method_mame,
//       cacheManager,
//       metadata,
//       logger
//     );
//     if (cron) {
//       this.registerCron(
//         cron,
//         this.getCacheKey(instance, method_mame, []),
//         methodRef.bind(instance),
//         validate,
//         logger
//       );
//     }
//     instance[method_mame] = wrappedMethod;
//   };
// }
// private processProvider(provider: any) {
//   const instance = provider.instance;
//   this.scanner.scanFromPrototype(
//     instance,
//     Object.getPrototypeOf(instance),
//     this.registerCacheAndJob(instance)
//   );
// }
// registerAllCache() {
//   const providers = this.discovery.getProviders();
//   const valid_providers = providers
//     .filter(wrapper => wrapper.isDependencyTreeStatic())
//     .filter(({instance}) => instance && Object.getPrototypeOf(instance));
//   valid_providers.forEach(this.processProvider.bind(this));
// }
// registerCron(
//   cron: string,
//   cacheKey: string,
//   job: Function,
//   validate: Function,
//   logger: Function
// ) {
//   const handleTick = async () => {
//     try {
//       const {cacheManager} = this;
//       const cached = await cacheManager.get(cacheKey);
//       const job_data = await job();
//       logger({cacheKey, job_data});
//       const refreshed_data = validate(job_data) ? job_data : cached;
//       await cacheManager.set(cacheKey, refreshed_data, {
//         ttl: 0,
//       });
//     } catch (error) {
//       console.error('Error in handleTick:', error);
//     }
//   };
//   new CronJob(cron, handleTick).start();
//   handleTick();
// }
