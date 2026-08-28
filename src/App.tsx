/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, GameStats, Achievement, DailyMission, WalletTransaction, GameDefinition 
} from './types';
import { 
  getSavedProfile, saveProfile, 
  getSavedStats, saveStats, 
  getSavedAchievements, saveAchievements, 
  getSavedMissions, saveMissions, 
  getSavedTransactions, saveTransactions,
  updateWallet, awardXP, triggerProgress 
} from './utils/platformState';
import { GAMES_LIST, GAME_CATEGORIES } from './data/gamesList';
import Header from './components/Header';
import Footer from './components/Footer';
import PromoCarousel from './components/PromoCarousel';
import GameCard from './components/GameCard';
import WalletModal from './components/WalletModal';
import ProfileModal from './components/ProfileModal';
import DailyRewardsModal from './components/DailyRewardsModal';
import LeaderboardModal from './components/LeaderboardModal';
import GameCabinet from './components/GameCabinet';
import CategoriesPage from './components/CategoriesPage';
import MissionsPage from './components/MissionsPage';
import RankPage from './components/RankPage';
import ProfilePage from './components/ProfilePage';
import FavoritesPage from './components/FavoritesPage';
import AudioController from './components/AudioController';
import { CoinValidationProvider } from './context/CoinContext';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Volume2, Sparkles, TrendingUp, Search } from 'lucide-react';
import { synth } from './utils/audioSynth';
import { usePerformanceManager } from './hooks/usePerformanceManager';
import { PerformanceManager } from './utils/PerformanceManager';
import { OfflinePopupModal } from './components/OfflinePopupModal';
import { AdMobBanner } from './components/AdMobBanner';
import { AdMobInterstitialModal } from './components/AdMobInterstitialModal';
import { AdMobManager } from './utils/AdMobManager';

// Mock Live Real-time Wins Tick items
interface LiveWin {
  id: string;
  user: string;
  payout: number;
  game: string;
  currency: 'coins' | 'diamonds';
}

const INITIAL_LIVE_WINS: LiveWin[] = [
  { id: 'lw1', user: 'Michael', payout: 2500000, game: 'Sky Flight', currency: 'coins' },
  { id: 'lw2', user: 'Sophia', payout: 850000, game: 'Lucky Wheel', currency: 'coins' },
  { id: 'lw3', user: 'David', payout: 3000, game: 'Gem Mines', currency: 'diamonds' },
  { id: 'lw4', user: 'Emma', payout: 4500, game: 'Card Duel', currency: 'coins' },
  { id: 'lw5', user: 'Liam', payout: 12000, game: 'Diamond Plinko', currency: 'diamonds' },
];

