import React, { useState, useEffect } from 'react';
import { Lock, FileText, Shield, ArrowLeft } from 'lucide-react';
import Welcome from './components/Welcome';
import Notes from './components/Notes';
import PasswordManager from './components/PasswordManager';

function App() {
  const [activeTab, setActiveTab] = useState<'welcome' | 'notes' | 'passwords'>('welcome');
  const [previousTabs, setPreviousTabs] = useState<('welcome' | 'notes' | 'passwords')[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [masterPassword, setMasterPassword] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');

  useEffect(() => {
    const storedPassword = localStorage.getItem('masterPassword');
    const storedQuestion = localStorage.getItem('securityQuestion');
    const storedAnswer = localStorage.getItem('securityAnswer');
    if (storedPassword) setMasterPassword(storedPassword);
    if (storedQuestion) setSecurityQuestion(storedQuestion);
    if (storedAnswer) setSecurityAnswer(storedAnswer);
  }, []);

  useEffect(() => {
    if (activeTab === 'passwords') {
      setIsAuthenticated(false);
    }
  }, [activeTab]);

  const handleAuth = (status: boolean) => {
    setIsAuthenticated(status);
  };

  const handleSetMasterPassword = (password: string, question: string, answer: string) => {
    setMasterPassword(password);
    setSecurityQuestion(question);
    setSecurityAnswer(answer);
    localStorage.setItem('masterPassword', password);
    localStorage.setItem('securityQuestion', question);
    localStorage.setItem('securityAnswer', answer);
  };

  const handleResetMasterPassword = () => {
    setMasterPassword('');
    setSecurityQuestion('');
    setSecurityAnswer('');
    localStorage.removeItem('masterPassword');
    localStorage.removeItem('securityQuestion');
    localStorage.removeItem('securityAnswer');
  };

  const handleTabChange = (newTab: 'welcome' | 'notes' | 'passwords') => {
    setPreviousTabs([...previousTabs, activeTab]);
    setActiveTab(newTab);
  };

  const handleBack = () => {
    if (previousTabs.length > 0) {
      const newActiveTab = previousTabs.pop();
      setPreviousTabs([...previousTabs]);
      if (newActiveTab) {
        setActiveTab(newActiveTab);
      }
    } else {
      setActiveTab('welcome');
    }
  };

  const goToHome = () => {
    setActiveTab('welcome');
    setPreviousTabs([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 to-indigo-900 text-white">
      <header className="bg-black bg-opacity-30 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center cursor-pointer" onClick={goToHome}>
            <Shield className="mr-2 text-yellow-400" /> Secure Vault
          </h1>
          {activeTab !== 'welcome' && (
            <nav className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
              >
                <ArrowLeft className="inline mr-1" /> Back
              </button>
              <button
                onClick={() => handleTabChange('notes')}
                className={`mr-4 ${activeTab === 'notes' ? 'text-yellow-400' : 'hover:text-yellow-400 transition-colors duration-200'}`}
              >
                <FileText className="inline mr-1" /> Notes
              </button>
              <button
                onClick={() => handleTabChange('passwords')}
                className={activeTab === 'passwords' ? 'text-yellow-400' : 'hover:text-yellow-400 transition-colors duration-200'}
              >
                <Lock className="inline mr-1" /> Passwords
              </button>
            </nav>
          )}
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        {activeTab === 'welcome' && <Welcome onSelectTab={handleTabChange} />}
        {activeTab === 'notes' && <Notes />}
        {activeTab === 'passwords' && (
          <PasswordManager
            isAuthenticated={isAuthenticated}
            onAuth={handleAuth}
            masterPassword={masterPassword}
            securityQuestion={securityQuestion}
            securityAnswer={securityAnswer}
            onSetMasterPassword={handleSetMasterPassword}
            onResetMasterPassword={handleResetMasterPassword}
          />
        )}
      </main>
    </div>
  );
}

export default App;