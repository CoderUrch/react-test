import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/visits')  // this hits your backend
      .then(res => res.json())
      .then(data => setCount(data.count));
  }, []);

  return (
    <div className="container">
      <h1>Hello Uche. Well done for the great work done! 👋</h1>
      <p>This is your first React UI containerized for learning!</p>
      <p>{count !== null ? `Visits recorded: ${count}` : 'Loading...'}</p>
    </div>
  );
}

export default App;
