import React, { useState } from 'react';
import './App.css';

interface DiscordUser {
  id: string;
  username: string;
  avatar: string | null;
  banner: string | null;
  public_flags: number;
  created_at: string;
  banner_color: string | null;
}

const BADGES: { [key: number]: string } = {
  // Example: 1: 'Discord Staff', 2: 'Partner', ...
};

function formatDateFromSnowflake(snowflake: string): string {
  // Discord snowflake epoch: 1420070400000
  const discordEpoch = 1420070400000;
  const binary = BigInt(snowflake);
  const timestamp = Number((binary >> BigInt(22)) + BigInt(discordEpoch));
  return new Date(timestamp).toLocaleString();
}

const App: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLookup = async () => {
    setError('');
    setUser(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/user?id=${userId}`);
      if (!res.ok) throw new Error('User not found or invalid token');
      const data = await res.json();
      setUser({
        id: data.id,
        username: `${data.username}${data.discriminator !== '0' ? '#' + data.discriminator : ''}`,
        avatar: data.avatar,
        banner: data.banner,
        public_flags: data.public_flags,
        created_at: formatDateFromSnowflake(data.id),
        banner_color: data.banner_color,
      });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getAvatarUrl = (user: DiscordUser) =>
    user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=256`
      : 'https://cdn.discordapp.com/embed/avatars/0.png';

  const getBannerUrl = (user: DiscordUser) =>
    user.banner
      ? `https://cdn.discordapp.com/banners/${user.id}/${user.banner}.png?size=512`
      : null;

  return (
    <div className="lookup-app">
      <div className="lookup-header">
        <input
          type="text"
          placeholder="Enter Discord User ID"
          value={userId}
          onChange={e => setUserId(e.target.value)}
          className="lookup-input"
        />
        <button onClick={handleLookup} className="lookup-btn" disabled={loading || !userId}>
          {loading ? 'Looking up...' : 'LOOK UP'}
        </button>
      </div>
      <div className="lookup-card">
        {error && <div className="error-msg">{error}</div>}
        {user && (
          <>
            <div className="profile-row">
              <img src={getAvatarUrl(user)} alt="avatar" className="avatar" />
              <div className="banner-container">
                {getBannerUrl(user) ? (
                  <img src={getBannerUrl(user) as string} alt="banner" className="banner" />
                ) : (
                  <div className="banner-placeholder">No Banner</div>
                )}
              </div>
            </div>
            <div className="info-row">
              <div className="info-col">
                <div><b>USER ID:</b> <span className="info-link">{user.id}</span></div>
                <div><b>USERNAME:</b> {user.username}</div>
                <div><b>BADGES:</b> {user.public_flags ? BADGES[user.public_flags] || 'N/A' : 'N/A'}</div>
                <div><b>DATE CREATED:</b> {user.created_at}</div>
              </div>
              <div className="info-col">
                <div><b>BANNER COLOR:</b> <span style={{ color: user.banner_color || '#fff', fontWeight: 'bold' }}>{user.banner_color || 'N/A'}</span></div>
                <div><b>ACTIVE REPORT COUNT:</b> <span style={{ color: 'gold', fontWeight: 'bold' }}>23 Active Reports</span></div>
                <div><b>REPORT CHARGES:</b> <span style={{ color: 'red', fontWeight: 'bold' }}>ILLEGAL PURCHASE/ATTACK/BOT/ETC/FINANCIAL/SCAM</span></div>
              </div>
            </div>
          </>
        )}
        <div className="bottom-banner">
          <img src={process.env.PUBLIC_URL + '/bottom-banner.png'} alt="bottom banner" style={{ width: '100%' }} />
        </div>
      </div>
    </div>
  );
};

export default App;
