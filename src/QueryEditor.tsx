import defaults from 'lodash/defaults';

import React, { ChangeEvent, PureComponent } from 'react';
import { LegacyForms } from '@grafana/ui';
import { QueryEditorProps } from '@grafana/data';
import { SosDataSource } from './datasource';
import { SosFilters } from 'FilterMenu';
import { SosDataSourceOptions, SosQuery, defaultQuery } from './types';

const { FormField } = LegacyForms;

type Props = QueryEditorProps<SosDataSource, SosQuery, SosDataSourceOptions>;

interface FilterState {
  filters: string[];
}

export class QueryEditor extends PureComponent<Props, FilterState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      filters: [],
    };
  }

  onAnalysisChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, analysisModule: event.target.value });
  };
  onContainerChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, container: event.target.value });
  };
  /*
  updateFilterQuery(query: SosQuery): SosQuery {
    const qCopy = cloneDeep(query);
    const model = new SosQueryModel(qCopy);
    model.addFilter();
    return model.target;
  }*/

  onFilterChange = (newFilters: string[]) => {
    const { onChange, query } = this.props;
    this.setState({ filters: newFilters });
    onChange({ ...query, filters: this.state.filters });
  };
  onFormatChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, format: event.target.value });
  };
  onQueryTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, queryType: event.target.value });
  };
  onSchemaChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, schema: event.target.value });
  };
  onTargetChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { onChange, query } = this.props;
    onChange({ ...query, target: event.target.value });
  };
  getFilterState = () => {
    return this.state.filters;
  };

  render() {
    const query = defaults(this.props.query, defaultQuery);
    const { analysisModule, container, filters, format, queryType, schema, target } = query;

    return (
      <>
        <div className="gf-form-group">
          <div className="gf-form-inline">
            <div className="gf-form">
              <label className="gf-form-label query-keyword width-8">Query Type</label>
              <select
                value={queryType}
                defaultValue="metrics"
                className="gf-form-input width-12"
                onChange={this.onQueryTypeChange}
              >
                <option selected>metrics</option>
                <option>analysis</option>
              </select>
            </div>
            {queryType === 'analysis' && (
              <div className="gf-form">
                <label className="gf-form-label query-keyword width-8">Analysis Module</label>
                <select value={analysisModule} className="gf-form-input width-12" onChange={this.onAnalysisChange}>
                  <option></option>
                  <option>compMinMeanMax</option>
                  <option>meanMetricRate</option>
                  <option>metricRateBin</option>
                  <option>papiGetLikeJobs</option>
                  <option>papiJobsTable</option>
                  <option>papiJobStatTable</option>
                  <option>papiMeanJobMetrics</option>
                  <option>papiTimeseries</option>
                  <option>rankMemByJob</option>
                </select>
              </div>
            )}
            <div className="gf-form">
              <label className="gf-form-label query-keyword width-8">Query Format</label>
              <select
                value={format}
                className="gf-form-input width-12"
                placeholder="format"
                onChange={this.onFormatChange}
              >
                <option>time_series</option>
                <option>table</option>
                <option>heatmap</option>
              </select>
            </div>
            <div className="gf-form gf-form--grow">
              <div className="gf-form-label gf-form-label--grow"></div>
            </div>
          </div>
          <div className="gf-form-inline">
            <div className="gf-form">
              <FormField
                labelWidth={8}
                value={container}
                label="Container"
                tooltip="Name of SOS Container to query"
                onChange={this.onContainerChange}
                className="gf-form-label query-keyword"
              />
            </div>
            <div className="gf-form">
              <FormField
                labelWidth={8}
                value={schema}
                label="Schema"
                tooltip="Name of schema to query"
                onChange={this.onSchemaChange}
                className="gf-form-label query-keyword"
              />
            </div>
            <div className="gf-form gf-form--grow">
              <div className="gf-form-label gf-form-label--grow"></div>
            </div>
          </div>
          <div className="gf-form-inline">
            <div className="gf-form">
              <FormField
                labelWidth={8}
                value={target}
                onChange={this.onTargetChange}
                label="Metric"
                tooltip="Metric to query"
                className="gf-form-label query-keyword"
              />
            </div>
            <div className="gf-form gf-form--grow">
              <div className="gf-form-label gf-form-label--grow"></div>
            </div>
          </div>
          <div className="gf-form-inline">
            <div className="gf-form">
              <label className="gf-form-label query-keyword width-8">Filter</label>
            </div>
            <SosFilters onChange={this.onFilterChange} values={filters}></SosFilters>
            <div className="gf-form gf-form--grow">
              <div className="gf-form-label gf-form-label--grow"></div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
