import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.openaiApiKey;

if (!OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured in app.config.js');
}

export async function transcribe(bytes: Uint8Array): Promise<string> {
  console.log('Starting transcription process...');
  
  // Create a temporary file to store the audio data
  const tempFile = `${FileSystem.cacheDirectory}temp_audio_${Date.now()}.wav`;
  console.log('Created temporary file:', tempFile);
  
  try {
    // Write the audio data to the temporary file
    console.log('Writing audio data to file...');
    await FileSystem.writeAsStringAsync(tempFile, Buffer.from(bytes).toString('base64'), {
      encoding: FileSystem.EncodingType.Base64,
    });
    console.log('Audio data written successfully');

    // Create form data with the file
    const formData = new FormData();
    formData.append('file', {
      uri: tempFile,
      type: 'audio/wav',
      name: 'audio.wav',
    } as any);
    formData.append('model', 'whisper-1');
    formData.append('language', 'en');

    console.log('Sending request to Whisper API...');
    // Send to OpenAI Whisper API
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Whisper API error:', response.status, errorText);
      throw new Error(`Whisper API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Received transcription response:', data);
    return data.text;
  } catch (error) {
    console.error('Transcription error:', error);
    throw error;
  } finally {
    // Clean up the temporary file
    try {
      console.log('Cleaning up temporary file...');
      await FileSystem.deleteAsync(tempFile);
      console.log('Temporary file deleted');
    } catch (err) {
      console.error('Error deleting temporary file:', err);
    }
  }
} 