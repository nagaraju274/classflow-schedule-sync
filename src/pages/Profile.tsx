
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // Format role for display
  const roleDisplay = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">
          Your account information
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Your personal details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Name</h3>
                <p>{user.name}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{user.email}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Role</h3>
                <p>{roleDisplay}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
