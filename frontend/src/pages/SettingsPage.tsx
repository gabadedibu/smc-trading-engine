import { FormEvent, useState } from 'react';

export const SettingsPage = (): JSX.Element => {
  const [saved, setSaved] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <form onSubmit={submit} className="card space-y-3 p-4">
      <h2 className="text-lg font-semibold">Data Source Settings</h2>
      {['OANDA API Key', 'OANDA Account ID', 'Binance API Key', 'Binance Secret', 'Default Symbol', 'Default Timeframe'].map((label) => (
        <label key={label} className="block">
          <span className="mb-1 block text-sm text-muted">{label}</span>
          <input className="w-full rounded border border-border bg-bg px-3 py-2" />
        </label>
      ))}
      <button className="rounded bg-accent px-4 py-2 text-white" type="submit">Save</button>
      {saved && <p className="text-sm text-buy">Settings saved.</p>}
    </form>
  );
};
