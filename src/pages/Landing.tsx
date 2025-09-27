import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

// Declare iconify-icon for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'iconify-icon': any;
    }
  }
}

export default function Landing() {
  const [activeTab, setActiveTab] = useState('login');
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="homepage bg-dark text-white">
      {/* Navigation */}
      <motion.nav
        style={{ opacity }}
        className="navbar navbar-expand-lg container-fluid p-4 bg-card/50 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="container-fluid">
          <motion.div
            className="main-logo"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="d-block">
              <img src="/images/main-logo.png" alt="Astrid Global Ltd" />
            </Link>
          </motion.div>

          <motion.button
            className="navbar-toggler md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasNavbar"
            aria-controls="offcanvasNavbar"
            whileTap={{ scale: 0.95 }}
          >
            <iconify-icon icon="system-uicons:menu-hamburger" className="hamburger-menu h-6 w-6"></iconify-icon>
          </motion.button>

          <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
            <div className="offcanvas-header">
              <h5 className="offcanvas-title text-white" id="offcanvasNavbarLabel">Menu</h5>
              <button type="button" className="btn-close btn-close-white text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div className="offcanvas-body justify-content-lg-between">
              <div className="main-menu text-center d-lg-flex align-items-center">
                <ul className="menu-list list-unstyled d-lg-flex content-light m-0">
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a className="fw-bold hover:text-primary transition-colors" href="#billboard">Home</a>
                  </motion.li>
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link className="fw-bold hover:text-primary transition-colors" to="/about">About</Link>
                  </motion.li>
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link className="fw-bold hover:text-primary transition-colors" to="/services">Services</Link>
                  </motion.li>
                  <motion.li
                    className="menu-item text-uppercase mx-3"
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link className="fw-bold hover:text-primary transition-colors" to="/contact">Contact</Link>
                  </motion.li>
                </ul>
              </div>
              <div className="btn-wrap d-md-flex gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="btn btn-normal btn-medium align-self-center text-uppercase btn-rounded login-btn hover:shadow-glow transition-all">
                    Log in
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/signup" className="btn btn-linear btn-medium align-self-center btn-rounded text-uppercase register-btn mt-3 mt-md-0 hover:shadow-glow transition-all">
                    Register
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Billboard Section */}
      <section id="billboard" className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              className="order-2 lg:order-1"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="aspect-square max-w-md mx-auto lg:mx-0 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="/images/banner-image.png"
                  alt="Professional Crypto Trading Platform"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>

            <motion.div
              className="order-1 lg:order-2 space-y-8"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Expert Crypto &
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                    Wealth Management
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl">
                  At Astrid Global Ltd, we specialize in comprehensive crypto and wealth management solutions,
                  providing secure investment opportunities and expert guidance for your financial growth.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/signup"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Investing
                    <TrendingUp className="ml-2 h-5 w-5" />
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-blue-400 border-2 border-blue-400/50 hover:border-blue-400 hover:bg-blue-400/10 rounded-xl transition-all duration-300"
                  >
                    Sign In
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Association Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-slate-900/50 to-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-4">
              Trusted by Industry Leaders
            </h3>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center items-center gap-8 lg:gap-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className="grayscale hover:grayscale-0 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img
                  src={`/images/association-brand${i}.png`}
                  alt={`Partner ${i}`}
                  className="h-8 lg:h-10 w-auto opacity-60 hover:opacity-100 transition-opacity duration-300"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Product Card Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Premier Crypto Offerings
              </span>
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Explore our curated selection of top-performing cryptocurrencies with real-time pricing and instant trading capabilities.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
            variants={staggerContainer}
            initial="animate"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {[
              { name: 'Bitcoin', price: '31,020.564', symbol: 'BTC', icon: 'bitcoin' },
              { name: 'Ethereum', price: '4.4668', symbol: 'ETH', icon: 'ethereum' },
              { name: 'Ripple', price: '0.6549', symbol: 'XRP', icon: 'ripple' }
            ].map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                className="group"
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center hover:border-blue-400/30 transition-all duration-300">
                  <motion.div
                    className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <span className="text-2xl font-bold text-white">{crypto.symbol[0]}</span>
                  </motion.div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{crypto.name}</h3>
                      <div className="text-2xl font-mono font-bold text-blue-400">
                        {crypto.price} $
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link
                        to="/trading"
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Buy Now
                        <TrendingUp className="ml-2 h-4 w-4" />
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Track Earning Section */}
      <section id="track-earning" className="cryptocode-info padding-large">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="image-holder">
                <img src="/images/single-image1.png" alt="crypto" />
              </div>
            </div>
            <div className="col-md-6">
              <div className="inner-content p-5">
                <h2 className="display-5">Advanced Portfolio Tracking and Wealth Management</h2>
                <p>Experience seamless portfolio tracking and wealth management with Astrid Global Ltd's advanced platform. Our comprehensive tools make it simple to monitor your crypto investments, analyze performance, and optimize your wealth strategy for long-term financial success.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Us Section */}
      <section id="trust-us" className="cryptocode-info padding-large">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <div className="inner-content p-5 left-block">
                <h2 className="display-5">Secure Wealth Management and Crypto Services</h2>
                <p>Choose Astrid Global Ltd for secure wealth management and crypto services. Our robust security measures protect your investments while providing convenient access to your portfolio. Trust in our expertise to safeguard your financial assets and support your wealth-building journey with confidence.</p>
              </div>
            </div>
            <div className="col-md-6">
              <div className="image-holder">
                <img src="/images/single-image2.png" alt="crypto" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscribe Section */}
      <section id="subscribe" className="padding-large pattern-circle">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="col-md-8">
              <div className="subscribe-content">
                <div className="subscribe-header text-center">
                  <h2 className="display-5">Subscribe for Crypto and Wealth Management Insights</h2>
                  <p>Stay informed about the latest developments in crypto and wealth management. Subscribe to receive exclusive insights, market analysis, and personalized wealth management tips from Astrid Global Ltd's expert team. Join our community of informed investors committed to financial excellence.</p>
                </div>
                <form id="form" className="border-set-bold border-rounded-20">
                  <input type="text" name="email" placeholder="Write your email here" className="btn-rounded" />
                  <button className="btn btn-linear btn-medium btn-rounded text-uppercase">Subscribe Now</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer" className="padding-large">
        <div className="container">
          <div className="row d-flex flex-wrap justify-content-between">
            <div className="col-sm-6 col-lg-4">
              <div className="footer-item item-001">
                <img src="/images/main-logo.png" alt="Astrid Global Ltd" />
                <p>Astrid Global Ltd is your trusted partner in crypto and wealth management, offering comprehensive financial solutions that combine innovative cryptocurrency services with professional wealth management expertise. We empower investors to build and protect their wealth through secure, strategic, and informed financial decisions.</p>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-002 content-light">
                <h4 className="widget-title">About</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/about">About us</Link></li>
                  <li><Link to="/services">Services</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-003 content-light">
                <h4 className="widget-title">Company</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/security">Security</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-004 content-light">
                <h4 className="widget-title">Support</h4>
                <ul className="footer-menu list-unstyled text-uppercase">
                  <li><Link to="/contact">Contact us</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-sm-6 col-lg-2">
              <div className="footer-item item-005 content-light">
                <h4 className="widget-title">Social</h4>
                <ul className="footer-menu social-links list-unstyled d-flex">
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-facebook"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-twitter"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-instagram"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-linkedin"></i></a>
                  </li>
                  <li className="border-set-thin border-rounded-10">
                    <a href="#"><i className="icon icon-youtube"></i></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
      <hr />
      <div id="footer-bottom">
        <div className="container">
          <div className="row text-center">
            <p>© 2024 Astrid Global Ltd. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
