import React from 'react';
import { Shield, FileText, Lock } from 'lucide-react';

interface WelcomeProps {
  onSelectTab: (tab: 'notes' | 'passwords') => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onSelectTab }) => {
  return (
    <div className="text-center">
      <Shield className="w-24 h-24 mx-auto mb-8 text-yellow-400" />
      <h1 className="text-5xl font-bold mb-4">Welcome to Secure Vault</h1>
      <p className="text-xl mb-12 text-gray-300">
        Your all-in-one solution for secure note-taking and password management
      </p>
      <div className="flex justify-center space-x-6">
        <button
          onClick={() => onSelectTab('notes')}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center"
        >
          <FileText className="mr-2" /> Notes
        </button>
        <button
          onClick={() => onSelectTab('passwords')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 flex items-center"
        >
          <Lock className="mr-2" /> Passwords
        </button>
      </div>
    </div>
  );
};

export default Welcome;