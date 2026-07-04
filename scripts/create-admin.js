const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Try to load env variables from .env.local or .env
let envPath = path.join(process.cwd(), ".env.local");
if (!fs.existsSync(envPath)) {
  envPath = path.join(process.cwd(), ".env");
}

let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.substring(1, value.length - 1);
      }
      if (key === "NEXT_PUBLIC_SUPABASE_URL") supabaseUrl = value;
      if (key === "SUPABASE_SERVICE_ROLE_KEY") supabaseServiceKey = value;
    }
  });
}

if (!supabaseUrl || !supabaseServiceKey || supabaseUrl.includes("your-project")) {
  console.error("Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão configurados.");
  console.error("Certifique-se de que o arquivo .env ou .env.local existe com as credenciais válidas.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const email = "admin@account.com";
  const password = "admin@123";
  const fullName = "Administrador";

  console.log(`A criar o utilizador administrador: ${email}...`);

  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authError) {
    const errorMsg = authError.message.toLowerCase();
    if (
      errorMsg.includes("already exists") ||
      errorMsg.includes("conflict") ||
      errorMsg.includes("already been registered")
    ) {
      console.log("O utilizador já existe no Supabase Auth. A garantir permissões de Administrador...");
      
      const { data } = await supabase.auth.admin.listUsers();
      const user = data?.users?.find(u => u.email === email);
      
      if (user) {
        // Also update password to match admin@123 just in case
        await supabase.auth.admin.updateUserById(user.id, { password });
        
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ id: user.id, role: "admin", full_name: fullName });
          
        if (profileError) {
          console.error("Erro ao atualizar perfil do utilizador existente:", profileError.message);
        } else {
          console.log("Sucesso: Perfil atualizado para admin e senha redefinida!");
        }
      } else {
        console.error("Erro: Utilizador existe na base de dados mas não foi localizado na lista de auth.");
      }
    } else {
      console.error("Erro ao criar utilizador:", authError.message);
    }
    return;
  }

  console.log("Utilizador criado no Supabase Auth com sucesso.");

  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({ id: authUser.user.id, role: "admin", full_name: fullName });

  if (profileError) {
    console.error("Erro ao configurar permissões no perfil:", profileError.message);
  } else {
    console.log("Sucesso: Administrador criado e configurado com sucesso!");
  }
}

main().catch(console.error);
