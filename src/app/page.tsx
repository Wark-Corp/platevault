import Link from "next/link";
import styles from "./page.module.css";
import HomeSearch from "@/components/HomeSearch";
import { getPublicStats } from "@/actions/stats";
import {
  ShieldCheck, Zap, Database, Star, Check,
  ArrowRight, Lock, Code2, HelpCircle, UserPlus,
  Search, FileText, Smartphone
} from "lucide-react";

import SupportSystem from "@/components/SupportSystem";

export default async function Home() {
  const stats = await getPublicStats();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className="container flex justify-between items-center">
          <div className={styles.logo}>
            Plate<span>Vault</span>
          </div>
          <nav className={styles.nav}>
            <SupportSystem />
            <Link href="/auth/login" className={styles.loginBtn}>Iniciar Sesión</Link>
            <Link href="/auth/register" className={`${styles.registerBtn} premium-gradient`}>Registrarse</Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className="container">
            <div className="badge flex items-center gap-2 mb-6" style={{ margin: '0 auto 1.5rem auto', width: 'fit-content' }}>
              <Star size={14} fill="var(--accent)" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Ingeniería Automotriz de Precisión
              </span>
            </div>
            <h1 className={styles.title}>
              Información Técnica Real, <br />
              <span>Sin Compromisos.</span>
            </h1>
            <p className={styles.subtitle}>
              Accede al catálogo técnico más completo de vehículos en España mediante matrícula.
              Datos actualizados para profesionales del sector.
            </p>

            <div style={{ maxWidth: '700px', margin: '0 auto' }}>
              <HomeSearch />
              <p className={styles.registerNotice}>* Requiere una cuenta para consultas de alta precisión.</p>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.lookups.toLocaleString()}+</span>
                <span className={styles.statLabel}>Búsquedas Realizadas</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.versions.toLocaleString()}</span>
                <span className={styles.statLabel}>Versiones Técnicas</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statNumber}>{stats.users.toLocaleString()}+</span>
                <span className={styles.statLabel}>Usuarios Activos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 1: Workflow */}
        <section className={styles.workflow}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>¿Cómo funciona PlateVault?</h2>
              <p>Consulta cualquier vehículo en tres sencillos pasos con nuestra tecnología de indexación avanzada.</p>
            </div>
            <div className={styles.workflowGrid}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <h3>Introduce la Matrícula</h3>
                <p>Ingresa cualquier matrícula española. Nuestro sistema valida el formato al instante.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <h3>Procesamiento en Nube</h3>
                <p>Cruzamos datos con nuestro catálogo técnico de ingeniería global.</p>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <h3>Ficha Técnica Completa</h3>
                <p>Recibe detalles de motorización, pesos, medidas y distintivo ambiental.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Pricing */}
        <section className={styles.pricing}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Planes Adaptados a ti</h2>
              <p>Ya seas un entusiasta o una empresa, tenemos el acceso que necesitas.</p>
            </div>
            <div className={styles.pricingGrid}>
              <div className={styles.priceCard}>
                <h3>Básico</h3>
                <div className={styles.priceValue}>€0<span>/mes</span></div>
                <ul className={styles.priceFeatures}>
                  <li><Check size={16} /> 5 búsquedas diarias</li>
                  <li><Check size={16} /> Datos básicos de motor</li>
                  <li><Check size={16} /> Historial limitado</li>
                </ul>
                <Link href="/auth/register" className={styles.pricingBtn}>Empezar Gratis</Link>
              </div>
              <div className={`${styles.priceCard} ${styles.priceCardFeatured}`}>
                <h3>Premium</h3>
                <div className={styles.priceValue}>€9.99<span>/mes</span></div>
                <ul className={styles.priceFeatures}>
                  <li><Check size={16} /> Búsquedas ilimitadas</li>
                  <li><Check size={16} /> Ficha técnica completa</li>
                  <li><Check size={16} /> Comparador avanzado</li>
                  <li><Check size={16} /> Exportación PDF</li>
                </ul>
                <Link href="/dashboard/premium" className={`${styles.pricingBtn} ${styles.pricingBtnFeatured}`}>Suscribirse</Link>
              </div>
              <div className={styles.priceCard}>
                <h3>Empresa</h3>
                <div className={styles.priceValue}>Consúltanos</div>
                <ul className={styles.priceFeatures}>
                  <li><Check size={16} /> Acceso vía API</li>
                  <li><Check size={16} /> Múltiples usuarios</li>
                  <li><Check size={16} /> Soporte dedicado</li>
                </ul>
                <SupportSystem variant="button" className={styles.pricingBtn}>
                  Contactar Ventas
                </SupportSystem>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Engineering API */}
        <section className={styles.apiShowcase}>
          <div className="container">
            <div className={styles.apiContainer}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="badge flex items-center gap-2 mb-6" style={{ width: 'fit-content' }}>
                  <Star size={14} fill="var(--accent)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                    API PARA DESARROLLADORES
                  </span>
                </div>
                <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.1, letterSpacing: '-1.5px' }}>
                  Integra PlateVault <br />
                  <span>en tu flujo de trabajo</span>
                </h2>
                <p className="text-muted mb-8 leading-relaxed" style={{ fontSize: '1.1rem', maxWidth: '520px', color: 'var(--text-muted)' }}>
                  Nuestra API REST de alta disponibilidad permite a empresas de automoción integrar datos técnicos reales directamente en sus CRM, sistemas de tasación o portales de venta.
                </p>
                <div className="flex gap-8">
                  <div className="flex items-center gap-3 font-bold text-xs tracking-wider uppercase cursor-pointer hover:text-accent transition-colors">
                    <Code2 size={20} className="text-accent" /> Documentación
                  </div>
                  <div className="flex items-center gap-3 font-bold text-xs tracking-wider uppercase cursor-pointer hover:text-accent transition-colors">
                    <Lock size={20} className="text-accent" /> Auth Seguro
                  </div>
                </div>
              </div>
              <div className={styles.codeBlock}>
                <pre style={{ margin: 0 }}>
                  <code style={{ fontSize: '0.95rem', lineHeight: 1.4 }}>
                    <span className="keyword">GET</span> /api/v1/vehicle/1234ABC<br /><br />
                    {`{`}<br />
                    {`  "`}<span className="variable">brand</span>{`": "`}<span className="string">AUDI</span>{`",`}<br />
                    {`  "`}<span className="variable">model</span>{`": "`}<span className="string">A3 Sportback</span>{`",`}<br />
                    {`  "`}<span className="variable">engine</span>{`": "`}<span className="string">35 TFSI 150CV</span>{`",`}<br />
                    {`  "`}<span className="variable">fuel</span>{`": "`}<span className="string">Gasoline/PHEV</span>{`",`}<br />
                    {`  "`}<span className="variable">emissions</span>{`": "`}<span className="string">EU6 AP</span>{`",`}<br />
                    {`  "`}<span className="variable">status</span>{`": "`}<span className="string">success</span>{`"`}<br />
                    {`}`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Security */}
        <section className={styles.features}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Seguridad de Nivel Militar</h2>
              <p>Protegemos tus datos y tu privacidad con las tecnologías más robustas del mercado.</p>
            </div>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><Lock size={24} /></div>
                <h3>Encriptación AES-256</h3>
                <p>Todos tus datos de cuenta y preferencias se almacenan bajo los estandares de encriptación más altos.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><ShieldCheck size={24} /></div>
                <h3>2FA Obligatorio</h3>
                <p>Ofrecemos autenticación en dos pasos para asegurar que solo tú accedas a tu panel técnico.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}><Smartphone size={24} /></div>
                <h3>Acceso Móvil Seguro</h3>
                <p>Nuestra plataforma está optimizada para que consultes datos en el taller o concesionario con total seguridad.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5: FAQ */}
        <section className={styles.faq}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Preguntas Frecuentes</h2>
              <p>Resolvemos tus dudas sobre el servicio de PlateVault.</p>
            </div>
            <div className={styles.faqGrid}>
              <div className={styles.faqItem}>
                <h4>¿Los datos incluyen el nombre del dueño?</h4>
                <p>No. PlateVault se enfoca exclusivamente en datos técnicos de ingeniería del vehículo. No proporcionamos datos personales de terceros.</p>
              </div>
              <div className={styles.faqItem}>
                <h4>¿Con qué frecuencia se actualiza el catálogo?</h4>
                <p>Actualizamos nuestras bases de datos semanalmente con las últimas homologaciones y variantes técnicas del mercado.</p>
              </div>
              <div className={styles.faqItem}>
                <h4>¿Puedo cancelar mi suscripción Premium?</h4>
                <p>Sí, en cualquier momento desde tu panel de cuenta sin periodos de permanencia.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerGrid}>
            <div className={styles.footerInfo}>
              <div className={styles.logo} style={{ marginBottom: '1.5rem' }}>
                Plate<span>Vault</span>
              </div>
              <p>
                La plataforma líder en España para la consulta de especificaciones técnicas automotrices. Diseñada para profesionales por Wark Corp.
              </p>
            </div>

            <div className={styles.footerLinks}>
              <h4>Recursos</h4>
              <ul>
                <li><Link href="/auth/login">Iniciar Sesión</Link></li>
                <li><Link href="/auth/register">Plan Premium</Link></li>
                <li><Link href="/dashboard">Buscador Técnico</Link></li>
                <li><Link href="/cookies">Gestión de Cookies</Link></li>
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h4>Legal</h4>
              <ul>
                <li><Link href="/terms">Términos del Servicio</Link></li>
                <li><Link href="/privacy">Política de Privacidad</Link></li>
                <li><Link href="/cookies">Política de Cookies</Link></li>
              </ul>
            </div>
          </div>

          <div className={styles.copyright}>
            <p>&copy; {new Date().getFullYear()} PlateVault by Wark Corp. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
