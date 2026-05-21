import { FormEvent, useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export const AuthCard = (): JSX.Element => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, register, loading, error } = useAuthStore();

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (isLogin) {
      await login(email, password);
      return;
    }
    await register(email, password);
  };

  return (
    <div className="card w-full max-w-sm p-6">
      <h2 className="text-xl font-semibold">{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={(e) => void submit(e)} className="mt-4 space-y-4">
        <input
          className="w-full rounded border border-border bg-bg px-3 py-2"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
        />
        <input
          className="w-full rounded border border-border bg-bg px-3 py-2"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
        />
        <button className="w-full rounded bg-accent px-4 py-2 font-medium text-white" disabled={loading} type="submit">
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      {error && <p className="mt-2 text-sm text-sell">{error}</p>}
      <button className="mt-4 text-sm text-muted" onClick={() => setIsLogin((v) => !v)} type="button">
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};
