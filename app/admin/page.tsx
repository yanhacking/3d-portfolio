'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  fetchContentFile,
  saveContentFile,
  verifyAccess,
  GitHubApiError,
  type GitHubConfig,
} from '@/lib/github';
import { encryptConfig, decryptConfig, WrongPasswordError, type VaultBlob } from '@/lib/vault';
import siteContent from '@/content/site-content.json';

interface DetailItem {
  k: string;
  v: string;
}
interface SkillItem {
  name: string;
  description: string;
}
interface ProjectItem {
  name: string;
  category: string;
  description: string;
  tech: string[];
  liveUrl: string;
  emoji: string;
  gradient: string;
}
interface EducationItem {
  date: string;
  name: string;
  school: string;
  description: string;
  tags: string[];
}
interface SiteContent {
  hero: { headline: string; tagline: string };
  about: { bio: string; details: DetailItem[] };
  skills: SkillItem[];
  projects: ProjectItem[];
  education: EducationItem[];
  contact: { email: string; phone: string; github: string };
}

const VAULT_KEY = 'yra-admin-vault';

const emptyProject: ProjectItem = {
  name: 'Nouveau projet',
  category: '',
  description: '',
  tech: [],
  liveUrl: '',
  emoji: '✨',
  gradient: 'linear-gradient(135deg,#0f172a,#06b6d4)',
};

const emptySkill: SkillItem = { name: 'Nouvelle compétence', description: '' };

const emptyEducation: EducationItem = {
  date: '',
  name: 'Nouvelle formation',
  school: '',
  description: '',
  tags: [],
};

function updateAt<T>(arr: T[], idx: number, patch: Partial<T>): T[] {
  return arr.map((item, i) => (i === idx ? { ...item, ...patch } : item));
}

function removeAt<T>(arr: T[], idx: number): T[] {
  return arr.filter((_, i) => i !== idx);
}

