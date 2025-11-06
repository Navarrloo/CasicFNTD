import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Unit } from '../types';
import { UNITS, BALANCE_ICON } from './constants';

interface Profile {
  id: number;
  username: string | null;
  first_name: string;
  balance: number;
  inventory: Unit[];
}

const AdminPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [foundUser, setFoundUser] = useState<Profile | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [soulsToAdd, setSoulsToAdd] = useState<number>(0);
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);
  const [massAmount, setMassAmount] = useState<number>(100);

  const handleSearch = async () => {
    if (!searchTerm || !supabase) return;
    setIsLoading(true);
    setMessage('');
    setFoundUser(null);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', searchTerm)
      .single();

    if (error || !data) {
      setMessage(`User "${searchTerm}" not found.`);
      console.error(error);
    } else {
      setFoundUser(data as Profile);
    }
    setIsLoading(false);
  };

  const handleAddSouls = async () => {
    if (!foundUser || soulsToAdd <= 0 || !supabase) return;
    
    const newBalance = foundUser.balance + soulsToAdd;
    const { data, error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', foundUser.id)
        .select()
        .single();
    
    if (error) {
        setMessage('Error updating balance.');
    } else if (data) {
        setMessage(`${soulsToAdd} souls added to ${foundUser.username || 'the user'}.`);
        setFoundUser(data as Profile);
        setSoulsToAdd(0);
    }
  };

  const handleGiveUnit = async () => {
    if (!foundUser || !selectedUnit || !supabase) return;
    
    const currentInventory = Array.isArray(foundUser.inventory) ? foundUser.inventory : [];
    const newInventory = [...currentInventory, selectedUnit];
    
    const { data, error } = await supabase
        .from('profiles')
        .update({ inventory: newInventory })
        .eq('id', foundUser.id)
        .select()
        .single();

    if (error) {
        setMessage('Error giving unit.');
    } else if (data) {
        setMessage(`${selectedUnit.name} given to ${foundUser.username || 'the user'}.`);
        setFoundUser(data as Profile);
        setSelectedUnit(null);
    }
  };
  
  const handleClearInventory = async () => {
    if (!foundUser || !supabase) return;
    if (!window.confirm(`Are you sure you want to clear inventory for ${foundUser.username || 'this user'}?`)) return;

     const { data, error } = await supabase
        .from('profiles')
        .update({ inventory: [] })
        .eq('id', foundUser.id)
        .select()
        .single();
    
    if (error) {
        setMessage('Error clearing inventory.');
    } else if (data) {
        setMessage(`Inventory cleared for ${foundUser.username || 'the user'}.`);
        setFoundUser(data as Profile);
    }
  };

  const handleGiveAllSouls = async () => {
    if (!supabase || massAmount <= 0) return;

    if (!window.confirm(`Give ${massAmount} souls to ALL users?`)) return;

    const { data: allProfiles, error: fetchError } = await supabase
        .from('profiles')
        .select('id, balance');

    if (fetchError) {
        setMessage('Failed to fetch users.');
        return;
    }

    // Update all users
    let successCount = 0;
    for (const profile of allProfiles || []) {
        const { error } = await supabase
            .from('profiles')
            .update({ balance: profile.balance + massAmount })
            .eq('id', profile.id);
        
        if (!error) successCount++;
    }

    setMessage(`Gave ${massAmount} souls to ${successCount} users!`);
  }

  return (
    <div className="p-2 animate-fadeIn h-full flex flex-col">
      <div className="admin-panel-container flex-grow flex flex-col">
        {/* Mass Actions */}
        <div className="bg-accent-red/20 border-2 border-accent-red p-4 mb-4">
          <h2 className="font-pixel text-xl text-glow-red mb-3">⚠️ MASS ACTIONS</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <img src={BALANCE_ICON} alt="Souls" className="w-6 h-6" />
              <input
                type="number"
                value={massAmount}
                onChange={e => setMassAmount(parseInt(e.target.value) || 0)}
                className="admin-input w-32 text-center text-xl"
                placeholder="100"
              />
            </div>
            <button
              onClick={handleGiveAllSouls}
              className="btn btn-red flex-grow"
            >
              Give to ALL Players
            </button>
          </div>
          <p className="text-xs text-accent-yellow mt-2">⚠️ This will give souls to every user in database!</p>
        </div>

        {/* Header/Search */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl uppercase">{foundUser ? foundUser.username || "User Profile" : "Player Management"}</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Username"
              className="admin-input w-40"
            />
            <button onClick={handleSearch} disabled={isLoading} className="btn admin-button admin-button-purple">
              {isLoading ? '...' : 'Find Player'}
            </button>
          </div>
        </div>

        {message && <p className="text-center my-2 text-accent-yellow">{message}</p>}

        {foundUser && (
          <div className="bg-black/20 p-2 border border-[#333]">
            {/* User Info */}
            <div className="flex justify-between items-start border-b-2 border-[#333] pb-2 mb-4">
              <div className="flex items-center">
                <img src={UNITS[0].image} alt="avatar" className="w-16 h-16 mr-4 border-2 border-[#333]"/>
                <div>
                  <h2 className="text-xl text-white">{foundUser.first_name}</h2>
                  <p className="text-sm text-gray-400">@{foundUser.username || 'no_username'} [{foundUser.id}]</p>
                  <p className="text-sm text-green-400">STATUS: CLEAR</p>
                </div>
              </div>
              <p className="text-lg text-gray-400">ONLINE</p>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="flex flex-col gap-2">
                <div className="flex items-stretch gap-2">
                  <input 
                    type="number" 
                    value={soulsToAdd} 
                    onChange={e => setSoulsToAdd(parseInt(e.target.value, 10) || 0)} 
                    className="admin-input w-24 text-center"
                    placeholder="0"
                  />
                  <button onClick={handleAddSouls} className="btn admin-button admin-button-yellow flex-grow">Give Souls</button>
                </div>
                <button onClick={handleClearInventory} className="btn admin-button admin-button-red">
                  Clear Inventory
                </button>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-1">
                <h3 className="text-center text-gray-400 text-sm border-b border-[#333] pb-1">GIVE</h3>
                <div className="admin-list">
                  {UNITS.map((unit: Unit) => (
                    <p 
                      key={unit.id} 
                      onClick={() => setSelectedUnit(unit)} 
                      className={`admin-list-item ${selectedUnit?.id === unit.id ? 'selected' : ''}`}
                    >
                      {unit.name}
                    </p>
                  ))}
                </div>
                <button onClick={handleGiveUnit} disabled={!selectedUnit} className="btn admin-button admin-button-gray mt-1">
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;