import _ from 'lodash';

import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { getBackendSrv, TemplateSrv } from '@grafana/runtime';
import { SosQuery, SosDataSourceOptions } from './types';
import { DsosCache } from './CacheLayer';

export class SosDataSource extends DataSourceApi<SosQuery, SosDataSourceOptions> {
  type: string;
  name: string;
  url: any;
  dsosCache: DsosCache;
  constructor(instanceSettings: DataSourceInstanceSettings<SosDataSourceOptions>, private templateSrv: TemplateSrv) {
    super(instanceSettings);
    this.type = instanceSettings.type;
    this.url = _.map(instanceSettings.url?.split(','), (url) => {
      return url.trim();
    });
    this.name = instanceSettings.name;
    this.templateSrv = templateSrv;
    this.dsosCache = new DsosCache(10);
  }

  buildQueryParameters(options: any) {
    let targets = _.map(options.targets, (target) => {
      return {
        target: this.templateSrv.replace(target.target) || null,
        container: this.templateSrv.replace(target.container) || null,
        schema: this.templateSrv.replace(target.schema) || null,
        query_type: target.queryType || 'metrics',
        filters: this.templateSrv.replace(target.filters) || null,
        format: this.templateSrv.replace(target.format) || 'time_series',
        analysis_module: this.templateSrv.replace(target.analysisModule) || null,
        extra_params: this.templateSrv.replace(target.extraParams) || null,
        refId: target.refId,
        hide: target.hide,
      };
    });

    options.targets = targets;
    return options;
  }

  async doSosRequest(options: { method: string; url: any; data?: any; withCredentials?: any; headers: any }) {
    // use datasourceRequest rather than fetch for backwards compatability
    return getBackendSrv().datasourceRequest(options);
  }

  // Code to map template variable query response
  mapMetricToTextValue(result: any) {
    return {
      data: _.map(result.data, (d, i) => {
        if (d && d.text && d.value) {
          return { text: d.text, value: d.value };
        }
        return { text: d, value: i };
      }),
    };
  }

  async query(options: DataQueryRequest<SosQuery>): Promise<DataQueryResponse> {
    const params = this.buildQueryParameters(options);
    const req_opts = {
      method: 'POST',
      url: this.url + '/query',
      data: params,
      headers: { 'Content-Type': 'application/json' },
    };
    let cacheRecord: any = this.dsosCache.get(this.url, params);
    if (cacheRecord !== null) {
      //return new Promise((resolve) => resolve(this.dsosCache.get(this.url, params)));
      if (cacheRecord[1] !== null) {
        const full_from = params.range.from;
        const full_to = params.range.to;
        let partial = await this.partialDSosQuery(req_opts, cacheRecord[1]);
        let i = 0;
        if (partial.data.length === cacheRecord[0].result.data.length) {
          while (i < cacheRecord[0].result.data.length) {
            partial.data[i].datapoints = partial.data[i].datapoints.concat(cacheRecord[0].result.data[i].datapoints);
            i += 1;
          }
        }
        partial.config.data.range.from = full_from;
        partial.config.data.range.to = full_to;
        return new Promise((resolve) => resolve(partial));
      }
      return new Promise((resolve) => resolve(cacheRecord[0].result));
    }
    return this.doSosRequest(req_opts).then(async (response) => {
      if (!response.ok) {
        throw response;
      }
      this.dsosCache.set(this.url, params, response);
      return response;
    });
  }

  async partialDSosQuery(options: any, tstamps: [number, number, string]) {
    options.data.range.from = new Date(tstamps[0]);
    options.data.range.to = new Date(tstamps[1]);
    let req_opts = {
      method: 'POST',
      url: this.url + '/query',
      data: options.data,
      headers: { 'Content-Type': 'application/json' },
    };
    return this.doSosRequest(req_opts).then(async (response) => {
      if (!response.ok) {
        throw response;
      }
      return response;
    });
  }

  async testDatasource() {
    // Implement a health check for your data source.
    const options = {
      url: this.url + '/',
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    };

    return this.doSosRequest(options)
      .then((response: any) => {
        if (response.status === 200) {
          return {
            status: 'success',
            message: 'Datasource connected',
            title: 'Success',
          };
        } else {
          return {
            status: 'error',
            message: 'Enable to make connection to SOS database',
            title: 'Failed',
          };
        }
      })
      .catch((err: any) => {
        return { status: 'error', message: err.message };
      });
  }
}
