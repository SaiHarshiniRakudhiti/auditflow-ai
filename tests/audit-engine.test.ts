import { describe, expect, it } from "vitest";
import { auditSpend } from "../lib/audit-engine";
describe("auditSpend",()=>{
 it("downgrades team plan for two seats",()=>{const r=auditSpend({teamSize:2,primaryUseCase:"coding",tools:[{tool:"Cursor",plan:"Business",monthlySpend:80,seats:2,useCase:"coding"}]}); expect(r.totalMonthlySavings).toBeGreaterThan(0);});
 it("does not manufacture savings for optimal low-cost stack",()=>{const r=auditSpend({teamSize:1,primaryUseCase:"writing",tools:[{tool:"Claude",plan:"Pro",monthlySpend:20,seats:1,useCase:"writing"}]}); expect(r.totalMonthlySavings).toBe(0);});
 it("flags duplicate coding assistant",()=>{const r=auditSpend({teamSize:3,primaryUseCase:"coding",tools:[{tool:"Cursor",plan:"Pro",monthlySpend:60,seats:3,useCase:"coding"},{tool:"GitHub Copilot",plan:"Business",monthlySpend:57,seats:3,useCase:"coding"}]}); expect(r.recommendations.some(x=>x.recommendedAction.includes("duplicate"))).toBe(true);});
 it("optimizes high API spend",()=>{const r=auditSpend({teamSize:5,primaryUseCase:"mixed",tools:[{tool:"OpenAI API",plan:"API direct",monthlySpend:1000,seats:1,useCase:"mixed"}]}); expect(r.totalMonthlySavings).toBe(350);});
 it("marks high tier above 500 dollars",()=>{const r=auditSpend({teamSize:10,primaryUseCase:"mixed",tools:[{tool:"OpenAI API",plan:"API direct",monthlySpend:2000,seats:1,useCase:"mixed"}]}); expect(r.tier).toBe("high");});
});
