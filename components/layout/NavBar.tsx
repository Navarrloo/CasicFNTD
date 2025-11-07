import React from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Gavel, Casino, AccountCircle, BarChart, Store, Security, MoreHoriz } from '@mui/icons-material';

type Page = 'main' | 'wiki' | 'casino' | 'profile' | 'admin' | 'trade' | 'scammers' | 'more';

interface NavBarProps {
  activePage: string;
  setActivePage: (page: Page) => void;
  isAdmin: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ activePage, setActivePage, isAdmin }) => {
  const handleChange = (event: React.SyntheticEvent, newValue: Page) => {
    setActivePage(newValue);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation value={activePage} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Main" value="main" icon={<Home />} />
        <BottomNavigationAction label="Wiki" value="wiki" icon={<BarChart />} />
        <BottomNavigationAction label="Casino" value="casino" icon={<Casino />} />
        <BottomNavigationAction label="Trade" value="trade" icon={<Store />} />
        <BottomNavigationAction label="Scammers" value="scammers" icon={<Security />} />
        <BottomNavigationAction label="More" value="more" icon={<MoreHoriz />} />
        <BottomNavigationAction label="Profile" value="profile" icon={<AccountCircle />} />
        {isAdmin && <BottomNavigationAction label="Admin" value="admin" icon={<Gavel />} />}
      </BottomNavigation>
    </Paper>
  );
};

export default NavBar;