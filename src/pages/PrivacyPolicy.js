import { Link } from 'react-router-dom';
import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="How ToolNexa collects, uses, and protects your information when you use our online tools."
    >
      <LegalSection title="1. Introduction">
        <p>
          Welcome to ToolNexa (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;). We provide free browser-based
          AI, PDF, image, and utility tools. This Privacy Policy explains what information we handle when
          you visit our website and use our services.
        </p>
      </LegalSection>

      <LegalSection title="2. Information We Collect">
        <p>
          Most ToolNexa tools run directly in your browser. For client-side utilities (such as JSON formatting,
          password generation, or color conversion), your input is processed locally and is not sent to our
          servers.
        </p>
        <p>
          When you use tools that connect to third-party APIs (such as AI writing, PDF conversion, or
          background removal), the content you submit may be transmitted to those service providers to
          process your request. We do not permanently store your files or personal content on our servers
          after processing is complete.
        </p>
        <p>
          We may automatically collect limited technical data such as browser type, device type, pages
          visited, and general usage analytics to improve our website performance and user experience.
        </p>
      </LegalSection>

      <LegalSection title="3. How We Use Information">
        <p>We use collected information to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Provide, operate, and maintain our tools</li>
          <li>Improve website functionality and fix errors</li>
          <li>Monitor usage trends and optimize performance</li>
          <li>Respond to support or contact inquiries</li>
          <li>Comply with applicable legal obligations</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. Third-Party Services">
        <p>
          Some tools rely on third-party APIs and infrastructure providers. Those providers may process
          your data according to their own privacy policies. We encourage you to review their policies
          when using features that require external processing.
        </p>
      </LegalSection>

      <LegalSection title="5. Cookies">
        <p>
          We may use cookies or similar technologies for essential site functionality, preferences, and
          analytics. You can control cookies through your browser settings, though disabling them may
          affect certain features.
        </p>
      </LegalSection>

      <LegalSection title="6. Data Security">
        <p>
          We take reasonable measures to protect information transmitted through our website. However,
          no method of transmission over the internet is completely secure, and we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection title="7. Your Rights">
        <p>
          Depending on your location, you may have rights to access, correct, or delete personal data we
          hold about you. To make a request, please contact us using the details on our Contact Us page.
        </p>
      </LegalSection>

      <LegalSection title="8. Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page with
          an updated revision date. Continued use of ToolNexa after changes constitutes acceptance of the
          updated policy.
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>
          If you have questions about this Privacy Policy, please visit our{' '}
          <Link to="/contact-us" className="font-semibold text-brand-600 hover:text-brand-700">
            Contact Us
          </Link>{' '}
          page.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

export default PrivacyPolicy;
