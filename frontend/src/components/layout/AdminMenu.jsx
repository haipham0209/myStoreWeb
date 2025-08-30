// src/components/admin/AdminMenu.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ChevronRight,
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Boxes,
  ChevronDown,
  ChevronUp,
  Tag,
  Box,
  DollarSign,
  Computer,
  History,
  FileText,
  TrendingUp,
  Receipt,
  Layers
} from 'lucide-react';

import { logout } from '../../services/authService';
import './admin-menu.css';
import ConfirmLogoutDialog from '../auth/ConfirmLogoutDialog';
const menuItems = [
  { label: 'Home', icon: <LayoutDashboard size={25} />, to: '/admin/home' },
  { label: 'POS', icon: <Computer size={25} />, to: '/admin/pos' },
  {
    label: 'Products',
    icon: <Box size={25} />,
    subItems: [
      { label: 'All Products', icon: <Boxes size={25} />, to: '/admin/products' },
      { label: 'Category', icon: <Layers size={25} />, to: '/admin/products/categories' },
      { label: 'On Sales', icon: <Tag size={25} />, to: '/admin/products/on-sales' },
      { label: 'On Trend', icon: <TrendingUp size={25} />, to: '/admin/products/trending' },
    ],
  },
  { label: 'Custommers', icon: <Users size={25} />, to: '/admin/users' },
  {
    label: 'Report',
    icon: <FileText size={25} />,
    subItems: [
      { label: 'Revenue', icon: <DollarSign size={25} />, to: '/admin/report/revenue' },
    ],
  },

  {
    label: 'History',
    icon: <History size={25} />,
    subItems: [
      { label: 'Receipt', icon: <Receipt size={25} />, to: '/admin/history/receipts' },
    ],
  },




  { label: 'System setting', icon: <Settings size={25} />, to: '/admin/settings' },
  { label: 'Log Out', icon: <LogOut size={25} />, action: 'logout' },
];


const bottomMenuLabels = ['System setting', 'Log Out'];
const bottomMenuItems = menuItems.filter(item => bottomMenuLabels.includes(item.label));
const mainMenuItems = menuItems.filter(item => !bottomMenuLabels.includes(item.label));

export default function AdminMenu() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    const newExpandedMenus = {};
    mainMenuItems.forEach(item => {
      if (item.subItems) {
        const shouldExpand = item.subItems.some(sub => currentPath.startsWith(sub.to));
        if (shouldExpand) newExpandedMenus[item.label] = true;
      }
    });
    setExpandedMenus(newExpandedMenus);
  }, [currentPath]);

  const toggleExpand = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleMenuClick = async (item) => {
    if (item.action === 'logout') {
      const confirm = window.confirm('Are you sure you want to log out?');
      if (confirm) {
        await logout();
        navigate('/login');
      }
    }
  };


  const handleLogoutConfirm = async () => {
    setShowConfirm(false);
    await logout();
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-white shadow-lg flex flex-col pt-2 px-0 custom-home-menu">
      <div>
        <Link
          to="/home"
          className="px-2 fs-10 flex items-center text-sm text-gray-500 hover:text-gray-700 custom-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>Go to homepage</span>
          <span className="ml-1">{'>>>'}</span>
        </Link>

        <ul className="list-none hover:bg-white transition-colors duration-200">
          {mainMenuItems.map((item) => {
            const isActiveParent = item.to && currentPath.startsWith(item.to) && !item.subItems;
            const hasActiveSub = item.subItems && item.subItems.some(sub => currentPath.startsWith(sub.to));

            return (

              <li key={item.label}>
                {item.subItems ? (
                  <>
                    <div
                      className={`custom-collapse-button flex items-center pl-0 justify-between cursor-pointer p-2 py-2 transition w-full ${hasActiveSub ? 'active' : ''}`}
                      onClick={() => toggleExpand(item.label)}
                      role="menuitem"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') toggleExpand(item.label);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        <span className="custom-label">{item.label}</span>
                      </div>
                      <div className="ml-3">
                        {expandedMenus[item.label] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>
                    {(expandedMenus[item.label] || (hasActiveSub && !expandedMenus.hasOwnProperty(item.label))) && (
                      <ul className="custom-sub-ul ml-6 mt-1 sub-list-none">
                        {item.subItems.map((sub) => {
                          const isActiveSub = currentPath === sub.to;
                          return (
                            <li className={`custom-sub-li ${isActiveSub ? 'active' : ''}`} key={sub.label}>
                              <Link to={sub.to} className="flex items-center gap-2 px-2 py-1 hover:bg-gray-200">
                                {sub.icon}
                                <span className="custom-label">{sub.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.to}
                    className={`custom-collapse-button2 flex items-center space-x-2 p-2 transition px-2 hover:bg-white hover:text-black ${isActiveParent ? 'bg-white text-black' : ''}`}
                  >
                    {item.icon}
                    <span className="custom-label">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-auto py-4 border-t">
        {bottomMenuItems.map((item) => (
          item.to ? (
            <Link
              key={item.label}
              to={item.to}
              className="custom-bottom-nav-menu flex items-center gap-2 text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition w-full justify-start"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ) : (
            <div
              key={item.label}
              onClick={() => handleMenuClick(item)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleMenuClick(item);
              }}
              className="custom-bottom-nav-menu flex items-center gap-2 text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition w-full justify-start cursor-pointer"
            >
              {item.icon}
              <span>{item.label}</span>
            </div>
          )
        ))}

      </div>

    </div>
  );
}