function parseList(str: string): string[] {
  return str
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const inputClass =
  'w-full bg-[#151515] border border-[#D7E2EA]/15 rounded-lg px-3 py-2 text-sm text-[#D7E2EA] outline-none focus:border-[#B600A8]/60 transition-colors';
const labelClass = 'text-xs uppercase tracking-widest text-[#D7E2EA]/40';
const cardClass = 'border border-[#D7E2EA]/10 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 bg-[#D7E2EA]/[0.02]';
const sectionClass = 'flex flex-col gap-4 border-b border-[#D7E2EA]/10 pb-10 mb-10';
const primaryBtnClass =
  'rounded-full px-6 py-3 text-sm font-medium uppercase tracking-widest text-white bg-gradient-to-r from-[#18011F] via-[#B600A8] to-[#BE4C00] disabled:opacity-50';
const errorBoxClass = 'text-sm text-[#ff6b6b] bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 rounded-lg px-3 py-2';

export default function AdminPage() {
  const [checkedStorage, setCheckedStorage] = useState(false);
  const [vaultBlob, setVaultBlob] = useState<VaultBlob | null>(null);

  const [config, setConfig] = useState<GitHubConfig | null>(null);
  const [data, setData] = useState<SiteContent | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'error' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [commitMessage, setCommitMessage] = useState('Mise à jour du contenu du site');

  // Locked-screen state
  const [password, setPassword] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [unlocking, setUnlocking] = useState(false);

  // Setup-screen state
  const [setupForm, setSetupForm] = useState({
    owner: 'yanhacking',
    repo: '',
    branch: 'main',
    path: 'content/site-content.json',
    token: '',
    password: '',
    confirmPassword: '',
  });
  const [setupError, setSetupError] = useState('');
  const [settingUp, setSettingUp] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(VAULT_KEY);
    if (stored) {
      try {
        setVaultBlob(JSON.parse(stored) as VaultBlob);
      } catch {
        localStorage.removeItem(VAULT_KEY);
      }
    }
    setCheckedStorage(true);
  }, []);

  async function loadContentInto(cfg: GitHubConfig) {
    const { json, sha: fileSha } = await fetchContentFile<SiteContent>(cfg);
    setData(json);
    setSha(fileSha);
    setConfig(cfg);
  }

  async function handleSetup(e: FormEvent) {
    e.preventDefault();
    setSetupError('');

    if (setupForm.password.length < 8) {
      setSetupError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }
    if (setupForm.password !== setupForm.confirmPassword) {
      setSetupError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    const cfg: GitHubConfig = {
      owner: setupForm.owner,
      repo: setupForm.repo,
      branch: setupForm.branch,
      path: setupForm.path,
      token: setupForm.token,
    };

    setSettingUp(true);
    try {
      await verifyAccess(cfg);
      const blob = await encryptConfig(cfg, setupForm.password);
      localStorage.setItem(VAULT_KEY, JSON.stringify(blob));
      setVaultBlob(blob);
      await loadContentInto(cfg);
    } catch (err) {
      setSetupError(
        err instanceof GitHubApiError ? err.message : 'Connexion impossible. Vérifiez le dépôt et le token.'
      );
    } finally {
      setSettingUp(false);
    }
  }

  async function handleUnlock(e: FormEvent) {
    e.preventDefault();
    if (!vaultBlob) return;
    setUnlockError('');
    setUnlocking(true);
    try {
      const cfg = await decryptConfig(vaultBlob, password);
      try {
        await loadContentInto(cfg);
        setPassword('');
      } catch (err) {
        setUnlockError(
          err instanceof GitHubApiError
            ? err.message
            : "Le token semble invalide ou expiré. Utilise « Réinitialiser l'accès » ci-dessous."
        );
      }
    } catch (err) {
      setUnlockError(err instanceof WrongPasswordError ? err.message : 'Mot de passe incorrect.');
    } finally {
      setUnlocking(false);
    }
  }

  function handleLock() {
    setConfig(null);
    setData(null);
    setSha(null);
    setPassword('');
  }

  function handleResetVault() {
    localStorage.removeItem(VAULT_KEY);
    setVaultBlob(null);
    setConfig(null);
    setData(null);
    setSha(null);
    setPassword('');
    setUnlockError('');
  }

  async function handleSave() {
    if (!config || !data || !sha) return;
    setStatus('saving');
    setMessage('');
    try {
      const result = await saveContentFile(config, data, sha, commitMessage || 'Mise à jour du contenu du site');
      setSha(result.sha);
      setStatus('success');
      setMessage(
        'Enregistré. Le site se reconstruit automatiquement (GitHub Actions) — les changements seront en ligne dans une à deux minutes.'
      );
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof GitHubApiError ? err.message : "Échec de l'enregistrement.");
    }
  }

  if (!checkedStorage) {
    return <main className="min-h-screen bg-[#0C0C0C]" />;
  }

  // ----- Dashboard -----
  if (config && data) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] pb-32">
        <div className="sticky top-0 z-50 bg-[#0C0C0C]/95 backdrop-blur border-b border-[#D7E2EA]/10 px-5 sm:px-8 py-4 flex flex-wrap items-center gap-3 justify-between">
          <h1 className="text-sm sm:text-base font-medium uppercase tracking-wider">
            Admin — {config.owner}/{config.repo}
          </h1>
          <div className="flex flex-wrap items-center gap-3 flex-1 justify-end">
            <input
              className={`${inputClass} max-w-xs`}
              value={commitMessage}
              onChange={(e) => setCommitMessage(e.target.value)}
              placeholder="Message du commit"
            />
            <button onClick={handleSave} disabled={status === 'saving'} className={primaryBtnClass}>
              {status === 'saving' ? 'Enregistrement…' : 'Enregistrer'}
            </button>
            <button
              onClick={handleLock}
              className="rounded-full px-5 py-2.5 text-sm font-medium uppercase tracking-widest border border-[#D7E2EA]/25 hover:bg-[#D7E2EA]/10"
            >
              Verrouiller
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mx-5 sm:mx-8 mt-4 rounded-lg px-4 py-3 text-sm ${
              status === 'error'
                ? 'bg-[#ff6b6b]/10 border border-[#ff6b6b]/30 text-[#ff6b6b]'
                : 'bg-[#0fb9b1]/10 border border-[#0fb9b1]/30 text-[#0fb9b1]'
            }`}
          >
            {message}
          </div>
        )}

        <div className="px-5 sm:px-8 pt-8 max-w-4xl mx-auto">
          {/* Hero */}
          <section className={sectionClass}>
            <h2 className="text-lg font-medium uppercase tracking-wider">Accueil</h2>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Titre principal</span>
              <input
                className={inputClass}
                value={data.hero.headline}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, headline: e.target.value } })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Sous-titre</span>
              <textarea
                className={`${inputClass} min-h-[70px]`}
                value={data.hero.tagline}
                onChange={(e) => setData({ ...data, hero: { ...data.hero, tagline: e.target.value } })}
              />
            </label>
          </section>

          {/* About */}
          <section className={sectionClass}>
            <h2 className="text-lg font-medium uppercase tracking-wider">Profil</h2>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Bio</span>
              <textarea
                className={`${inputClass} min-h-[120px]`}
                value={data.about.bio}
                onChange={(e) => setData({ ...data, about: { ...data.about, bio: e.target.value } })}
              />
            </label>

            <span className={labelClass}>Détails</span>
            {data.about.details.map((d, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  className={inputClass}
                  value={d.k}
                  placeholder="Label"
                  onChange={(e) =>
                    setData({
                      ...data,
                      about: { ...data.about, details: updateAt(data.about.details, idx, { k: e.target.value }) },
                    })
                  }
                />
                <input
                  className={inputClass}
                  value={d.v}
                  placeholder="Valeur"
                  onChange={(e) =>
                    setData({
                      ...data,
                      about: { ...data.about, details: updateAt(data.about.details, idx, { v: e.target.value }) },
                    })
                  }
                />
                <button
                  onClick={() =>
                    setData({ ...data, about: { ...data.about, details: removeAt(data.about.details, idx) } })
                  }
                  className="text-xs uppercase tracking-widest text-[#ff6b6b]/80 hover:text-[#ff6b6b] px-2 py-2 flex-shrink-0"
                >
                  Suppr.
                </button>
              </div>
            ))}
            <button
              onClick={() =>
                setData({ ...data, about: { ...data.about, details: [...data.about.details, { k: '', v: '' }] } })
              }
              className="self-start text-xs uppercase tracking-widest border border-[#D7E2EA]/25 rounded-full px-4 py-2 hover:bg-[#D7E2EA]/10"
            >
              + Ajouter un détail
            </button>
          </section>

          {/* Contact */}
          <section className={sectionClass}>
            <h2 className="text-lg font-medium uppercase tracking-wider">Contact</h2>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Email</span>
              <input
                className={inputClass}
                value={data.contact.email}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, email: e.target.value } })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Téléphone</span>
              <input
                className={inputClass}
                value={data.contact.phone}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, phone: e.target.value } })}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>GitHub (URL complète)</span>
              <input
                className={inputClass}
                value={data.contact.github}
                onChange={(e) => setData({ ...data, contact: { ...data.contact, github: e.target.value } })}
              />
            </label>
          </section>

          {/* Skills */}
          <section className={sectionClass}>
            <h2 className="text-lg font-medium uppercase tracking-wider">Compétences</h2>
            {data.skills.map((s, idx) => (
              <div key={idx} className={cardClass}>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs text-[#D7E2EA]/40">{String(idx + 1).padStart(2, '0')}</span>
                  <button
                    onClick={() => setData({ ...data, skills: removeAt(data.skills, idx) })}
                    className="text-xs uppercase tracking-widest text-[#ff6b6b]/80 hover:text-[#ff6b6b]"
                  >
                    Supprimer
                  </button>
                </div>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Nom</span>
                  <input
                    className={inputClass}
                    value={s.name}
                    onChange={(e) => setData({ ...data, skills: updateAt(data.skills, idx, { name: e.target.value }) })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Description</span>
                  <textarea
                    className={`${inputClass} min-h-[70px]`}
                    value={s.description}
                    onChange={(e) =>
                      setData({ ...data, skills: updateAt(data.skills, idx, { description: e.target.value }) })
                    }
                  />
                </label>
              </div>
            ))}
            <button
              onClick={() => setData({ ...data, skills: [...data.skills, { ...emptySkill }] })}
              className="self-start text-xs uppercase tracking-widest border border-[#D7E2EA]/25 rounded-full px-4 py-2 hover:bg-[#D7E2EA]/10"
            >
              + Ajouter une compétence
            </button>
          </section>

          {/* Projects */}
          <section className={sectionClass}>
            <h2 className="text-lg font-medium uppercase tracking-wider">Projets</h2>
            {data.projects.map((p, idx) => (
              <div key={idx} className={cardClass}>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs text-[#D7E2EA]/40">{String(idx + 1).padStart(2, '0')}</span>
                  <button
                    onClick={() => setData({ ...data, projects: removeAt(data.projects, idx) })}
                    className="text-xs uppercase tracking-widest text-[#ff6b6b]/80 hover:text-[#ff6b6b]"
                  >
                    Supprimer
                  </button>
                </div>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Nom</span>
                  <input
                    className={inputClass}
                    value={p.name}
                    onChange={(e) => setData({ ...data, projects: updateAt(data.projects, idx, { name: e.target.value }) })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Catégorie</span>
                  <input
                    className={inputClass}
                    value={p.category}
                    onChange={(e) =>
                      setData({ ...data, projects: updateAt(data.projects, idx, { category: e.target.value }) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Description</span>
                  <textarea
                    className={`${inputClass} min-h-[70px]`}
                    value={p.description}
                    onChange={(e) =>
                      setData({ ...data, projects: updateAt(data.projects, idx, { description: e.target.value }) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Technologies (séparées par des virgules)</span>
                  <input
                    className={inputClass}
                    value={p.tech.join(', ')}
                    onChange={(e) =>
                      setData({ ...data, projects: updateAt(data.projects, idx, { tech: parseList(e.target.value) }) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>
                    Lien du site en ligne (laisser vide si aucun → affichera GitHub)
                  </span>
                  <input
                    className={inputClass}
                    value={p.liveUrl}
                    onChange={(e) =>
                      setData({ ...data, projects: updateAt(data.projects, idx, { liveUrl: e.target.value }) })
                    }
                  />
                </label>
                <div className="flex gap-3">
                  <label className="flex flex-col gap-1 w-24">
                    <span className={labelClass}>Emoji</span>
                    <input
                      className={inputClass}
                      value={p.emoji}
                      onChange={(e) =>
                        setData({ ...data, projects: updateAt(data.projects, idx, { emoji: e.target.value }) })
                      }
                    />
                  </label>
                  <label className="flex flex-col gap-1 flex-1">
                    <span className={labelClass}>Dégradé CSS (background)</span>
                    <input
                      className={inputClass}
                      value={p.gradient}
                      onChange={(e) =>
                        setData({ ...data, projects: updateAt(data.projects, idx, { gradient: e.target.value }) })
                      }
                    />
                  </label>
                  <div className="flex flex-col gap-1">
                    <span className={labelClass}>Aperçu</span>
                    <div className="w-12 h-9 rounded-lg border border-[#D7E2EA]/15" style={{ background: p.gradient }} />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setData({ ...data, projects: [...data.projects, { ...emptyProject }] })}
              className="self-start text-xs uppercase tracking-widest border border-[#D7E2EA]/25 rounded-full px-4 py-2 hover:bg-[#D7E2EA]/10"
            >
              + Ajouter un projet
            </button>
          </section>

          {/* Education */}
          <section className={sectionClass}>
            <h2 className="text-lg font-medium uppercase tracking-wider">Formation</h2>
            {data.education.map((ed, idx) => (
              <div key={idx} className={cardClass}>
                <div className="flex justify-between items-start gap-3">
                  <span className="text-xs text-[#D7E2EA]/40">{String(idx + 1).padStart(2, '0')}</span>
                  <button
                    onClick={() => setData({ ...data, education: removeAt(data.education, idx) })}
                    className="text-xs uppercase tracking-widest text-[#ff6b6b]/80 hover:text-[#ff6b6b]"
                  >
                    Supprimer
                  </button>
                </div>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Date</span>
                  <input
                    className={inputClass}
                    value={ed.date}
                    onChange={(e) => setData({ ...data, education: updateAt(data.education, idx, { date: e.target.value }) })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Titre</span>
                  <input
                    className={inputClass}
                    value={ed.name}
                    onChange={(e) => setData({ ...data, education: updateAt(data.education, idx, { name: e.target.value }) })}
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>École / Organisme</span>
                  <input
                    className={inputClass}
                    value={ed.school}
                    onChange={(e) =>
                      setData({ ...data, education: updateAt(data.education, idx, { school: e.target.value }) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Description</span>
                  <textarea
                    className={`${inputClass} min-h-[70px]`}
                    value={ed.description}
                    onChange={(e) =>
                      setData({ ...data, education: updateAt(data.education, idx, { description: e.target.value }) })
                    }
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className={labelClass}>Tags (séparés par des virgules)</span>
                  <input
                    className={inputClass}
                    value={ed.tags.join(', ')}
                    onChange={(e) =>
                      setData({ ...data, education: updateAt(data.education, idx, { tags: parseList(e.target.value) }) })
                    }
                  />
                </label>
              </div>
            ))}
            <button
              onClick={() => setData({ ...data, education: [...data.education, { ...emptyEducation }] })}
              className="self-start text-xs uppercase tracking-widest border border-[#D7E2EA]/25 rounded-full px-4 py-2 hover:bg-[#D7E2EA]/10"
            >
              + Ajouter une formation
            </button>
          </section>

          <div className="flex items-center justify-between">
            <p className="text-xs text-[#D7E2EA]/30">
              Contenu publié (fallback local au build) : {siteContent.projects.length} projets,{' '}
              {siteContent.skills.length} compétences.
            </p>
            <button onClick={handleResetVault} className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 hover:text-[#ff6b6b]">
              Oublier cet appareil
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ----- Locked screen (vault exists, waiting for password) -----
  if (vaultBlob) {
    return (
      <main className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex items-center justify-center px-5">
        <form onSubmit={handleUnlock} className="w-full max-w-sm flex flex-col gap-4 border border-[#D7E2EA]/15 rounded-2xl p-6 sm:p-8">
          <h1 className="text-xl font-medium uppercase tracking-wider mb-1">Admin verrouillé</h1>
          <p className="text-xs text-[#D7E2EA]/50 -mt-1 mb-2">
            Entre ton mot de passe pour déverrouiller l&apos;accès à ce dépôt.
          </p>
          <label className="flex flex-col gap-1">
            <span className={labelClass}>Mot de passe</span>
            <input
              type="password"
              autoFocus
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {unlockError && <p className={errorBoxClass}>{unlockError}</p>}
          <button type="submit" disabled={unlocking} className={primaryBtnClass}>
            {unlocking ? 'Déverrouillage…' : 'Déverrouiller'}
          </button>
          <button
            type="button"
            onClick={handleResetVault}
            className="text-xs uppercase tracking-widest text-[#D7E2EA]/40 hover:text-[#ff6b6b] self-center mt-1"
          >
            Réinitialiser l&apos;accès
          </button>
        </form>
      </main>
    );
  }

  // ----- First-time setup screen -----
  return (
    <main className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex items-center justify-center px-5 py-16">
      <form onSubmit={handleSetup} className="w-full max-w-md flex flex-col gap-4 border border-[#D7E2EA]/15 rounded-2xl p-6 sm:p-8">
        <h1 className="text-xl font-medium uppercase tracking-wider mb-1">Configurer l&apos;accès admin</h1>
        <p className="text-xs text-[#D7E2EA]/50 leading-relaxed -mt-1 mb-2">
          Ce token n&apos;est envoyé qu&apos;à github.com. Il sera chiffré avec ton mot de passe et stocké
          uniquement dans ce navigateur — ensuite tu ne retaperas plus que le mot de passe.
        </p>

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Propriétaire (owner)</span>
          <input
            className={inputClass}
            value={setupForm.owner}
            onChange={(e) => setSetupForm((f) => ({ ...f, owner: e.target.value }))}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Dépôt (repo)</span>
          <input
            className={inputClass}
            value={setupForm.repo}
            onChange={(e) => setSetupForm((f) => ({ ...f, repo: e.target.value }))}
            placeholder="3d-portfolio"
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Branche</span>
          <input
            className={inputClass}
            value={setupForm.branch}
            onChange={(e) => setSetupForm((f) => ({ ...f, branch: e.target.value }))}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Chemin du fichier</span>
          <input
            className={inputClass}
            value={setupForm.path}
            onChange={(e) => setSetupForm((f) => ({ ...f, path: e.target.value }))}
            required
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Token GitHub (fine-grained, accès contenu de ce repo)</span>
          <input
            type="password"
            className={inputClass}
            value={setupForm.token}
            onChange={(e) => setSetupForm((f) => ({ ...f, token: e.target.value }))}
            placeholder="github_pat_..."
            required
          />
        </label>

        <div className="h-px bg-[#D7E2EA]/10 my-1" />

        <label className="flex flex-col gap-1">
          <span className={labelClass}>Choisis un mot de passe (8 caractères min.)</span>
          <input
            type="password"
            className={inputClass}
            value={setupForm.password}
            onChange={(e) => setSetupForm((f) => ({ ...f, password: e.target.value }))}
            required
            minLength={8}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={labelClass}>Confirme le mot de passe</span>
          <input
            type="password"
            className={inputClass}
            value={setupForm.confirmPassword}
            onChange={(e) => setSetupForm((f) => ({ ...f, confirmPassword: e.target.value }))}
            required
            minLength={8}
          />
        </label>

        {setupError && <p className={errorBoxClass}>{setupError}</p>}

        <button type="submit" disabled={settingUp} className={`mt-2 ${primaryBtnClass}`}>
          {settingUp ? 'Vérification…' : 'Configurer et se connecter'}
        </button>
      </form>
    </main>
  );
}
