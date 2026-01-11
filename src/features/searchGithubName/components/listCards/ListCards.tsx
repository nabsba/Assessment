import content from '../../data/content.json'
import Card from './Card'
import styles from './MainListCard.module.css'

import type { ContentConfig } from '../../types/content.types'


const mockUsers = [
  { id: 1, login: 'john_doe', avatar: '' },
  { id: 2, login: 'jane_smith', avatar: 'https://avatars.githubusercontent.com/u/14582?v=4' },
  { id: 3, login: 'alex_jones', avatar: '' },

  { id: 4, login: 'john_doe', avatar: 'https://avatars.githubusercontent.com/u/14582?v=4' },
  { id: 5, login: 'jane_smith', avatar: 'https://avatars.githubusercontent.com/u/14582?v=4' },
  { id: 6, login: 'alex_jones', avatar: '' },

  { id: 7, login: 'john_doe', avatar: 'https://avatars.githubusercontent.com/u/14582?v=4' },
  { id: 8, login: 'jane_smith', avatar: 'https://avatars.githubusercontent.com/u/14582?v=4' },
  { id: 9, login: 'alex_jones', avatar: '' },
  

]

export default function ListCard() {
  const { card } = content as ContentConfig;

  const handleSelectUser = (userId: number, selected: boolean) => {
    console.log(`User ${userId} selected: ${selected}`);
  };

  const handleViewProfile = (userId: number) => {
    console.log(`View profile for user ${userId}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardGrid}>
        {mockUsers.map((user) => (
          <Card
            key={user.id}
            userId={user.id}
            username={user.login}
            avatarSrc={user.avatar}
            isSelected={true}
            onSelect={(selected) => handleSelectUser(user.id, selected)}
            onButtonClick={() => handleViewProfile(user.id)}
            buttonText={card.button.text}
            className={styles.cardWrapper}
          />
        ))}
      </div>
    </div>
  )
}