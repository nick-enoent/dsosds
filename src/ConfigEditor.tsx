import React, { PureComponent } from 'react';
import { DataSourceHttpSettings } from '@grafana/ui';
import {
  DataSourcePluginOptionsEditorProps,
} from '@grafana/data';
import { SosDataSourceOptions } from './types';

export type Props = DataSourcePluginOptionsEditorProps<SosDataSourceOptions>;

export class ConfigEditor extends PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }
  render() {
    const { options, onOptionsChange } = this.props;

    return (
      <>
        <DataSourceHttpSettings
          defaultUrl="http://localhost:8080/grafana/"
          dataSourceConfig={options}
          onChange={onOptionsChange}
        />

      </>
    );
  }
}

export default ConfigEditor;
