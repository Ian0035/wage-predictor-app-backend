import { Injectable } from '@nestjs/common';
import { StructuredInputDTO } from './dto/structured-input.dto'; // Adjust path if needed
import axios from 'axios';



@Injectable()
export class WageService {
  private readonly apiKey = process.env.GROQ_API_KEY;

  async extractInfo(text: string) {
    const systemPrompt = `
You are an AI assistant that extracts and normalizes user data to structured categories for a wage prediction model.

Return a JSON object with the following keys:
- age (choose one bucket: "18-21", "22-24", "25-29", "30-34", "35-39", "40-44", "45-49", "50-54", "55-59", "60-69", "70-79", "80+")
- years_experience (choose one bucket: "0-1", "1-2", "2-3", "3-4", "4-5", "5-11", "11-15", "15-20", "20-25", "25-30", "30+")
- education (one of: "Master’s degree", "Bachelor’s degree", "Some college/university study without earning a bachelor’s degree", "Doctoral degree", "Professional degree", "I prefer not to answer")
- gender (one of: "Female", "Male", "Prefer not to say", "Prefer to self-describe")
- country (country name only; if only a city is mentioned, infer the country)
- industry (choose one from this list: 
"I am a student", "Online Service/Internet-based Services", "Other", "Academics/Education", "Energy/Mining", "Military/Security/Defense", "Computers/Technology", "Insurance/Risk Assessment", "Broadcasting/Communications", "Accounting/Finance", "Shipping/Transportation", "Online Business/Internet-based Sales", "Manufacturing/Fabrication", "Medical/Pharmaceutical", "Government/Public Service", "Non-profit/Service", "Marketing/CRM", "Retail/Sales", "Hospitality/Entertainment/Sports")

Also return:
- missingFields: array of field names not detected
- nextQuestion: a question to ask the user to help fill a missing field

If any value is missing or unclear, return 'null' and include the field in "missingFields".

Always return JSON.
`;


    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Input: """${text}"""` },
        ],
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const raw = response.data.choices[0].message.content;
    try {
      return JSON.parse(raw ?? '{}');
    } catch (err) {
      console.error('Parse error:', raw);
      return { error: 'Invalid response from model' };
    }
  }
  async predictWage(input: StructuredInputDTO): Promise<number> {
    try {
      const response = await axios.post('http://localhost:8000/predict', input);
      return response.data.predictedWage;
    } catch (error) {
      console.error('Prediction error:', error?.response?.data || error.message);
      throw new Error('Prediction failed');
    }
  }
}


