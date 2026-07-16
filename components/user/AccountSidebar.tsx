"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, Calendar, FileText, User, MessageSquare, ExternalLink, ChevronLeft, ChevronRight, Umbrella, type LucideIcon } from "lucide-react";
import LogoutButton from "./LogoutButton";
import QuickQuoteButton from "./QuickQuoteButton";

interface AccountSidebarProps {
  initials: string;
  userName: string | null;
  userPhone: string;
  userCity: string | null;
  userEmail: string | null;
  memberSince: string;
}

export default function AccountSidebar({
  initials,
  userName,
  userPhone,
  userCity,
  userEmail,
  memberSince,
}: AccountSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`acct-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      {/* Logo & Toggle Section */}
      <div className="sidebar-header">
        <Link href="/" className="logo-link">
          {isCollapsed ? (
            <div className="collapsed-logo">
              <Umbrella className="w-6 h-6 text-blue-500 animate-pulse" />
            </div>
          ) : (
            <img
              src="/logo-dark-zoomed.png"
              alt="NPS Insurance.in"
              className="expanded-logo"
            />
          )}
        </Link>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="collapse-toggle"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Profile Section */}
      <div className="profile-section">
        <div className="avatar-circle">
          <span>{initials}</span>
        </div>
        <div className="profile-info">
          <p className="profile-name">{userName}</p>
          <p className="profile-phone">+91 {userPhone}</p>
          {userCity && <p className="profile-city">{userCity}</p>}
          <div className="member-badge">
            <div className="status-dot" />
            <span>Member since {memberSince}</span>
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="nav-menu">
        <p className="menu-title">Menu</p>
        {(
          [
            { label: "Overview",  href: "#overview",  Icon: Home },
            { label: "Renewals",  href: "#renewals",  Icon: Calendar },
            { label: "Quotes",    href: "#quotes",    Icon: FileText },
            { label: "Profile",   href: "#profile",   Icon: User },
            { label: "Contact",   href: "#contact",   Icon: MessageSquare },
          ] as { label: string; href: string; Icon: LucideIcon }[]
        ).map((item) => (
          <a key={item.label} href={item.href} className="acct-nav-link" title={item.label}>
            <item.Icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </a>
        ))}
      </nav>

      {/* Promo Box */}
      <div className="promo-section">
        <div className="promo-box">
          <p className="promo-title">Need coverage?</p>
          <p className="promo-desc">Advisor calls you in 30 min.</p>
          <QuickQuoteButton
            name={userName ?? ""}
            phone={userPhone}
            email={userEmail}
            city={userCity}
            sidebar
          />
        </div>
      </div>

      {/* Footer Links */}
      <div className="sidebar-footer">
        <Link href="/" className="footer-link" title="Back to site">
          <ExternalLink className="nav-icon" />
          <span className="footer-label">Back to site</span>
        </Link>
        <div className="logout-wrapper">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
