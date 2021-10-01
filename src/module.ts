import { DataSourcePlugin } from '@grafana/data';
import { SosDataSource } from './datasource';
import { ConfigEditor } from './ConfigEditor';
import { QueryEditor } from './QueryEditor';
import { SosQuery, SosDataSourceOptions } from './types';

export const plugin = new DataSourcePlugin<SosDataSource, SosQuery, SosDataSourceOptions>(SosDataSource)
  .setConfigEditor(ConfigEditor)
  .setQueryEditor(QueryEditor);
