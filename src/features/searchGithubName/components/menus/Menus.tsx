import IconAction from '../../../shared/components/iconAction/IconAction';
import { useSearchContext } from '../../hooks/GitHubContext';

export default function Menus() {

  const { state } = useSearchContext();


  return (
    <div className="flex-space-between">
      <div> 
        <IconAction icon={"search"} onClick={() => console.log('Search clicked')} text={`${Object.keys(state.selectedUsers).length}`} />
      </div>
      <div>
        {/* Duplicate action */}
        <IconAction
          icon="duplicate"  // or "copy"
          onClick={() => console.log('duplicateItem')}
        />

        {/* Delete action */}
        <IconAction
          icon="bin"  // or "trash"
          onClick={() => console.log('deleteItem')}
        />

      </div>

      </div>
  )
}
