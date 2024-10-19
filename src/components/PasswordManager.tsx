import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Plus, Trash2, Key, RefreshCw } from 'lucide-react';

interface Password {
  id: number;
  site: string;
  username: string;
  password: string;
}

interface PasswordManagerProps {
  isAuthenticated: boolean;
  onAuth: (status: boolean) => void;
  masterPassword: string;
  securityQuestion: string;
  securityAnswer: string;
  onSetMasterPassword: (password: string, question: string, answer: string) => void;
  onResetMasterPassword: () => void;
}

const PasswordManager: React.FC<PasswordManagerProps> = ({
  isAuthenticated,
  onAuth,
  masterPassword,
  securityQuestion,
  securityAnswer,
  onSetMasterPassword,
  onResetMasterPassword,
}) => {
  const [passwords, setPasswords] = useState<Password[]>(() => {
    const savedPasswords = localStorage.getItem('passwords');
    return savedPasswords ? JSON.parse(savedPasswords) : [];
  });
  const [newPassword, setNewPassword] = useState({ site: '', username: '', password: '' });
  const [showPasswords, setShowPasswords] = useState<{ [key: number]: boolean }>({});
  const [currentPassword, setCurrentPassword] = useState('');
  const [newMasterPassword, setNewMasterPassword] = useState('');
  const [confirmNewMasterPassword, setConfirmNewMasterPassword] = useState('');
  const [newSecurityQuestion, setNewSecurityQuestion] = useState('');
  const [newSecurityAnswer, setNewSecurityAnswer] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSecurityAnswer, setResetSecurityAnswer] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  useEffect(() => {
    localStorage.setItem('passwords', JSON.stringify(passwords));
  }, [passwords]);

  const handleLogin = () => {
    if (currentPassword === masterPassword) {
      onAuth(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSetMasterPassword = () => {
    if (newMasterPassword === confirmNewMasterPassword) {
      onSetMasterPassword(newMasterPassword, newSecurityQuestion, newSecurityAnswer);
      onAuth(true);
    } else {
      alert('Passwords do not match');
    }
  };

  const handleResetMasterPassword = () => {
    if (resetSecurityAnswer === securityAnswer) {
      if (newMasterPassword === confirmNewMasterPassword) {
        onSetMasterPassword(newMasterPassword, newSecurityQuestion, newSecurityAnswer);
        setIsResetting(false);
        setShowForgotPassword(false);
        alert('Master password has been reset');
      } else {
        alert('New passwords do not match');
      }
    } else {
      alert('Incorrect security answer');
    }
  };

  const addPassword = () => {
    if (newPassword.site.trim() === '' || newPassword.username.trim() === '' || newPassword.password.trim() === '') return;
    setPasswords([...passwords, { ...newPassword, id: Date.now() }]);
    setNewPassword({ site: '', username: '', password: '' });
  };

  const deletePassword = (id: number) => {
    setPasswords(passwords.filter((pw) => pw.id !== id));
  };

  const togglePasswordVisibility = (id: number) => {
    setShowPasswords({ ...showPasswords, [id]: !showPasswords[id] });
  };

  if (!masterPassword) {
    return (
      <div className="max-w-md mx-auto bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Set Master Password</h2>
        <input
          type="password"
          placeholder="Enter new master password"
          value={newMasterPassword}
          onChange={(e) => setNewMasterPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <input
          type="password"
          placeholder="Confirm new master password"
          value={confirmNewMasterPassword}
          onChange={(e) => setConfirmNewMasterPassword(e.target.value)}
          className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <input
          type="text"
          placeholder="Security Question"
          value={newSecurityQuestion}
          onChange={(e) => setNewSecurityQuestion(e.target.value)}
          className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <input
          type="text"
          placeholder="Security Answer"
          value={newSecurityAnswer}
          onChange={(e) => setNewSecurityAnswer(e.target.value)}
          className="w-full p-3 mb-6 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <button
          onClick={handleSetMasterPassword}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300"
        >
          Set Master Password
        </button>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto bg-white bg-opacity-10 p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6">Password Manager</h2>
        {!showForgotPassword ? (
          <>
            <input
              type="password"
              placeholder="Enter master password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 mb-6 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <button
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg w-full mb-4 transition duration-300"
            >
              Login
            </button>
            <button
              onClick={() => setShowForgotPassword(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg w-full transition duration-300"
            >
              Forgot Password
            </button>
          </>
        ) : (
          <>
            <p className="mb-2">Security Question: {securityQuestion}</p>
            <input
              type="text"
              placeholder="Security Answer"
              value={resetSecurityAnswer}
              onChange={(e) => setResetSecurityAnswer(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <input
              type="password"
              placeholder="New master password"
              value={newMasterPassword}
              onChange={(e) => setNewMasterPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <input
              type="password"
              placeholder="Confirm new master password"
              value={confirmNewMasterPassword}
              onChange={(e) => setConfirmNewMasterPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="New Security Question"
              value={newSecurityQuestion}
              onChange={(e) => setNewSecurityQuestion(e.target.value)}
              className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <input
              type="text"
              placeholder="New Security Answer"
              value={newSecurityAnswer}
              onChange={(e) => setNewSecurityAnswer(e.target.value)}
              className="w-full p-3 mb-6 bg-white bg-opacity-20 rounded-lg text-black"
            />
            <button
              onClick={handleResetMasterPassword}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-6 rounded-lg w-full transition duration-300"
            >
              Reset Master Password
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-4xl font-bold mb-8">Password Manager</h2>
      <div className="mb-8 bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
        <input
          type="text"
          placeholder="Site"
          value={newPassword.site}
          onChange={(e) => setNewPassword({ ...newPassword, site: e.target.value })}
          className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <input
          type="text"
          placeholder="Username"
          value={newPassword.username}
          onChange={(e) => setNewPassword({ ...newPassword, username: e.target.value })}
          className="w-full p-3 mb-4 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <input
          type="password"
          placeholder="Password"
          value={newPassword.password}
          onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
          className="w-full p-3 mb-6 bg-white bg-opacity-20 rounded-lg text-black"
        />
        <button
          onClick={addPassword}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition duration-300"
        >
          <Plus className="mr-2" /> Add Password
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {passwords.map((pw) => (
          <div key={pw.id} className="bg-white bg-opacity-10 p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-4">{pw.site}</h3>
            <p className="mb-2">Username: {pw.username}</p>
            <p className="mb-4 flex items-center">
              Password:{' '}
              <span className="ml-2 font-mono">
                {showPasswords[pw.id] ? pw.password : '••••••••'}
              </span>
              <button
                onClick={() => togglePasswordVisibility(pw.id)}
                className="ml-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
              >
                {showPasswords[pw.id] ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => deletePassword(pw.id)}
                className="text-red-500 hover:text-red-600 transition-colors duration-200"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PasswordManager;