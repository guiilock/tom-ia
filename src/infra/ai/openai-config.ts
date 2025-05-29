import OpenAI from 'openai';

export const openai = new OpenAI({
    defaultHeaders: {
        "x-requester-token": process.env.X_REQUESTER_TOKEN
    }
});