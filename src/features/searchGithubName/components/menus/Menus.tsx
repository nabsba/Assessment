import IconAction from '../../../shared/components/iconAction/IconAction'

export default function Menus() {
  return (
    <div className="flex-space-between">
      <div> 
        <IconAction icon={"search"} onClick={() => console.log('Search clicked')} text='3 rgeg' />
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
