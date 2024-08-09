import { NextResponse } from 'next/server';
import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';

// Create a Bedrock Runtime client in the AWS Region of your choice.
const client = new BedrockRuntimeClient({ region: 'us-east-1' });

// Set the model ID, e.g., Llama 3 8B Instruct.
const modelId = 'meta.llama3-8b-instruct-v1:0';

// Define the system prompt for the Uber driver chatbot.
const systemPrompt = `
You are a specialized assistant designed to help Uber drivers in NYC navigate their day-to-day activities efficiently. 
Your purpose is to provide real-time, actionable information that enhances the driving experience and maximizes earnings.

You can:
- Share information about ongoing and upcoming events in the city, including locations, start and end times, and expected attendance.
- Suggest optimal locations and times to pick up high-value passengers, particularly those looking for long trips.
- Provide updates on traffic conditions, road closures, and alternative routes to avoid delays.
- Offer tips and best practices for safe and efficient driving, including fuel-saving strategies and how to improve passenger ratings.
- Assist with any other relevant inquiries that could help drivers in their work, including app features, policy updates, and customer service issues.

Always maintain a professional, friendly, and concise tone, focusing on delivering clear, useful information that helps drivers make the best decisions on the road.

Now, please tell me how I can assist you today.
`;

export async function POST(req) {
  try {
    const userMessage = await req.json();

    // Embed the system prompt and user message in Llama 3's prompt format.
    const prompt = `
      system
      ${systemPrompt}
      
      user
      ${userMessage.user}
      
      assistant
    `;

    // Format the request payload using the model's native structure.
    const request = {
      prompt,
      max_gen_len: 512,
      temperature: 0.5,
      top_p: 0.9,
    };

    // Encode and send the request.
    const response = await client.send(
        new InvokeModelCommand({
          contentType: 'application/json',
          body: JSON.stringify(request),
          modelId,
        })
    );

    // This decodes the native response body.
    const decodedResponse = new TextDecoder().decode(response.body);
    console.log('Raw Response:', decodedResponse);

    let nativeResponse;
    try {
      nativeResponse = JSON.parse(decodedResponse);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return NextResponse.json({ error: 'Failed to parse response from Bedrock.' });
    }

    // Extract the generated text.
    const responseText = nativeResponse.generation;
    console.log('Assistant Response:', responseText);

    return NextResponse.json({ message: responseText });
  } catch (error) {
    console.error('Error in POST handler:', error);
    return NextResponse.json({ error: 'An error occurred while processing your request.' });
  }
}
