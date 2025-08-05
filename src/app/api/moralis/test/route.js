import { NextResponse } from 'next/server';

export async function GET() {
  try {
    let moralisApiKey = process.env.MORALIS_API_KEY;
    
    console.log('=== MORALIS API TEST DEBUG ===');
    console.log('Environment variables available:', Object.keys(process.env).filter(key => key.includes('MORALIS')));
    console.log('API Key length:', moralisApiKey ? moralisApiKey.length : 'undefined');
    console.log('API Key starts with:', moralisApiKey ? moralisApiKey.substring(0, 20) + '...' : 'undefined');
    console.log('API Key ends with:', moralisApiKey ? '...' + moralisApiKey.substring(moralisApiKey.length - 20) : 'undefined');
    
    // Fallback to NEXT_PUBLIC if MORALIS_API_KEY is not available
    if (!moralisApiKey) {
      moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
      console.log('Using NEXT_PUBLIC_MORALIS_API_KEY as fallback');
    }
    
    if (!moralisApiKey) {
      console.log('ERROR: No API key found');
      return NextResponse.json({ 
        error: 'Moralis API key not configured',
        debug: {
          envVars: Object.keys(process.env).filter(key => key.includes('MORALIS')),
          nodeEnv: process.env.NODE_ENV,
          allEnvVars: Object.keys(process.env).slice(0, 10) // First 10 env vars for debugging
        },
        status: 'error'
      }, { status: 500 });
    }

    // Test with a popular Ethereum address (Vitalik's address)
    const testAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
    const url = `https://deep-index.moralis.io/api/v2.2/${testAddress}/transactions?chain=eth&limit=5`;
    
    console.log('Making request to:', url);
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': moralisApiKey,
      },
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Moralis API test error:', response.status, errorText);
      
      return NextResponse.json({ 
        error: `API test failed: ${response.status}`,
        details: errorText,
        debug: {
          url: url,
          apiKeyLength: moralisApiKey.length,
          apiKeyStart: moralisApiKey.substring(0, 10) + '...'
        },
        status: 'error'
      }, { status: response.status });
    }

    const data = await response.json();
    
    console.log('SUCCESS: API call successful');
    
    return NextResponse.json({
      success: true,
      status: 'connected',
      message: 'Moralis API is working correctly',
      testData: {
        address: testAddress,
        transactions: data.result?.length || 0,
        sampleTransaction: data.result?.[0] ? {
          hash: data.result[0].hash,
          from: data.result[0].from_address,
          to: data.result[0].to_address,
          value: data.result[0].value,
          timestamp: data.result[0].block_timestamp
        } : null
      }
    });

  } catch (error) {
    console.error('Error testing Moralis API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message,
      status: 'error'
    }, { status: 500 });
  }
} 