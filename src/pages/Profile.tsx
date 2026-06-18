import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Bell, Mail, Phone, Globe, KeyRound } from 'lucide-react';

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
          <TabsList className="grid w-full grid-cols-3 sm:inline-flex sm:w-auto">
            <TabsTrigger value="profile" className="w-full sm:w-auto">Profile</TabsTrigger>
            <TabsTrigger value="security" className="w-full sm:w-auto">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="w-full sm:w-auto">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card className="p-4 sm:p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                  Personal information
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-6 p-0 pt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <div className="relative">
                      <User className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                      <Input id="fullName" className="pl-10" value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                      <Input id="email" className="pl-10" value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                      <Input id="phone" className="pl-10" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="country">Country</Label>
                    <div className="relative">
                      <Globe className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                      <Input id="country" className="pl-10" value={profileData.country} onChange={(e) => setProfileData({...profileData, country: e.target.value})} />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSave} variant="primary" className="self-start">Save changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="p-4 sm:p-6">
              <CardHeader className="p-0">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-interactive" strokeWidth={1.5} aria-hidden="true" />
                  Password
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-5 p-0 pt-6">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                    <Input id="currentPassword" type="password" className="pl-10" placeholder="Current password" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                    <Input id="newPassword" type="password" className="pl-10" placeholder="New password" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <div className="relative">
                    <KeyRound className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-text-tertiary" strokeWidth={1.5} aria-hidden="true" />
                    <Input id="confirmPassword" type="password" className="pl-10" placeholder="Re-enter new password" />
                  </div>
                </div>
                <Button variant="primary" className="self-start">Update password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="p-4 sm:p-6">
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
