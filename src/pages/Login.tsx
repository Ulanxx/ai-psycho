import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Bot, Lock, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/auth';
import { useThemeStore } from '../stores/theme';

export function LoginPage() {
  const { t } = useTranslation();
  const { isDark } = useThemeStore();
  const { isAuthenticated, login } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError(t('login.invalidCredentials'));
      }
    } catch (err) {
      setError(t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${isDark ? 'bg-dark-800' : 'bg-white'} rounded-2xl p-8 shadow-xl`}>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl tech-gradient flex items-center justify-center shadow-lg mb-4">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-2xl font-display font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {t('login.title')}
          </h1>
          <p className={`mt-2 text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('login.subtitle')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('login.username')}
            </label>
            <div className="relative">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <User className="w-5 h-5" />
              </div>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                  isDark
                    ? 'bg-dark-700 border-white/10 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                placeholder={t('login.usernamePlaceholder')}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className={`block text-sm font-medium mb-1.5 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {t('login.password')}
            </label>
            <div className="relative">
              <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                  isDark
                    ? 'bg-dark-700 border-white/10 text-white placeholder-gray-400'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
                placeholder={t('login.passwordPlaceholder')}
                required
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl tech-gradient text-white hover:opacity-90 active:opacity-80 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isLoading ? t('login.loggingIn') : t('login.login')}
          </button>
        </form>
      </div>
    </div>
  );
}