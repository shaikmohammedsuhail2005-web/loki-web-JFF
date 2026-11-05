import lokiLogo from '../loki logo.png';

export default function LokiLogo({ className = '' }) {
  return (
    <a className={`loki-logo ${className}`.trim()} href="#top">
      <img src={lokiLogo} alt="Loki" />
    </a>
  );
}
