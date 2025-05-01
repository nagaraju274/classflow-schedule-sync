
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Settings, User, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  roles?: Array<string>;
}

const Sidebar: React.FC = () => {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: <Clock className="h-5 w-5" />,
    },
    {
      name: 'Timetable',
      href: '/timetable',
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: 'Subjects',
      href: '/subjects',
      icon: <Users className="h-5 w-5" />,
      roles: ['admin', 'teacher'],
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: <User className="h-5 w-5" />,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(
    item => !item.roles || item.roles.includes(user?.role || '')
  );

  return (
    <aside className="hidden w-64 flex-col border-r bg-muted/40 md:flex">
      <div className="flex flex-col gap-2 p-4">
        {filteredNavItems.map(item => (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                'flex w-full items-center justify-start gap-2 px-2',
                pathname === item.href && 'bg-accent text-accent-foreground'
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Button>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
