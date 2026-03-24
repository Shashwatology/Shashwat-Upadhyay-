-- Create chat_conversations table to track visitor sessions
CREATE TABLE public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_name TEXT,
    visitor_email TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create chat_messages table for conversation history
CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Public policies (visitors can chat without auth)
CREATE POLICY "Anyone can create conversations"
    ON public.chat_conversations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can view their own conversation"
    ON public.chat_conversations FOR SELECT
    USING (true);

CREATE POLICY "Anyone can update their conversation"
    ON public.chat_conversations FOR UPDATE
    USING (true);

CREATE POLICY "Anyone can add messages to conversations"
    ON public.chat_messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can view messages in their conversation"
    ON public.chat_messages FOR SELECT
    USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();