import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Profile({ user, setUser }) {
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [showDelete, setShowDelete] = useState(false);
  const [deletePw, setDeletePw] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await API.get('/auth/profile');
      setProfile(res.data);
      setUser(res.data);
    } catch (err) {
      setError('Could not load profile');
    }
    setLoading(false);
  };

  const handlePwChange = e => {
    setPwForm({ ...pwForm, [e.target.name]: e.target.value });
    setPwError('');
    setPwSuccess('');
  };

  const handlePwSubmit = async e => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwForm.newPassword !== pwForm.confirmNewPassword) {
      setPwError('New passwords do not match');
      return;
    }
    if (!pwForm.oldPassword || !pwForm.newPassword) {
      setPwError('Please fill all fields');
      return;
    }
    try {
      const res = await API.post('/auth/change-password', {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword
      });
      setPwSuccess(res.data.message || 'Password changed successfully');
      setPwForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
      setShowChangePassword(false);
    } catch (err) {
      setPwError(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async e => {
    e.preventDefault();
    setDeleteError('');
    setDeleteSuccess('');
    if (!deletePw || !deleteConfirm) {
      setDeleteError('Please enter your password and confirm deletion.');
      return;
    }
    try {
      const res = await API.post('/auth/delete-account', { password: deletePw });
      setDeleteSuccess(res.data.message || 'Account deleted successfully');
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/register';
      }, 2000);
    } catch (err) {
      setDeleteError(err.response?.data?.message || 'Failed to delete account');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '2em auto', background: 'rgba(44,83,100,0.7)', borderRadius: 16, padding: '2em', boxShadow: '0 4px 32px 0 rgba(0,255,231,0.1)' }}>
      <h2 style={{ color: '#00ffe7', fontFamily: 'Orbitron, sans-serif', marginBottom: '1em' }}>Profile</h2>
      {loading ? <div>Loading...</div> : (
        <>
          <div><strong>Username:</strong> {profile.username}</div>
          <div><strong>Email:</strong> {profile.email}</div>
          <div><strong>User ID:</strong> {profile._id}</div>
          <div><strong>Joined:</strong> {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : ''}</div>
        </>
      )}
      {error && <div style={{ color: 'red', marginTop: '1em' }}>{error}</div>}
      <button onClick={fetchProfile} style={{ marginTop: '1.5em' }}>Refresh</button>
      <button onClick={() => setShowChangePassword(v => !v)} style={{ marginTop: '1em', background: 'linear-gradient(90deg, #e52e71 0%, #ff8a00 100%)', color: '#fff' }}>
        {showChangePassword ? 'Cancel' : 'Change Password'}
      </button>
      {showChangePassword && (
        <form onSubmit={handlePwSubmit} style={{ marginTop: '1.5em', background: 'rgba(44,83,100,0.95)' }}>
          <input
            type="password"
            name="oldPassword"
            placeholder="Old Password"
            value={pwForm.oldPassword}
            onChange={handlePwChange}
            required
          />
          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={pwForm.newPassword}
            onChange={handlePwChange}
            required
          />
          <input
            type="password"
            name="confirmNewPassword"
            placeholder="Confirm New Password"
            value={pwForm.confirmNewPassword}
            onChange={handlePwChange}
            required
          />
          <button type="submit">Update Password</button>
          {pwError && <div style={{ color: 'red', marginTop: '1em' }}>{pwError}</div>}
          {pwSuccess && <div style={{ color: 'lime', marginTop: '1em' }}>{pwSuccess}</div>}
        </form>
      )}
      <button onClick={() => setShowDelete(v => !v)} style={{ marginTop: '1em', background: 'linear-gradient(90deg, #ff5858 0%, #ff8a00 100%)', color: '#fff' }}>
        {showDelete ? 'Cancel' : 'Delete Account'}
      </button>
      {showDelete && (
        <form onSubmit={handleDeleteAccount} style={{ marginTop: '1.5em', background: 'rgba(44,83,100,0.95)' }}>
          <div style={{ color: '#ff5858', fontWeight: 600, marginBottom: '1em' }}>
            To delete account Please enter your password and then click on <span style={{ fontWeight: 700 }}>'I am sure'</span>
          </div>
          <input
            type="password"
            name="deletePw"
            placeholder="Password"
            value={deletePw}
            onChange={e => setDeletePw(e.target.value)}
            required
          />
          <div style={{ margin: '1em 0' }}>
            <label style={{ color: '#ff8a00', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={deleteConfirm}
                onChange={e => setDeleteConfirm(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              I am sure
            </label>
          </div>
          <button type="submit" style={{ background: 'red', color: '#fff', fontWeight: 700, border: 'none', borderRadius: 8, padding: '0.7em 1.2em' }}>Delete Account</button>
          {deleteError && <div style={{ color: 'red', marginTop: '1em' }}>{deleteError}</div>}
          {deleteSuccess && <div style={{ color: 'lime', marginTop: '1em' }}>{deleteSuccess}</div>}
        </form>
      )}
    </div>
  );
} 