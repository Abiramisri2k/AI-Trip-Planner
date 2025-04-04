import React from 'react';
import { Button } from './ui/button';

function Header() {
  return (
    <div className='p-1 shadow-sm flex justify-between items-center px-4'>
     <img src='/logo.png'></img>
     <div>
      <Button>Sign in</Button>
     </div>
    </div>
  );
}

export default Header;
