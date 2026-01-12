import { useState } from 'react';
import IconAction from '../../../shared/components/iconAction/IconAction';
import { useSearchContext } from '../../hooks/GitHubContext';
import Switch from '../../../form/components/Switch';
import content from '../../data/content.json'
import type { ContentConfig } from '../../types/content.types'
export default function Menus() {
  const { state, deleteUserSelection, duplicateUserSelection } = useSearchContext();
  const [editMode, setEditMode] = useState(false);
  const { menu } = content as ContentConfig;
  const selectedCount = Object.keys(state.selectedUsers).length;
  const hasSelectedUsers = selectedCount > 0;

  return (
    <div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <Switch
          checked={editMode}
          onChange={setEditMode}
          label={menu.editModeLabel}
          data-testid="edit-mode-switch" // Add this
        />
      </div>

      {editMode && (
        <div className="flex-space-between child">
          <div>
            <IconAction
              icon="search"
              onClick={() => console.log('Search clicked')}
              text={`${selectedCount}`}
            />
          </div>
          <div>
            <IconAction
              icon="duplicate"
              onClick={duplicateUserSelection}
              disabled={!hasSelectedUsers}
            />
            <IconAction
              icon="bin"
              onClick={deleteUserSelection}
              disabled={!hasSelectedUsers}
            />
          </div>
        </div>
      )}
    </div>
  );
}