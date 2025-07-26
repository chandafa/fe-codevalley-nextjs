'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Calendar,
  MapPin,
  Edit,
  Camera,
  Save,
  Shield,
  Key,
  Bell,
  Globe,
  Trash2,
  Star,
  Trophy,
  Target,
  Users,
  Code,
  Award,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GameLayout } from '@/components/layout/game-layout';
import { useAuthStore, useGameStore } from '@/lib/store';
import { api } from '@/lib/api';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { addNotification } = useGameStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    location: '',
    website: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [preferences, setPreferences] = useState({
    email_notifications: true,
    push_notifications: true,
    public_profile: true,
    show_online_status: true,
  });

  const handleUpdateProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.auth.updateProfile(profileForm);
      updateUser(response.data.data);
      
      setIsEditing(false);
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been updated successfully',
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Update Failed',
        message: error.response?.data?.message || 'Failed to update profile',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Password Mismatch',
        message: 'New passwords do not match',
      });
      return;
    }

    try {
      setIsLoading(true);
      // API call would go here
      
      setPasswordForm({
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Password Changed',
        message: 'Your password has been updated successfully',
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Password Change Failed',
        message: error.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      await api.auth.deleteAccount();
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Account Deleted',
        message: 'Your account has been deleted successfully',
      });
      
      // Redirect to landing page
      window.location.href = '/';
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Deletion Failed',
        message: error.response?.data?.message || 'Failed to delete account',
      });
    } finally {
      setIsLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      const response = await api.auth.uploadAvatar(file);
      updateUser({ avatar_url: response.data.data.avatar_url });
      
      addNotification({
        id: Date.now().toString(),
        type: 'success',
        title: 'Avatar Updated',
        message: 'Your profile picture has been updated',
      });
    } catch (error: any) {
      addNotification({
        id: Date.now().toString(),
        type: 'error',
        title: 'Upload Failed',
        message: error.response?.data?.message || 'Failed to upload avatar',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const userStats = {
    totalQuests: 45,
    completedQuests: 32,
    totalXP: user?.exp || 0,
    level: user?.level || 1,
    friends: 18,
    achievements: 12,
    joinDate: user?.created_at || new Date().toISOString(),
  };

  return (
    <GameLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Profile</h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Manage your account settings, view your progress, and customize your Code Valley experience.
          </p>
        </motion.div>

        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
                {/* Avatar */}
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.avatar_url} />
                    <AvatarFallback className="text-4xl bg-white text-blue-600">
                      {user?.username?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-gray-50 transition-colors">
                    <Camera className="w-5 h-5 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-3xl font-bold mb-2">{user?.username}</h2>
                  <p className="text-blue-100 mb-4">{user?.bio || 'No bio yet'}</p>
                  
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-300" />
                      <span>Level {userStats.level}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-300" />
                      <span>{userStats.totalXP} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-200" />
                      <span>Joined {new Date(userStats.joinDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                  </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 text-center">
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">{userStats.completedQuests}</div>
                    <div className="text-sm text-blue-100">Quests Done</div>
                  </div>
                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="text-2xl font-bold">{userStats.friends}</div>
                    <div className="text-sm text-blue-100">Friends</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="edit">Edit Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Target className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-blue-600 mb-1">{userStats.totalQuests}</div>
                    <div className="text-sm text-gray-600">Total Quests</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Trophy className="w-8 h-8 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-green-600 mb-1">{userStats.completedQuests}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-purple-600 mb-1">{userStats.friends}</div>
                    <div className="text-sm text-gray-600">Friends</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="w-8 h-8 text-orange-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-orange-600 mb-1">{userStats.achievements}</div>
                    <div className="text-sm text-gray-600">Achievements</div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'Completed quest', item: 'JavaScript Basics', time: '2 hours ago', icon: Trophy, color: 'text-green-600' },
                      { action: 'Earned achievement', item: 'First Steps', time: '1 day ago', icon: Award, color: 'text-yellow-600' },
                      { action: 'Added friend', item: 'CodeMaster123', time: '2 days ago', icon: Users, color: 'text-blue-600' },
                      { action: 'Started quest', item: 'React Components', time: '3 days ago', icon: Code, color: 'text-purple-600' },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <div className={`w-10 h-10 rounded-full bg-white flex items-center justify-center ${activity.color}`}>
                          <activity.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity.action} <span className="text-blue-600">{activity.item}</span>
                          </p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="edit" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={profileForm.username}
                        onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                        placeholder="Your username"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileForm.location}
                        onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        placeholder="Your location"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={profileForm.website}
                      onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                      placeholder="https://your-website.com"
                    />
                  </div>

                  <Button onClick={handleUpdateProfile} disabled={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              {/* Change Password */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5" />
                    Change Password
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="current_password">Current Password</Label>
                    <Input
                      id="current_password"
                      type="password"
                      value={passwordForm.current_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="new_password">New Password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      value={passwordForm.new_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm_password">Confirm New Password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      value={passwordForm.confirm_password}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                    />
                  </div>
                  <Button onClick={handleChangePassword} disabled={isLoading}>
                    <Shield className="w-4 h-4 mr-2" />
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              {/* Delete Account */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <Trash2 className="w-5 h-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p className="text-gray-600">
                          This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                        </p>
                        <div className="flex gap-3">
                          <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {isLoading ? 'Deleting...' : 'Yes, delete my account'}
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email_notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={preferences.email_notifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, email_notifications: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push_notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-600">Receive push notifications in browser</p>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={preferences.push_notifications}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, push_notifications: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="public_profile">Public Profile</Label>
                      <p className="text-sm text-gray-600">Make your profile visible to other users</p>
                    </div>
                    <Switch
                      id="public_profile"
                      checked={preferences.public_profile}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, public_profile: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="show_online_status">Show Online Status</Label>
                      <p className="text-sm text-gray-600">Let friends see when you're online</p>
                    </div>
                    <Switch
                      id="show_online_status"
                      checked={preferences.show_online_status}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, show_online_status: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </GameLayout>
  );
}