export default function App() {
  const { isOnline } = usePerformanceManager();

  // Global Profile states
  const [profile, setProfile] = useState<UserProfile>(getSavedProfile());
  const [stats, setStats] = useState<GameStats>(getSavedStats());
  const [achievements, setAchievements] = useState<Achievement[]>(getSavedAchievements());
  const [missions, setMissions] = useState<DailyMission[]>(getSavedMissions());
  const [transactions, setTransactions] = useState<WalletTransaction[]>(getSavedTransactions());

  // Lobby States
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [liveWins, setLiveWins] = useState<LiveWin[]>(INITIAL_LIVE_WINS);

  // Modal Dialog states
  const [walletOpen, setWalletOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dailyOpen, setDailyOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<GameDefinition | null>(null);

  const [currentTab, setCurrentTab] = useState<'home' | 'categories' | 'missions' | 'rank' | 'profile' | 'favorites'>('home');
  const [toastMsg, setToastMsg] = useState<string>('');

  // Trigger simulated live winnings ticker periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const users = ['Michael', 'Sophia', 'David', 'Emma', 'Liam', 'Olivia', 'Ethan', 'Isabella', 'Mason', 'Ava', 'Charlotte', 'Noah'];
      const games = ['Sky Flight', 'Lucky Wheel', 'Gem Mines', 'Card Duel', 'Diamond Plinko'];
      const selectedGame = games[Math.floor(Math.random() * games.length)];
      const currency = selectedGame === 'Gem Mines' || selectedGame === 'Diamond Plinko' ? 'diamonds' : 'coins';
      const payout = currency === 'diamonds'
        ? Math.floor(Math.random() * 4500) + 500
        : [150000, 250000, 850000, 1200000, 2500000][Math.floor(Math.random() * 5)];
      
      const nextWin: LiveWin = {
        id: 'lw_' + Date.now(),
        user: users[Math.floor(Math.random() * users.length)],
        payout,
        game: selectedGame,
        currency,
      };

      setLiveWins((prev) => [nextWin, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sync profile update back to state
  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    saveProfile(updated);
  };

  // State handlers wrapped with wallet ledger entries
  const handleUpdateWallet = (
    amount: number,
    currency: 'coins' | 'diamonds',
    type: 'deposit' | 'withdraw' | 'win' | 'bet' | 'reward',
    title?: string
  ) => {
    const nextProfile = updateWallet(amount, currency, type, title);
    setProfile(nextProfile);
    setTransactions(getSavedTransactions());
  };

  const handleAwardXP = (amount: number) => {
    const nextProfile = awardXP(amount);
    setProfile(nextProfile);
  };

  const handleToggleFavorite = (gameId: string) => {
    synth.playClick();
    const game = GAMES_LIST.find((g) => g.id === gameId);
    let favs = [...profile.favorites];
    let isAdding = false;
    if (favs.includes(gameId)) {
      favs = favs.filter((id) => id !== gameId);
    } else {
      favs.push(gameId);
      isAdding = true;
    }
    handleUpdateProfile({ favorites: favs });
    if (game) {
      setToastMsg(isAdding ? `Added ${game.title} to Favorites!` : `Removed ${game.title} from Favorites.`);
      setTimeout(() => setToastMsg(''), 3000);
    }
  };

  const handleClearHistory = () => {
    handleUpdateProfile({ recentlyPlayed: [] });
    setToastMsg('Cleared Recently Played history!');
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Stats recorder
  const handleRecordGamePlayed = (gameTitle: string, wonCoins: number) => {
    const updatedStats = { ...stats };
    updatedStats.gamesPlayed += 1;
    if (wonCoins > updatedStats.biggestWin) {
      updatedStats.biggestWin = wonCoins;
    }
    updatedStats.totalWon += wonCoins;

    setStats(updatedStats);
    saveStats(updatedStats);

    // Dynamic progression achievements & missions check triggers
    const { achievements: nextAch, missions: nextMis } = triggerProgress('play_3', 1);
    setAchievements(nextAch);
    setMissions(nextMis);

    if (wonCoins >= 1000) {
      const { achievements: nextAch2, missions: nextMis2 } = triggerProgress('win_1000', wonCoins);
      setAchievements(nextAch2);
      setMissions(nextMis2);
    }

    if (gameTitle === 'Sky Flight') {
      const { achievements: nextAch3 } = triggerProgress('sky_high', 1);
      setAchievements(nextAch3);
    }
  };

  const handlePlayGame = (gameId: string) => {
    if (!PerformanceManager.getState().isOnline) {
      synth.playError();
      try { if (navigator.vibrate) navigator.vibrate([100, 50, 100]); } catch {}
      return;
    }
    synth.playClick();
    const targetGame = GAMES_LIST.find((g) => g.id === gameId);
    if (targetGame) {
      let recents = [...(profile.recentlyPlayed || [])];
      recents = recents.filter((id) => id !== gameId);
      recents.unshift(gameId);
      handleUpdateProfile({ recentlyPlayed: recents.slice(0, 12) });
      setActiveGame(targetGame);
    }
  };

  // Filter Catalog
  const filteredGames = GAMES_LIST.filter((g) => {
    const matchesCategory = selectedCategory === 'All' || g.category === selectedCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <CoinValidationProvider onNavigateToLobby={() => {
      setCurrentTab('missions');
      setActiveGame(null);
      AdMobManager.showInterstitial();
    }}>
      <div className="min-h-screen bg-black text-white flex flex-col pb-20 md:pb-0 font-sans" id="app_root">
      
      {/* Top Banner Header bar */}
      <Header 
        profile={profile}
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenWallet={() => setWalletOpen(true)}
        onOpenProfile={() => setCurrentTab('profile')}
        onOpenLeaderboard={() => setCurrentTab('rank')}
        onOpenDailyRewards={() => setCurrentTab('missions')}
        onOpenFavorites={() => setCurrentTab(currentTab === 'favorites' ? 'home' : 'favorites')}
        isFavoritesActive={currentTab === 'favorites'}
      />

      {/* Main scrolling Lobby Canvas body */}
      <main className="grow max-w-7xl mx-auto w-full px-4 py-6 space-y-8">
        
        {currentTab === 'favorites' && (
          <FavoritesPage 
            profile={profile}
            onClose={() => setCurrentTab('home')}
            onPlay={handlePlayGame}
            onToggleFavorite={handleToggleFavorite}
            onClearHistory={handleClearHistory}
          />
        )}

        {currentTab === 'categories' && (
          <CategoriesPage 
            profile={profile}
            onPlayGame={handlePlayGame}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'missions' && (
          <MissionsPage 
            profile={profile}
            missions={missions}
            onUpdateWallet={handleUpdateWallet}
            onAwardXP={handleAwardXP}
            onUpdateMissions={setMissions}
          />
        )}

        {currentTab === 'rank' && (
          <RankPage 
            profile={profile}
            totalWon={stats.totalWon}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage 
            profile={profile}
            stats={stats}
            achievements={achievements}
            missions={missions}
            onUpdateProfile={handleUpdateProfile}
            onUpdateWallet={handleUpdateWallet}
          />
        )}

        {currentTab === 'home' && (
          <>
            {/* Promotional Sliders banner carousel */}
            <PromoCarousel />

            {/* Live wins ticker */}
            <section className="bg-zinc-950 border border-white/5 p-3 rounded-2xl shadow-xl overflow-hidden flex items-center">
              {/* Fixed Left Header Badge */}
              <div className="flex items-center gap-2 pr-4 shrink-0 border-r border-white/10 z-10 bg-zinc-950 font-black tracking-widest text-white uppercase text-xs">
                <span className="text-[11px] font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-400">
                  LIVE TOP WINS TODAY
                </span>
              </div>

              {/* Endless right-to-left marquee container */}
              <div className="relative flex-1 overflow-hidden ml-4">
                <div className="animate-marquee flex gap-8 items-center whitespace-nowrap">
                  {/* First duplicate */}
                  <div className="flex gap-8 items-center shrink-0">
                    {liveWins.map((win) => (
                      <div key={win.id} className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                        <span className="text-zinc-400 font-bold">👤 {win.user}</span>
                        <span className="text-zinc-500">won</span>
                        <span className={`font-black drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] ${win.currency === 'diamonds' ? 'text-purple-400' : 'text-amber-400'}`}>
                          {win.payout.toLocaleString()} {win.currency === 'diamonds' ? 'Diamonds' : 'Coins'}
                        </span>
                        <span className="text-zinc-500">in</span>
                        <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-black uppercase text-[10px] tracking-wide">{win.game}</span>
                        <span className="text-zinc-600">➔</span>
                      </div>
                    ))}
                  </div>
                  {/* Second duplicate for seamless loop */}
                  <div className="flex gap-8 items-center shrink-0">
                    {liveWins.map((win) => (
                      <div key={win.id + '_dup'} className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                        <span className="text-zinc-400 font-bold">👤 {win.user}</span>
                        <span className="text-zinc-500">won</span>
                        <span className={`font-black drop-shadow-[0_0_8px_rgba(245,158,11,0.2)] ${win.currency === 'diamonds' ? 'text-purple-400' : 'text-amber-400'}`}>
                          {win.payout.toLocaleString()} {win.currency === 'diamonds' ? 'Diamonds' : 'Coins'}
                        </span>
                        <span className="text-zinc-500">in</span>
                        <span className="bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded font-black uppercase text-[10px] tracking-wide">{win.game}</span>
                        <span className="text-zinc-600">➔</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Filter Categories Bar with horizontal scrolling */}
            <section className="space-y-3" id="categories_bar">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  Interactive Catalog
                </h3>
                <span className="text-[10px] text-gray-500 font-bold">{filteredGames.length} Games available</span>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 pr-4 scrollbar-none">
                {GAME_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      synth.playClick();
                      setSelectedCategory(cat);
                    }}
                    className={`px-4.5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition shrink-0 border ${
                      selectedCategory === cat 
                        ? 'border-red-500 bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/20' 
                        : 'border-white/5 bg-white/3 text-gray-400 hover:border-red-500/30 hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </section>

            {/* Catalog Grid of Games */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-12">
              {filteredGames.length === 0 ? (
                <div className="col-span-full py-16 text-center space-y-3">
                  <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">No games matching criteria</p>
                  <button 
                    onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                    className="px-4 py-2 rounded-xl bg-red-600 text-xs font-black uppercase text-white"
                  >
                    Clear Filters
                  </button>
                </div>
              ) : (
                filteredGames.map((game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    isFavorite={profile.favorites.includes(game.id)}
                    heartColor={profile.favoriteHeartColor}
                    onPlay={handlePlayGame}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              )}
            </section>
          </>
        )}

      </main>

      {/* Google AdMob Mobile Banner Ad (Only on non-game pages) */}
      <AdMobBanner isGameActive={!!activeGame} />

      {/* Sticky Bottom Navigation mobile drawer bar */}
      <Footer 
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
      />

      {/* Wallet dialog modal portal */}
      {walletOpen && (
        <WalletModal 
          profile={profile}
          transactions={transactions}
          onClose={() => setWalletOpen(false)}
          onUpdateWallet={handleUpdateWallet}
        />
      )}

      {/* Profile / Stats modal portal */}
      {profileOpen && (
        <ProfileModal 
          profile={profile}
          stats={stats}
          achievements={achievements}
          missions={missions}
          onClose={() => setProfileOpen(false)}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Daily streak login awards modal portal */}
      {dailyOpen && (
        <DailyRewardsModal 
          profile={profile}
          onClose={() => setDailyOpen(false)}
          onUpdateWallet={handleUpdateWallet}
          onAwardXP={handleAwardXP}
        />
      )}

      {/* Leaderboard modal portal */}
      {leaderboardOpen && (
        <LeaderboardModal 
          profile={profile}
          totalWon={stats.totalWon}
          onClose={() => setLeaderboardOpen(false)}
        />
      )}

      {/* Core Game Cabinet Console overlay */}
      {activeGame && (
        <GameCabinet 
          game={activeGame}
          profile={profile}
          onClose={() => {
            synth.playClick();
            setActiveGame(null);
            AdMobManager.showInterstitial();
          }}
          onUpdateWallet={handleUpdateWallet}
          onAwardXP={handleAwardXP}
          onRecordGamePlayed={handleRecordGamePlayed}
        />
      )}

      {/* Dynamic Toast feedback overlay */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-zinc-950/95 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider shadow-2xl shadow-black/90 backdrop-blur-md flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4 animate-pulse text-amber-400" />
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating global BGM & volume controls */}
      <AudioController />

      {/* AdMob Interstitial modal for natural transition points */}
      <AdMobInterstitialModal />

      {/* Online-Only Mode Full-Screen Luxury Popup */}
      <OfflinePopupModal isOnline={isOnline} onExitGame={() => setActiveGame(null)} />

    </div>
    </CoinValidationProvider>
  );
}
