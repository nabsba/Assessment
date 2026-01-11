import Checkbox from '../../../form/components/CheckBox'
import Avatar from '../../../shared/components/avatar/Avatar'
import Identity from '../../../shared/components/identity/Identity'
import content from '../../data/content.json'
import styles from './Card.module.css'

import ButtonV1 from '../../../shared/components/buttons/ButtonV1'
import type { ContentConfig } from '../../types/content.types'

interface CardProps {
  isSelected?: boolean;
  onSelect?: (checked: boolean) => void;
  avatarSrc?: string;
  avatarAlt?: string;
  avatarSize?: number;
  userId: number | string;
  username: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}


export default function Card({
  isSelected = false,
  onSelect,
  avatarSrc = '',
  avatarAlt,
  avatarSize = 90,
  userId,
  username,
  buttonText,
  onButtonClick,
  className = '',
}: CardProps) {
  const { card } = content as ContentConfig;

  const handleCheckboxChange = () => {
    if (onSelect) {
      onSelect(!isSelected);
    }
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <div className={`${styles.card} ${className}`}>

      <div className={styles.checkboxWrapper}>
        <Checkbox
          checked={isSelected}
          onChange={handleCheckboxChange}
          text={card.checkbox.text}
        />
      </div>


      <div className={styles.content}>
        <Avatar
          src={avatarSrc}
          alt={avatarAlt || card.avatar.alt}
          text={ card.avatar.defaultText}
          size={avatarSize}
          className="card_search_name"
        />
        <Identity id={userId} login={username} />
        <ButtonV1
          text={buttonText || card.button.text}
          onClick={handleButtonClick}
          className="primary-btn"
        />
      </div>
    </div>
  )
}