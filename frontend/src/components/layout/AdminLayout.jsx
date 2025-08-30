// src/layouts/MenuSidebar.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminMenu from './AdminMenu';
import AdminHeader from './HeaderAdmin';
import './admin-layout.css';

export default function MenuSidebar() {
  return (
    <div className="">

      {/* Menu bên trái */}
      <AdminHeader />
      <AdminMenu />

      {/* Nội dung chính bên phải, chiếm phần còn lại */}
      <div className="custom-outlet flex-grow p-6 overflow-y-auto">
        <Outlet />
      </div>
    </div>

  );

}
