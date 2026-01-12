import IconAction from '../../../shared/components/iconAction/IconAction';
import { useSearchContext } from '../../hooks/GitHubContext';

export default function Menus() {

  const { state, deleteUserSelection, duplicateUserSelection } = useSearchContext();
  const selectedCount = Object.keys(state.selectedUsers).length;
  const hasSelectedUsers = selectedCount > 0;

  return (
    <div className="flex-space-between">
      <div> 
        <IconAction icon={"search"} onClick={() => console.log('Search clicked')} text={`${Object.keys(state.selectedUsers).length}`} />
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
  )
}
