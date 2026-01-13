
import IconAction from '../../../shared/components/iconAction/IconAction';
import { useSearchContext } from '../../hooks/GitHubContext';
import Switch from '../../../form/components/Switch';
import content from '../../data/content.json'
import type { ContentConfig } from '../../types/content.types'
import FadeIn from '../../../shared/components/animations/fadeIn/FadeAnimation';
import styles from './menu.module.css';
export default function Menus() {
  const { state, deleteUserSelection, duplicateUserSelection, editMode, handleEditModeChange, toggleSelectAllUsers } = useSearchContext();
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
          onChange={handleEditModeChange}
          label={menu.editModeLabel}
          data-testid="edit-mode-switch" // Add this
        />
      </div>

      {editMode && (
        <FadeIn
          key={`fade-${editMode}`}
          opacityDuration={500}
          duration={500}
          opacityDelay={100}
          direction="top"
        >
        <div className="flex-space-between child" >
            <IconAction
              icon={hasSelectedUsers ? "stackIcon" : "stackIconEmpty"}
              onClick={() => toggleSelectAllUsers(!hasSelectedUsers)}
              text={
                <p>
                  <strong>{selectedCount > 1 ? selectedCount : ''}</strong>
                  {selectedCount
                    ? ` ${selectedCount > 1 ? menu.indiceSelections : menu.indiceSelection}`
                    : ` ${menu.selectAll}`}
                </p>
              }
            />
          <div>
            <div className={styles.wrapper_icons_right}> 
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
        </div>
        </FadeIn>
      )}
    </div>
  );
}