import Checkbox from '../../../form/components/CheckBox'
import Avatar from '../../../shared/components/avatar/Avatar'
import Identity from '../../../shared/components/identity/Identity'
import content from '../../data/content.json'
import styles from './Card.module.css'
import ButtonV1 from '../../../shared/components/buttons/ButtonV1'
import type { ContentConfig } from '../../types/content.types'
import type { UserGitHubProfile } from '../../hooks/GitHubContext'
import { useSearchContext } from '../../hooks/GitHubContext'

interface CardProps {
  user: UserGitHubProfile;
  onButtonClick: (userId: number) => void;
  buttonText?: string;
  className?: string;
  avatarSize?: number;
}

export default function Card({
  user,
  onButtonClick,
  buttonText,
  className = '',
  avatarSize = 90,
}: CardProps) {
  const { card } = content as ContentConfig;
  const { state, toggleUserSelection, editMode } = useSearchContext();

  const isSelected = Boolean(state.selectedUsers[user.id as unknown as number]);

  return (
    <div className={`${styles.card} ${className}`}>
    {editMode && <div className={styles.checkboxWrapper}>
      <Checkbox
        checked={isSelected}
        onChange={() => toggleUserSelection(user.id as unknown as number)}
        text={card.checkbox.text}
        customStyles={{
          checkboxCustom: {
            borderColor: 'black',
            borderWidth: '4px',
            backgroundColor: 'var(--color-tertiary)',
          },
          checkboxChecked: {
            backgroundColor: 'var(--color-tertiary)',
            borderColor: 'black',
            borderWidth: '4px',
          },
          checkmark: {
            color: 'black',
          }
        }}
      />
    </div>}
      <div className={styles.content}>
        <Avatar
          src={user.avatar_url}
          alt={card.avatar.alt}
          text={card.avatar.defaultText}
          size={avatarSize}
          className="card_search_name"
        />
        <Identity id={user.id} login={user.login} />
        <ButtonV1
          text={buttonText || card.button.text}
          onClick={() => onButtonClick(user.id as unknown as number)}
          className="primary-btn"
        />
      </div>
    </div>
  )
}