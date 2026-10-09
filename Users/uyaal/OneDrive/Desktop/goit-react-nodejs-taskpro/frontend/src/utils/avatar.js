export function getAvatarUrl(user) {
  const name = user?.name || 'User';
  return (
    user?.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=bedbb0&color=000`
  );
}
