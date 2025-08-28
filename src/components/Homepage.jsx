import React from 'react';
import { Play, Shield, Zap, CheckCircle, Users, Download, ArrowRight, BookOpen, ChevronDown, ExternalLink, BookOpenCheck, UserCheck, Settings } from 'lucide-react';

const Homepage = ({ onGetStarted, onViewDocumentation }) => {
  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('.features-section');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const keyFeatures = [
    {
      icon: <CheckCircle className="feature-icon" />,
      title: "Comprehensive Policies",
      description: "Complete baseline covering all the device configurations to enhance your managed endpoints."
    },
    {
      icon: <UserCheck className="feature-icon" />,
      title: "User Experience Focused",
      description: "Exceeds all other security frameworks by enhancing user experience and productivity."
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Industry Alignment",
      description: "Embraces frameworks like CIS, NCSC, and other security standards for maximum endpoint security."
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Easy Implementation",
      description: "Ready-to-deploy configuration templates that can be quickly imported into your Microsoft Intune environment."
    },
    {
      icon: <Settings className="feature-icon" />,
      title: "Customizable",
      description: "Designed to allow maximum flexibility and scaling to environments of any size."
    },
    {
      icon: <BookOpenCheck className="feature-icon" />,
      title: "Tried and Tested",
      description: "Extensively deployed in production environments, not just tested on VMs."
    }
  ];

  const benefits = [
    "🚀 Deploy 100+ security policies across multiple platforms in minutes",
    "🔒 Industry aligned configurations",
    "📊 Report status against existing OIB deployments",
    "🎯 Granular policy selection by category and platform",
    "📱 Device compliance, endpoint security, and configuration policies",
    "🔧 Administrative templates and Windows Update policies"
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Deploy and Manage
              <span className="hero-highlight"> OpenIntuneBaseline </span> in Microsoft Intune
            </h1>
            <p className="hero-description">
              The OpenIntuneBaseline project provides a comprehensive set of Microsoft Intune security 
              baselines designed to enhance your organization's security posture. Deploy proven security 
              configurations with enterprise-grade automation and governance.
            </p>
            <div className="hero-actions">
              <button 
                onClick={onGetStarted}
                className="btn btn-primary btn-large hero-cta"
              >
                <Download className="btn-icon" />
                Deploy Now
                <ArrowRight className="btn-icon-right" />
              </button>
              <button 
                onClick={onViewDocumentation}
                className="btn btn-outline btn-large"
              >
                <BookOpen className="btn-icon" />
                View Documentation
              </button>
            </div>
          </div>
          
          <div className="hero-video">
            <div className="video-container">
              <video 
                className="demo-video"
                controls
                preload="metadata"
              >
                <source src="/OIBDemo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="video-caption">
                Demo: OpenIntuneBaseline security policy deployment walkthrough
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="scroll-indicator" onClick={scrollToFeatures}>
        <ChevronDown className="scroll-arrow" />
        <span>Explore Features</span>
      </div>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose OpenIntuneBaseline?</h2>
          <p>Built by experts, driven by community.</p>
          <p>Experience enterprise-grade security, without the complexity!</p>
        </div>
        
        <div className="features-grid">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="benefits-content">
          <div className="benefits-text">
            <h2>Strengthened Security Posture, Empowered User Experience</h2>
            <p className="benefits-intro">
              OpenIntuneBaseline provides enterprise-ready security configurations that help organizations 
              implement industry security best practices efficiently, without compromising user productivity.
            </p>
            <ul className="benefits-list">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefit-item">{benefit}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Reference Section */}
      <section className="reference-section">
        <div className="reference-content">
          <div className="reference-text">
            <h3>About OpenIntuneBaseline</h3>
            <p>
              OpenIntuneBaseline is an open-source project that provides enterprise-ready security 
              configurations for Microsoft Intune. The project is maintained by security professionals 
              and aligned with Microsoft's Security Compliance Toolkit recommendations.
            </p>
            <a 
              href="https://openintunebaseline.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="reference-link"
            >
              <ExternalLink className="link-icon" />
              Learn more at openintunebaseline.com
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Enhance Your Security?</h2>
          <p>Deploy OpenIntuneBaseline security policies to your Microsoft Intune tenant and strengthen your organization's security posture.</p>
          <button 
            onClick={onGetStarted}
            className="btn btn-primary btn-large cta-button"
          >
            <Shield className="btn-icon" />
            Deploy Security Baselines
            <ArrowRight className="btn-icon-right" />
          </button>
          <p className="cta-note">
            Requires Microsoft Intune license and DeviceManagementConfiguration.ReadWrite.All permissions
          </p>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
