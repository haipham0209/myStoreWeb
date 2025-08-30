// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import {
//   LayoutDashboard,
//   Users,
//   Settings,
//   LogOut,
//   Box,
//   ChevronDown,
//   ChevronUp,
//   TrendingUp,
//   Tag
// } from 'lucide-react';
// import { logout } from '../../services/authService';
// import '../css/home-menu.css';

// const menuItems = [
//   { label: 'Home', icon: <LayoutDashboard size={20} />, to: '/admin/home' },
//   { label: 'Custommers', icon: <Users size={20} />, to: '/admin/users' },
//   {
//     label: 'Products',
//     icon: <Box size={20} />,
//     subItems: [
//       { label: 'Sales', icon: <Tag size={20} />, to: '/admin/products/sales' },
//       { label: 'On Trend', icon: <TrendingUp size={20} />, to: '/admin/products/trending' },
//     ],
//   },
//   { label: 'System setting', icon: <Settings size={20} />, to: '/admin/settings' },
//   { label: 'Log Out', icon: <LogOut size={20} />, action: 'logout' },
// ];

// export default function AdminMenu() {
//   const [showConfirm, setShowConfirm] = useState(false);
//   const [expandedMenus, setExpandedMenus] = useState({});
//   const navigate = useNavigate();

//   const toggleExpand = (label) => {
//     setExpandedMenus((prev) => ({
//       ...prev,
//       [label]: !prev[label],
//     }));
//   };

//   const handleMenuClick = async (item) => {
//     if (item.action === 'logout') {
//       setShowConfirm(true);
//     }
//   };

//   const handleLogoutConfirm = async () => {
//     setShowConfirm(false);
//     await logout();
//     navigate('/login');
//   };


//   const logoutItem = menuItems.find(item => item.action === 'logout');
//   const menuItemsWithoutLogout = menuItems.filter(item => item.action !== 'logout');


//   return (
//     // <div className="w-64 h-screen bg-white shadow-lg p-4 flex flex-col custom-home-menu">
//     <div className="w-64 h-full flex flex-col bg-white shadow-lg p-4 custom-home-menu">

//       {/* Top menu */}
//       <div className="flex-grow">
//         <h2 className="text-xl font-semibold">Menu</h2>
//         <ul className="list-none">
//           {menuItemsWithoutLogout.map((item) => (
//             <li key={item.label}>
//               {item.subItems ? (
//                 <>
//                   <button
//                     onClick={() => toggleExpand(item.label)}
//                     // className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition"
//                     className="flex items-center gap-2 text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition custom-collapse-menu"
//                   >
//                     <span className="flex items-center gap-2">
//                       <span>{item.icon}</span>
//                       <span>{item.label}</span>
//                     </span>
//                     {expandedMenus[item.label] ? (
//                       <ChevronUp size={16} />
//                     ) : (
//                       <ChevronDown size={16} />
//                     )}
//                   </button>
//                   {expandedMenus[item.label] && item.subItems && (
//                     <ul className="ml-6 mt-1 space-y-1 list-none">
//                       {item.subItems.map((sub) => (
//                         <li key={sub.label}>
//                           <Link
//                             to={sub.to}
//                             className="flex items-center gap-2 text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition"

//                           >
//                             <span>{sub.icon}</span>
//                             <span>{sub.label}</span>
//                           </Link>
//                         </li>
//                       ))}
//                     </ul>
//                   )}

//                 </>
//               ) : item.to ? (
//                 <Link
//                   to={item.to}
//                   className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition"
//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </Link>
//               ) : (
//                 <button
//                   onClick={() => handleMenuClick(item)}
//                   className="flex items-center gap-2 text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition"

//                 >
//                   {item.icon}
//                   <span>{item.label}</span>
//                 </button>
//               )}
//             </li>
//           ))}
//         </ul>
//       </div>
//       {/* Nút Log Out nằm dưới cùng, không nằm trong flex-grow */}
//       {logoutItem && (
//         <div className="mt-4">
//           <button
//             onClick={() => handleMenuClick(logoutItem)}
//             className="flex items-center gap-2 text-gray-700 hover:text-blue-600 p-2 rounded hover:bg-gray-100 transition w-full justify-start"
//           >
//             {logoutItem.icon}
//             <span>{logoutItem.label}</span>
//           </button>
//         </div>
//       )}


//       {showConfirm && (
//         <div className="fixed inset-0 flex items-center justify-center z-50">
//           <div className="absolute inset-0 bg-black bg-opacity-40" />
//           <div className="z-50 bg-white rounded shadow-lg p-6 w-[90%] max-w-sm mx-auto">
//             <p className="text-lg font-medium">Are you sure you want to log out?</p>
//             <div className="flex justify-end mt-4 space-x-3">
//               <button
//                 onClick={() => setShowConfirm(false)}
//                 className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleLogoutConfirm}
//                 className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//               >
//                 Log Out
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
