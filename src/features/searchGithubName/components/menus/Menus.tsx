import IconAction from '../../../shared/components/iconAction/IconAction';
import { useSearchContext } from '../../hooks/GitHubContext';

export default function Menus() {

  const { state, deleteUserSelection } = useSearchContext();


  return (
    <div className="flex-space-between">
      <div> 
        <IconAction icon={"search"} onClick={() => console.log('Search clicked')} text={`${Object.keys(state.selectedUsers).length}`} />
      </div>
      <div>
        <IconAction
          icon="duplicate"  
          onClick={() => console.log('duplicateItem')}
        />

      
        <IconAction
          icon="bin" 
          onClick={deleteUserSelection}
        />

      </div>

      </div>
  )
}
