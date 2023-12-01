import React from 'react';

const Hashtag = ({ hashtag, index, handleHashtagChange, handleRemoveHashtag }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
      <input
        type="text"
        value={hashtag.text}
        maxLength={20}
        onChange={(e) => handleHashtagChange(index, e.target.value, hashtag.color)}
        placeholder={`Hashtag #${index + 1}`}
        style={{ marginRight: '10px' }}
      />
      <input
        type="color"
        value={hashtag.color}
        onChange={(e) => handleHashtagChange(index, hashtag.text, e.target.value)}
        style={{ marginRight: '10px' }}
      />
      <button onClick={() => handleRemoveHashtag(index)}>-</button>
    </div>
  );
};

export default Hashtag;
