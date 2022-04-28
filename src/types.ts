import { DataQuery, DataSourceJsonData } from '@grafana/data';

export interface SosVariableQuery {
  name: string;
  rawQuery: string;
}

/**
 * These are options configured for each DataSource instance
 */
export interface SosDataSourceOptions extends DataSourceJsonData {
  sosVersion?: string;
}

export interface SosQuery extends DataQuery {
  analysisModule?: string;
  container: string;
  extraParams: string;
  schema: string;
  target: string;
  filters?: string;
  format: string;
  frequency: number;
  queryType: string;
}

export const defaultQuery: Partial<SosQuery> = {
  frequency: 1.0,
};
