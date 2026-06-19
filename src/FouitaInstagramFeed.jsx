// src/FouitaInstagramFeed.jsx

function FouitaInstagramFeed() {
  return (
    <div className="ig-scroll-wrapper" style={{ width: '100%', height: '100%' }}>
      {/* วางลิงก์ iframe ที่ได้จากเว็บ Fouita ตรง src ด้านล่างนี้ครับ 👇 */}
      <iframe 
        src="https://emb.fouita.com/widget/0x4b0c82/ftv7xly1q" 
        title="Instagram Feed" 
        width="100%" 
        height="100%" 
        style={{ border: 'none', borderRadius: '12px' }}
      ></iframe>
    </div>
  );
}

export default FouitaInstagramFeed;