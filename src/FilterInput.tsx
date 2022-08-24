import React, { ChangeEvent, useState } from 'react';
import { Input, MenuGroup, MenuItem, WithContextMenu, InlineLabel } from '@grafana/ui';

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

/*const noRightMargin = {
  paddingRight: 0,
  marginRight: 0,
};

const getFilterClass = (theme: GrafanaTheme2) => {
  return {
    paddingLeft: 0,
    lineHeight: theme.typography.body.lineHeight,
    fontSize: theme.typography.body.fontSize,
  };
};

const openButtonClass = {
  cursor: 'pointer',
};
*/
const RemoveFilter = ({ name, onRemove }: { name: string; onRemove: () => void }) => {
  return (
    <WithContextMenu renderMenuItems={() => renderRemovableButton(onRemove)}>
      {({ openMenu }) => (
        <button className={'noRightMargin'} onClick={openMenu}>
          X
        </button>
      )}
    </WithContextMenu>
  );
};

export const FilterInp = (props: InputProps): JSX.Element => {
  //const grafanaTheme = useTheme2();
  //const filterClass = useMemo(() => 'newTheme', [grafanaTheme]);
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
        <div className={'paddingLeft: 0'}>
          <InlineLabel
            as="button"
            className={'cursor:pointer'}
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
