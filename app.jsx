import React, { useState, useEffect } from 'react';
import { Lock, Plus, TrendingUp, Calendar, DollarSign, X, BarChart3 } from 'lucide-react';

export default function BettingTracker() {
  const [bets, setBets] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [creatorPassword, setCreatorPassword] = useState('');
  const [showAddBet, setShowAddBet] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newBet, setNewBet] = useState({
    sport: 'cricket',
    event: '',
    pick: '',
    stake: '',
    odds: '',
    outcome: 'pending'
  });

  // DEFAULT CREATOR PASSWORD - Change this to your desired password
  const DEFAULT_PASSWORD = 'admin123';

  // Load bets and check creator status on mount
  useEffect(() => {
    loadBets();
    initializeCreatorPassword();
  }, []);

  const initializeCreatorPassword = async () => {
    try {
      const result = await window.storage.get('creator-pass', true);
      if (!result) {
        // Set default password if none exists
        await window.storage.set('creator-pass', DEFAULT_PASSWORD, true);
        console.log('Default creator password set');
      }
    } catch (error) {
      console.error('Error initializing password:', error);
    }
  };

  const loadBets = async () => {
    try {
      const result = await window.storage.get('all-bets', true);
      if (result && result.value) {
        const data = JSON.parse(result.value);
        setBets(data.bets || []);
      }
    } catch (error) {
      // No bets yet
      setBets([]);
    }
    setLoading(false);
  };

  const verifyCreator = async () => {
    if (!creatorPassword.trim()) return;
    
    try {
      const result = await window.storage.get('creator-pass', true);
      
      if (result && result.value === creatorPassword) {
        setIsCreator(true);
      } else {
        alert('Incorrect password');
      }
    } catch (error) {
      alert('Incorrect password');
      console.error('Error verifying creator:', error);
    }
    setCreatorPassword('');
  };

  const addBet = async () => {
    if (!newBet.event || !newBet.pick || !newBet.stake || !newBet.odds) {
      alert('Please fill in all fields');
      return;
    }

    const bet = {
      id: Date.now(),
      ...newBet,
      date: new Date().toISOString(),
      stake: parseFloat(newBet.stake),
      odds: parseFloat(newBet.odds)
    };

    const updatedBets = [bet, ...bets];
    
    try {
      await window.storage.set('all-bets', JSON.stringify({ bets: updatedBets }), true);
      setBets(updatedBets);
      setNewBet({ sport: 'cricket', event: '', pick: '', stake: '', odds: '', outcome: 'pending' });
      setShowAddBet(false);
    } catch (error) {
      alert('Error adding bet. Please try again.');
      console.error('Error:', error);
    }
  };

  const updateBetOutcome = async (betId, outcome) => {
    const updatedBets = bets.map(bet => 
      bet.id === betId ? { ...bet, outcome } : bet
    );
    
    try {
      await window.storage.set('all-bets', JSON.stringify({ bets: updatedBets }), true);
      setBets(updatedBets);
    } catch (error) {
      alert('Error updating bet. Please try again.');
      console.error('Error:', error);
    }
  };

  const calculateStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todaysBets = bets.filter(bet => {
      const betDate = new Date(bet.date);
      return betDate >= today && betDate < tomorrow;
    });
    
    const won = todaysBets.filter(b => b.outcome === 'won').length;
    const lost = todaysBets.filter(b => b.outcome === 'lost').length;
    const pending = todaysBets.filter(b => b.outcome === 'pending').length;
    
    const totalStaked = todaysBets.reduce((sum, bet) => sum + bet.stake, 0);
    const totalProfit = todaysBets.reduce((sum, bet) => {
      if (bet.outcome === 'won') return sum + (bet.stake * bet.odds - bet.stake);
      if (bet.outcome === 'lost') return sum - bet.stake;
      return sum;
    }, 0);

    return { won, lost, pending, totalStaked, totalProfit };
  };

  const calculatePeriodStats = (days) => {
    const now = new Date();
    const startDate = new Date(now);
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    
    const periodBets = bets.filter(bet => {
      const betDate = new Date(bet.date);
      return betDate >= startDate;
    });
    
    const won = periodBets.filter(b => b.outcome === 'won').length;
    const lost = periodBets.filter(b => b.outcome === 'lost').length;
    const pending = periodBets.filter(b => b.outcome === 'pending').length;
    const total = won + lost;
    const winRate = total > 0 ? ((won / total) * 100).toFixed(1) : 0;
    
    const totalStaked = periodBets.reduce((sum, bet) => sum + bet.stake, 0);
    const totalProfit = periodBets.reduce((sum, bet) => {
      if (bet.outcome === 'won') return sum + (bet.stake * bet.odds - bet.stake);
      if (bet.outcome === 'lost') return sum - bet.stake;
      return sum;
    }, 0);
    
    const roi = totalStaked > 0 ? ((totalProfit / totalStaked) * 100).toFixed(1) : 0;

    return { won, lost, pending, total, winRate, totalStaked, totalProfit, roi };
  };

  const stats = calculateStats();
  
  // Get today's bets for display
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const todaysBets = bets.filter(bet => {
    const betDate = new Date(bet.date);
    return betDate >= today && betDate < tomorrow;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <TrendingUp className="w-8 h-8" />
            Betting Tracker
          </h1>
          <p className="text-slate-400">Track and share your betting activity</p>
        </div>

        {/* Creator Login */}
        {!isCreator && (
          <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-yellow-500" />
              <h2 className="text-xl font-semibold">Creator Access</h2>
            </div>
            <p className="text-slate-400 mb-2 text-sm">
              Enter password to add bets and view statistics.
            </p>
            <p className="text-yellow-400 mb-4 text-xs font-semibold">
              Default password: admin123 (Change in app.jsx file)
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                value={creatorPassword}
                onChange={(e) => setCreatorPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && verifyCreator()}
                placeholder="Enter password"
                className="flex-1 px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
              />
              <button
                onClick={verifyCreator}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
              >
                Unlock
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-slate-300">Today's Stats</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4">
            <div className="text-green-400 text-sm mb-1">Won</div>
            <div className="text-2xl font-bold">{stats.won}</div>
          </div>
          <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded-lg p-4">
            <div className="text-red-400 text-sm mb-1">Lost</div>
            <div className="text-2xl font-bold">{stats.lost}</div>
          </div>
          <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
            <div className="text-yellow-400 text-sm mb-1">Pending</div>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </div>
          <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
            <div className="text-blue-400 text-sm mb-1">Total Staked</div>
            <div className="text-2xl font-bold">₹{stats.totalStaked.toFixed(0)}</div>
          </div>
          <div className={`${stats.totalProfit >= 0 ? 'bg-green-600' : 'bg-red-600'} bg-opacity-20 border ${stats.totalProfit >= 0 ? 'border-green-600' : 'border-red-600'} rounded-lg p-4`}>
            <div className={`${stats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'} text-sm mb-1`}>Profit/Loss</div>
            <div className="text-2xl font-bold">₹{stats.totalProfit >= 0 ? '+' : ''}{stats.totalProfit.toFixed(0)}</div>
          </div>
        </div>

        {/* Add Bet Button */}
        {isCreator && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setShowAddBet(true)}
              className="px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Bet
            </button>
            <button
              onClick={() => setShowStats(true)}
              className="px-6 py-4 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold text-lg flex items-center justify-center gap-2 transition-colors"
            >
              <BarChart3 className="w-5 h-5" />
              View Stats
            </button>
          </div>
        )}

        {/* Add Bet Modal */}
        {showAddBet && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Bet</h3>
                <button onClick={() => setShowAddBet(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Sport</label>
                  <select
                    value={newBet.sport}
                    onChange={(e) => setNewBet({...newBet, sport: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="cricket">Cricket</option>
                    <option value="tennis">Tennis</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Event</label>
                  <input
                    type="text"
                    value={newBet.event}
                    onChange={(e) => setNewBet({...newBet, event: e.target.value})}
                    placeholder={newBet.sport === 'cricket' ? 'e.g., India vs Australia' : 'e.g., Djokovic vs Nadal'}
                    className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Your Pick</label>
                  <input
                    type="text"
                    value={newBet.pick}
                    onChange={(e) => setNewBet({...newBet, pick: e.target.value})}
                    placeholder={newBet.sport === 'cricket' ? 'e.g., India to win' : 'e.g., Djokovic to win'}
                    className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Stake (₹)</label>
                    <input
                      type="number"
                      value={newBet.stake}
                      onChange={(e) => setNewBet({...newBet, stake: e.target.value})}
                      placeholder="1000"
                      className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Odds</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newBet.odds}
                      onChange={(e) => setNewBet({...newBet, odds: e.target.value})}
                      placeholder="2.00"
                      className="w-full px-4 py-2 bg-slate-700 rounded border border-slate-600 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                <button
                  onClick={addBet}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-semibold transition-colors"
                >
                  Add Bet
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Modal */}
        {showStats && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full border border-slate-700 my-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" />
                  Performance Statistics
                </h3>
                <button onClick={() => setShowStats(false)} className="text-slate-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {(() => {
                const weekStats = calculatePeriodStats(7);
                const monthStats = calculatePeriodStats(30);
                const allTimeStats = calculatePeriodStats(365);
                
                return (
                  <div className="space-y-6">
                    {/* Weekly Stats */}
                    <div className="bg-slate-900 rounded-lg p-5 border border-slate-700">
                      <h4 className="text-lg font-semibold mb-4 text-blue-400">Last 7 Days</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Total Bets</div>
                          <div className="text-2xl font-bold">{weekStats.total}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Win Rate</div>
                          <div className="text-2xl font-bold text-green-400">{weekStats.winRate}%</div>
                          <div className="text-xs text-slate-500">{weekStats.won}W - {weekStats.lost}L</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Profit/Loss</div>
                          <div className={`text-2xl font-bold ${weekStats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ₹{weekStats.totalProfit >= 0 ? '+' : ''}{weekStats.totalProfit.toFixed(0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">ROI</div>
                          <div className={`text-2xl font-bold ${weekStats.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {weekStats.roi >= 0 ? '+' : ''}{weekStats.roi}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Monthly Stats */}
                    <div className="bg-slate-900 rounded-lg p-5 border border-slate-700">
                      <h4 className="text-lg font-semibold mb-4 text-purple-400">Last 30 Days</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Total Bets</div>
                          <div className="text-2xl font-bold">{monthStats.total}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Win Rate</div>
                          <div className="text-2xl font-bold text-green-400">{monthStats.winRate}%</div>
                          <div className="text-xs text-slate-500">{monthStats.won}W - {monthStats.lost}L</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Profit/Loss</div>
                          <div className={`text-2xl font-bold ${monthStats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ₹{monthStats.totalProfit >= 0 ? '+' : ''}{monthStats.totalProfit.toFixed(0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">ROI</div>
                          <div className={`text-2xl font-bold ${monthStats.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {monthStats.roi >= 0 ? '+' : ''}{monthStats.roi}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* All Time Stats */}
                    <div className="bg-slate-900 rounded-lg p-5 border border-slate-700">
                      <h4 className="text-lg font-semibold mb-4 text-yellow-400">All Time</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Total Bets</div>
                          <div className="text-2xl font-bold">{allTimeStats.total}</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Win Rate</div>
                          <div className="text-2xl font-bold text-green-400">{allTimeStats.winRate}%</div>
                          <div className="text-xs text-slate-500">{allTimeStats.won}W - {allTimeStats.lost}L</div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">Profit/Loss</div>
                          <div className={`text-2xl font-bold ${allTimeStats.totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            ₹{allTimeStats.totalProfit >= 0 ? '+' : ''}{allTimeStats.totalProfit.toFixed(0)}
                          </div>
                        </div>
                        <div>
                          <div className="text-slate-400 text-sm mb-1">ROI</div>
                          <div className={`text-2xl font-bold ${allTimeStats.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {allTimeStats.roi >= 0 ? '+' : ''}{allTimeStats.roi}%
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Sport Breakdown */}
                    <div className="bg-slate-900 rounded-lg p-5 border border-slate-700">
                      <h4 className="text-lg font-semibold mb-4 text-orange-400">Sport Breakdown (Last 30 Days)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {(() => {
                          const cricketBets = bets.filter(b => {
                            const betDate = new Date(b.date);
                            const thirtyDaysAgo = new Date();
                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                            return b.sport === 'cricket' && betDate >= thirtyDaysAgo;
                          });
                          const tennisBets = bets.filter(b => {
                            const betDate = new Date(b.date);
                            const thirtyDaysAgo = new Date();
                            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                            return b.sport === 'tennis' && betDate >= thirtyDaysAgo;
                          });
                          
                          const cricketWon = cricketBets.filter(b => b.outcome === 'won').length;
                          const cricketLost = cricketBets.filter(b => b.outcome === 'lost').length;
                          const cricketTotal = cricketWon + cricketLost;
                          const cricketWinRate = cricketTotal > 0 ? ((cricketWon / cricketTotal) * 100).toFixed(1) : 0;
                          
                          const tennisWon = tennisBets.filter(b => b.outcome === 'won').length;
                          const tennisLost = tennisBets.filter(b => b.outcome === 'lost').length;
                          const tennisTotal = tennisWon + tennisLost;
                          const tennisWinRate = tennisTotal > 0 ? ((tennisWon / tennisTotal) * 100).toFixed(1) : 0;
                          
                          return (
                            <>
                              <div className="bg-orange-600 bg-opacity-20 border border-orange-600 rounded p-4">
                                <div className="font-semibold mb-2">🏏 Cricket</div>
                                <div className="text-sm text-slate-400">Win Rate: <span className="text-white font-bold">{cricketWinRate}%</span></div>
                                <div className="text-xs text-slate-500">{cricketWon}W - {cricketLost}L ({cricketTotal} bets)</div>
                              </div>
                              <div className="bg-purple-600 bg-opacity-20 border border-purple-600 rounded p-4">
                                <div className="font-semibold mb-2">🎾 Tennis</div>
                                <div className="text-sm text-slate-400">Win Rate: <span className="text-white font-bold">{tennisWinRate}%</span></div>
                                <div className="text-xs text-slate-500">{tennisWon}W - {tennisLost}L ({tennisTotal} bets)</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Bets List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Today's Bets</h2>
            <span className="text-slate-400 text-sm">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          
          {todaysBets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No bets today</p>
              <p className="text-sm">Creator can add bets to get started</p>
            </div>
          ) : (
            todaysBets.map(bet => (
              <div key={bet.id} className="bg-slate-800 rounded-lg p-5 border border-slate-700">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${bet.sport === 'cricket' ? 'bg-orange-600' : 'bg-purple-600'}`}>
                        {bet.sport === 'cricket' ? '🏏 Cricket' : '🎾 Tennis'}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold mb-1">{bet.event}</h3>
                    <p className="text-blue-400 mb-2">{bet.pick}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ₹{bet.stake}
                      </div>
                      <div>Odds: {bet.odds}</div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(bet.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {isCreator ? (
                    <select
                      value={bet.outcome}
                      onChange={(e) => updateBetOutcome(bet.id, e.target.value)}
                      className={`px-3 py-1 rounded font-medium text-sm border-2 ${
                        bet.outcome === 'won' ? 'bg-green-600 border-green-600' :
                        bet.outcome === 'lost' ? 'bg-red-600 border-red-600' :
                        'bg-yellow-600 border-yellow-600'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded font-medium text-sm ${
                      bet.outcome === 'won' ? 'bg-green-600' :
                      bet.outcome === 'lost' ? 'bg-red-600' :
                      'bg-yellow-600'
                    }`}>
                      {bet.outcome.charAt(0).toUpperCase() + bet.outcome.slice(1)}
                    </span>
                  )}
                </div>
                
                {bet.outcome !== 'pending' && (
                  <div className={`text-sm font-semibold ${bet.outcome === 'won' ? 'text-green-400' : 'text-red-400'}`}>
                    {bet.outcome === 'won' ? '+' : '-'}₹{Math.abs(bet.outcome === 'won' ? bet.stake * bet.odds - bet.stake : bet.stake).toFixed(2)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>Showing today's bets only • All users can view • Only creator can add and update</p>
        </div>
      </div>
    </div>
  );
}

const { createElement: h } = React;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(BettingTracker));
