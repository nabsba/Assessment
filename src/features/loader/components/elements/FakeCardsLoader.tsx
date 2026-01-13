
import React from 'react';
import Card from '../../../searchGithubName/components/listCards/Card';
import styles from '../../../searchGithubName/components/listCards/MainListCard.module.css';

interface FakeCardsLoaderProps {
    count?: number;
}

const FakeCardsLoader: React.FC<FakeCardsLoaderProps> = ({
    count = 10
}) => {
    // Crée des faux utilisateurs
    const fakeUsers = Array.from({ length: count }, (_,) => ({
        id: `Unknown`,
        login: `Unknown`,
        avatar_url: '',
        html_url: '#',
        type: 'User',
        score: 0,
        node_id: '',
        gravatar_id: '',
        url: '',
        followers_url: '',
        following_url: '',
        gists_url: '',
        starred_url: '',
        subscriptions_url: '',
        organizations_url: '',
        repos_url: '',
        events_url: '',
        received_events_url: '',
        user_view_type: 'public',
        site_admin: false,
        isFake: true // Marqueur pour le style
    }));

    return (
        <div className={styles.cardGrid}>
            {fakeUsers.map((fakeUser) => (
                <div
                    key={fakeUser.id}
                    className={styles.cardWrapper}
                    style={{ position: 'relative' }}
                >
                    {/* Appelle le vrai composant Card avec le faux utilisateur */}
                    <Card
                        user={fakeUser}
                        onButtonClick={() => { }}
                        buttonText="View Profile"
                    />

                    {/* Overlay shimmer sur la carte */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255, 255, 255, 0.7)',
                        zIndex: 10
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: '-100%',
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
                            animation: 'shimmer 1.5s infinite'
                        }}></div>
                    </div>
                </div>
            ))}

            <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
        </div>
    );
};

export default FakeCardsLoader;