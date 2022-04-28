import _ from 'lodash';

import { DataQueryRequest, DataQueryResponse, DataSourceApi, DataSourceInstanceSettings } from '@grafana/data';
import { getBackendSrv, TemplateSrv } from '@grafana/runtime';
import { SosQuery, SosDataSourceOptions } from './types';

export class SosDataSource extends DataSourceApi<SosQuery, SosDataSourceOptions> {
  type: string;
  name: string;
  url: any;
  constructor(instanceSettings: DataSourceInstanceSettings<SosDataSourceOptions>, private templateSrv: TemplateSrv) {
    super(instanceSettings);
    this.type = instanceSettings.type;
    this.url = _.map(instanceSettings.url?.split(','), (url) => {
      return url.trim();
    });
    this.name = instanceSettings.name;
    this.templateSrv = templateSrv;
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
    return this.doSosRequest(req_opts);
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
