/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Shield, 
  LogOut, 
  CheckCircle, 
  Grid, 
  Users, 
  Activity, 
  Settings, 
  Trash2, 
  Search, 
  AlertCircle,
  RefreshCw,
  Award,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Sliders,
  DollarSign,
  Plus
} from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'studio' | 'admin';
  plan: 'free' | 'pro' | 'max';
  registeredAt: string;
  mrr: number;
}

interface UserProfileProps {
  themeStyle: 'warm' | 'brutalist';
}

export default function UserProfile({ themeStyle }: UserProfileProps) {
  const isWarm = themeStyle === 'warm';

  // Auth States
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Admin Dashboard States
  const [adminUsers, setAdminUsers] = useState<UserAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'studio' | 'admin'>('all');
  const [isEditingUser, setIsEditingUser] = useState<string | null>(null);
  const [editRole, setEditRole] = useState<'user' | 'studio' | 'admin'>('user');
  const [editPlan, setEditPlan] = useState<'free' | 'pro' | 'max'>('free');

  // Load active authenticated user subscription
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFbUser(user);
      if (user) {
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          
          if (snap.exists()) {
            setProfile(snap.data() as UserAccount);
          } else {
            // Auto-provision a central user document if missing
            const activeEmail = user.email || 'designer@nordictemplatelab.dk';
            const isDefaultAdmin = activeEmail.toLowerCase() === 'ellanovachenko@gmail.com';
            const newProfile: UserAccount = {
              id: user.uid,
              name: user.displayName || 'Authorized Google Designer',
              email: activeEmail,
              role: isDefaultAdmin ? 'admin' : 'studio',
              plan: 'max',
              registeredAt: new Date().toISOString().split('T')[0],
              mrr: 499
            };
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to all users if the logged-in user is an Admin
  useEffect(() => {
    if (!profile || profile.role !== 'admin') {
      setAdminUsers([]);
      return;
    }

    const q = collection(db, 'users');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: UserAccount[] = [];
      snapshot.forEach((doc) => {
        list.push(doc.data() as UserAccount);
      });
      setAdminUsers(list);
    }, (error) => {
      console.warn("Failed to subscribe as admin inside UserProfile component:", error);
      // Fallback from localStorage
      const saved = localStorage.getItem('nordic_tenant_users');
      if (saved) {
        setAdminUsers(JSON.parse(saved));
      }
    });

    return () => unsubscribe();
  }, [profile]);

  // Handle Google Login Popup
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Authenticator failed:", error);
      alert(`Authentication aborted: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Sign Out Action
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  // Admin action: Delete a user (GDPR erasure)
  const handleDeleteUser = async (userId: string) => {
    if (userId === auth.currentUser?.uid) {
      alert("You cannot delete your own active session profile!");
      return;
    }
    if (!confirm("Are you sure you want to permanently delete this user document from Firestore (GDPR Erasure Right)?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      // Trigger a storage sync fallback if local storage exists
      const saved = localStorage.getItem('nordic_tenant_users');
      if (saved) {
        const parsed = JSON.parse(saved) as UserAccount[];
        const filtered = parsed.filter(u => u.id !== userId);
        localStorage.setItem('nordic_tenant_users', JSON.stringify(filtered));
      }
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `users/${userId}`);
    }
  };

  // Admin action: Save updated role/plan
  const handleSaveUserEdit = async (userId: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      const mrrValue = editPlan === 'max' ? 499 : editPlan === 'pro' ? 199 : 20;

      await updateDoc(userRef, {
        role: editRole,
        plan: editPlan,
        mrr: mrrValue
      });

      // Synchronize back to localstorage if local storage exists
      const saved = localStorage.getItem('nordic_tenant_users');
      if (saved) {
        const parsed = JSON.parse(saved) as UserAccount[];
        const updated = parsed.map(u => u.id === userId ? { ...u, role: editRole, plan: editPlan, mrr: mrrValue } : u);
        localStorage.setItem('nordic_tenant_users', JSON.stringify(updated));
      }
      window.dispatchEvent(new Event('storage'));
      setIsEditingUser(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    }
  };

  const startEditUser = (user: UserAccount) => {
    setIsEditingUser(user.id);
    setEditRole(user.role);
    setEditPlan(user.plan);
  };

  // Calculate Metrics
  const totalUsersCount = adminUsers.length;
  const totalMRRSum = adminUsers.reduce((acc, curr) => acc + (curr.mrr || 0), 0);
  const adminPlanBreakdown = {
    free: adminUsers.filter(u => u.plan === 'free').length,
    pro: adminUsers.filter(u => u.plan === 'pro').length,
    max: adminUsers.filter(u => u.plan === 'max').length,
  };

  // Filtering Directory Users
  const filteredUsers = adminUsers.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      {/* AUTH STATUS HEADER / HERO */}
      <div className={`p-6 border rounded-none ${
        isWarm ? 'bg-stone-50 border-stone-200' : 'bg-zinc-900 border-zinc-800'
      }`}>
        <AnimatePresence mode="wait">
          {loading ? (
            <div key="loading" className="flex items-center justify-center py-6 gap-3">
              <RefreshCw className="w-5 h-5 text-amber-500 animate-spin" />
              <span className="text-xs uppercase tracking-widest font-mono">Synchronizing Authorized Session...</span>
            </div>
          ) : fbUser && profile ? (
            <motion.div 
              key="auth-user"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4.5">
                <div className={`w-14 h-14 rounded-none border flex items-center justify-center overflow-hidden shrink-0 ${
                  isWarm ? 'border-stone-300 bg-white' : 'border-zinc-700 bg-zinc-950'
                }`}>
                  {fbUser.photoURL ? (
                    <img 
                      src={fbUser.photoURL} 
                      alt={profile.name} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <User className={`w-6 h-6 ${isWarm ? 'text-stone-400' : 'text-zinc-600'}`} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-light tracking-wide uppercase">{profile.name}</h3>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                      profile.role === 'admin' 
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                        : profile.role === 'studio' 
                          ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' 
                          : 'bg-stone-500/10 border-stone-550 text-stone-500'
                    }`}>
                      {profile.role}
                    </span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                      isWarm ? 'bg-stone-100 border-stone-200' : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                    }`}>
                      {profile.plan} spec
                    </span>
                  </div>

                  <p className="text-xs opacity-65 flex items-center gap-1.5 font-sans">
                    <Mail className="w-3.5 h-3.5 inline opacity-70" /> {profile.email}
                    <span className="opacity-40">•</span>
                    <Clock className="w-3.5 h-3.5 inline opacity-70" /> Joined {profile.registeredAt}
                  </p>
                </div>
              </div>

              {/* Sign Out Trigger */}
              <button
                onClick={handleSignOut}
                className={`py-2 px-4 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 cursor-pointer transition-all ${
                  isWarm 
                    ? 'border-stone-800 text-stone-800 hover:bg-stone-900 hover:text-white' 
                    : 'border-zinc-700 text-zinc-300 hover:bg-zinc-850 hover:text-white'
                }`}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </motion.div>
          ) : (
            <motion.div 
              key="no-auth"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center space-y-5"
            >
              <div className="max-w-md mx-auto space-y-2">
                <Shield className="w-10 h-10 text-amber-500 mx-auto animate-pulse" />
                <h3 className="text-md uppercase tracking-widest font-light">Secure License Verification Center</h3>
                <p className="text-xs opacity-65 font-sans">
                  Unauthorized Guest Session detected. Please link your verified Google Identity to automatically synchronize regional databases, inspect corporate credentials, and elevate permissions.
                </p>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className={`mx-auto py-3 px-6 border font-sans text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition cursor-pointer select-none ${
                  isWarm 
                    ? 'bg-white border-stone-300 text-stone-800 hover:bg-stone-50' 
                    : 'bg-zinc-950 border-zinc-800 text-white hover:bg-zinc-900 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)]'
                }`}
              >
                {isSigningIn ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887C18.2 16.96 15.63 19.2 12.24 19.2c-3.98 0-7.2-3.21-7.2-7.2s3.22-7.2 7.2-7.2c1.74 0 3.34.62 4.59 1.635l3.235-3.235C18.065 1.44 15.35 0 12.24 0c-6.627 0-12 5.373-12 12s5.373 12 12 12c6.288 0 11.43-4.56 11.43-11.43 0-.6-.054-1.185-.15-1.715H12.24z" />
                  </svg>
                )}
                <span>{isSigningIn ? 'Requesting Handshake...' : 'Authenticate Google Identity'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CORE PROFILE VIEWER (IF USER LOGGED IN) */}
      {fbUser && profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-sans">
          {/* Dynamic License overview */}
          <div className={`p-5 border ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'}`}>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#9c8469] mb-3">Identity Authorization Stream</h4>
            <div className="space-y-3.5 text-xs text-left">
              <div className="flex justify-between border-b pb-1.5 opacity-80">
                <span>Verification State</span>
                <span className="text-emerald-500 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Locked Secure
                </span>
              </div>
              <div className="flex justify-between border-b pb-1.5 opacity-80">
                <span>Authorized Level</span>
                <span className="font-bold uppercase">{profile.role}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 opacity-80">
                <span>Assigned Plan spec</span>
                <span className="font-bold uppercase">{profile.plan}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5 opacity-80">
                <span>Unique UID</span>
                <span className="font-mono text-[9px] truncate max-w-[120px]">{profile.id}</span>
              </div>
            </div>
          </div>

          {/* Database connections info */}
          <div className={`p-5 border md:col-span-2 ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'}`}>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#9c8469] mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-amber-500" /> Firestore Session State
            </h4>
            <div className="text-xs space-y-2 text-stone-500 dark:text-zinc-400">
              <p>
                Your design profile variables are compiled directly under Firestore document path: 
                <code className="mx-1 px-1.5 py-0.5 bg-[#2C2A27] text-amber-400 font-mono text-[10px]">
                  /users/{profile.id}
                </code>
              </p>
              <p>
                As a logged-in <strong className="text-stone-850 dark:text-zinc-200 uppercase">{profile.role}</strong>, you can design templates, access premium sandboxes, and export verified build parameters. Role structures are authenticated server-side inside Firestore rule constraints.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN DASHBOARD (ONLY SEEN BY ADMINS) */}
      {fbUser && profile && profile.role === 'admin' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 pt-2"
        >
          {/* Admin Header */}
          <div className="border-b pb-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-light uppercase tracking-wide flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-500" />
                Administrative Command Dashboard
              </h3>
              <p className="text-xs opacity-60 font-sans">
                Real-time Firebase Firestore synchronization. Conduct active auditing & GDPR right to erasure workflows.
              </p>
            </div>
            
            <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-500 py-1 px-3 uppercase tracking-widest font-mono font-bold">
              SYS_ADMIN_PRIVILEGE_HIGH
            </span>
          </div>

          {/* Diagnostic Metrics Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className={`p-4 border text-left ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-850'}`}>
              <div className="flex items-center justify-between mb-1 opacity-60">
                <span className="text-[10px] uppercase font-bold tracking-widest">Active Tenants</span>
                <Users className="w-4 h-4 text-[#9c8469]" />
              </div>
              <p className="text-2xl font-light font-mono text-stone-900 dark:text-zinc-100">{totalUsersCount}</p>
              <p className="text-[9px] opacity-50 font-sans">Active database documents</p>
            </div>

            {/* Metric 2 */}
            <div className={`p-4 border text-left ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-850'}`}>
              <div className="flex items-center justify-between mb-1 opacity-60">
                <span className="text-[10px] uppercase font-bold tracking-widest">Simulated MRR</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-light font-mono text-emerald-550 dark:text-emerald-450">
                {totalMRRSum.toLocaleString()} {isWarm ? 'DKK' : 'EUR'}
              </p>
              <p className="text-[9px] opacity-50 font-sans">Calculated subscription value</p>
            </div>

            {/* Metric 3 */}
            <div className={`p-4 border text-left ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-850'}`}>
              <div className="flex items-center justify-between mb-1 opacity-60">
                <span className="text-[10px] uppercase font-bold tracking-widest">Atelier Pro level</span>
                <Sliders className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-light font-mono text-stone-900 dark:text-zinc-100">{adminPlanBreakdown.pro}</p>
              <p className="text-[9px] opacity-50 font-sans">Mid-tier design subscriptions</p>
            </div>

            {/* Metric 4 */}
            <div className={`p-4 border text-left ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-850'}`}>
              <div className="flex items-center justify-between mb-1 opacity-60">
                <span className="text-[10px] uppercase font-bold tracking-widest">Studio Max level</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-light font-mono text-stone-900 dark:text-zinc-100">{adminPlanBreakdown.max}</p>
              <p className="text-[9px] opacity-50 font-sans">Top-tier commercial licenses</p>
            </div>
          </div>

          {/* Dynamic Table & Users Search Database */}
          <div className={`p-5 border ${isWarm ? 'bg-white border-stone-200' : 'bg-zinc-950 border-zinc-800'}`}>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-dashed border-stone-200/50">
              <div className="flex items-center gap-2">
                <Activity className="w-4.5 h-4.5 text-rose-500" />
                <span className="text-xs uppercase font-extrabold tracking-wider">Firestore Identity Registry</span>
              </div>

              {/* Filtering Interface */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search query input */}
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search name, email, UID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`p-2 pl-8 text-xs font-sans focus:outline-none focus:ring-1 focus:ring-stone-400 border w-56 ${
                      isWarm ? 'bg-white text-black' : 'bg-zinc-90 w-full'
                    }`}
                  />
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 opacity-40 text-stone-600" />
                </div>

                {/* Role filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className={`p-2 text-xs font-sans border uppercase focus:outline-none focus:ring-1 focus:ring-stone-400 ${
                    isWarm ? 'bg-white text-black' : 'bg-zinc-90 w-full text-zinc-100 border-zinc-700'
                  }`}
                >
                  <option value="all">ALL ROLES</option>
                  <option value="user">USER</option>
                  <option value="studio">STUDIO</option>
                  <option value="admin">ADMIN</option>
                </select>
              </div>
            </div>

            {/* Users Directory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans border-collapse">
                <thead>
                  <tr className={`border-b opacity-60 text-[10px] uppercase font-bold tracking-widest ${
                    isWarm ? 'text-stone-500' : 'text-zinc-400'
                  }`}>
                    <th className="py-2.5 px-3">Reg. date</th>
                    <th className="py-2.5 px-3">Name / User Identity</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3 text-center">System Role</th>
                    <th className="py-2.5 px-3 text-center">Assigned spec</th>
                    <th className="py-2.5 px-3 text-right">MRR Value</th>
                    <th className="py-2.5 px-3 text-right">Actions / Right to Erasure</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr 
                        key={user.id} 
                        className={`border-b transition-colors hover:bg-stone-50/40 dark:hover:bg-zinc-900/40 ${
                          user.id === auth.currentUser?.uid ? 'bg-amber-50/25 dark:bg-amber-950/10' : ''
                        }`}
                      >
                        <td className="py-3 px-3 font-mono text-[10px] opacity-70">
                          {user.registeredAt}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold">{user.name}</div>
                          <div className="font-mono text-[9px] opacity-40 truncate max-w-[130px]" title={user.id}>
                            UID: {user.id}
                          </div>
                        </td>
                        <td className="py-3 px-3 opacity-80 break-all select-all">
                          {user.email}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex justify-center">
                            {isEditingUser === user.id ? (
                              <select
                                value={editRole}
                                onChange={(e) => setEditRole(e.target.value as any)}
                                className={`p-1.5 border text-[10px] uppercase focus:outline-none ${
                                  isWarm ? 'bg-white' : 'bg-zinc-80 w-full text-zinc-105 border-zinc-750'
                                }`}
                              >
                                <option value="user">USER</option>
                                <option value="studio">STUDIO</option>
                                <option value="admin">ADMIN</option>
                              </select>
                            ) : (
                              <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${
                                user.role === 'admin' 
                                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' 
                                  : user.role === 'studio' 
                                    ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500' 
                                    : 'bg-stone-500/10 border-stone-300 text-stone-500'
                              }`}>
                                {user.role}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex justify-center">
                            {isEditingUser === user.id ? (
                              <select
                                value={editPlan}
                                onChange={(e) => setEditPlan(e.target.value as any)}
                                className={`p-1.5 border text-[10px] uppercase focus:outline-none ${
                                  isWarm ? 'bg-white' : 'bg-zinc-80 w-full text-zinc-105 border-zinc-750'
                                }`}
                              >
                                <option value="free">FREE</option>
                                <option value="pro">PRO</option>
                                <option value="max">MAX</option>
                              </select>
                            ) : (
                              <span className={`text-[10px] uppercase font-bold ${
                                user.plan === 'max' ? 'text-[#c5a880]' : user.plan === 'pro' ? 'text-indigo-600' : 'text-stone-400'
                              }`}>
                                {user.plan}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-[10px] opacity-75">
                          {user.mrr} kr
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex justify-end items-center gap-2">
                            {isEditingUser === user.id ? (
                              <>
                                <button
                                  onClick={() => handleSaveUserEdit(user.id)}
                                  className="text-[10px] px-2 py-1 bg-emerald-600 text-white font-semibold uppercase tracking-wider hover:bg-emerald-700 transition"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setIsEditingUser(null)}
                                  className="text-[10px] px-2 py-1 bg-stone-300 text-stone-800 font-semibold uppercase tracking-wider hover:bg-stone-400 transition"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEditUser(user)}
                                  className={`text-[10px] px-2.5 py-1 border transition uppercase ${
                                    isWarm ? 'border-stone-400 hover:bg-stone-100' : 'border-zinc-700 hover:bg-zinc-800'
                                  }`}
                                >
                                  Modify
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  disabled={user.id === auth.currentUser?.uid}
                                  className={`p-1.5 rounded-none border text-rose-500 hover:bg-rose-500/10 transition duration-150 ${
                                    user.id === auth.currentUser?.uid ? 'opacity-30 cursor-not-allowed' : 'border-rose-500/20'
                                  }`}
                                  title="GDPR Right to Erasure"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-6 text-center opacity-50 italic">
                        No registered users match search queries.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
