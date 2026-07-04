import { Link } from 'react-router-dom';
import LegalPageLayout, { LegalSection } from '../components/LegalPageLayout';

function TermsAndConditions() {
  return (
    <LegalPageLayout
      title="Terms and Conditions"
      description="Please read these terms carefully before using ToolNexa and its online tools."
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using ToolNexa, you agree to be bound by these Terms and Conditions. If you do
          not agree, please do not use our website or services.
        </p>
      </LegalSection>

      <LegalSection title="2. Description of Service">
        <p>
          ToolNexa provides free online tools for text, AI, PDF, image, and general utility tasks. Tools
          may be updated, modified, or removed at any time without prior notice.
        </p>
      </LegalSection>

      <LegalSection title="3. Acceptable Use">
        <p>You agree not to use ToolNexa to:</p>
        <ul className="list-disc space-y-2 pl-5">
          <li>Violate any applicable law or regulation</li>
          <li>Infringe intellectual property or privacy rights of others</li>
          <li>Upload malicious, illegal, or harmful content</li>
          <li>Attempt to disrupt, overload, or reverse engineer our services</li>
          <li>Use automated systems to abuse or scrape the platform without permission</li>
        </ul>
      </LegalSection>

      <LegalSection title="4. User Content">
        <p>
          You retain ownership of content you submit through our tools. You are solely responsible for
          ensuring you have the right to use, convert, or process any files, text, or data you provide.
        </p>
      </LegalSection>

      <LegalSection title="5. No Professional Advice">
        <p>
          Output from AI and automated tools is provided for general informational purposes only. It
          does not constitute legal, medical, financial, or other professional advice.
        </p>
      </LegalSection>

      <LegalSection title="6. Service Availability">
        <p>
          We strive to keep ToolNexa available and reliable, but we do not guarantee uninterrupted or
          error-free operation. Maintenance, third-party outages, or technical issues may temporarily
          affect availability.
        </p>
      </LegalSection>

      <LegalSection title="7. Limitation of Liability">
        <p>
          To the fullest extent permitted by law, ToolNexa and its operators shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of the website
          or tools, including loss of data, profits, or business opportunities.
        </p>
      </LegalSection>

      <LegalSection title="8. Intellectual Property">
        <p>
          The ToolNexa name, branding, website design, and original content are protected by applicable
          intellectual property laws. You may not copy, reproduce, or redistribute our materials without
          permission, except as allowed by normal use of the service.
        </p>
      </LegalSection>

      <LegalSection title="9. Termination">
        <p>
          We reserve the right to restrict or terminate access to ToolNexa for users who violate these
          terms or misuse the platform.
        </p>
      </LegalSection>

      <LegalSection title="10. Governing Law">
        <p>
          These terms shall be governed by applicable local laws without regard to conflict of law
          principles, unless otherwise required by mandatory consumer protection rules in your jurisdiction.
        </p>
      </LegalSection>

      <LegalSection title="11. Contact">
        <p>
          For questions about these Terms and Conditions, please visit our{' '}
          <Link to="/contact-us" className="font-semibold text-brand-600 hover:text-brand-700">
            Contact Us
          </Link>{' '}
          page.
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}

export default TermsAndConditions;
