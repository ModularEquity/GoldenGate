"use client";

import { useCallback, useEffect, useState } from "react";

type UserRef = { id: string; email: string | null; name: string | null };

export type CommentNode = {
  id: string;
  body: string;
  createdAt: string;
  user: UserRef;
  likes: number;
  upvotes: number;
  downvotes: number;
  myVote: string | null;
  replies: CommentNode[];
};

type Props = { dealSlug: string };

export function DealCommentsSection({ dealSlug }: Props) {
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [body, setBody] = useState("");
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/deals/${dealSlug}/comments`);
    const data = (await res.json()) as { comments?: CommentNode[] };
    if (res.ok && data.comments) setComments(data.comments);
    setLoading(false);
  }, [dealSlug]);

  useEffect(() => {
    load();
  }, [load]);

  async function postComment(parentId?: string) {
    const text = parentId ? "" : body.trim();
    if (!parentId && !text) return;
    setPosting(true);
    setErr(null);
    try {
      const res = await fetch(`/api/deals/${dealSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text || undefined, parentId: parentId ?? null }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setErr(data.error ?? "Could not post");
        return;
      }
      if (!parentId) setBody("");
      await load();
    } finally {
      setPosting(false);
    }
  }

  async function vote(commentId: string, kind: "LIKE" | "UPVOTE" | "DOWNVOTE") {
    const res = await fetch(
      `/api/deals/${dealSlug}/comments/${commentId}/vote`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind }),
      },
    );
    if (res.ok) await load();
  }

  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Discussion</h2>
      <p className="mt-1 text-sm text-muted">
        Like, upvote, downvote, or reply. One reaction per person per comment (change
        by clicking another).
      </p>

      <div className="mt-4">
        <label htmlFor="deal-comment" className="sr-only">
          New comment
        </label>
        <textarea
          id="deal-comment"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          placeholder="Ask a question or share a note…"
        />
        <button
          type="button"
          disabled={posting || !body.trim()}
          onClick={() => postComment()}
          className="mt-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {posting ? "Posting…" : "Post comment"}
        </button>
        {err ? (
          <p className="mt-2 text-sm text-red-600">{err}</p>
        ) : null}
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-muted">Loading comments…</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {comments.map((c) => (
            <CommentThread
              key={c.id}
              node={c}
              dealSlug={dealSlug}
              onVote={vote}
              onReplyPosted={load}
              depth={0}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function CommentThread({
  node,
  dealSlug,
  onVote,
  onReplyPosted,
  depth,
}: {
  node: CommentNode;
  dealSlug: string;
  onVote: (id: string, k: "LIKE" | "UPVOTE" | "DOWNVOTE") => void;
  onReplyPosted: () => void;
  depth: number;
}) {
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [posting, setPosting] = useState(false);

  async function submitReply() {
    if (!replyText.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/deals/${dealSlug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: replyText.trim(), parentId: node.id }),
      });
      if (res.ok) {
        setReplyText("");
        setReplyOpen(false);
        onReplyPosted();
      }
    } finally {
      setPosting(false);
    }
  }

  const label = node.user.name || node.user.email || "User";

  return (
    <li className={depth > 0 ? "ml-4 border-l-2 border-border pl-4" : ""}>
      <div className="rounded-lg border border-border/80 bg-background/50 p-3">
        <p className="text-xs text-muted">
          {label}{" "}
          <span className="text-muted/70">
            · {new Date(node.createdAt).toLocaleString()}
          </span>
        </p>
        <p className="mt-2 whitespace-pre-wrap text-sm text-foreground">{node.body}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <VoteBtn
            active={node.myVote === "LIKE"}
            onClick={() => onVote(node.id, "LIKE")}
            label={`👍 ${node.likes}`}
          />
          <VoteBtn
            active={node.myVote === "UPVOTE"}
            onClick={() => onVote(node.id, "UPVOTE")}
            label={`▲ ${node.upvotes}`}
          />
          <VoteBtn
            active={node.myVote === "DOWNVOTE"}
            onClick={() => onVote(node.id, "DOWNVOTE")}
            label={`▼ ${node.downvotes}`}
          />
          {depth < 6 ? (
            <button
              type="button"
              onClick={() => setReplyOpen((o) => !o)}
              className="text-xs text-accent hover:underline"
            >
              Reply
            </button>
          ) : null}
        </div>
        {replyOpen ? (
          <div className="mt-3 space-y-2">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={2}
              className="w-full rounded-md border border-border bg-background px-2 py-1 text-sm"
              placeholder="Write a reply…"
            />
            <button
              type="button"
              disabled={posting || !replyText.trim()}
              onClick={submitReply}
              className="rounded-md bg-accent/90 px-3 py-1 text-xs text-white disabled:opacity-50"
            >
              {posting ? "…" : "Post reply"}
            </button>
          </div>
        ) : null}
      </div>
      {node.replies.length > 0 ? (
        <ul className="mt-3 space-y-3">
          {node.replies.map((r) => (
            <CommentThread
              key={r.id}
              node={r}
              dealSlug={dealSlug}
              onVote={onVote}
              onReplyPosted={onReplyPosted}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function VoteBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-md border border-accent bg-accent/15 px-2 py-0.5 text-xs text-foreground"
          : "rounded-md border border-border px-2 py-0.5 text-xs text-muted hover:border-accent/50"
      }
    >
      {label}
    </button>
  );
}
