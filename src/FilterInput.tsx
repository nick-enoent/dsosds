import React, { ChangeEvent, useMemo, useState } from 'react';
import { cx, css } from '@emotion/css';
import { Input, MenuGroup, MenuItem, WithContextMenu, useTheme2, InlineLabel } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';

type InputProps = {
  value: string;
  onChange: (value: string, id: string) => void;
  id: string;
  onRemove: (id: string) => void;
  placeholder?: string;
  allowCustomValue?: boolean;
};

const renderRemovableButton = (onClick: () => void) => {
  return (
    <MenuGroup label="" ariaLabel="">
      <MenuItem label="remove" ariaLabel="remove" onClick={onClick} />
    </MenuGroup>
  );
};

const noRightMargin = css({
  paddingRight: '0',
  marginRight: '0',
});

const getFilterClass = (theme: GrafanaTheme2) => {
  return cx(
    'gf-form-label',
    css({
      paddingLeft: '0',
      lineHeight: theme.typography.body.lineHeight,
      fontSize: theme.typography.body.fontSize,
    })
  );
};

const openButtonClass = css({
  width: 'auto',
  cursor: 'pointer',
});

const RemoveFilter = ({ name, onRemove }: { name: string; onRemove: () => void }) => {
  return (
    <WithContextMenu renderMenuItems={() => renderRemovableButton(onRemove)}>
      {({ openMenu }) => (
        <button className={cx('gf-form-label', noRightMargin)} onClick={openMenu}>
          X
        </button>
      )}
    </WithContextMenu>
  );
};

export const FilterInp = (props: InputProps): JSX.Element => {
  const grafanaTheme = useTheme2();
  const filterClass = useMemo(() => getFilterClass(grafanaTheme), [grafanaTheme]);
  const { value, onChange, id, onRemove, placeholder } = props;
  const [isOpen, setOpen] = useState(true);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value, id);
  };
  const handleRemove = () => {
    onRemove(id);
    setOpen(false);
  };
  const handleBlur = () => {
    setOpen(false);
  };
  if (!isOpen) {
    return (
      <>
        <div className={filterClass}>
          <InlineLabel
            as="button"
            className={openButtonClass}
            onClick={() => {
              setOpen(true);
            }}
          >
            {value}
          </InlineLabel>
          <RemoveFilter name={value} onRemove={handleRemove} />
        </div>
      </>
    );
  } else {
    return (
      <Input
        autoFocus
        css
        type="text"
        value={value}
        spellCheck={false}
        onBlur={handleBlur}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );
  }
};
