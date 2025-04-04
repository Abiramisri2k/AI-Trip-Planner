import React from 'react';
import { Button } from './ui/button';
import { Link } from 'react-router-dom';

function Hero() {
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-5xl text-center font-bold mt-16 mb-8">
        Plan Your Next Adventure with AI
      </h1>
      <p className="text-2xl text-center text-gray-600 mb-8">
        Get personalized travel recommendations powered by AI.
      </p>

      <Link to={"/Create-trip"}>
        <Button className="px-8 py-4">Get Started</Button>
      </Link>
    </div>
  );
}

export default Hero;
