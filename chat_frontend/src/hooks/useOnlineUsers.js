import { useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Hook to track online users using Supabase Realtime Presence within a "lobby" channel.
 * Presence payload includes:
 * - id: user id
 * - email: user email
 */
export function useOnlineUsers(user) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const channelRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel('presence:lobby', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const flat = Object.entries(state).flatMap(([key, sessions]) =>
          sessions.map((s) => ({
            id: key,
            email: s.email,
            lastSeenAt: s?.last_seen_at,
          }))
        );
        setOnlineUsers(flat);
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          channel.track({
            id: user.id,
            email: user.email,
            last_seen_at: new Date().toISOString(),
          });
        }
      });

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [user]);

  const uniqueUsers = useMemo(() => {
    const map = new Map();
    for (const u of onlineUsers) {
      if (!map.has(u.id)) map.set(u.id, u);
    }
    return Array.from(map.values());
  }, [onlineUsers]);

  return { users: uniqueUsers };
}
