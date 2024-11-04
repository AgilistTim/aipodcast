import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Navbar, 
  NavbarBrand, 
  NavbarContent, 
  NavbarItem, 
  Button, 
  Avatar, 
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem,
  Switch
} from "@nextui-org/react";
import { Mic, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from 'next-themes';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <Navbar maxWidth="full" className="shadow-lg">
      <NavbarBrand>
        <Link to="/" className="flex items-center gap-2">
          <Mic size={24} />
          <p className="font-bold text-inherit">PodcastGen</p>
        </Link>
      </NavbarBrand>

      <NavbarContent justify="end">
        <NavbarItem>
          <Switch
            defaultSelected={theme === 'dark'}
            size="lg"
            color="primary"
            startContent={<Sun />}
            endContent={<Moon />}
            onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
          />
        </NavbarItem>
        
        <NavbarItem>
          <Link to="/">
            <Button variant="light">Home</Button>
          </Link>
        </NavbarItem>
        
        {user ? (
          <>
            <NavbarItem>
              <Link to="/config">
                <Button variant="light">Generate</Button>
              </Link>
            </NavbarItem>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  as="button"
                  className="transition-transform"
                  color="primary"
                  name={user.email?.charAt(0).toUpperCase()}
                  size="sm"
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="profile" onPress={() => navigate('/profile')}>
                  Profile
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <>
            <NavbarItem>
              <Link to="/login">
                <Button variant="light">Login</Button>
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link to="/register">
                <Button color="primary" variant="flat">
                  Sign Up
                </Button>
              </Link>
            </NavbarItem>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;