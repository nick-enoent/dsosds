import React, { PureComponent } from 'react';
import { DataSourceHttpSettings, InlineFormLabel, LegacyForms } from '@grafana/ui';
import {
  DataSourcePluginOptionsEditorProps,
  onUpdateDatasourceJsonDataOptionSelect,
  SelectableValue,
} from '@grafana/data';
import { SosDataSourceOptions } from './types';

const { Select } = LegacyForms;
const sosVersion = [
  { label: 'SOS', value: 'sos' },
  { label: 'Distributed SOS', value: 'dsos' },
] as SelectableValue[];

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
        <h3 className="page-heading">Sos Details</h3>
        <div className="gf-form-group">
          <div className="gf-form-inline">
            <div className="gf-form">
              <InlineFormLabel className="width-10" tooltip="The POST method is used by default">
                Sos Version
              </InlineFormLabel>
              <Select
                className="width-10"
                value={sosVersion.find((sosVersion) => sosVersion.value === options.jsonData.sosVersion)}
                options={sosVersion}
                defaultValue={options.jsonData.sosVersion}
                onChange={onUpdateDatasourceJsonDataOptionSelect(this.props, 'sosVersion')}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default ConfigEditor;
