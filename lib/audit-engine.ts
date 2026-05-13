import { BENCHMARKS, PRICING, ToolName } from "./pricing";
export type UseCase = "coding" | "writing" | "data" | "research" | "mixed";
export type SpendItem = { tool: ToolName; plan: string; monthlySpend: number; seats: number; useCase: UseCase };
export type AuditInput = { teamSize: number; primaryUseCase: UseCase; tools: SpendItem[] };
export type SavingsCategory = "plan_rightsizing" | "tool_consolidation" | "api_optimization" | "credit_procurement" | "benchmark";
export type Recommendation = { tool: ToolName; currentSpend: number; recommendedAction: string; recommendedSpend: number; monthlySavings: number; reason: string; category: SavingsCategory; confidence: number };
export type AuditResult = { recommendations: Recommendation[]; totalMonthlySavings: number; totalAnnualSavings: number; tier: "high"|"medium"|"low"|"optimal"; confidenceScore: number; spendPerMember: number; benchmarkPerMember: number; benchmarkDeltaPct: number; shareHeadline: string };
const round = (n:number)=> Math.max(0, Math.round((Number.isFinite(n)?n:0)*100)/100);
function seats(n:number){ return Math.max(1, Math.round(Number(n)||1)); }
function priceFor(tool: ToolName, plan: string, seatCount: number){ const p=PRICING[tool]?.find(x=>x.plan.toLowerCase()===String(plan).toLowerCase()); if(!p) return undefined; return p.perSeat ? p.monthly*seats(seatCount):p.monthly; }
function cheaperIndividual(tool: ToolName){ return (PRICING[tool]||[]).filter(p=>p.monthly>0 && p.monthly<=25).sort((a,b)=>a.monthly-b.monthly)[0]; }
function tier(total:number){ return total>500?'high':total>=100?'medium':total>0?'low':'optimal' as const; }
export function auditSpend(input: AuditInput): AuditResult {
 const safeTools=Array.isArray(input.tools)?input.tools:[]; const teamSize=seats(input.teamSize); const recs: Recommendation[]=[];
 const codingSet=safeTools.filter(t=>t.useCase==='coding'||input.primaryUseCase==='coding').map(t=>t.tool); const duplicateCoding=new Set(codingSet).size>1&&codingSet.length>1;
 for(const item of safeTools){
   const current=round(Number(item.monthlySpend)>0?Number(item.monthlySpend):priceFor(item.tool,item.plan,item.seats)||0); let recommended=current; let action='Keep current plan'; let reason='Current plan appears aligned with team size, plan tier, and stated use case.'; let category:SavingsCategory='benchmark'; let confidence=74;
   const seatCount=seats(item.seats);
   if(['Business','Team','Enterprise','Teams'].includes(item.plan) && seatCount<=2){ const cheaper=cheaperIndividual(item.tool); if(cheaper){recommended=round(cheaper.monthly*seatCount); action=`Downgrade to ${cheaper.plan}`; reason=`${item.plan} is usually too heavy for ${seatCount} seat(s); ${cheaper.plan} covers the likely usage at lower cost.`; category='plan_rightsizing'; confidence=88;}}
   if(duplicateCoding && ['GitHub Copilot','Windsurf'].includes(item.tool) && current>0){ recommended=0; action='Remove duplicate coding assistant'; reason='The stack already includes another coding assistant, so this is likely overlapping autocomplete/chat spend.'; category='tool_consolidation'; confidence=86; }
   if(['Anthropic API','OpenAI API'].includes(item.tool) && current>=300){ recommended=round(current*0.65); action='Apply caching, batch jobs, model routing, and usage alerts'; reason='High API spend is commonly reduced through prompt caching, batch processing, model routing, and hard monthly budget alerts.'; category='api_optimization'; confidence=82; }
   if(current>=500){ const creditSpend=round(current*0.75); if(creditSpend<recommended){ recommended=creditSpend; action=action==='Keep current plan'?'Evaluate discounted credits through Credex':`${action} + evaluate Credex credits`; reason=`${reason} At this spend level, discounted infrastructure credits can materially reduce retail spend.`; category='credit_procurement'; confidence=Math.max(confidence,80); }}
   const monthlySavings=round(current-recommended); recs.push({tool:item.tool,currentSpend:current,recommendedAction:action,recommendedSpend:round(recommended),monthlySavings,reason,category,confidence});
 }
 const totalMonthlySavings=round(recs.reduce((s,r)=>s+r.monthlySavings,0)); const totalCurrent=round(recs.reduce((s,r)=>s+r.currentSpend,0)); const spendPerMember=round(totalCurrent/teamSize); const benchmarkPerMember=BENCHMARKS[input.primaryUseCase]||BENCHMARKS.mixed; const benchmarkDeltaPct=round(((spendPerMember-benchmarkPerMember)/benchmarkPerMember)*100);
 const confidenceScore=recs.length?Math.round(recs.reduce((s,r)=>s+r.confidence,0)/recs.length):70; const t=tier(totalMonthlySavings) as AuditResult['tier'];
 const shareHeadline=t==='optimal'?'This AI stack is already spending carefully':`This AI stack can save about $${totalMonthlySavings}/month`;
 return {recommendations:recs,totalMonthlySavings,totalAnnualSavings:round(totalMonthlySavings*12),tier:t,confidenceScore,spendPerMember,benchmarkPerMember,benchmarkDeltaPct,shareHeadline};
}
export function fallbackSummary(result: AuditResult){ if(result.tier==='optimal') return 'Your AI stack looks disciplined. I would not manufacture fake savings here; the best next step is monitoring pricing changes and usage as the team grows.'; return `This audit found about $${result.totalMonthlySavings}/month in possible savings, or $${result.totalAnnualSavings}/year. The strongest opportunities are plan rightsizing, duplicate-tool consolidation, API cost controls, and discounted credit procurement when spend is high. Confidence: ${result.confidenceScore}%.`; }
