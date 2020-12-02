import { emitNewConversation } from '../../socketio-client';

export const createOrLoadConversation = async (userId, receiver, payload) => {
  try {
    const response = await fetch(`/api/users/${userId}/conversations`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 201) {
      emitNewConversation(receiver);
      console.log('Conversation created, Redirect to messages Page');
      return true;
    }
    if (response.status === 200) {
      console.log('Conversation exists. Redirecting to messages');
      return true;
    }
  } catch (error) {
    return error;
  }
};
