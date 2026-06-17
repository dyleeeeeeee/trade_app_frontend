import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Shield, Bell } from 'lucide-react';

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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full name</Label>
                    <Input value={profileData.fullName} onChange={(e) => setProfileData({...profileData, fullName: e.target.value})} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={profileData.email} onChange={(e) => setProfileData({...profileData, email: e.target.value})} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} />
                  </div>
                  <div>
                    <Label>Country</Label>
                    <Input value={profileData.country} onChange={(e) => setProfileData({...profileData, country: e.target.value})} />
                  </div>
                </div>
                <Button onClick={handleSave} variant="premium">Save changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Password
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Current password</Label>
                  <Input type="password" placeholder="Current password" />
                </div>
                <div>
                  <Label>New password</Label>
                  <Input type="password" placeholder="New password" />
                </div>
                <div>
                  <Label>Confirm new password</Label>
                  <Input type="password" placeholder="Re-enter new password" />
                </div>
                <Button variant="premium">Update password</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Notification settings aren't available yet. Check back soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}