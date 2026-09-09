
const sb = supabase.createClient(
  window.SANAYYA_CONFIG.SUPABASE_URL,
  window.SANAYYA_CONFIG.SUPABASE_PUBLISHABLE_KEY
);
function toast(msg, ok=true){const el=document.getElementById('toast');if(!el)return;el.textContent=msg;el.className='toast show';setTimeout(()=>el.className='toast',3500)}
async function getProfile(){
  const {data:{user}}=await sb.auth.getUser();
  if(!user)return null;
  const {data,error}=await sb.from('profiles').select('*').eq('id',user.id).maybeSingle();
  if(error) console.error(error);
  return data?{...data,email:user.email,id:user.id}: {id:user.id,email:user.email,role:'customer',active:true};
}
async function requireAuth(roles=[]){
  const p=await getProfile();
  if(!p){location.href='login.html';return null}
  if(p.active===false){await sb.auth.signOut();alert('This account is inactive.');location.href='login.html';return null}
  if(roles.length && !roles.includes(p.role)){alert('You do not have permission to open this page.');location.href='index.html';return null}
  return p;
}
function dashboardFor(role){
  return ({admin:'admin.html',customer:'customer.html',inspector:'inspector.html',garage:'garage.html',parts_supplier:'parts.html'})[role]||'customer.html';
}
async function logout(){await sb.auth.signOut();location.href='login.html'}
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}


async function recordLegalAcceptance(userId){
  const keys=['terms','privacy'];
  const docs=await sb.from('legal_documents').select('key,version').in('key',keys);
  if(docs.error) throw docs.error;
  for(const d of (docs.data||[])){
    const r=await sb.from('user_legal_acceptances').upsert({user_id:userId,document_key:d.key,version:d.version,accepted_at:new Date().toISOString()},{onConflict:'user_id,document_key'});
    if(r.error) throw r.error;
  }
}

async function loadLegalDocument(key){
  const r=await sb.from('legal_documents').select('key,title,body,version,updated_at').eq('key',key).maybeSingle();
  if(r.error) throw r.error;
  return r.data;
}
