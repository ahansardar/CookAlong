"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
interface Step {
  step_number: number;
  instruction: string;
  duration_in_seconds: number | null;
  video_url?: string | null;
}
interface Recipe {
  id: string;
  slug?: string;
  title: string;
  steps: Step[];
}
export function CookAlongPlayer({ recipe }: { recipe: Recipe }) {
  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(
    recipe.steps[0]?.duration_in_seconds || 0
  );
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [sound, setSound] = useState(true);
  const [announced, setAnnounced] = useState(false);
  const deadline = useRef<number | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const step = recipe.steps[index];
  const duration = step?.duration_in_seconds || 0;
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = Math.max(
        0,
        Math.ceil(((deadline.current || Date.now()) - Date.now()) / 1000)
      );
      setRemaining(left);
      if (!left) {
        setRunning(false);
        setAnnounced(true);
        if (sound && audio.current) {
          try {
            const a = audio.current;
            const osc = a.createOscillator();
            const gain = a.createGain();
            osc.connect(gain);
            gain.connect(a.destination);
            gain.gain.setValueAtTime(0.2, a.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 1);
            osc.frequency.value = 740;
            osc.start();
            osc.stop(a.currentTime + 1);
          } catch {}
        }
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running, sound]);
  useEffect(
    () => () => {
      audio.current?.close().catch(() => {});
    },
    []
  );
  function toggle() {
    if (running) {
      setRemaining(
        Math.max(
          0,
          Math.ceil(((deadline.current || Date.now()) - Date.now()) / 1000)
        )
      );
      setRunning(false);
    } else {
      if (sound) {
        try {
          audio.current ||= new AudioContext();
          void audio.current.resume();
        } catch {}
      }
      const seconds = remaining || duration;
      setRemaining(seconds);
      deadline.current = Date.now() + seconds * 1000;
      setAnnounced(false);
      setRunning(true);
    }
  }
  function move(next: number) {
    setRunning(false);
    deadline.current = null;
    setIndex(next);
    setRemaining(recipe.steps[next]?.duration_in_seconds || 0);
    setAnnounced(false);
  }
  function reset() {
    setRunning(false);
    setRemaining(duration);
    setAnnounced(false);
  }
  function finishCooking() {
    setRunning(false);
    deadline.current = null;
    setDone(true);
  }
  const href = `/recipe/${recipe.slug || recipe.id}`;
  if (!step)
    return (
      <main className="shell empty-state">
        <h1>No cooking steps yet</h1>
        <Link href={href}>Back to recipe</Link>
      </main>
    );
  if (done)
    return (
      <main className="cooking-complete">
        <CheckCircle2 size={58} />
        <p className="eyebrow">FROM RECIPE TO REAL LIFE</p>
        <h1>You made it.</h1>
        <p>
          {recipe.title} is ready for your final check. Taste, adjust, and
          enjoy.
        </p>
        <p className="small-note">
          Check that your food is cooked through before serving.
        </p>
        <Link className="primary-action" href={href}>
          Back to recipe <ArrowRight size={17} />
        </Link>
        <button
          className="text-button"
          onClick={() => {
            setDone(false);
            move(0);
          }}
        >
          Cook it again
        </button>
      </main>
    );
  return (
    <div className="cooking-screen">
      <header className="cooking-header">
        <Link href={href} className="exit-cooking">
          <X size={20} />
          <span>Exit cooking</span>
        </Link>
        <span className="cooking-wordmark">cook-along.</span>
        <button
          className="sound-toggle"
          aria-label={sound ? "Mute timer sound" : "Enable timer sound"}
          aria-pressed={sound}
          onClick={() => setSound(!sound)}
        >
          {sound ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </header>
      <main className="cooking-layout">
        <aside className="cooking-sidebar">
          <p className="eyebrow">ON THE MENU</p>
          <h1>{recipe.title}</h1>
          <div className="cooking-progress">
            <span
              style={{ width: `${(index / recipe.steps.length) * 100}%` }}
            />
          </div>
          <p className="small-note">
            {index} of {recipe.steps.length} steps finished
          </p>
          <ol aria-label="Cooking steps">
            {recipe.steps.map((s, i) => (
              <li key={s.step_number}>
                <button
                  className={
                    i === index ? "current" : i < index ? "finished" : ""
                  }
                  onClick={() => move(i)}
                  aria-current={i === index ? "step" : undefined}
                >
                  <span>{i < index ? <Check size={14} /> : s.step_number}</span>
                  <span>{s.instruction}</span>
                </button>
              </li>
            ))}
          </ol>
        </aside>
        <section className="active-step">
          <div className="active-step-top">
            <p className="eyebrow">LET'S MAKE SOMETHING GOOD</p>
            <span>
              Step {index + 1} / {recipe.steps.length}
            </span>
          </div>
          <span className="giant-step">
            {String(index + 1).padStart(2, "0")}
          </span>
          <h2>{step.instruction}</h2>
          {duration > 0 ? (
            <div className={`timer-panel ${announced ? "timer-finished" : ""}`}>
              <div className="timer-label">
                <Clock size={16} />
                {announced
                  ? "Timer finished. Check your food."
                  : running
                  ? "A little patience. You're doing well."
                  : "Your timer is ready when you are."}
              </div>
              <div
                className="timer-value"
                role="timer"
                aria-label={`${Math.floor(remaining / 60)} minutes ${
                  remaining % 60
                } seconds remaining`}
              >
                {String(Math.floor(remaining / 60)).padStart(2, "0")}
                <span>:</span>
                {String(remaining % 60).padStart(2, "0")}
              </div>
              <div className="timer-actions">
                <button className="primary-action" onClick={toggle}>
                  {running ? <Pause size={18} /> : <Play size={18} />}{" "}
                  {running
                    ? "Pause timer"
                    : remaining === duration
                    ? "Start timer"
                    : remaining === 0
                    ? "Restart timer"
                    : "Resume timer"}
                </button>
                <button
                  className="reset-timer"
                  aria-label="Reset timer"
                  onClick={reset}
                >
                  <RotateCcw size={20} />
                </button>
              </div>
              <p className="small-note">
                Timers don't advance the recipe. Move on when your food is
                ready.
              </p>
              <span className="sr-only" role="status">
                {announced
                  ? "Timer finished. Check your food before continuing."
                  : ""}
              </span>
            </div>
          ) : (
            <p className="untimed-note">
              No timer needed. Take your time with this step.
            </p>
          )}
          {step.video_url && (
            <a
              href={step.video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="video-link"
            >
              Watch the step video <ArrowRight size={16} />
            </a>
          )}
          <div className="cooking-navigation">
            <button
              className="previous-step"
              disabled={index === 0}
              onClick={() => move(index - 1)}
            >
              <ArrowLeft size={18} /> Previous
            </button>
            <button
              className="primary-action"
              onClick={() =>
                index < recipe.steps.length - 1
                  ? move(index + 1)
                  : finishCooking()
              }
            >
              {index === recipe.steps.length - 1
                ? "Finish cooking"
                : "Done, next step"}{" "}
              {index === recipe.steps.length - 1 ? (
                <Check size={18} />
              ) : (
                <ArrowRight size={18} />
              )}
            </button>
          </div>
          {index < recipe.steps.length - 1 && (
            <div className="up-next">
              <span>UP NEXT</span>
              <p>{recipe.steps[index + 1].instruction}</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
