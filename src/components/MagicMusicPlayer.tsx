// Test minimal : juste une balise audio avec un bouton
export default function MagicMusicPlayer() {
  return (
    <div style={{
      position: 'fixed',
      bottom: '100px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      alignItems: 'center'
    }}>
      <audio id="hm-player" loop preload="auto" style={{ display: 'none' }}>
        <source src="/histoire-magique/audio/histoire-magique-theme.mp3" type="audio/mpeg" />
      </audio>
      <button
        id="hm-play-btn"
        onClick={() => {
          const a = document.getElementById('hm-player') as HTMLAudioElement;
          if (a.paused) {
            a.play().catch(e => alert('Erreur: ' + e.message));
          } else {
            a.pause();
          }
        }}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f59e0b, #7c3aed)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(124,58,237,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '24px'
        }}
      >
        ▶
      </button>
    </div>
  );
}
