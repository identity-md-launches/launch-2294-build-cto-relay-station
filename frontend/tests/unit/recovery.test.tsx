import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FixtureAdapter, DEMO_ACCOUNTS } from "../../src/domain/fixtureAdapter";
import { mergeJournal, loadJournal, type Journal } from "../../src/domain/chainAdapter";
import type { Sponsorship } from "../../src/domain/types";
import { isLatestAttempt } from "../../src/ui/recovery";
import { Workspace } from "../../src/ui/Workspace";

beforeEach(() => localStorage.clear());
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

// These hashes are synthetic transaction identities for isolated unit fault injection only.
const hash = (n: number) => `0x${n.toString(16).padStart(64, "0")}` as `0x${string}`;

describe("journal recovery preserves authenticated retry and explicit spending", () => {
  it.each(["REVERTED", "REPLACED_OTHER"])("%s pseudo-row cannot hide a refusal; reviewing and closing never purchases", async status => {
    const adapter = await FixtureAdapter.create({ latency: 0, reset: true });
    adapter.controls.callbackOutcome = "refused";
    const q = await adapter.quoteFee("fx-prop-1");
    await adapter.approve(DEMO_ACCOUNTS[0], q, q.price);
    const refused = await adapter.sponsor(DEMO_ACCOUNTS[0], "fx-prop-1", q.price, q);
    const failed: Sponsorship = { ...refused, id: "unknown:" + hash(2), txHash: hash(2), attempt: refused.attempt + 1,
      stages: { ...refused.stages, purchase: "failed", callback: "not_started", binding: "not_started" },
      note: `Original transaction reconciliation: ${status}. No automatic purchase.` };
    expect(isLatestAttempt([refused, failed], refused)).toBe(true);
    vi.spyOn(adapter, "getSponsorships").mockResolvedValue([refused, failed]);
    const approve = vi.spyOn(adapter, "approve"), retry = vi.spyOn(adapter, "retryRefused"), purchase = vi.spyOn(adapter, "sponsor");
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={qc}><Workspace adapter={adapter} branchId={refused.branchId} account={DEMO_ACCOUNTS[0]} /></QueryClientProvider>);
    const review = await screen.findByRole("button", { name: "Review identical paid retry" });
    expect(screen.getByText(failed.note!)).toBeInTheDocument();
    expect(approve).not.toHaveBeenCalled(); expect(retry).not.toHaveBeenCalled(); expect(purchase).not.toHaveBeenCalled();
    fireEvent.click(review);
    const dialog = await screen.findByRole("dialog", { name: "Review identical paid retry" });
    const buy = within(dialog).getByRole("button", { name: "2. Purchase identical retry" });
    expect(buy).toBeDisabled();
    fireEvent.click(buy); // A disabled purchase cannot bypass consent.
    expect(retry).not.toHaveBeenCalled(); expect(purchase).not.toHaveBeenCalled();
    fireEvent.click(within(dialog).getByRole("button", { name: "Close preparation" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(approve).not.toHaveBeenCalled(); expect(retry).not.toHaveBeenCalled();
    fireEvent.click(review);
    const next = await screen.findByRole("dialog", { name: "Review identical paid retry" });
    const approval = within(next).getByRole("button", { name: "1. Approve exact amount" });
    await waitFor(() => expect(approval).toBeEnabled()); fireEvent.click(approval);
    const consent = within(next).getByRole("button", { name: "2. Purchase identical retry" });
    await waitFor(() => expect(consent).toBeEnabled());
    expect(approve).toHaveBeenCalledTimes(1); expect(retry).not.toHaveBeenCalled();
    fireEvent.click(consent);
    await waitFor(() => expect(retry).toHaveBeenCalledTimes(1));
    expect(retry.mock.calls[0][1]).toBe(refused.id); expect(purchase).not.toHaveBeenCalled();
    qc.clear();
  });

  it("unknown pending row still blocks retry and ordinary funding", async () => {
    const adapter = await FixtureAdapter.create({ latency: 0, reset: true });
    adapter.controls.callbackOutcome = "refused";
    const q = await adapter.quoteFee("fx-prop-1"); await adapter.approve(DEMO_ACCOUNTS[0], q, q.price);
    const refused = await adapter.sponsor(DEMO_ACCOUNTS[0], "fx-prop-1", q.price, q);
    const unknown: Sponsorship = { ...refused, id: "unknown:" + hash(3), txHash: hash(3), attempt: refused.attempt + 1,
      stages: { ...refused.stages, purchase: "unknown", callback: "not_started", binding: "not_started" } };
    expect(isLatestAttempt([refused, unknown], refused)).toBe(false);
    vi.spyOn(adapter, "getSponsorships").mockResolvedValue([refused, unknown]);
    const retry = vi.spyOn(adapter, "retryRefused"), purchase = vi.spyOn(adapter, "sponsor"), approve = vi.spyOn(adapter, "approve");
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(<QueryClientProvider client={qc}><Workspace adapter={adapter} branchId={refused.branchId} account={DEMO_ACCOUNTS[0]} /></QueryClientProvider>);
    await screen.findByText("An attempt is unresolved. Review its status before funding again.");
    expect(screen.queryByRole("button", { name: "Review identical paid retry" })).not.toBeInTheDocument();
    for (const button of screen.queryAllByRole("button", { name: "Review funding" })) expect(button).toBeDisabled();
    expect(retry).not.toHaveBeenCalled(); expect(purchase).not.toHaveBeenCalled(); expect(approve).not.toHaveBeenCalled(); qc.clear();
  });

  it("keeps same-nonce different-hash history across persistence and updates only the original hash", () => {
    const original: Journal = { hash: hash(1), nonce: 7, account: DEMO_ACCOUNTS[0].address, chainId: 31337,
      operation: "retry", branch: "fx-branch-1", proposalId: "fx-prop-1", data: "0x1234", to: DEMO_ACCOUNTS[1].address, state: "SUBMITTED", at: "2026-10-21" };
    const replacement = { ...original, hash: hash(2), state: "MINED" };
    const history = mergeJournal(mergeJournal([], original), replacement);
    expect(history.map(r => r.hash)).toEqual([hash(1), hash(2)]);
    localStorage.setItem("relay.local.transactions.v1", JSON.stringify(history));
    expect(loadJournal()).toEqual(history);
    const updated = mergeJournal(loadJournal(), { ...original, state: "REPLACED_OTHER" });
    expect(updated).toHaveLength(2); expect(updated.find(r => r.hash === replacement.hash)).toEqual(replacement);
    expect(updated.find(r => r.hash === original.hash)?.state).toBe("REPLACED_OTHER");
  });
});
