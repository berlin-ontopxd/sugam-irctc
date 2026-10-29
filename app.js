const $ = id => document.getElementById(id);
let intent = null;
let selectedAmount = 1850;

document.querySelectorAll("[data-example]").forEach(b => b.onclick = () => $("request").value = b.dataset.example);

function show(id){$(id).classList.remove("hidden");$(id).scrollIntoView({behavior:"smooth",block:"start"});}
function setStatus(t){$("status").textContent=t;}

$("understand").onclick = async () => {
  const text = $("request").value.trim();
  if(!text){setStatus("Please enter a booking request.");return;}
  setStatus("Sugam is asking gpt-4o-mini to structure your request…");
  $("understand").disabled=true;
  try{
    const r=await fetch("/.netlify/functions/parse",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text})});
    const data=await r.json();
    if(!r.ok) throw new Error(data.error||"Unable to parse request.");
    intent=data;
    $("intentGrid").innerHTML=[
      ["From",`${data.from_name} · ${data.from_code}`],
      ["To",`${data.to_name} · ${data.to_code}`],
      ["Journey",data.journey_date],
      ["Quota",`${data.quota_label} · ${data.quota}`],
      ["Class",`${data.class_label} · ${data.travel_class}`],
      ["Passengers",String(data.passengers.length)]
    ].map(([a,b])=>`<article class="item"><small>${a}</small><strong>${escapeHtml(b)}</strong></article>`).join("");
    $("passengers").innerHTML=data.passengers.map(p=>`<div class="person"><strong>${escapeHtml(p.name)}</strong><span>${p.age} · ${escapeHtml(p.gender)}</span></div>`).join("");
    setStatus("Intent structured successfully. Review the result below.");
    show("intentSection");
  }catch(e){setStatus(e.message)}
  finally{$("understand").disabled=false}
};

$("findTrains").onclick=()=>show("trainsSection");
document.querySelectorAll("[data-select]").forEach(b=>b.onclick=()=>{
  selectedAmount=Number(b.dataset.select);
  $("amount").textContent=`₹${selectedAmount.toLocaleString("en-IN")}`;
  show("passengerSection");
});
$("toPayment").onclick=()=>show("paymentSection");
$("pay").onclick=()=>{
  $("pnr").textContent="SUG"+Math.floor(1000000000+Math.random()*8999999999);
  show("confirmationSection");
};
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
