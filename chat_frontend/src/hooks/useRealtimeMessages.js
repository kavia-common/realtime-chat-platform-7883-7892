import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../supabaseClient';

/**
 * Hook to manage message list and realtime updates for a single "global" chat room.
 * Assumes there is a 'messages' table with columns:
 * - id (uuid or bigint)
 * - created_at (timestamp)
 * - user_id (uuid)
 * - content (text)
 * - user_email (text) optional (denormalized for quick display)
 */
export function useRealtimeMessages(user) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(200);

    if (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching messages:', error);
      setLoading(false);
      return;
    }
    setMessages(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Subscribe to new messages
  useEffect(() => {
    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      );

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        // eslint-disable-next-line no-console
        // console.log('Subscribed to messages');
      }
    });
    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);

  // PUBLIC_INTERFACE
  const sendMessage = useCallback(
    async (content) => {
      if (!user) return;
      const { error } = await supabase.from('messages').insert({
        content,
        user_id: user.id,
        user_email: user.email || null,
      });
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Error sending message:', error);
        throw error;
      }
    },
    [user]
  );

  const sortedMessages = useMemo(() => messages, [messages]);

  return { messages: sortedMessages, loading, sendMessage };
}
