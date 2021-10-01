import { FilterInp } from './FilterInput';
import uniqueId from 'lodash/uniqueId';
import React, { useEffect, useState } from 'react';

type FilterConfig = {
  value: string;
  id: string;
};

type Props = {
  values?: string[];
  onChange: (newValues: string[]) => void;
};

/*yarn
const sosFilters: string[] = ['component_id', 'job_id', 'user_name', 'extra_params'];
const FilterDropDown = (props: Props): JSX.Element => {
  const data = props.data;
  return (
    <>
      <div className="gf-form-label">
        <ul className="dropdown-menu">
          {data.map(item => (
            <li key={item} className="dropdown-submenu">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
function updateFilterQuery(query: SosQuery): SosQuery {
  const qCopy = cloneDeep(query);
  const model = new SosQueryModel(qCopy);
  model.addFilter();
  return model.target;
}
*/

const createFilterConfig = (values: string[]): FilterConfig[] => {
  return values.map((value) => {
    return {
      id: uniqueId('input'),
      value,
    };
  });
};

const newFilter = (): FilterConfig => ({
  id: uniqueId('input'),
  value: '',
});

export const SosFilters = (props: Props): JSX.Element => {
  const { values, onChange } = props;
  const [filterConfigs, setFilterConfigs] = useState<FilterConfig[]>([]);

  useEffect(() => {
    if (filterConfigs.length) {
      return;
    }
    let initialFilters: FilterConfig[];
    if (!values || !values.length) {
    } else {
      initialFilters = createFilterConfig(values);
      setFilterConfigs(initialFilters);
    }
  }, [values, filterConfigs]);

  const addNewFilter = () => {
    if (filterConfigs?.length) {
      setFilterConfigs([...filterConfigs, newFilter()]);
    } else {
      setFilterConfigs([newFilter()]);
    }
  };

  const filterChangeHandler = (value: string, id: string) => {
    const newValues: string[] = [];
    const newFilters = filterConfigs?.map((input) => {
      newValues.push(input.value);
      if (input.id !== id) {
        return input;
      }

      return { ...input, value };
    });

    onChange(newValues);
    setFilterConfigs(newFilters);
  };

  const filterRemoveHandler = (id: string) => {
    const screenedFilters = filterConfigs?.filter((input) => input.id !== id);
    if (screenedFilters.length === 0) {
      setFilterConfigs([]);
    } else {
      setFilterConfigs((prevArray) => screenedFilters);
    }
  };

  const renderFilters = (input: FilterConfig) => (
    <div className="gf-form">
      <FilterInp
        key={input.id}
        value={input.value}
        id={input.id}
        onChange={filterChangeHandler}
        onRemove={filterRemoveHandler}
      />
    </div>
  );
  return (
    <>
      <div id="sos_filters" className="gf-form-inline">
        {filterConfigs.map(renderFilters)}
        <a
          className="gf-form-label fa fa-plus"
          onClick={() => {
            addNewFilter();
          }}
        />
      </div>
    </>
  );
};
