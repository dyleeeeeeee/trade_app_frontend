import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Bell } from 'lucide-react';

export default function Profile() {
  const { toast } = useToast();
  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    country: 'United States'
  });

  const handleSave = () => {
    toast({
      title: "Profile saved",
      description: "Your changes are saved.",
    });
  };

  return (
    <Layout>
      <div className="flex flex-col gap-8">
        <header className="flex flex-col gap-2">
          <p className="text-caption uppercase text-text-tertiary">Account</p>
          <h1 className="text-h1 text-text-primary">Profile</h1>
          <p className="text-body text-text-secondary">Manage your account and preferences.</p>
        </header>

        <Tabs defaultValue="profile" className="flex flex-col gap-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                  Personal information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 p-0 pt-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="country">Country</Label>
                    <Input id="country" value={profileData.country} onChange={(e) => setProfileData({...profileData, country: e.target.value})} />
                  </div>
                </div>
                <Button onClick={handleSave} variant="primary" className="self-start">Save changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                  Password
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 p-0 pt-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input id="currentPassword" type="password" placeholder="Current password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input id="newPassword" type="password" placeholder="New password" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input id="confirmPassword" type="password" placeholder="Re-enter new password" />
                </div>
                <Button variant="primary" className="self-start">Update password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 pt-6">
                <div className="glass-inset flex items-start gap-3 rounded-xl p-4">
                  <Bell className="mt-0.5 h-4 w-4 shrink-0 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                  <p className="text-body-sm text-text-secondary">Notification settings aren't available yet. Check back soon.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
