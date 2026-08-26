import axios from 'axios';
import { useState } from 'react';
import { generateGameAnalysis } from '../../api/ai';
import type {
  AIGameAnalysisRequest,
  AIGameAnalysisResponse,
} from '../../types/ai';

interface AIGameAnalysisPanelProps {
  request: AIGameAnalysisRequest | null;
}

export function AIGameAnalysisPanel({ request }: AIGameAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<AIGameAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleGenerate() {
    if (!request || isLoading) return;

    setError(null);
    setIsLoading(true);

    try {
      setAnalysis(await generateGameAnalysis(request));
    } catch (caughtError) {
      setError(getAnalysisErrorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-700">
            On-demand insight
          </p>
          <h2 className="mt-2 text-xl font-semibold text-slate-950">
            AI Game Analyst
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Generate a structured analysis from the game data available right now.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleGenerate()}
          disabled={!request || isLoading}
          className="shrink-0 rounded-md bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading
            ? 'Generating analysis...'
            : analysis
              ? 'Regenerate analysis'
              : 'Generate AI Analysis'}
        </button>
      </div>

      {!request ? (
        <p className="mt-5 rounded-md bg-slate-50 p-4 text-sm text-slate-600">
          Player statistics are required before analysis can be generated.
        </p>
      ) : null}

      {isLoading ? (
        <p role="status" className="mt-5 text-sm font-medium text-cyan-800">
          Generating analysis from the current game snapshot...
        </p>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          {error}
        </div>
      ) : null}

      {analysis ? <AnalysisResult analysis={analysis} /> : null}
    </section>
  );
}

function AnalysisResult({ analysis }: { analysis: AIGameAnalysisResponse }) {
  return (
    <div className="mt-6 space-y-6 border-t border-slate-200 pt-6">
      <section aria-labelledby="ai-summary-heading">
        <h3 id="ai-summary-heading" className="text-base font-semibold text-slate-950">
          Game Summary
        </h3>
        <p className="mt-2 text-sm leading-6 text-slate-700">{analysis.summary}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <AnalysisList title="Why They're Leading" items={analysis.winning_reasons} />
        <AnalysisList title="Improvement Areas" items={analysis.improvement_areas} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-lg bg-cyan-50 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-cyan-800">
            Standout Player
          </h3>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {analysis.standout_player}
          </p>
        </section>
        <section className="rounded-lg bg-slate-50 p-5">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Prediction
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-800">
            {analysis.prediction}
          </p>
        </section>
      </div>
    </div>
  );
}

function AnalysisList({ title, items }: { title: string; items: readonly string[] }) {
  return (
    <section className="rounded-lg border border-slate-200 p-5">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      <ol className="mt-3 space-y-3">
        {items.map((item, index) => (
          <li key={`${index}-${item}`} className="flex gap-3 text-sm leading-6 text-slate-700">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700">
              {index + 1}
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function getAnalysisErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 422) {
      return 'The current game data could not be analyzed. Refresh the game and try again.';
    }

    if (!error.response) {
      return 'Unable to reach Athena. Check your connection and try again.';
    }
  }

  return 'Unable to generate analysis right now. Please try again.';
}
