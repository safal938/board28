/**
 * Vercel Serverless Function - Show Notification Endpoint
 * 
 * This endpoint receives a notification message and type from external sources
 * and broadcasts it to connected clients via SSE to display an alert modal.
 */

export default async function handler(req, res) {
  // Enable CORS for this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    });
  }

  try {
    const { message, type = 'info' } = req.body;

    // Validate required fields
    if (!message) {
      return res.status(400).json({
        error: 'Missing message',
        message: 'Request body must include a message field'
      });
    }

    // Validate notification type
    const validTypes = ['success', 'error', 'warning', 'info'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        error: 'Invalid type',
        message: `Type must be one of: ${validTypes.join(', ')}`
      });
    }

    console.log(`📢 Notification request received:`, { message, type });

    // Forward the notification to the backend SSE server
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const apiUrl = `${backendUrl}/api/notification`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message, type })
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status ${response.status}`);
    }

    const data = await response.json();

    console.log(`✅ Notification sent successfully:`, data);

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      data
    });

  } catch (error) {
    console.error('❌ Error in show-notification endpoint:', error);
    
    return res.status(500).json({
      error: 'Server error',
      message: error.message || 'Failed to send notification'
    });
  }
}
