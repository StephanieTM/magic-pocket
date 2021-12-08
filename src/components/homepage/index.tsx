import React, { useState } from 'react';

export default function Homepage(): JSX.Element {
  const [contentSwitch, setContentSwitch] = useState<boolean>(false);

  function handleSwitch() {
    setContentSwitch(!contentSwitch);
  }

  return (
    <div onClick={handleSwitch}>
      {contentSwitch ? (
        <div>Congrats 🎉</div>
      ) : (
        <div>Hello World!</div>
      )}
    </div>
  );
}
