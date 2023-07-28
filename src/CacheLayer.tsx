type CacheResult = any;

export class DsosCache {
  private static instance: DsosCache;
  private readonly maxCache: number;
  private cache: Array<{ url: string; params: any; result: CacheResult }> = [];

  constructor(maxCache: number) {
    this.maxCache = maxCache;
    if (!DsosCache.instance) {
      return DsosCache.instance;
    }
    DsosCache.instance = this;

    return this;
  }

  set = (url: string, params: any, result: any): void => {
    if (!this.recordExists(url, params)) {
      if (this.cache.length >= this.maxCache) {
        const key = this.cache.keys().next().value;
        delete this.cache[key];
      }
      this.cache.push({
        url,
        params: {
          start: new Date(params.range.from).getTime(),
          end: new Date(params.range.to).getTime(),
          targets: params.targets,
        },
        result,
      });
    }
  };

  get = (url: string, params: any): CacheResult | null => {
    const cacheRecord = this.cache.find((x) => {
      if (x.url === url && JSON.stringify(x.params.targets) === JSON.stringify(params.targets)) {
        return (
          new Date(params.range.from).getTime() >= x.params.start && new Date(params.range.to).getTime() <= x.params.end
        );
      } else {
        return null;
      }
    });
    if (cacheRecord) {
      return cacheRecord.result;
    }
    return null;
  };
  recordExists = (url: string, params: any): boolean => {
    return !!this.get(url, params);
  };
}
