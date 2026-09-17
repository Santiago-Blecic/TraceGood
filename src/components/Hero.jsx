import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Globe } from './icons.jsx'
import './Hero.css'

const stats = [
  { value: '€0.02', label: 'from this bottle' },
  { value: '100%', label: 'funding traceable' },
]

const steps = [
  ['01', 'Scan the QR code', 'One scan connects your product to its impact.'],
  ['02', 'See the project', 'Meet the local work your purchase helps fund.'],
  ['03', 'Verify the transfer', 'View the batch payment recorded on XRPL.'],
]

export default function Hero() {
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Some browsers block autoplay until the element is explicitly nudged.
    const play = video.play()
    if (play?.catch) play.catch(() => {})

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      video.pause()
      setReady(true)
    }
  }, [])

  return (
    <>
    <section className="hero">
      <div className="hero__media">
        <video
          ref={videoRef}
          className={`hero__video ${ready ? 'is-ready' : ''}`}
          src="/hero-loop.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
        />
        <div className="hero__scrim" aria-hidden="true" />
        <div className="hero__rules" aria-hidden="true">
          <span /><span /><span />
        </div>
      </div>

      <div className="hero__inner">
        <div className="hero__lead">
          <p className="hero__note">
            <Globe className="hero__note-icon" />
            <span>Transparent social impact,<br />one product at a time</span>
          </p>

          <h1 className="hero__title">
            Scan the product.<br />
            See the project.<br />
            <em>Verify</em> the funding.
          </h1>

          <p className="hero__sub">
            TraceGood turns every purchase into proof. Scan a product QR code
            to follow its contribution to a real social project.
          </p>

          <div className="hero__cta">
            <a className="btn btn--flame hero__go" href="#how-it-works">
              Follow the journey
              <span className="hero__go-dot" aria-hidden="true"><ArrowRight /></span>
            </a>

            <div className="hero__proof" aria-label="Verified on XRP Ledger">
              <span className="hero__check" aria-hidden="true">✓</span>
              <span className="hero__proof-text">
                <strong>Verified on XRPL</strong>
                Public, traceable transfers
              </span>
            </div>
          </div>

          <ul className="hero__stats">
            {stats.map((stat) => (
              <li key={stat.label} className="stat">
                <span className="stat__mark" aria-hidden="true">*</span>
                <span className="stat__value">{stat.value}</span>
                <span className="stat__label">{stat.label}</span>
                <span className="stat__rule" aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>

        <aside className="impact-card" id="proof">
          <span className="impact-card__eyebrow">Your scanned product</span>
          <h2>ClearSpring<br />Natural Water</h2>
          <div className="impact-card__meta">
            <span>500 ml bottle</span><span>Batch CS-KE-0426</span>
          </div>
          <div className="impact-card__project">
            <span className="impact-card__pin" aria-hidden="true">⌖</span>
            <div><small>Supporting</small><strong>Water pipeline repair<br />Kisumu County, Kenya</strong></div>
          </div>
          <div className="impact-card__funding">
            <span>Your contribution</span><strong>€0.02</strong>
          </div>
          <a className="impact-card__tx" href="#verification">View XRP Ledger transaction <ArrowRight /></a>
        </aside>
      </div>

    </section>

    <section className="journey" id="how-it-works">
      <div className="section-kicker">End consumer process</div>
      <div className="journey__intro">
        <h2>From the shelf<br />to transparent impact.</h2>
        <p>No crypto wallet. No vague claims. Just a direct, understandable record of where a purchase contributes.</p>
      </div>
      <ol className="journey__steps">
        {steps.map(([number, title, copy]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{copy}</p></li>)}
      </ol>
    </section>

    <section className="verification" id="verification">
      <div>
        <div className="section-kicker">Traceable by design</div>
        <h2>Every batch has a story you can check.</h2>
        <p>Contributions are aggregated by product batch and transferred to the project’s wallet. The XRP Ledger provides a public record of the amount, time and destination.</p>
      </div>
      <div className="verification__record">
        <div><span>Batch contribution</span><strong>10,000 bottles × €0.02</strong></div>
        <div><span>Transferred to project</span><strong>€200.00</strong></div>
        <div><span>Transaction status</span><strong className="verified">✓ Funding verified on XRPL</strong></div>
        <code>TX · 7A31F…9B84E · 18 SEP 2026</code>
      </div>
    </section>

    <section className="mission" id="mission">
      <div className="section-kicker">For brands and communities</div>
      <h2>Make social impact<br /><em>visible, not vague.</em></h2>
      <p id="for-brands">TraceGood gives brands a credible way to show that every promised contribution reaches its intended project—while communities receive funding directly.</p>
    </section>
    </>
  )
}
