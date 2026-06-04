import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ttbaohblrhmpdzcmwaqk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR0YmFvaGJscmhtcGR6Y213YXFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0MDk3NjEsImV4cCI6MjA5NTk4NTc2MX0.PAfzUHEK-XVIpHwNS4Cgi73-dAb5nzAijgV1l3eufMk';

export const supabase = createClient(supabaseUrl, supabaseKey);