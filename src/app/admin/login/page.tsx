'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Lock, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error('Email ou senha incorretos');
      setLoading(false);
      return;
    }

    toast.success('Bem-vindo!');
    router.push('/admin');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-terra/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-moss/8 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-display text-3xl font-bold text-ink mb-1">Beto Baltazar</div>
          <p className="text-[10px] tracking-[3px] text-moss uppercase font-medium">
            Painel do Corretor
          </p>
        </div>

        <form onSubmit={onLogin} className="card-base p-8 space-y-5">
          <div>
            <p className="text-xs tracking-[3px] text-terra uppercase font-semibold mb-2">Acesso restrito</p>
            <h1 className="font-display text-2xl font-bold text-ink">
              Entre na sua conta
            </h1>
          </div>

          <div>
            <label className="field-label">E-mail</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="field-input pl-10"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div>
            <label className="field-label">Senha</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="field-input pl-10"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Entrando...</> : 'Entrar'}
          </button>

          <p className="text-xs text-center text-ink-soft/60 pt-4 border-t border-border">
            Acesso exclusivo do gestor. Para suporte, entre em contato com o desenvolvedor.
          </p>
        </form>
      </div>
    </div>
  );
}
